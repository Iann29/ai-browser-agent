"use strict";
(() => {
  // content.ts
  var ContentScriptHandler = class {
    highlightedElements;
    constructor() {
      this.highlightedElements = /* @__PURE__ */ new Set();
      this.init();
    }
    init() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message, sender, sendResponse);
        return true;
      });
      this.notifyReady();
    }
    async handleMessage(message, sender, sendResponse) {
      try {
        switch (message.action) {
          case "highlight_element":
            this.highlightElement(message.selector);
            sendResponse({ success: true });
            break;
          case "unhighlight_all":
            this.unhighlightAll();
            sendResponse({ success: true });
            break;
          case "get_element_info":
            const info = this.getElementInfo(message.selector);
            sendResponse({ success: true, info });
            break;
          case "simulate_hover":
            this.simulateHover(message.selector);
            sendResponse({ success: true });
            break;
          case "get_all_inputs":
            const inputs = this.getAllInputs();
            sendResponse({ success: true, inputs });
            break;
          case "get_all_buttons":
            const buttons = this.getAllButtons();
            sendResponse({ success: true, buttons });
            break;
          case "get_visible_text":
            const text = this.getVisibleText();
            sendResponse({ success: true, text });
            break;
          default:
            sendResponse({ success: false, error: `Unknown action: ${message.action}` });
        }
      } catch (error) {
        console.error("[Content Script] Error handling message:", error);
        sendResponse({
          success: false,
          error: error?.message || String(error) || "Unknown error in content script"
        });
      }
    }
    notifyReady() {
      chrome.runtime.sendMessage({
        type: "content_script_ready",
        url: window.location.href
      }).catch(() => {
      });
    }
    highlightElement(selector) {
      const element = document.querySelector(selector);
      if (!element) return;
      const originalOutline = element.style.outline;
      const originalOutlineOffset = element.style.outlineOffset;
      element.style.outline = "3px solid #4f46e5";
      element.style.outlineOffset = "2px";
      this.highlightedElements.add({
        element,
        originalOutline,
        originalOutlineOffset
      });
      setTimeout(() => {
        element.style.outline = originalOutline;
        element.style.outlineOffset = originalOutlineOffset;
      }, 3e3);
    }
    unhighlightAll() {
      this.highlightedElements.forEach(({ element, originalOutline, originalOutlineOffset }) => {
        element.style.outline = originalOutline;
        element.style.outlineOffset = originalOutlineOffset;
      });
      this.highlightedElements.clear();
    }
    getElementInfo(selector) {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const typedElement = element;
      return {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        textContent: element.textContent?.substring(0, 200),
        value: typedElement.value,
        type: typedElement.type,
        position: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        visible: this.isElementVisible(element),
        attributes: Array.from(element.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      };
    }
    isElementVisible(element) {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0" && element.offsetParent !== null;
    }
    simulateHover(selector) {
      const element = document.querySelector(selector);
      if (!element) return;
      const mouseoverEvent = new MouseEvent("mouseover", {
        view: window,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(mouseoverEvent);
    }
    getAllInputs() {
      const inputs = document.querySelectorAll(
        "input, textarea, select"
      );
      return Array.from(inputs).map((input, index) => {
        const label = this.findLabelForInput(input);
        const placeholder = input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement ? input.placeholder : "";
        return {
          index,
          tagName: input.tagName,
          type: input.type,
          id: input.id,
          name: input.name,
          placeholder,
          value: input.value,
          label: label?.textContent?.trim(),
          selector: this.getOptimalSelector(input)
        };
      });
    }
    getAllButtons() {
      const buttons = document.querySelectorAll(
        'button, input[type="button"], input[type="submit"], [role="button"]'
      );
      return Array.from(buttons).map((button, index) => ({
        index,
        tagName: button.tagName,
        text: button.textContent?.trim() || button.value,
        id: button.id,
        className: button.className,
        selector: this.getOptimalSelector(button)
      }));
    }
    findLabelForInput(input) {
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label;
      }
      const parentLabel = input.closest("label");
      if (parentLabel) return parentLabel;
      const prevSibling = input.previousElementSibling;
      if (prevSibling && prevSibling.tagName === "LABEL") {
        return prevSibling;
      }
      return null;
    }
    getOptimalSelector(element) {
      if (element.id) {
        return `#${element.id}`;
      }
      if (element.name) {
        return `[name="${element.name}"]`;
      }
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.name.startsWith("data-") && attr.value) {
          return `[${attr.name}="${attr.value}"]`;
        }
      }
      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        return `${element.tagName.toLowerCase()}:nth-child(${index})`;
      }
      return element.tagName.toLowerCase();
    }
    getVisibleText() {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node2) => {
          const parent = node2.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
            return NodeFilter.FILTER_REJECT;
          }
          const text = node2.textContent?.trim() || "";
          return text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const textParts = [];
      let node;
      while (node = walker.nextNode()) {
        textParts.push(node.textContent?.trim() || "");
      }
      return textParts.join(" ").substring(0, 1e4);
    }
  };
  var contentScriptHandler = new ContentScriptHandler();
})();
//# sourceMappingURL=content.js.map
