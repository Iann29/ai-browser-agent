import type { AssistantContent, JSONValue, ModelMessage, ToolContent, ToolResultPart, UserContent } from 'ai';
import type { Message, MessageContent } from './message-schema.js';

export function toModelMessages(history: Message[] = []): ModelMessage[] {
  const normalized = Array.isArray(history) ? history : [];
  console.log('[model-convert] toModelMessages called with', normalized.length, 'messages');
  
  // Detailed log of each message
  for (let i = 0; i < normalized.length; i++) {
    const m = normalized[i];
    console.log(`[model-convert] Message ${i}:`, {
      role: m.role,
      hasToolCalls: !!(m as any).toolCalls?.length,
      toolCallsCount: (m as any).toolCalls?.length || 0,
      toolCallIds: (m as any).toolCalls?.map((tc: any) => tc.id) || [],
      contentType: Array.isArray(m.content) ? `array(${m.content.length})` : typeof m.content,
      contentPreview: typeof m.content === 'string' ? m.content.slice(0, 50) : 
        Array.isArray(m.content) ? m.content.map((p: any) => p?.type || typeof p) : 'object',
    });
  }
  return normalized
    .filter((msg) => msg && msg.role)
    .map((msg) => {
      if (msg.role === 'tool') {
        return {
          role: 'tool',
          content: normalizeToolContent(msg),
        };
      }
      if (msg.role === 'assistant') {
        return {
          role: 'assistant',
          content: normalizeAssistantContent(msg),
        };
      }
      if (msg.role === 'system') {
        return {
          role: 'system',
          content: normalizeSystemContent(msg.content),
        };
      }
      return {
        role: 'user',
        content: normalizeUserContent(msg.content),
      };
    });
}

function normalizeToolContent(message: Message): ToolContent {
  const content = message.content;
  console.log('[model-convert] normalizeToolContent called, content type:', Array.isArray(content) ? 'array' : typeof content);
  if (Array.isArray(content)) {
    const parts = content.filter((part) => part && typeof part === 'object' && 'type' in part) as ToolResultPart[];
    console.log('[model-convert] Found', parts.length, 'tool-result parts in array');
    if (parts.length) return parts;
  }
  const toolCallId = message.toolCallId || (message as any).tool_call_id || `tool_${Date.now()}`;
  console.log('[model-convert] Creating single tool-result with toolCallId:', toolCallId);
  return [
    {
      type: 'tool-result',
      toolCallId: String(toolCallId),
      toolName: message.name || message.toolName || 'tool',
      output: normalizeToolOutput(content),
    },
  ];
}

function normalizeToolOutput(content: MessageContent): ToolResultPart['output'] {
  if (typeof content === 'string') {
    return { type: 'text', value: content };
  }
  if (content && typeof content === 'object') {
    return {
      type: 'json',
      value: coerceJsonValue(content),
    };
  }
  return { type: 'text', value: '' };
}

function normalizeUserContent(content: MessageContent): UserContent {
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return { type: 'text', text: part } as const;
        }
        if (part && typeof part === 'object') {
          if ('text' in part && typeof part.text === 'string') {
            return { type: 'text', text: part.text } as const;
          }
          if ('image' in part && part.image) {
            return { type: 'image', image: part.image } as const;
          }
          if ('image_url' in part && part.image_url?.url) {
            return { type: 'image', image: part.image_url.url } as const;
          }
        }
        return { type: 'text', text: '' } as const;
      })
      .filter(Boolean);
  }
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object') return JSON.stringify(content);
  return '';
}

function normalizeAssistantContent(message: Message): AssistantContent {
  const parts: AssistantContent = [];

  console.log('[model-convert] normalizeAssistantContent called:', {
    hasThinking: !!message.thinking,
    contentType: typeof message.content,
    contentLength: typeof message.content === 'string' ? message.content.length : Array.isArray(message.content) ? message.content.length : 0,
    hasToolCalls: !!message.toolCalls,
    toolCallsCount: message.toolCalls?.length || 0,
    toolCallIds: message.toolCalls?.map(tc => tc.id) || [],
  });

  // Add reasoning/thinking if present
  if (message.thinking) {
    parts.push({ type: 'reasoning', text: message.thinking } as const);
  }

  // Add text content
  if (typeof message.content === 'string' && message.content) {
    parts.push({ type: 'text', text: message.content } as const);
  } else if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (typeof part === 'string' && part) {
        parts.push({ type: 'text', text: part } as const);
      } else if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' && part.text) {
        parts.push({ type: 'text', text: part.text } as const);
      }
    }
  } else if (message.content && typeof message.content === 'object') {
    parts.push({ type: 'text', text: JSON.stringify(message.content) } as const);
  }

  // Add tool calls if present - this is critical for maintaining the message chain
  if (message.toolCalls && Array.isArray(message.toolCalls) && message.toolCalls.length > 0) {
    console.log('[model-convert] Adding tool-call parts for', message.toolCalls.length, 'tool calls');
    for (const tc of message.toolCalls) {
      const toolCallPart = {
        type: 'tool-call' as const,
        toolCallId: tc.id || `tool_${Date.now()}`,
        toolName: tc.name || 'unknown',
        input: tc.args || {},
      };
      console.log('[model-convert] Adding tool-call part:', toolCallPart);
      parts.push(toolCallPart);
    }
  }

  console.log('[model-convert] normalizeAssistantContent result:', {
    partsCount: parts.length,
    partTypes: parts.map(p => (p as { type: string }).type),
  });

  // Return parts array or empty string if no content
  if (parts.length === 0) return '';
  if (parts.length === 1 && parts[0].type === 'text') {
    return (parts[0] as { type: 'text'; text: string }).text;
  }
  return parts;
}

function normalizeSystemContent(content: MessageContent) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return part.text;
        }
        return '';
      })
      .join('\n');
  }
  if (content && typeof content === 'object') return JSON.stringify(content);
  return '';
}

function coerceJsonValue(value: unknown): JSONValue {
  try {
    return JSON.parse(JSON.stringify(value)) as JSONValue;
  } catch {
    return String(value ?? '');
  }
}
