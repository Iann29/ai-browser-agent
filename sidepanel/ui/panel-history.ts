import { createMessage, normalizeConversationHistory } from '../../ai/message-schema.js';
import { dedupeThinking, extractThinking } from '../../ai/message-utils.js';
import { SidePanelUI } from './panel-ui.js';

function collectToolResultIds(msg: any): string[] {
  if (!msg || msg.role !== 'tool') return [];

  const ids: string[] = [];
  if (typeof msg.toolCallId === 'string' && msg.toolCallId) {
    ids.push(msg.toolCallId);
  }

  // Handle AI-SDK style tool messages: content is an array of { type: 'tool-result', toolCallId, ... }
  if (Array.isArray(msg.content)) {
    for (const part of msg.content) {
      const id = part?.toolCallId || part?.tool_use_id || part?.id;
      if (typeof id === 'string' && id) ids.push(id);
    }
  }

  return ids;
}

function collectAssistantToolCallIds(msg: any): string[] {
  if (!msg || msg.role !== 'assistant') return [];
  if (!Array.isArray(msg.toolCalls)) return [];
  return msg.toolCalls
    .map((tc: any) => (typeof tc?.id === 'string' ? tc.id : ''))
    .filter(Boolean);
}

function trimHistoryPreservingToolChains(history: any[], maxMessages: number): any[] {
  const messages = Array.isArray(history) ? history : [];
  if (messages.length <= maxMessages) return messages;

  const trimmedReversed: any[] = [];
  const requiredToolCallIds = new Set<string>();

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    trimmedReversed.push(msg);

    if (msg?.role === 'tool') {
      for (const id of collectToolResultIds(msg)) {
        requiredToolCallIds.add(id);
      }
    } else if (msg?.role === 'assistant') {
      for (const id of collectAssistantToolCallIds(msg)) {
        requiredToolCallIds.delete(id);
      }
    }

    const atLimit = trimmedReversed.length >= maxMessages;
    if (atLimit && requiredToolCallIds.size === 0) {
      break;
    }
  }

  const trimmed = trimmedReversed.reverse();

  // If we still start with tool messages, drop them to avoid orphan tool results.
  while (trimmed.length > 0 && trimmed[0]?.role === 'tool') {
    trimmed.shift();
  }

  return trimmed;
}

function buildContextFromDisplayTranscript(displayTranscript: any[]): any[] {
  const normalized = normalizeConversationHistory(displayTranscript || []);
  const repaired: any[] = [];

  for (const msg of normalized) {
    if (msg?.role !== 'tool') {
      repaired.push(msg);
      continue;
    }

    const toolCallId = msg.toolCallId;
    const toolName = msg.toolName || msg.name || 'tool';
    let args: Record<string, unknown> = {};

    if (typeof toolCallId === 'string' && toolCallId) {
      try {
        const parsed = typeof msg.content === 'string' ? JSON.parse(msg.content) : null;
        if (parsed?.args && typeof parsed.args === 'object') {
          args = parsed.args as Record<string, unknown>;
        }
      } catch {
        // ignore
      }

      // Synthesize the missing assistant tool-call message so the provider can
      // validate tool_call_id/toolCallId references.
      const assistantToolCall = createMessage({
        role: 'assistant',
        content: '',
        toolCalls: [
          {
            id: toolCallId,
            name: String(toolName || 'tool'),
            args,
          },
        ],
        meta: { kind: 'tool', source: 'history-repair' },
      });
      if (assistantToolCall) {
        repaired.push(assistantToolCall);
      }
    }

    repaired.push(msg);
  }

  return normalizeConversationHistory(repaired);
}


function buildContextHistoryFromLegacyTranscript(transcript: any[]) {
  const normalized = normalizeConversationHistory(transcript || []);
  const output: any[] = [];
  const seenToolCalls = new Set<string>();

  for (const msg of normalized) {
    if (msg?.role === 'assistant' && Array.isArray((msg as any).toolCalls)) {
      for (const call of (msg as any).toolCalls) {
        if (call?.id) seenToolCalls.add(String(call.id));
      }
    }

    if (msg?.role === 'tool') {
      const toolCallId = (msg as any).toolCallId;
      if (toolCallId && !seenToolCalls.has(String(toolCallId))) {
        let toolName = (msg as any).toolName || (msg as any).name || 'tool';
        let args: Record<string, unknown> = {};

        if (typeof msg.content === 'string') {
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed?.args && typeof parsed.args === 'object') {
              args = parsed.args as Record<string, unknown>;
            }
            if (typeof parsed?.toolName === 'string') {
              toolName = parsed.toolName;
            }
          } catch {
            // ignore
          }
        }

        const stub = createMessage({
          role: 'assistant',
          content: '',
          toolCalls: [
            {
              id: String(toolCallId),
              name: String(toolName),
              args,
            },
          ],
          meta: {
            kind: 'tool',
            source: 'history-repair',
          },
        });
        if (stub) {
          output.push(stub);
          seenToolCalls.add(String(toolCallId));
        }
      }
    }

    output.push(msg);
  }

  return normalizeConversationHistory(output);
}

(SidePanelUI.prototype as any).persistHistory = async function persistHistory() {
  // Default to saving history unless explicitly disabled in config
  const config = this.configs?.[this.currentConfig];
  const saveEnabled = config?.saveHistory !== false;
  if (!saveEnabled) return;
  
  // Only persist if there's actual content
  if (!this.displayHistory || this.displayHistory.length === 0) return;
  
  const displayTranscript = this.displayHistory.slice(-200);
  const contextTranscript = trimHistoryPreservingToolChains(this.contextHistory, 400);

  const entry = {
    id: this.sessionId,
    startedAt: this.sessionStartedAt,
    updatedAt: Date.now(),
    title: this.firstUserMessage || 'Session',
    messageCount: this.displayHistory.length,
    transcript: displayTranscript,
    // Separate context transcript for API/tool-call correctness.
    contextTranscript,
  };
  
  try {
    const existing = await chrome.storage.local.get(['chatSessions']);
    const sessions = existing.chatSessions || [];
    const filtered = sessions.filter((s: any) => s.id !== entry.id);
    filtered.unshift(entry);
    const trimmed = filtered.slice(0, 50); // Keep more sessions
    await chrome.storage.local.set({ chatSessions: trimmed });
    this.loadHistoryList();
  } catch (e) {
    console.error('Failed to persist history:', e);
  }
};

(SidePanelUI.prototype as any).loadHistoryList = async function loadHistoryList() {
  console.log('[History] loadHistoryList called, historyItems:', !!this.elements.historyItems);
  if (!this.elements.historyItems) {
    console.warn('[History] historyItems element not found, cannot load history list');
    return;
  }

  // Read saveHistory from config (not DOM element, which may not be populated yet during init)
  const config = this.configs?.[this.currentConfig];
  const saveEnabled = config?.saveHistory !== false;
  console.log('[History] saveHistory from config:', config?.saveHistory, 'enabled:', saveEnabled);
  if (!saveEnabled) {
    this.elements.historyItems.innerHTML =
      '<div class="history-empty">History is off. Enable "Save History" in Settings to see past chats.</div>';
    return;
  }
  
  try {
    const { chatSessions = [] } = await chrome.storage.local.get(['chatSessions']);
    console.log('[History] chatSessions found:', chatSessions.length, 'sessions');
    this.elements.historyItems.innerHTML = '';
    
    if (!chatSessions.length) {
      this.elements.historyItems.innerHTML = '<div class="history-empty">No saved chats yet.</div>';
      return;
    }
    
    console.log('[History] Rendering sessions, historyItems element:', this.elements.historyItems, 'id:', this.elements.historyItems?.id);
    chatSessions.forEach((session: any) => {
      console.log('[History] Rendering session:', session.title, session.id);
      const item = document.createElement('div');
      item.className = 'history-item';
      const date = new Date(session.updatedAt || session.startedAt || Date.now());
      const msgCount = session.messageCount || session.transcript?.length || 0;
      const timeAgo = this.formatTimeAgo(date);
      
      item.innerHTML = `
        <div class="history-item-main">
          <div class="history-title">${this.escapeHtml(session.title || 'Untitled Session')}</div>
          <div class="history-meta">
            <span>${timeAgo}</span>
            <span class="history-meta-dot">·</span>
            <span>${msgCount} messages</span>
          </div>
        </div>
        <button class="history-delete" title="Delete" data-session-id="${session.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      // Click to load session
      item.querySelector('.history-item-main')?.addEventListener('click', () => {
        this.loadSession(session);
      });
      
      // Delete button
      item.querySelector('.history-delete')?.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.deleteSession(session.id);
      });
      
      this.elements.historyItems.appendChild(item);
    });
  } catch (e) {
    console.error('Failed to load history:', e);
    this.elements.historyItems.innerHTML = '<div class="history-empty">Failed to load history.</div>';
  }
};

(SidePanelUI.prototype as any).loadSession = function loadSession(session: any) {
  this.switchView('chat');
  if (!Array.isArray(session.transcript) && !Array.isArray(session.contextTranscript)) return;

  this.recordScrollPosition();

  const displayNormalized = normalizeConversationHistory(session.transcript || []);
  this.displayHistory = displayNormalized;

  if (Array.isArray(session.contextTranscript) && session.contextTranscript.length > 0) {
    this.contextHistory = normalizeConversationHistory(session.contextTranscript || []);
  } else {
    // Back-compat: older sessions only stored UI transcript (missing assistant toolCalls).
    this.contextHistory = buildContextFromDisplayTranscript(session.transcript || []);
  }

  this.sessionId = session.id || `session-${Date.now()}`;
  this.firstUserMessage = session.title || '';
  this.renderConversationHistory();
  this.updateContextUsage();
};

(SidePanelUI.prototype as any).deleteSession = async function deleteSession(sessionId: string) {
  try {
    const { chatSessions = [] } = await chrome.storage.local.get(['chatSessions']);
    const filtered = chatSessions.filter((s: any) => s.id !== sessionId);
    await chrome.storage.local.set({ chatSessions: filtered });
    this.loadHistoryList();
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
};

(SidePanelUI.prototype as any).clearAllHistory = async function clearAllHistory() {
  if (!confirm('Clear all chat history? This cannot be undone.')) return;
  
  try {
    await chrome.storage.local.set({ chatSessions: [] });
    this.loadHistoryList();
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
};

(SidePanelUI.prototype as any).formatTimeAgo = function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

(SidePanelUI.prototype as any).renderConversationHistory = function renderConversationHistory() {
  this.elements.chatMessages.innerHTML = '';
  this.toolCallViews.clear();
  this.lastChatTurn = null;
  this.resetActivityPanel();

  this.displayHistory.forEach((msg: any) => {
    if (msg.role === 'system' || msg.meta?.kind === 'summary') {
      this.displaySummaryMessage(msg);
      return;
    }
    if (msg.role === 'tool') {
      // Render tool execution from history
      const toolName = msg.toolName || msg.name || 'tool';
      let args: Record<string, unknown> = {};
      let result: unknown = null;
      try {
        const parsed = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
        args = (parsed as any)?.args || {};
        result = (parsed as any)?.result;
      } catch {
        result = msg.content;
      }
      const resultObj = result as Record<string, unknown> | null;
      const isError = resultObj && typeof resultObj === 'object' && (resultObj.error || resultObj.success === false);
      const argsPreview = this.getArgsPreview?.(args) || '';
      const resultText = this.truncateText?.(this.safeJsonStringify?.(result) || '', 500) || '';
      
      const toolDiv = document.createElement('div');
      toolDiv.className = `tool-tree-item ${isError ? 'error' : 'success'}`;
      toolDiv.innerHTML = `
          <span class="tool-tree-status"></span>
          <div class="tool-tree-content">
            <div class="tool-tree-header">
              <span class="tool-tree-name">${this.escapeHtml(toolName)}</span>
              <span class="tool-tree-args">${this.escapeHtml(argsPreview)}</span>
            </div>
            <span class="tool-tree-meta">${isError ? 'Error' : 'Done'}</span>
            ${resultText ? `<div class="tool-tree-result" style="font-size: 11px; color: var(--muted); margin-top: 4px; white-space: pre-wrap; word-break: break-word;">${this.escapeHtml(resultText)}</div>` : ''}
          </div>
        `;
      this.elements.chatMessages.appendChild(toolDiv);
      return;
    }
    if (msg.role === 'user') {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user';
      messageDiv.innerHTML = `
          <div class="message-header">You</div>
          <div class="message-content">${this.escapeHtml(msg.content || '')}</div>
        `;
      this.elements.chatMessages.appendChild(messageDiv);
    } else if (msg.role === 'assistant') {
      const rawContent = typeof msg.content === 'string' ? msg.content : this.safeJsonStringify(msg.content);
      const parsed = extractThinking(rawContent, msg.thinking || null);
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      let html = `<div class="message-header">Assistant</div>`;
      const showThinking = this.elements.showThinking.value === 'true';
      if (parsed.thinking && showThinking) {
        const cleanedThinking = dedupeThinking(parsed.thinking);
        html += `
            <div class="thinking-block collapsed">
              <button class="thinking-header" type="button" aria-expanded="false">
                <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                Thinking
              </button>
              <div class="thinking-content">${this.escapeHtml(cleanedThinking)}</div>
            </div>
          `;
      }
      if (parsed.content && parsed.content.trim() !== '') {
        html += `<div class="message-content markdown-body">${this.renderMarkdown(parsed.content)}</div>`;
      }
      messageDiv.innerHTML = html;

      const thinkingHeader = messageDiv.querySelector('.thinking-header');
      if (thinkingHeader) {
        thinkingHeader.addEventListener('click', () => {
          const block = thinkingHeader.closest('.thinking-block');
          if (!block || block.classList.contains('thinking-hidden')) return;
          block.classList.toggle('collapsed');
          const expanded = !block.classList.contains('collapsed');
          thinkingHeader.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
      }

      this.elements.chatMessages.appendChild(messageDiv);
    }
  });
  this.restoreScrollPosition();
  this.updateChatEmptyState();
};
