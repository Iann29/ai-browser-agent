// sidepanel/services/account-client.ts
var AccountClient = class {
  baseUrl;
  getAuthToken;
  constructor({ baseUrl = "", getAuthToken } = {}) {
    this.baseUrl = baseUrl;
    this.getAuthToken = typeof getAuthToken === "function" ? getAuthToken : () => "";
  }
  setBaseUrl(baseUrl = "") {
    this.baseUrl = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  }
  async request(path, { method = "GET", body, auth = false } = {}) {
    if (!this.baseUrl) {
      throw new Error("Account API base URL is not configured.");
    }
    const headers = {
      "Content-Type": "application/json"
    };
    if (auth) {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("Missing access token. Please sign in again.");
      }
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : void 0
    });
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (error) {
        payload = { error: text };
      }
    }
    if (!response.ok) {
      const message = payload?.error || payload?.message || `Request failed (${response.status})`;
      throw new Error(message);
    }
    return payload || {};
  }
  startDeviceCode() {
    return this.request("/v1/auth/device-code", { method: "POST" });
  }
  verifyDeviceCode(deviceCode) {
    return this.request("/v1/auth/device-code/verify", {
      method: "POST",
      body: { deviceCode }
    });
  }
  signInWithEmail(email) {
    return this.request("/v1/auth/email", {
      method: "POST",
      body: { email }
    });
  }
  getAccount() {
    return this.request("/v1/account", { auth: true });
  }
  getBillingOverview() {
    return this.request("/v1/billing/overview", { auth: true });
  }
  createCheckout({ returnUrl } = {}) {
    return this.request("/v1/billing/checkout", {
      method: "POST",
      auth: true,
      body: returnUrl ? { returnUrl } : void 0
    });
  }
  createPortal({ returnUrl } = {}) {
    return this.request("/v1/billing/portal", {
      method: "POST",
      auth: true,
      body: returnUrl ? { returnUrl } : void 0
    });
  }
};

// sidepanel/ui/panel-elements.ts
var byId = (id) => document.getElementById(id);
var bySelector = (selector) => document.querySelector(selector);
var getSidePanelElements = () => ({
  // Sidebar elements
  sidebar: byId("sidebar"),
  openSidebarBtn: byId("openSidebarBtn"),
  closeSidebarBtn: byId("closeSidebarBtn"),
  navChatBtn: byId("navChatBtn"),
  navHistoryBtn: byId("navHistoryBtn"),
  navSettingsBtn: byId("navSettingsBtn"),
  navAccountBtn: byId("navAccountBtn"),
  accountNavLabel: byId("accountNavLabel"),
  rightPanel: byId("rightPanel"),
  rightPanelPanels: byId("rightPanelPanels") ?? bySelector(".right-panel-panels"),
  // Legacy references (kept for compatibility)
  settingsBtn: byId("settingsBtn"),
  accountBtn: byId("accountBtn"),
  settingsPanel: byId("settingsPanel"),
  chatInterface: byId("chatInterface"),
  accessPanel: byId("accessPanel"),
  authPanel: byId("authPanel"),
  billingPanel: byId("billingPanel"),
  accountPanel: byId("accountPanel"),
  authSubtitle: byId("authSubtitle"),
  accessConfigPrompt: byId("accessConfigPrompt"),
  authForm: byId("authForm"),
  authEmail: byId("authEmail"),
  authStartBtn: byId("authStartBtn"),
  authOpenBtn: byId("authOpenBtn"),
  authOpenSettingsBtn: byId("authOpenSettingsBtn"),
  authTokenInput: byId("authTokenInput"),
  authTokenSaveBtn: byId("authTokenSaveBtn"),
  billingStartBtn: byId("billingStartBtn"),
  billingManageBtn: byId("billingManageBtn"),
  authLogoutBtn: byId("authLogoutBtn"),
  accountGreeting: byId("accountGreeting"),
  accountSubtext: byId("accountSubtext"),
  accountRefreshBtn: byId("accountRefreshBtn"),
  statusBar: byId("statusBar"),
  statusText: byId("statusText"),
  statusMeta: byId("statusMeta"),
  activityPanel: byId("activityPanel"),
  activityCloseBtn: byId("activityCloseBtn"),
  activityToggleBtn: byId("activityToggleBtn"),
  toolLog: byId("toolLog"),
  thinkingPanel: byId("thinkingPanel"),
  agentNav: byId("agentNav"),
  tabSelectorBtn: byId("tabSelectorBtn"),
  tabSelector: byId("tabSelector"),
  tabSelectorSummary: byId("tabSelectorSummary"),
  tabSelectorAddActive: byId("tabSelectorAddActive"),
  tabSelectorClear: byId("tabSelectorClear"),
  tabList: byId("tabList"),
  closeTabSelector: byId("closeTabSelector"),
  selectedTabsBar: byId("selectedTabsBar"),
  scrollToLatestBtn: byId("scrollToLatestBtn"),
  viewChatBtn: byId("viewChatBtn"),
  viewHistoryBtn: byId("viewHistoryBtn"),
  historyPanel: byId("historyPanel"),
  historyItems: byId("historyItems"),
  clearHistoryBtn: byId("clearHistoryBtn"),
  startNewSessionBtn: byId("startNewSessionBtn"),
  settingsTabGeneralBtn: byId("settingsTabGeneralBtn"),
  settingsTabProfilesBtn: byId("settingsTabProfilesBtn"),
  settingsTabGeneral: byId("settingsTabGeneral"),
  settingsTabProfiles: byId("settingsTabProfiles"),
  newProfileNameInput: byId("newProfileNameInput"),
  createProfileBtn: byId("createProfileBtn"),
  openGeneralBtn: byId("openGeneralBtn"),
  openProfilesBtn: byId("openProfilesBtn"),
  generalProfileSelect: byId("generalProfileSelect"),
  profileEditorTitle: byId("profileEditorTitle"),
  profileEditorName: byId("profileEditorName"),
  profileEditorProvider: byId("profileEditorProvider"),
  profileEditorApiKey: byId("profileEditorApiKey"),
  profileEditorModel: byId("profileEditorModel"),
  profileEditorEndpoint: byId("profileEditorEndpoint"),
  profileEditorEndpointGroup: byId("profileEditorEndpointGroup"),
  profileEditorTemperature: byId("profileEditorTemperature"),
  profileEditorTemperatureValue: byId("profileEditorTemperatureValue"),
  profileEditorMaxTokens: byId("profileEditorMaxTokens"),
  profileEditorTimeout: byId("profileEditorTimeout"),
  profileEditorEnableScreenshots: byId("profileEditorEnableScreenshots"),
  profileEditorSendScreenshots: byId("profileEditorSendScreenshots"),
  profileEditorScreenshotQuality: byId("profileEditorScreenshotQuality"),
  profileEditorPrompt: byId("profileEditorPrompt"),
  saveProfileBtn: byId("saveProfileBtn"),
  permissionRead: byId("permissionRead"),
  permissionInteract: byId("permissionInteract"),
  permissionNavigate: byId("permissionNavigate"),
  permissionTabs: byId("permissionTabs"),
  permissionScreenshots: byId("permissionScreenshots"),
  allowedDomains: byId("allowedDomains"),
  accountSettingsSection: byId("accountSettingsSection"),
  accountApiBaseGroup: byId("accountApiBaseGroup"),
  accountApiBase: byId("accountApiBase"),
  exportSettingsBtn: byId("exportSettingsBtn"),
  importSettingsBtn: byId("importSettingsBtn"),
  importSettingsInput: byId("importSettingsInput"),
  accessStatus: byId("accessStatus"),
  // Form elements - Provider & model
  provider: byId("provider"),
  apiKey: byId("apiKey"),
  model: byId("model"),
  customEndpoint: byId("customEndpoint"),
  customEndpointGroup: byId("customEndpointGroup"),
  // Form elements - Model parameters
  temperature: byId("temperature"),
  temperatureValue: byId("temperatureValue"),
  maxTokens: byId("maxTokens"),
  contextLimit: byId("contextLimit"),
  timeout: byId("timeout"),
  // Form elements - Screenshots & vision
  enableScreenshots: byId("enableScreenshots"),
  sendScreenshotsAsImages: byId("sendScreenshotsAsImages"),
  screenshotQuality: byId("screenshotQuality"),
  visionBridge: byId("visionBridge"),
  visionProfile: byId("visionProfile"),
  // Form elements - Behavior
  showThinking: byId("showThinking"),
  streamResponses: byId("streamResponses"),
  autoScroll: byId("autoScroll"),
  confirmActions: byId("confirmActions"),
  saveHistory: byId("saveHistory"),
  // Form elements - Orchestrator
  orchestratorToggle: byId("orchestratorToggle"),
  orchestratorProfile: byId("orchestratorProfile"),
  // Form elements - System prompt
  systemPrompt: byId("systemPrompt"),
  // Settings actions
  saveSettingsBtn: byId("saveSettingsBtn"),
  cancelSettingsBtn: byId("cancelSettingsBtn"),
  // Profile management
  activeConfig: byId("activeConfig"),
  newConfigBtn: byId("newConfigBtn"),
  deleteConfigBtn: byId("deleteConfigBtn"),
  refreshProfilesBtn: byId("refreshProfilesBtn"),
  agentGrid: byId("agentGrid"),
  // Chat interface
  chatMessages: byId("chatMessages"),
  chatEmptyState: byId("chatEmptyState"),
  userInput: byId("userInput"),
  sendBtn: byId("sendBtn"),
  composer: byId("composer"),
  modelSelect: byId("modelSelect"),
  fileBtn: byId("fileBtn"),
  fileInput: byId("fileInput"),
  planStatus: byId("planStatus"),
  planDrawer: byId("planDrawer"),
  planDrawerToggle: byId("planDrawerToggle"),
  planDrawerContent: byId("planDrawerContent"),
  planChecklist: byId("planChecklist"),
  planStepCount: byId("planStepCount"),
  planClearBtn: byId("planClearBtn"),
  // Account panel elements
  accountCheckoutBtn: byId("accountCheckoutBtn"),
  accountPortalBtn: byId("accountPortalBtn"),
  accountLogoutBtn: byId("accountLogoutBtn"),
  accountOpenSettingsBtn: byId("accountOpenSettingsBtn"),
  accountOpenProfilesBtn: byId("accountOpenProfilesBtn"),
  accountOpenHistoryBtn: byId("accountOpenHistoryBtn"),
  accountPlanStatus: byId("accountPlanStatus"),
  accountPlanBadge: byId("accountPlanBadge"),
  accountPlanDetails: byId("accountPlanDetails"),
  accountBillingSummary: byId("accountBillingSummary"),
  accountSettingsSummary: byId("accountSettingsSummary"),
  accountConfigs: byId("accountConfigs"),
  accountHistory: byId("accountHistory"),
  accountInvoices: byId("accountInvoices")
});

// sidepanel/ui/panel-ui.ts
var SidePanelUI = class {
  elements;
  displayHistory;
  contextHistory;
  sessionId;
  sessionStartedAt;
  firstUserMessage;
  currentConfig;
  configs;
  toolCallViews;
  lastChatTurn;
  selectedTabs;
  tabGroupInfo;
  scrollPositions;
  pendingToolCount;
  isStreaming;
  thinkingStartedAt;
  thinkingTimerId;
  streamingState;
  userScrolledUp;
  isNearBottom;
  chatResizeObserver;
  contextUsage;
  sessionTokensUsed;
  lastUsage;
  sessionTokenTotals;
  auxAgentProfiles;
  currentView;
  currentSettingsTab;
  profileEditorTarget;
  authState;
  entitlement;
  billingOverview;
  accessPanelVisible;
  settingsOpen;
  accountClient;
  subagents;
  activeAgent;
  activityPanelOpen;
  latestThinking;
  activeToolName;
  streamingReasoning;
  currentPlan;
  constructor() {
    this.elements = getSidePanelElements();
    this.displayHistory = [];
    this.contextHistory = [];
    this.sessionId = `session-${Date.now()}`;
    this.sessionStartedAt = Date.now();
    this.firstUserMessage = "";
    this.currentConfig = "default";
    this.configs = { default: {} };
    this.toolCallViews = /* @__PURE__ */ new Map();
    this.lastChatTurn = null;
    this.selectedTabs = /* @__PURE__ */ new Map();
    this.tabGroupInfo = /* @__PURE__ */ new Map();
    this.scrollPositions = /* @__PURE__ */ new Map();
    this.pendingToolCount = 0;
    this.isStreaming = false;
    this.thinkingStartedAt = null;
    this.thinkingTimerId = null;
    this.streamingState = null;
    this.userScrolledUp = false;
    this.isNearBottom = true;
    this.chatResizeObserver = null;
    this.contextUsage = {
      approxTokens: 0,
      maxContextTokens: 196e3,
      percent: 0
    };
    this.sessionTokensUsed = 0;
    this.lastUsage = null;
    this.sessionTokenTotals = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    this.auxAgentProfiles = [];
    this.currentView = "chat";
    this.currentSettingsTab = "general";
    this.profileEditorTarget = "default";
    this.authState = { status: "signed_out" };
    this.entitlement = { active: false, plan: "none" };
    this.billingOverview = null;
    this.accessPanelVisible = false;
    this.settingsOpen = false;
    this.accountClient = new AccountClient({
      baseUrl: "",
      getAuthToken: () => this.authState?.accessToken || ""
    });
    this.subagents = /* @__PURE__ */ new Map();
    this.activeAgent = "main";
    this.activityPanelOpen = false;
    this.latestThinking = null;
    this.activeToolName = null;
    this.streamingReasoning = "";
    this.currentPlan = null;
    void this.init();
  }
};

// sidepanel/ui/panel-access.ts
SidePanelUI.prototype.loadAccessState = async function loadAccessState() {
  const { authState, entitlement } = await chrome.storage.local.get(["authState", "entitlement"]);
  this.authState = this.normalizeAuthState(authState);
  this.entitlement = this.normalizeEntitlement(entitlement);
  this.updateAccessUI();
  if (this.authState?.status === "signed_in" && this.authState?.accessToken) {
    await this.refreshAccountData({ silent: true });
  }
};
SidePanelUI.prototype.normalizeAuthState = function normalizeAuthState(state) {
  const normalized = { status: "signed_out" };
  if (!state || typeof state !== "object") return normalized;
  const status = state.status === "signed_out" || state.status === "device_code" || state.status === "signed_in" ? state.status : "signed_out";
  const result = { status };
  if (state.code) result.code = String(state.code);
  if (state.deviceCode) result.deviceCode = String(state.deviceCode);
  if (state.verificationUrl) result.verificationUrl = String(state.verificationUrl);
  if (state.accessToken) result.accessToken = String(state.accessToken);
  if (state.email) result.email = String(state.email);
  if (state.expiresAt) result.expiresAt = Number(state.expiresAt);
  return result;
};
SidePanelUI.prototype.normalizeEntitlement = function normalizeEntitlement(state) {
  if (!state || typeof state !== "object") {
    return { active: false, plan: "none" };
  }
  return {
    active: Boolean(state.active),
    plan: state.plan ? String(state.plan) : "none",
    renewsAt: state.renewsAt ? String(state.renewsAt) : "",
    status: state.status ? String(state.status) : ""
  };
};
SidePanelUI.prototype.persistAccessState = async function persistAccessState() {
  await chrome.storage.local.set({
    authState: this.authState,
    entitlement: this.entitlement
  });
};
SidePanelUI.prototype.getAccessState = function getAccessState() {
  if (!this.isAccountRequired()) return "ready";
  if (!this.authState || this.authState.status !== "signed_in") return "auth";
  if (!this.entitlement || !this.entitlement.active) return "billing";
  return "ready";
};
SidePanelUI.prototype.isAccessReady = function isAccessReady() {
  return this.getAccessState() === "ready";
};
SidePanelUI.prototype.updateAccessUI = function updateAccessUI() {
  const accountRequired = this.isAccountRequired();
  const state = this.getAccessState();
  this.updateAccessConfigPrompt();
  const showAccess = this.accessPanelVisible || state !== "ready";
  const showAccount = this.accessPanelVisible && state !== "auth";
  const showBilling = state === "billing" && !showAccount;
  const showAuth = state === "auth";
  if (this.elements.accessPanel) {
    this.elements.accessPanel.classList.toggle("hidden", !showAccess);
  }
  if (this.elements.authPanel) {
    this.elements.authPanel.classList.toggle("hidden", !showAuth);
  }
  if (this.elements.billingPanel) {
    this.elements.billingPanel.classList.toggle("hidden", !showBilling);
  }
  if (this.elements.accountPanel) {
    this.elements.accountPanel.classList.toggle("hidden", !showAccount);
    if (showAccount) {
      this.renderAccountPanel();
    }
  }
  if (this.elements.authOpenBtn) {
    const canOpenAccount = Boolean(this.accountClient?.baseUrl);
    this.elements.authOpenBtn.disabled = !canOpenAccount;
  }
  if (this.elements.planStatus) {
    this.elements.planStatus.textContent = this.entitlement?.active ? `Active${this.entitlement.renewsAt ? ` \xB7 Renews ${new Date(this.entitlement.renewsAt).toLocaleDateString()}` : ""}` : "No active plan";
  }
  if (this.elements.accountBtn) {
    const label = accountRequired ? state === "auth" ? "Signed out" : this.authState?.email || "Signed in" : this.authState?.email || "Account";
    this.elements.accountBtn.textContent = label;
  }
  if (this.elements.accountNavLabel) {
    const navLabel = this.authState?.email || "Account";
    this.elements.accountNavLabel.textContent = navLabel;
  }
  if (this.settingsOpen) {
    this.elements.accessPanel?.classList.add("hidden");
    return;
  }
  const locked = showAccess;
  if (this.elements.viewChatBtn) this.elements.viewChatBtn.disabled = locked;
  if (this.elements.viewHistoryBtn) this.elements.viewHistoryBtn.disabled = locked;
  if (this.elements.startNewSessionBtn) this.elements.startNewSessionBtn.disabled = locked;
  if (this.elements.sendBtn) this.elements.sendBtn.disabled = locked;
  if (this.elements.userInput) this.elements.userInput.disabled = locked;
  if (showAccess) {
    this.elements.chatInterface?.classList.add("hidden");
    this.elements.historyPanel?.classList.add("hidden");
    if (state !== "ready") {
      this.updateStatus(state === "auth" ? "Sign in required" : "Subscription required", "warning");
    }
  } else {
    this.switchView(this.currentView || "chat");
  }
};
SidePanelUI.prototype.updateAccessConfigPrompt = function updateAccessConfigPrompt() {
  const apiConfigured = Boolean(this.accountClient?.baseUrl);
  if (this.elements.accessConfigPrompt) {
    this.elements.accessConfigPrompt.classList.toggle("hidden", apiConfigured);
  }
  if (this.elements.authSubtitle) {
    this.elements.authSubtitle.textContent = apiConfigured ? "Sign in with your email to unlock billing and sync." : "Set the account API base URL in Settings before signing in.";
  }
};
SidePanelUI.prototype.toggleAccessPanel = function toggleAccessPanel() {
  if (this.accessPanelVisible) {
    this.accessPanelVisible = false;
    this.showRightPanel(null);
    this.setNavActive("chat");
    this.updateAccessUI();
    return;
  }
  this.openAccountPanel();
};
SidePanelUI.prototype.openExternalUrl = function openExternalUrl(url) {
  if (!url) return;
  chrome.tabs.create({ url });
};
SidePanelUI.prototype.openAuthPage = function openAuthPage() {
  const fallbackUrl = this.accountClient?.baseUrl ? `${this.accountClient.baseUrl}/portal` : "";
  const url = this.authState?.verificationUrl || fallbackUrl;
  if (!url) {
    this.setAccessStatus("Set the account API base URL in Settings to open the account page.", "warning");
    this.updateStatus("No account page available yet.", "warning");
    this.openAccountSettings({ focusAccountApi: true });
    return;
  }
  this.openExternalUrl(url);
};
SidePanelUI.prototype.refreshAccountData = async function refreshAccountData({ silent = false } = {}) {
  if (!this.authState || this.authState.status !== "signed_in") return;
  try {
    const [account, billing] = await Promise.all([
      this.accountClient.getAccount(),
      this.accountClient.getBillingOverview()
    ]);
    if (account?.user?.email) {
      this.authState.email = account.user.email;
    }
    if (billing?.entitlement) {
      this.entitlement = this.normalizeEntitlement(billing.entitlement);
    }
    this.billingOverview = billing || null;
    await this.persistAccessState();
    this.updateAccessUI();
    if (!silent) {
      this.updateStatus("Account synced", "success");
    }
  } catch (error) {
    const message = error?.message || "Unable to refresh account";
    if (message.includes("Session expired") || message.includes("Missing access token")) {
      await this.signOut();
      if (!silent) {
        this.updateStatus("Session expired. Please sign in again.", "warning");
      }
      return;
    }
    if (!silent) {
      this.updateStatus(message, "error");
    }
  }
};
SidePanelUI.prototype.openSettingsFromAccount = function openSettingsFromAccount() {
  this.openAccountSettings();
};
SidePanelUI.prototype.openAccountSettings = function openAccountSettings({ focusAccountApi = false } = {}) {
  this.openSettingsPanel();
  this.switchSettingsTab("general");
  const accountSection = this.elements.accountSettingsSection;
  if (accountSection && accountSection instanceof HTMLDetailsElement) {
    accountSection.open = true;
  }
  if (focusAccountApi) {
    this.focusAccountApiBase();
  }
};
SidePanelUI.prototype.focusAccountApiBase = function focusAccountApiBase() {
  const group = this.elements.accountApiBaseGroup;
  const input = this.elements.accountApiBase;
  if (!input) return;
  requestAnimationFrame(() => {
    if (group?.classList) {
      group.classList.add("highlight");
      window.setTimeout(() => group.classList.remove("highlight"), 1600);
    }
    input.focus();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};
SidePanelUI.prototype.openProfilesFromAccount = function openProfilesFromAccount() {
  this.openSettingsPanel();
  this.switchSettingsTab("profiles");
};
SidePanelUI.prototype.openHistoryFromAccount = function openHistoryFromAccount() {
  this.openHistoryPanel();
};
SidePanelUI.prototype.startEmailAuth = async function startEmailAuth() {
  if (!this.ensureAccountApiBase()) return;
  const email = (this.elements.authEmail?.value || "").trim();
  if (!email) {
    this.setAccessStatus("Enter your email to sign in.", "warning");
    this.updateStatus("Email is required to sign in", "warning");
    this.elements.authEmail?.focus();
    return;
  }
  if (this.elements.authStartBtn) {
    this.elements.authStartBtn.disabled = true;
  }
  if (this.elements.authEmail) {
    this.elements.authEmail.disabled = true;
  }
  this.setAccessStatus("Signing you in\u2026");
  try {
    const response = await this.accountClient.signInWithEmail(email);
    const accessToken = response?.accessToken || response?.token;
    if (!accessToken) {
      throw new Error("Sign-in did not return an access token.");
    }
    this.authState = {
      status: "signed_in",
      accessToken,
      email: response?.user?.email || email
    };
    this.entitlement = this.normalizeEntitlement(response?.entitlement || { active: false, plan: "none" });
    await this.persistAccessState();
    await this.refreshAccountData({ silent: true });
    this.accessPanelVisible = true;
    this.updateAccessUI();
    this.setAccessStatus("Signed in successfully.", "success");
    this.updateStatus("Signed in \u2014 subscription required", "warning");
  } catch (error) {
    this.setAccessStatus(error.message || "Unable to sign in", "error");
    this.updateStatus(error.message || "Unable to sign in", "error");
  } finally {
    if (this.elements.authStartBtn) {
      this.elements.authStartBtn.disabled = false;
    }
    if (this.elements.authEmail) {
      this.elements.authEmail.disabled = false;
    }
  }
};
SidePanelUI.prototype.saveAccessToken = async function saveAccessToken() {
  const token = (this.elements.authTokenInput?.value || "").trim();
  if (!token) {
    this.setAccessStatus("Paste an access token to continue.", "warning");
    this.updateStatus("Access token required", "warning");
    this.elements.authTokenInput?.focus();
    return;
  }
  this.authState = {
    status: "signed_in",
    accessToken: token,
    email: this.authState?.email || "Token user"
  };
  await this.persistAccessState();
  this.accessPanelVisible = true;
  this.updateAccessUI();
  this.setAccessStatus("Access token saved.", "success");
  this.updateStatus("Signed in with token", "success");
  this.elements.authTokenInput.value = "";
};
SidePanelUI.prototype.startSubscription = async function startSubscription() {
  if (!this.ensureAccountApiBase()) return;
  if (!this.authState || this.authState.status !== "signed_in") {
    this.setAccessStatus("Sign in required before subscribing.", "warning");
    this.updateStatus("Sign in required before subscribing", "warning");
    return;
  }
  try {
    const response = await this.accountClient.createCheckout();
    if (response?.url) {
      this.openExternalUrl(response.url);
      this.setAccessStatus("Checkout opened in a new tab.", "success");
      this.updateStatus("Checkout opened in a new tab", "active");
    } else {
      this.setAccessStatus("Checkout link unavailable.", "warning");
      this.updateStatus("Checkout link unavailable", "warning");
    }
  } catch (error) {
    this.setAccessStatus(error.message || "Unable to start subscription", "error");
    this.updateStatus(error.message || "Unable to start subscription", "error");
  }
};
SidePanelUI.prototype.manageBilling = function manageBilling() {
  if (!this.ensureAccountApiBase()) return;
  if (!this.authState || this.authState.status !== "signed_in") {
    this.setAccessStatus("Sign in required before opening billing.", "warning");
    this.updateStatus("Sign in required before opening billing", "warning");
    return;
  }
  this.accountClient.createPortal().then((response) => {
    if (response?.url) {
      this.openExternalUrl(response.url);
      this.setAccessStatus("Billing portal opened in a new tab.", "success");
      this.updateStatus("Billing portal opened in a new tab", "success");
    } else {
      this.setAccessStatus("Billing portal unavailable.", "warning");
      this.updateStatus("Billing portal unavailable", "warning");
    }
  }).catch((error) => {
    this.setAccessStatus(error.message || "Unable to open billing portal", "error");
    this.updateStatus(error.message || "Unable to open billing portal", "error");
  });
};
SidePanelUI.prototype.ensureAccountApiBase = function ensureAccountApiBase() {
  if (this.accountClient?.baseUrl) return true;
  this.setAccessStatus("Open Settings \u2192 Account & billing and add the account API base URL.", "warning");
  this.updateStatus("Account API base URL is not configured", "warning");
  this.openAccountSettings({ focusAccountApi: true });
  return false;
};
SidePanelUI.prototype.setAccessStatus = function setAccessStatus(message, tone = "") {
  const statusEl = this.elements.accessStatus;
  if (!statusEl) return;
  if (!message) {
    statusEl.textContent = "";
    statusEl.className = "access-status hidden";
    return;
  }
  statusEl.textContent = message;
  statusEl.className = `access-status ${tone}`.trim();
};
SidePanelUI.prototype.signOut = async function signOut() {
  this.authState = { status: "signed_out" };
  this.entitlement = { active: false, plan: "none" };
  this.billingOverview = null;
  await this.persistAccessState();
  this.accessPanelVisible = true;
  this.updateAccessUI();
  this.setAccessStatus("Signed out.", "warning");
  this.updateStatus("Signed out", "warning");
};

// ai/message-schema.ts
var ROLE_SET = /* @__PURE__ */ new Set(["system", "user", "assistant", "tool"]);
function createMessageId() {
  return `msg_${Date.now()}_${Math.floor(Math.random() * 1e5)}`;
}
function createMessage({ role, content, ...meta } = {}) {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return null;
  const message = {
    id: meta.id || createMessageId(),
    createdAt: meta.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    role: normalizedRole,
    content: normalizeContent(content)
  };
  if (typeof meta.thinking === "string" && meta.thinking.trim()) {
    message.thinking = meta.thinking;
  }
  if (meta.toolCalls) message.toolCalls = normalizeToolCalls(meta.toolCalls);
  if (meta.toolCallId) message.toolCallId = String(meta.toolCallId);
  if (meta.toolName) message.toolName = String(meta.toolName);
  if (meta.name) message.name = String(meta.name);
  if (meta.usage) message.usage = normalizeUsage(meta.usage);
  if (meta.meta) message.meta = meta.meta;
  return message;
}
function normalizeConversationHistory(history = [], options = {}) {
  const messages = Array.isArray(history) ? history : [];
  const normalized = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") continue;
    const role = normalizeRole(msg.role || options.defaultRole);
    if (!role) continue;
    const base = {
      role,
      content: normalizeContent(msg.content)
    };
    const id = typeof msg.id === "string" ? msg.id : options.addIds === false ? null : createMessageId();
    if (id) base.id = id;
    const createdAt = typeof msg.createdAt === "string" ? msg.createdAt : options.addTimestamps === false ? null : (/* @__PURE__ */ new Date()).toISOString();
    if (createdAt) base.createdAt = createdAt;
    if (typeof msg.thinking === "string" && msg.thinking.trim()) {
      base.thinking = msg.thinking;
    }
    if (role === "assistant") {
      const toolCalls = msg.toolCalls || msg.tool_calls;
      if (Array.isArray(toolCalls)) {
        base.toolCalls = normalizeToolCalls(toolCalls);
      }
    }
    if (role === "tool") {
      const toolCallId = msg.toolCallId || msg.tool_call_id;
      if (toolCallId) base.toolCallId = String(toolCallId);
      if (msg.name) base.name = String(msg.name);
      if (msg.toolName) base.toolName = String(msg.toolName);
    }
    if (msg.usage) base.usage = normalizeUsage(msg.usage);
    if (msg.meta) base.meta = msg.meta;
    normalized.push(base);
  }
  return normalized;
}
function normalizeToolCalls(toolCalls = []) {
  return toolCalls.map((call) => ({
    id: typeof call?.id === "string" ? call.id : createMessageId(),
    name: typeof call?.name === "string" ? call.name : call && typeof call.function?.name === "string" ? String(call.function?.name) : "",
    args: normalizeArgs(
      call?.args ?? call?.arguments ?? call?.function?.arguments
    )
  }));
}
function normalizeUsage(usage = {}) {
  return {
    inputTokens: Number(usage.inputTokens || 0),
    outputTokens: Number(usage.outputTokens || 0),
    totalTokens: Number(usage.totalTokens || 0)
  };
}
function normalizeRole(role) {
  if (typeof role !== "string") return "";
  const lowered = role.toLowerCase();
  return ROLE_SET.has(lowered) ? lowered : "";
}
function normalizeContent(content) {
  if (content === null || content === void 0) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content;
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}
function normalizeArgs(args) {
  if (args && typeof args === "object" && !Array.isArray(args)) return args;
  if (Array.isArray(args)) return { value: args };
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return { value: args };
    }
  }
  return {};
}

// sidepanel/ui/panel-account.ts
SidePanelUI.prototype.renderAccountPanel = function renderAccountPanel() {
  const email = this.authState?.email;
  if (this.elements.accountGreeting) {
    this.elements.accountGreeting.textContent = email ? `Welcome back, ${email}` : "Welcome back";
  }
  const apiConfigured = Boolean(this.accountClient?.baseUrl);
  const signedIn = this.authState?.status === "signed_in";
  if (this.elements.accountSubtext) {
    this.elements.accountSubtext.textContent = apiConfigured ? "Manage your subscription, billing, and workspace settings." : "Set the account API base URL in settings to enable billing.";
  }
  if (this.elements.accountRefreshBtn) {
    this.elements.accountRefreshBtn.disabled = !signedIn || !apiConfigured;
  }
  const planLabel = this.entitlement?.active ? this.entitlement?.plan || "Active" : "No plan";
  if (this.elements.accountPlanBadge) {
    this.elements.accountPlanBadge.textContent = planLabel;
  }
  if (this.elements.accountPlanStatus) {
    const renewsAt = this.entitlement?.renewsAt ? ` \xB7 Renews ${this.formatShortDate(this.entitlement.renewsAt)}` : "";
    this.elements.accountPlanStatus.textContent = this.entitlement?.active ? `Active${renewsAt}` : "No active plan";
  }
  if (this.elements.accountPlanDetails) {
    if (!apiConfigured) {
      this.elements.accountPlanDetails.textContent = "Connect billing to activate a subscription.";
    } else if (this.entitlement?.active) {
      this.elements.accountPlanDetails.textContent = `Plan: ${this.entitlement.plan || "Pro"} \xB7 Status: ${this.entitlement.status || "active"}`;
    } else {
      this.elements.accountPlanDetails.textContent = "No subscription on this device yet.";
    }
  }
  const billing = this.billingOverview || {};
  const payment = billing?.paymentMethod;
  if (this.elements.accountBillingSummary) {
    if (payment?.brand && payment?.last4) {
      const exp = payment?.expMonth ? ` \xB7 exp ${payment.expMonth}/${payment.expYear}` : "";
      this.elements.accountBillingSummary.textContent = `${payment.brand.toUpperCase()} \u2022\u2022\u2022\u2022 ${payment.last4}${exp}`;
    } else if (!apiConfigured) {
      this.elements.accountBillingSummary.textContent = "Billing data unavailable until the account API is configured.";
    } else {
      this.elements.accountBillingSummary.textContent = "No payment method on file yet.";
    }
  }
  if (this.elements.accountInvoices) {
    const invoices = Array.isArray(billing?.invoices) ? billing.invoices : [];
    this.elements.accountInvoices.innerHTML = "";
    if (!invoices.length) {
      this.elements.accountInvoices.innerHTML = '<div class="account-list-item"><span class="muted">No invoices yet.</span></div>';
    } else {
      invoices.slice(0, 4).forEach((invoice) => {
        const item = document.createElement("div");
        item.className = "account-list-item";
        const amount = this.formatCurrency(invoice.amountDue, invoice.currency);
        const date = this.formatShortDate(invoice.periodEnd || invoice.createdAt);
        const link = invoice.hostedInvoiceUrl;
        item.innerHTML = link ? `<a href="${this.escapeAttribute(link)}" target="_blank" rel="noopener noreferrer">${amount || "Invoice"}</a><span class="muted">${this.escapeHtml(date || "")}</span>` : `<span>${this.escapeHtml(amount || "Invoice")}</span><span class="muted">${this.escapeHtml(date || "")}</span>`;
        this.elements.accountInvoices.appendChild(item);
      });
    }
  }
  if (this.elements.accountCheckoutBtn) {
    this.elements.accountCheckoutBtn.disabled = !signedIn || !apiConfigured;
  }
  if (this.elements.accountPortalBtn) {
    this.elements.accountPortalBtn.disabled = !signedIn || !apiConfigured;
  }
  if (this.elements.accountSettingsSummary) {
    const profile = this.currentConfig || "default";
    const stream = this.elements.streamResponses?.value === "true" ? "Streaming on" : "Streaming off";
    const history = this.elements.saveHistory?.value === "true" ? "History saved" : "History off";
    this.elements.accountSettingsSummary.textContent = `Profile: ${profile} \xB7 ${stream} \xB7 ${history}`;
  }
  if (this.elements.accountConfigs) {
    const configs = Object.entries(this.configs || {});
    this.elements.accountConfigs.innerHTML = "";
    if (!configs.length) {
      this.elements.accountConfigs.innerHTML = '<div class="account-list-item"><span class="muted">No profiles saved.</span></div>';
    } else {
      configs.slice(0, 4).forEach(([name, config]) => {
        const item = document.createElement("div");
        item.className = "account-list-item";
        item.innerHTML = `
            <span>${this.escapeHtml(name)}</span>
            <span class="muted">${this.escapeHtml(config.provider || "provider")} \xB7 ${this.escapeHtml(config.model || "model")}</span>
          `;
        this.elements.accountConfigs.appendChild(item);
      });
    }
  }
  this.renderHistoryPreview();
};
SidePanelUI.prototype.renderHistoryPreview = async function renderHistoryPreview() {
  if (!this.elements.accountHistory) return;
  const { chatSessions = [] } = await chrome.storage.local.get(["chatSessions"]);
  this.elements.accountHistory.innerHTML = "";
  if (!chatSessions.length) {
    this.elements.accountHistory.innerHTML = '<div class="account-list-item"><span class="muted">No saved chats yet.</span></div>';
    return;
  }
  chatSessions.slice(0, 4).forEach((session) => {
    const item = document.createElement("div");
    item.className = "account-list-item";
    const date = new Date(session.updatedAt || session.startedAt || Date.now());
    item.innerHTML = `
        <span>${this.escapeHtml(session.title || "Session")}</span>
        <span class="muted">${this.escapeHtml(date.toLocaleDateString())}</span>
      `;
    item.addEventListener("click", () => {
      this.openHistoryFromAccount();
      if (Array.isArray(session.transcript)) {
        this.recordScrollPosition();
        const normalized = normalizeConversationHistory(session.transcript || []);
        this.displayHistory = normalized;
        this.contextHistory = normalized;
        this.sessionId = session.id || `session-${Date.now()}`;
        this.firstUserMessage = session.title || "";
        this.renderConversationHistory();
        this.updateContextUsage();
      }
    });
    this.elements.accountHistory.appendChild(item);
  });
};

// sidepanel/ui/panel-agents.ts
SidePanelUI.prototype.addSubagent = function addSubagent(id, name, tasks) {
  this.subagents.set(id, {
    name: name || `Sub-${this.subagents.size + 1}`,
    tasks,
    status: "running",
    messages: []
  });
  this.renderAgentNav();
};
SidePanelUI.prototype.updateSubagentStatus = function updateSubagentStatus(id, status) {
  const agent = this.subagents.get(id);
  if (agent) {
    agent.status = status;
    this.renderAgentNav();
  }
};
SidePanelUI.prototype.renderAgentNav = function renderAgentNav() {
  if (!this.elements.agentNav) return;
  if (this.subagents.size === 0) {
    this.hideAgentNav();
    return;
  }
  this.elements.agentNav.classList.remove("hidden");
  let html = `
      <div class="agent-nav-item main-agent ${this.activeAgent === "main" ? "active" : ""}" data-agent="main">
        <span class="agent-status"></span>
        <span>Main</span>
      </div>
    `;
  this.subagents.forEach((agent, id) => {
    const statusClass = agent.status === "running" ? "running" : agent.status === "completed" ? "completed" : "error";
    html += `
        <div class="agent-nav-item sub-agent ${statusClass} ${this.activeAgent === id ? "active" : ""}" data-agent="${id}">
          <span class="agent-status"></span>
          <span>${agent.name}</span>
        </div>
      `;
  });
  this.elements.agentNav.innerHTML = html;
  this.elements.agentNav.querySelectorAll(".agent-nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const agentId = item.dataset.agent;
      this.switchAgent(agentId);
    });
  });
};
SidePanelUI.prototype.switchAgent = function switchAgent(agentId) {
  this.activeAgent = agentId;
  this.renderAgentNav();
};
SidePanelUI.prototype.hideAgentNav = function hideAgentNav() {
  if (this.elements.agentNav) {
    this.elements.agentNav.classList.add("hidden");
  }
};

// ai/message-utils.ts
function extractThinking(content, existingThinking = null) {
  let thinking = existingThinking || null;
  let cleanedContent = content || "";
  const thinkRegex = /<\s*(think|analysis|thinking)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/gi;
  let match;
  const collected = [];
  while ((match = thinkRegex.exec(cleanedContent)) !== null) {
    if (match[2]) collected.push(match[2].trim());
  }
  if (collected.length > 0) {
    thinking = [existingThinking, ...collected].filter(Boolean).join("\n\n").trim();
    thinkRegex.lastIndex = 0;
    cleanedContent = cleanedContent.replace(thinkRegex, "").trim();
  }
  return { content: cleanedContent, thinking };
}
function dedupeThinking(thinking) {
  if (!thinking) return "";
  const paragraphs = thinking.split(/\n\n+/);
  const seenParagraphs = /* @__PURE__ */ new Set();
  const dedupedParagraphs = [];
  for (const para of paragraphs) {
    const normalized = para.trim().toLowerCase();
    if (normalized && !seenParagraphs.has(normalized)) {
      seenParagraphs.add(normalized);
      dedupedParagraphs.push(para.trim());
    }
  }
  const result = dedupedParagraphs.join("\n\n");
  const lines = result.split("\n");
  const deduplicated = [];
  let lastLine = null;
  let repeatCount = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === lastLine && trimmed !== "") {
      repeatCount++;
      if (repeatCount >= 2) {
      }
    } else {
      deduplicated.push(line);
      lastLine = trimmed;
      repeatCount = 0;
    }
  }
  return deduplicated.join("\n").trim();
}

// sidepanel/ui/panel-chat.ts
SidePanelUI.prototype.sendMessage = async function sendMessage() {
  const userMessage = this.elements.userInput.value.trim();
  if (!userMessage) return;
  if (!this.isAccessReady()) {
    this.updateAccessUI();
    this.updateStatus("Sign in required", "warning");
    return;
  }
  this.elements.userInput.value = "";
  this.elements.userInput.style.height = "";
  if (!this.firstUserMessage) {
    this.firstUserMessage = userMessage;
  }
  this.pendingToolCount = 0;
  this.isStreaming = false;
  this.activeToolName = null;
  this.clearRunIncompleteBanner();
  this.updateActivityState();
  const tabsContext = this.getSelectedTabsContext();
  const fullMessage = userMessage + tabsContext;
  this.currentPlan = null;
  this.displayUserMessage(userMessage);
  const displayEntry = createMessage({ role: "user", content: userMessage });
  if (displayEntry) {
    this.displayHistory.push(displayEntry);
  }
  const contextEntry = createMessage({ role: "user", content: fullMessage });
  if (contextEntry) {
    this.contextHistory.push(contextEntry);
  }
  this.updateContextUsage();
  this.updateStatus("Processing...", "active");
  this.elements.composer?.classList.add("running");
  try {
    chrome.runtime.sendMessage({
      type: "user_message",
      message: fullMessage,
      conversationHistory: this.contextHistory,
      selectedTabs: Array.from(this.selectedTabs.values()),
      sessionId: this.sessionId
    });
    this.persistHistory();
  } catch (error) {
    this.stopThinkingTimer?.();
    this.updateStatus("Error: " + error.message, "error");
    this.elements.composer?.classList.remove("running");
    this.displayAssistantMessage("Sorry, an error occurred: " + error.message);
  }
};
SidePanelUI.prototype.displayUserMessage = function displayUserMessage(content) {
  const turn = document.createElement("div");
  turn.className = "chat-turn";
  const messageDiv = document.createElement("div");
  messageDiv.className = "message user";
  messageDiv.innerHTML = `
      <div class="message-header">You</div>
      <div class="message-content">${this.escapeHtml(content)}</div>
    `;
  turn.appendChild(messageDiv);
  this.elements.chatMessages.appendChild(turn);
  this.lastChatTurn = turn;
  this.scrollToBottom({ force: true });
  this.updateChatEmptyState();
};
SidePanelUI.prototype.displaySummaryMessage = function displaySummaryMessage(messageOrEntry) {
  const content = typeof messageOrEntry === "string" ? messageOrEntry : String(messageOrEntry.content || "");
  const container = document.createElement("div");
  container.className = "message summary";
  container.innerHTML = `
      <div class="summary-header">Context compacted</div>
      <div class="summary-body">${this.renderMarkdown(content)}</div>
    `;
  this.elements.chatMessages.appendChild(container);
  this.scrollToBottom();
  this.updateChatEmptyState();
};
SidePanelUI.prototype.updateChatEmptyState = function updateChatEmptyState() {
  const emptyState = this.elements.chatEmptyState;
  if (!emptyState) return;
  const hasMessages = this.displayHistory && this.displayHistory.length > 0 || this.elements.chatMessages && this.elements.chatMessages.children.length > 0;
  emptyState.classList.toggle("hidden", hasMessages);
};
SidePanelUI.prototype.displayAssistantMessage = function displayAssistantMessage(content, thinking = null, usage = null, model = null) {
  this.stopThinkingTimer?.();
  const streamResult = this.finishStreamingMessage();
  const streamedContainer = streamResult?.container;
  const streamEventsEl = streamedContainer?.querySelector(".stream-events");
  const hasStreamEvents = Boolean(streamEventsEl && streamEventsEl.children.length > 0);
  let normalizedUsage = this.normalizeUsage(usage);
  const modelLabel = model || this.getActiveModelLabel();
  const combinedThinking = [streamResult?.thinking, thinking].filter(Boolean).join("\n\n") || null;
  if ((!content || content.trim() === "") && !combinedThinking && !hasStreamEvents) {
    if (streamedContainer) {
      streamedContainer.remove();
    }
    this.updateStatus("Ready", "success");
    this.elements.composer?.classList.remove("running");
    this.pendingToolCount = 0;
    this.updateActivityState();
    return;
  }
  const parsed = extractThinking(content, combinedThinking);
  content = parsed.content;
  thinking = parsed.thinking;
  this.updateThinkingPanel(thinking, false);
  if (!normalizedUsage) {
    normalizedUsage = this.estimateUsageFromContent(content);
  }
  if (normalizedUsage) {
    this.updateUsageStats(normalizedUsage);
  }
  const messageMeta = this.buildMessageMeta(normalizedUsage, modelLabel);
  const assistantEntry = createMessage({
    role: "assistant",
    content,
    thinking
  });
  if (assistantEntry) {
    this.displayHistory.push(assistantEntry);
  }
  if (streamedContainer) {
    if (!streamedContainer.querySelector(".message-header")) {
      const header = document.createElement("div");
      header.className = "message-header";
      header.textContent = "Assistant";
      streamedContainer.prepend(header);
    }
    if (messageMeta) {
      let metaEl = streamedContainer.querySelector(".message-meta");
      if (!metaEl) {
        metaEl = document.createElement("div");
        metaEl.className = "message-meta";
        const header = streamedContainer.querySelector(".message-header");
        if (header) {
          header.insertAdjacentElement("afterend", metaEl);
        } else {
          streamedContainer.prepend(metaEl);
        }
      }
      metaEl.textContent = messageMeta;
    }
    if (content && content.trim() !== "" && streamEventsEl) {
      const hasTextEvent = streamEventsEl.querySelector(".stream-event-text");
      if (!hasTextEvent) {
        const textEvent = document.createElement("div");
        textEvent.className = "stream-event stream-event-text";
        textEvent.innerHTML = this.renderMarkdown(content);
        streamEventsEl.appendChild(textEvent);
      }
    }
    this.scrollToBottom();
    this.updateStatus("Ready", "success");
    this.elements.composer?.classList.remove("running");
    this.pendingToolCount = 0;
    this.updateActivityState();
    this.persistHistory();
    this.updateChatEmptyState();
    return;
  }
  const messageDiv = document.createElement("div");
  messageDiv.className = "message assistant";
  let html = `<div class="message-header">Assistant</div>`;
  if (messageMeta) {
    html += `<div class="message-meta">${this.escapeHtml(messageMeta)}</div>`;
  }
  const showThinking = this.elements.showThinking.value === "true";
  if (thinking && showThinking) {
    const cleanedThinking = dedupeThinking(thinking);
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
  if (content && content.trim() !== "") {
    const renderedContent = this.renderMarkdown(content);
    html += `<div class="message-content markdown-body">${renderedContent}</div>`;
  }
  messageDiv.innerHTML = html;
  const thinkingHeader = messageDiv.querySelector(".thinking-header");
  if (thinkingHeader) {
    thinkingHeader.addEventListener("click", () => {
      const block = thinkingHeader.closest(".thinking-block");
      if (!block || block.classList.contains("thinking-hidden")) return;
      block.classList.toggle("collapsed");
      const expanded = !block.classList.contains("collapsed");
      thinkingHeader.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }
  if (this.lastChatTurn) {
    this.lastChatTurn.appendChild(messageDiv);
  } else {
    this.elements.chatMessages.appendChild(messageDiv);
  }
  this.scrollToBottom();
  this.updateStatus("Ready", "success");
  this.elements.composer?.classList.remove("running");
  this.pendingToolCount = 0;
  this.updateActivityState();
  this.persistHistory();
  this.updateChatEmptyState();
};

// sidepanel/ui/panel-context.ts
SidePanelUI.prototype.updateContextUsage = function updateContextUsage(actualTokens = null) {
  let approxTokens;
  if (actualTokens !== null && actualTokens > 0) {
    this.sessionTokensUsed = Math.max(this.sessionTokensUsed || 0, actualTokens);
    approxTokens = this.sessionTokensUsed;
  } else {
    const joined = this.contextHistory.map((msg) => {
      if (!msg) return "";
      if (typeof msg.content === "string") return msg.content;
      if (Array.isArray(msg.content)) {
        return msg.content.map((p) => {
          if (typeof p === "string") return p;
          if (p?.text) return p.text;
          if (p?.content) return JSON.stringify(p.content);
          if (p?.output) {
            const output = p.output?.value ?? p.output;
            if (typeof output === "string") return output;
            try {
              return JSON.stringify(output);
            } catch {
              return String(output);
            }
          }
          return "";
        }).join("");
      }
      return "";
    }).join("\n");
    const chars = joined.length;
    const baseTokens = this.estimateBaseContextTokens();
    const estimated = baseTokens + Math.ceil(chars / 4);
    approxTokens = Math.max(estimated, this.sessionTokensUsed || 0);
  }
  const maxContextTokens = this.getConfiguredContextLimit();
  const percent = Math.min(100, Math.round(approxTokens / maxContextTokens * 100));
  this.contextUsage = { approxTokens, maxContextTokens, percent };
  this.updateActivityState();
};
SidePanelUI.prototype.getConfiguredContextLimit = function getConfiguredContextLimit() {
  const active = this.configs[this.currentConfig] || {};
  const configured = active.contextLimit || Number.parseInt(this.elements.contextLimit?.value) || 2e5;
  return configured;
};
SidePanelUI.prototype.estimateBaseContextTokens = function estimateBaseContextTokens() {
  const active = this.configs[this.currentConfig] || {};
  const prompt2 = active.systemPrompt || this.getDefaultSystemPrompt();
  const promptTokens = Math.ceil((prompt2?.length || 0) / 4);
  const toolBudget = 1200;
  return promptTokens + toolBudget;
};

// types/runtime-messages.ts
var RUNTIME_MESSAGE_SCHEMA_VERSION = 2;
var runtimeMessageTypes = [
  "user_run_start",
  "assistant_stream_start",
  "assistant_stream_delta",
  "assistant_stream_stop",
  "tool_execution_start",
  "tool_execution_result",
  "plan_update",
  "manual_plan_update",
  "run_status",
  "assistant_response",
  "assistant_final",
  "run_error",
  "run_warning",
  "context_compacted",
  "subagent_start",
  "subagent_complete"
];
function isRuntimeMessage(value) {
  if (!value || typeof value !== "object") return false;
  const message = value;
  if (message.schemaVersion !== RUNTIME_MESSAGE_SCHEMA_VERSION) return false;
  if (typeof message.type !== "string") return false;
  if (!runtimeMessageTypes.includes(message.type)) return false;
  if (typeof message.runId !== "string" || !message.runId) return false;
  if (typeof message.sessionId !== "string" || !message.sessionId) return false;
  if (typeof message.timestamp !== "number") return false;
  return true;
}

// sidepanel/ui/panel-navigation.ts
var PANEL_SELECTOR = ".right-panel-content";
var setSidebarOpen = (elements, open) => {
  elements.sidebar?.classList.toggle("closed", !open);
};
var showRightPanel = (elements, panelName) => {
  const container = elements.rightPanelPanels ?? elements.rightPanel;
  if (!container) {
    console.log("[Navigation] showRightPanel: no container found", {
      rightPanelPanels: elements.rightPanelPanels,
      rightPanel: elements.rightPanel
    });
    return;
  }
  const panels = container.querySelectorAll(PANEL_SELECTOR);
  console.log("[Navigation] showRightPanel: found", panels.length, "panels");
  panels.forEach((panel) => panel.classList.add("hidden"));
  if (!panelName) return;
  const targetPanel = container.querySelector(`${PANEL_SELECTOR}[data-panel="${panelName}"]`);
  if (targetPanel) {
    targetPanel?.classList.remove("hidden");
    console.log("[Navigation] showRightPanel: showed", panelName);
  } else {
    console.log("[Navigation] showRightPanel: target panel not found for", panelName);
    if (elements.rightPanel) {
      const fallbackPanel = elements.rightPanel.querySelector(`${PANEL_SELECTOR}[data-panel="${panelName}"]`);
      if (fallbackPanel) {
        fallbackPanel.classList.remove("hidden");
        console.log("[Navigation] showRightPanel: showed", panelName, "(via fallback)");
      }
    }
  }
};
var updateNavActive = (elements, navName) => {
  elements.navChatBtn?.classList.remove("active");
  elements.navHistoryBtn?.classList.remove("active");
  elements.navSettingsBtn?.classList.remove("active");
  elements.navAccountBtn?.classList.remove("active");
  switch (navName) {
    case "chat":
      elements.navChatBtn?.classList.add("active");
      break;
    case "history":
      elements.navHistoryBtn?.classList.add("active");
      break;
    case "settings":
      elements.navSettingsBtn?.classList.add("active");
      break;
    case "account":
      elements.navAccountBtn?.classList.add("active");
      break;
  }
};
var bindSidebarNavigation = (elements, handlers) => {
  console.log("[Navigation] Binding sidebar navigation elements checks:", {
    openSidebarBtn: !!elements.openSidebarBtn,
    closeSidebarBtn: !!elements.closeSidebarBtn,
    navChatBtn: !!elements.navChatBtn,
    navHistoryBtn: !!elements.navHistoryBtn,
    navSettingsBtn: !!elements.navSettingsBtn,
    navAccountBtn: !!elements.navAccountBtn,
    rightPanelPanels: !!elements.rightPanelPanels,
    rightPanel: !!elements.rightPanel
  });
  elements.openSidebarBtn?.addEventListener("click", () => {
    const sidebar = elements.sidebar;
    if (!sidebar) {
      handlers.onOpen();
      return;
    }
    if (sidebar.classList.contains("closed")) {
      handlers.onOpen();
    } else {
      handlers.onClose();
    }
  });
  elements.closeSidebarBtn?.addEventListener("click", handlers.onClose);
  elements.navChatBtn?.addEventListener("click", handlers.onChat);
  elements.navHistoryBtn?.addEventListener("click", () => {
    console.log("[Navigation] navHistoryBtn clicked!");
    handlers.onHistory();
  });
  elements.navSettingsBtn?.addEventListener("click", handlers.onSettings);
  elements.navAccountBtn?.addEventListener("click", handlers.onAccount);
};

// sidepanel/ui/panel-core.ts
SidePanelUI.prototype.init = async function init() {
  console.log("[Parchi] init() starting...");
  this.setupEventListeners();
  this.setupPlanDrawer();
  this.setupResizeObserver();
  this.elements.sidebar?.classList.add("closed");
  console.log("[Parchi] Calling loadSettings...");
  await this.loadSettings();
  console.log("[Parchi] loadSettings done, configs:", Object.keys(this.configs), "current:", this.currentConfig);
  console.log("[Parchi] Config details:", JSON.stringify(this.configs[this.currentConfig] || {}).slice(0, 200));
  await this.loadHistoryList();
  await this.loadAccessState();
  if (this.isAccessReady()) {
    this.updateStatus("Ready", "success");
  }
  this.updateModelDisplay();
  console.log("[Parchi] Calling fetchAvailableModels...");
  this.fetchAvailableModels();
  this.updateChatEmptyState?.();
  console.log("[Parchi] init() complete");
};
SidePanelUI.prototype.setupEventListeners = function setupEventListeners() {
  bindSidebarNavigation(this.elements, {
    onOpen: () => this.openSidebar(),
    onClose: () => this.closeSidebar(),
    onChat: () => this.openChatView(),
    onHistory: () => this.openHistoryPanel(),
    onSettings: () => this.openSettingsPanel(),
    onAccount: () => this.openAccountPanel()
  });
  this.elements.settingsBtn?.addEventListener("click", () => {
    this.openSettingsPanel();
  });
  this.elements.accountBtn?.addEventListener("click", () => {
    this.toggleAccessPanel();
  });
  this.elements.authStartBtn?.addEventListener("click", (event) => {
    event?.preventDefault?.();
    this.startEmailAuth();
  });
  this.elements.authForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    this.startEmailAuth();
  });
  this.elements.authOpenBtn?.addEventListener("click", () => this.openAuthPage());
  this.elements.authTokenSaveBtn?.addEventListener("click", () => this.saveAccessToken());
  this.elements.authOpenSettingsBtn?.addEventListener(
    "click",
    () => this.openAccountSettings({ focusAccountApi: true })
  );
  this.elements.billingStartBtn?.addEventListener("click", () => this.startSubscription());
  this.elements.billingManageBtn?.addEventListener("click", () => this.manageBilling());
  this.elements.authLogoutBtn?.addEventListener("click", () => this.signOut());
  this.elements.accountRefreshBtn?.addEventListener("click", () => this.refreshAccountData());
  this.elements.accountCheckoutBtn?.addEventListener("click", () => this.startSubscription());
  this.elements.accountPortalBtn?.addEventListener("click", () => this.manageBilling());
  this.elements.accountOpenSettingsBtn?.addEventListener("click", () => this.openSettingsFromAccount());
  this.elements.accountOpenProfilesBtn?.addEventListener("click", () => this.openProfilesFromAccount());
  this.elements.accountOpenHistoryBtn?.addEventListener("click", () => this.openHistoryFromAccount());
  this.elements.accountLogoutBtn?.addEventListener("click", () => this.signOut());
  this.elements.startNewSessionBtn?.addEventListener("click", () => this.startNewSession());
  this.elements.clearHistoryBtn?.addEventListener("click", () => this.clearAllHistory());
  this.elements.provider?.addEventListener("change", () => {
    this.toggleCustomEndpoint();
    this.updateScreenshotToggleState();
  });
  this.elements.customEndpoint?.addEventListener("input", () => this.validateCustomEndpoint());
  this.elements.temperature?.addEventListener("input", () => {
    if (this.elements.temperatureValue) {
      this.elements.temperatureValue.textContent = this.elements.temperature.value;
    }
  });
  this.elements.newConfigBtn?.addEventListener("click", () => this.createNewConfig());
  this.elements.deleteConfigBtn?.addEventListener("click", () => this.deleteConfig());
  this.elements.activeConfig?.addEventListener("change", () => this.switchConfig());
  this.elements.settingsTabGeneralBtn?.addEventListener("click", () => this.switchSettingsTab("general"));
  this.elements.settingsTabProfilesBtn?.addEventListener("click", () => this.switchSettingsTab("profiles"));
  this.elements.createProfileBtn?.addEventListener("click", () => this.createProfileFromInput());
  this.elements.openGeneralBtn?.addEventListener("click", () => this.switchSettingsTab("general"));
  this.elements.openProfilesBtn?.addEventListener("click", () => this.switchSettingsTab("profiles"));
  this.elements.generalProfileSelect?.addEventListener(
    "change",
    (event) => this.setActiveConfig(event.target.value)
  );
  this.elements.agentGrid?.addEventListener("click", (event) => {
    const pill = event.target?.closest(".role-pill");
    if (pill) {
      const role = pill.dataset.role;
      const profile = pill.dataset.profile;
      this.assignProfileRole(profile, role);
      return;
    }
    const card = event.target?.closest(".agent-card");
    if (card) {
      const profile = card.dataset.profile;
      this.editProfile(profile);
    }
  });
  this.elements.refreshProfilesBtn?.addEventListener("click", () => this.renderProfileGrid());
  this.elements.agentGrid?.addEventListener("click", (event) => {
    const button = event.target?.closest("[data-role]");
    if (!button) return;
    const role = button.dataset.role;
    const profile = button.dataset.profile;
    this.assignProfileRole(profile, role);
  });
  this.elements.refreshProfilesBtn?.addEventListener("click", () => this.renderProfileGrid());
  this.elements.viewChatBtn?.addEventListener("click", () => this.switchView("chat"));
  this.elements.viewHistoryBtn?.addEventListener("click", () => this.switchView("history"));
  this.elements.enableScreenshots?.addEventListener("change", () => this.updateScreenshotToggleState());
  this.elements.visionProfile?.addEventListener("change", () => this.updateScreenshotToggleState());
  this.elements.sendScreenshotsAsImages?.addEventListener("change", () => this.updateScreenshotToggleState());
  this.elements.saveSettingsBtn?.addEventListener("click", () => {
    void this.saveSettings();
  });
  this.elements.cancelSettingsBtn?.addEventListener("click", () => {
    void this.cancelSettings();
  });
  this.elements.exportSettingsBtn?.addEventListener("click", () => this.exportSettings());
  this.elements.importSettingsBtn?.addEventListener("click", () => {
    this.elements.importSettingsInput?.click();
  });
  this.elements.importSettingsInput?.addEventListener("change", (event) => this.importSettings(event));
  this.elements.sendBtn?.addEventListener("click", () => {
    this.sendMessage();
  });
  this.elements.userInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  });
  const userInput = this.elements.userInput;
  userInput?.addEventListener("input", function() {
    userInput.style.height = "auto";
    userInput.style.height = `${userInput.scrollHeight}px`;
  });
  this.elements.modelSelect?.addEventListener("change", () => this.handleModelSelectChange());
  this.elements.fileBtn?.addEventListener("click", () => {
    this.elements.fileInput?.click();
  });
  this.elements.fileInput?.addEventListener("change", (event) => this.handleFileSelection(event));
  this.elements.tabSelectorBtn?.addEventListener("click", () => this.toggleTabSelector());
  this.elements.closeTabSelector?.addEventListener("click", () => this.closeTabSelector());
  this.elements.tabSelectorAddActive?.addEventListener("click", () => this.addActiveTabToSelection());
  this.elements.tabSelectorClear?.addEventListener("click", () => this.clearSelectedTabs());
  const tabBackdrop = this.elements.tabSelector?.querySelector(".modal-backdrop");
  tabBackdrop?.addEventListener("click", () => this.closeTabSelector());
  this.elements.chatMessages?.addEventListener("scroll", () => this.handleChatScroll());
  this.elements.scrollToLatestBtn?.addEventListener("click", () => this.scrollToBottom({ force: true }));
  this.elements.activityCloseBtn?.addEventListener("click", () => this.toggleActivityPanel(false));
  this.elements.profileEditorProvider?.addEventListener("change", () => this.toggleProfileEditorEndpoint());
  this.elements.profileEditorTemperature?.addEventListener("input", () => {
    if (this.elements.profileEditorTemperatureValue) {
      this.elements.profileEditorTemperatureValue.textContent = this.elements.profileEditorTemperature.value;
    }
  });
  this.elements.saveProfileBtn?.addEventListener("click", () => this.saveProfileEdits());
  chrome.runtime.onMessage.addListener((message) => {
    if (isRuntimeMessage(message)) {
      this.handleRuntimeMessage(message);
    }
  });
};
SidePanelUI.prototype.setupResizeObserver = function setupResizeObserver() {
  if (!this.elements.chatMessages || typeof ResizeObserver === "undefined") return;
  this.chatResizeObserver = new ResizeObserver(() => {
    if (this.shouldAutoScroll() && this.isNearBottom) {
      this.scrollToBottom();
    }
  });
  this.chatResizeObserver.observe(this.elements.chatMessages);
};
SidePanelUI.prototype.handleRuntimeMessage = function handleRuntimeMessage(message) {
  if (message.type === "assistant_stream_start") {
    this.streamingReasoning = "";
    this.handleAssistantStream({ status: "start" });
    return;
  }
  if (message.type === "assistant_stream_delta") {
    if (message.channel === "reasoning") {
      const delta = message.content || "";
      this.streamingReasoning = `${this.streamingReasoning}${delta}`;
      this.updateThinkingPanel(this.streamingReasoning, true);
      this.updateStreamReasoning(delta);
      return;
    }
    this.handleAssistantStream({ status: "delta", content: message.content });
    return;
  }
  if (message.type === "assistant_stream_stop") {
    this.handleAssistantStream({ status: "stop" });
    return;
  }
  if (message.type === "plan_update") {
    this.applyPlanUpdate(message.plan);
    return;
  }
  if (message.type === "manual_plan_update") {
    this.applyManualPlanUpdate(message.steps);
    return;
  }
  if (message.type === "tool_execution_start") {
    this.pendingToolCount += 1;
    this.clearErrorBanner();
    this.updateActivityState();
    this.activeToolName = message.tool || null;
    this.displayToolExecution(message.tool, message.args, null, message.id);
    return;
  }
  if (message.type === "tool_execution_result") {
    this.pendingToolCount = Math.max(0, this.pendingToolCount - 1);
    this.updateActivityState();
    this.activeToolName = null;
    this.displayToolExecution(message.tool, message.args, message.result, message.id);
    return;
  }
  if (message.type === "assistant_final") {
    this.displayAssistantMessage(message.content, message.thinking, message.usage, message.model);
    this.appendContextMessages(message.responseMessages, message.content, message.thinking);
    if (message.usage?.inputTokens) {
      this.updateContextUsage(message.usage.inputTokens);
    } else if (message.contextUsage?.approxTokens) {
      this.updateContextUsage(message.contextUsage.approxTokens);
    } else {
      this.updateContextUsage();
    }
    return;
  }
  if (message.type === "context_compacted") {
    this.handleContextCompaction(message);
    return;
  }
  if (message.type === "run_error") {
    this.stopThinkingTimer?.();
    this.elements.composer?.classList.remove("running");
    this.pendingToolCount = 0;
    this.isStreaming = false;
    this.activeToolName = null;
    this.updateActivityState();
    this.finishStreamingMessage();
    this.showErrorBanner(message.message);
    this.updateStatus("Error", "error");
    return;
  }
  if (message.type === "run_warning") {
    this.showErrorBanner(message.message);
    return;
  }
  if (message.type === "subagent_start") {
    this.addSubagent(message.id, message.name, message.tasks);
    this.updateStatus(`Sub-agent "${message.name}" started`, "active");
    return;
  }
  if (message.type === "subagent_complete") {
    this.updateSubagentStatus(message.id, message.success ? "completed" : "error");
    return;
  }
};
SidePanelUI.prototype.appendContextMessages = function appendContextMessages(responseMessages, fallbackContent, fallbackThinking) {
  if (!responseMessages || responseMessages.length === 0) {
    const assistantEntry = createMessage({
      role: "assistant",
      content: fallbackContent || "",
      thinking: fallbackThinking || null
    });
    if (assistantEntry) {
      this.contextHistory.push(assistantEntry);
    }
    return;
  }
  const normalized = normalizeConversationHistory(responseMessages);
  this.contextHistory.push(...normalized);
};
SidePanelUI.prototype.handleContextCompaction = function handleContextCompaction(message) {
  const normalized = normalizeConversationHistory(message.contextMessages);
  this.contextHistory = normalized;
  this.sessionId = message.newSessionId || this.sessionId;
  const summaryText = message.summary || "Context compacted.";
  const summaryEntry = createMessage({
    role: "system",
    content: summaryText,
    meta: {
      kind: "summary",
      summaryOfCount: message.trimmedCount,
      source: "auto"
    }
  });
  if (summaryEntry) {
    this.displayHistory.push(summaryEntry);
    this.displaySummaryMessage(summaryEntry);
  }
  if (message.contextUsage?.approxTokens) {
    this.updateContextUsage(message.contextUsage.approxTokens);
  }
};

// sidepanel/ui/panel-helpers.ts
SidePanelUI.prototype.safeJsonStringify = function safeJsonStringify(value) {
  try {
    if (value === void 0) return "";
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
};
SidePanelUI.prototype.truncateText = function truncateText(text, limit = 1200) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};
SidePanelUI.prototype.escapeHtmlBasic = function escapeHtmlBasic(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : text;
  return div.innerHTML;
};
SidePanelUI.prototype.escapeHtml = function escapeHtml(text) {
  return this.escapeHtmlBasic(text).replace(/\n/g, "<br>");
};
SidePanelUI.prototype.escapeAttribute = function escapeAttribute(value) {
  return this.escapeHtmlBasic(value).replace(/"/g, "&quot;");
};

// sidepanel/ui/panel-history.ts
SidePanelUI.prototype.persistHistory = async function persistHistory() {
  const saveEnabled = this.elements.saveHistory?.value !== "false";
  if (!saveEnabled) return;
  if (!this.displayHistory || this.displayHistory.length === 0) return;
  const entry = {
    id: this.sessionId,
    startedAt: this.sessionStartedAt,
    updatedAt: Date.now(),
    title: this.firstUserMessage || "Session",
    messageCount: this.displayHistory.length,
    transcript: this.displayHistory.slice(-200)
  };
  try {
    const existing = await chrome.storage.local.get(["chatSessions"]);
    const sessions = existing.chatSessions || [];
    const filtered = sessions.filter((s) => s.id !== entry.id);
    filtered.unshift(entry);
    const trimmed = filtered.slice(0, 50);
    await chrome.storage.local.set({ chatSessions: trimmed });
    this.loadHistoryList();
  } catch (e) {
    console.error("Failed to persist history:", e);
  }
};
SidePanelUI.prototype.loadHistoryList = async function loadHistoryList() {
  if (!this.elements.historyItems) return;
  const saveEnabled = this.elements.saveHistory?.value !== "false";
  if (!saveEnabled) {
    this.elements.historyItems.innerHTML = '<div class="history-empty">History is off. Enable \u201CSave History\u201D in Settings to see past chats.</div>';
    return;
  }
  try {
    const { chatSessions = [] } = await chrome.storage.local.get(["chatSessions"]);
    this.elements.historyItems.innerHTML = "";
    if (!chatSessions.length) {
      this.elements.historyItems.innerHTML = '<div class="history-empty">No saved chats yet.</div>';
      return;
    }
    chatSessions.forEach((session) => {
      const item = document.createElement("div");
      item.className = "history-item";
      const date = new Date(session.updatedAt || session.startedAt || Date.now());
      const msgCount = session.messageCount || session.transcript?.length || 0;
      const timeAgo = this.formatTimeAgo(date);
      item.innerHTML = `
        <div class="history-item-main">
          <div class="history-title">${this.escapeHtml(session.title || "Untitled Session")}</div>
          <div class="history-meta">
            <span>${timeAgo}</span>
            <span class="history-meta-dot">\xB7</span>
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
      item.querySelector(".history-item-main")?.addEventListener("click", () => {
        this.loadSession(session);
      });
      item.querySelector(".history-delete")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteSession(session.id);
      });
      this.elements.historyItems.appendChild(item);
    });
  } catch (e) {
    console.error("Failed to load history:", e);
    this.elements.historyItems.innerHTML = '<div class="history-empty">Failed to load history.</div>';
  }
};
SidePanelUI.prototype.loadSession = function loadSession(session) {
  this.switchView("chat");
  if (Array.isArray(session.transcript)) {
    this.recordScrollPosition();
    const normalized = normalizeConversationHistory(session.transcript || []);
    this.displayHistory = normalized;
    this.contextHistory = normalized;
    this.sessionId = session.id || `session-${Date.now()}`;
    this.firstUserMessage = session.title || "";
    this.renderConversationHistory();
    this.updateContextUsage();
  }
};
SidePanelUI.prototype.deleteSession = async function deleteSession(sessionId) {
  try {
    const { chatSessions = [] } = await chrome.storage.local.get(["chatSessions"]);
    const filtered = chatSessions.filter((s) => s.id !== sessionId);
    await chrome.storage.local.set({ chatSessions: filtered });
    this.loadHistoryList();
  } catch (e) {
    console.error("Failed to delete session:", e);
  }
};
SidePanelUI.prototype.clearAllHistory = async function clearAllHistory() {
  if (!confirm("Clear all chat history? This cannot be undone.")) return;
  try {
    await chrome.storage.local.set({ chatSessions: [] });
    this.loadHistoryList();
  } catch (e) {
    console.error("Failed to clear history:", e);
  }
};
SidePanelUI.prototype.formatTimeAgo = function formatTimeAgo(date) {
  const now = /* @__PURE__ */ new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};
SidePanelUI.prototype.renderConversationHistory = function renderConversationHistory() {
  this.elements.chatMessages.innerHTML = "";
  this.toolCallViews.clear();
  this.lastChatTurn = null;
  this.resetActivityPanel();
  this.displayHistory.forEach((msg) => {
    if (msg.role === "system" || msg.meta?.kind === "summary") {
      this.displaySummaryMessage(msg);
      return;
    }
    if (msg.role === "user") {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message user";
      messageDiv.innerHTML = `
          <div class="message-header">You</div>
          <div class="message-content">${this.escapeHtml(msg.content || "")}</div>
        `;
      this.elements.chatMessages.appendChild(messageDiv);
    } else if (msg.role === "assistant") {
      const rawContent = typeof msg.content === "string" ? msg.content : this.safeJsonStringify(msg.content);
      const parsed = extractThinking(rawContent, msg.thinking || null);
      const messageDiv = document.createElement("div");
      messageDiv.className = "message assistant";
      let html = `<div class="message-header">Assistant</div>`;
      const showThinking = this.elements.showThinking.value === "true";
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
      if (parsed.content && parsed.content.trim() !== "") {
        html += `<div class="message-content markdown-body">${this.renderMarkdown(parsed.content)}</div>`;
      }
      messageDiv.innerHTML = html;
      const thinkingHeader = messageDiv.querySelector(".thinking-header");
      if (thinkingHeader) {
        thinkingHeader.addEventListener("click", () => {
          const block = thinkingHeader.closest(".thinking-block");
          if (!block || block.classList.contains("thinking-hidden")) return;
          block.classList.toggle("collapsed");
          const expanded = !block.classList.contains("collapsed");
          thinkingHeader.setAttribute("aria-expanded", expanded ? "true" : "false");
        });
      }
      this.elements.chatMessages.appendChild(messageDiv);
    }
  });
  this.restoreScrollPosition();
  this.updateChatEmptyState();
};

// sidepanel/ui/panel-markdown.ts
SidePanelUI.prototype.renderMarkdown = function renderMarkdown(text) {
  if (!text) return "";
  const escape = (value = "") => this.escapeHtmlBasic(value);
  const escapeAttr = (value = "") => this.escapeAttribute(value);
  let working = String(text).replace(/\r\n/g, "\n");
  const codeBlocks = [];
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  working = working.replace(codeBlockRegex, (_, lang = "", body = "") => {
    const placeholder = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    const languageClass = lang ? ` class="language-${escapeAttr(lang.toLowerCase())}"` : "";
    codeBlocks.push(`<pre><code${languageClass}>${escape(body)}</code></pre>`);
    return placeholder;
  });
  const applyInline = (value = "") => {
    let html2 = escape(value);
    html2 = html2.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_, alt, url) => `<img alt="${escape(alt)}" src="${escapeAttr(url)}">`
    );
    html2 = html2.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label, url) => `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
    html2 = html2.replace(/`([^`]+)`/g, (_, code) => `<code>${escape(code)}</code>`);
    html2 = html2.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html2 = html2.replace(/__(.+?)__/g, "<strong>$1</strong>");
    html2 = html2.replace(/~~(.+?)~~/g, "<del>$1</del>");
    html2 = html2.replace(/(?<!\*)\*(?!\s)(.+?)\*(?!\*)/g, "<em>$1</em>");
    html2 = html2.replace(/(?<!_)_(?!\s)(.+?)_(?!_)/g, "<em>$1</em>");
    return html2;
  };
  const lines = working.split("\n");
  const blocks = [];
  let paragraph = [];
  let inUl = false;
  let inOl = false;
  const closeLists = () => {
    if (inUl) {
      blocks.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      blocks.push("</ol>");
      inOl = false;
    }
  };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${applyInline(paragraph.join("\n"))}</p>`);
    paragraph = [];
  };
  for (const rawLine of lines) {
    const line = rawLine;
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeLists();
      continue;
    }
    const placeholderMatch = trimmed.match(/^@@CODE_BLOCK_(\d+)@@$/);
    if (placeholderMatch) {
      flushParagraph();
      closeLists();
      blocks.push(trimmed);
      continue;
    }
    if (/^([-*_])(\s*\1){2,}$/.test(trimmed)) {
      flushParagraph();
      closeLists();
      blocks.push("<hr>");
      continue;
    }
    const headingMatch = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${applyInline(headingMatch[2])}</h${level}>`);
      continue;
    }
    if (/^\s*>\s*/.test(line)) {
      flushParagraph();
      closeLists();
      blocks.push(`<blockquote>${applyInline(line.replace(/^\s*>\s?/, ""))}</blockquote>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph();
      if (inOl) {
        blocks.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        blocks.push("<ul>");
        inUl = true;
      }
      blocks.push(`<li>${applyInline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushParagraph();
      if (inUl) {
        blocks.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        blocks.push("<ol>");
        inOl = true;
      }
      blocks.push(`<li>${applyInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>`);
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  closeLists();
  let html = blocks.join("");
  codeBlocks.forEach((block, index) => {
    const placeholder = `@@CODE_BLOCK_${index}@@`;
    html = html.split(placeholder).join(block);
  });
  return html;
};

// sidepanel/ui/panel-plan.ts
SidePanelUI.prototype.setupPlanDrawer = function setupPlanDrawer() {
  this.elements.planDrawerToggle?.addEventListener("click", (e) => {
    if (e.target.closest(".plan-drawer-actions")) return;
    this.togglePlanDrawer();
  });
  this.elements.planClearBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    this.clearPlan();
  });
};
SidePanelUI.prototype.togglePlanDrawer = function togglePlanDrawer() {
  this.elements.planDrawer?.classList.toggle("collapsed");
};
SidePanelUI.prototype.showPlanDrawer = function showPlanDrawer() {
  this.elements.planDrawer?.classList.remove("hidden");
  this.elements.planDrawer?.classList.remove("collapsed");
};
SidePanelUI.prototype.hidePlanDrawer = function hidePlanDrawer() {
  this.elements.planDrawer?.classList.add("hidden");
};
SidePanelUI.prototype.clearPlan = function clearPlan() {
  this.currentPlan = null;
  this.hidePlanDrawer();
  if (this.elements.planChecklist) {
    this.elements.planChecklist.innerHTML = "";
  }
};
SidePanelUI.prototype.renderPlanDrawer = function renderPlanDrawer(plan) {
  if (!plan || !plan.steps || plan.steps.length === 0) {
    this.hidePlanDrawer();
    return;
  }
  const steps = plan.steps;
  const completedCount = steps.filter((s) => s.status === "done").length;
  const totalCount = steps.length;
  if (this.elements.planStepCount) {
    this.elements.planStepCount.textContent = completedCount === totalCount ? `${totalCount} steps \xB7 Done` : `${completedCount}/${totalCount} steps`;
  }
  if (this.elements.planChecklist) {
    this.elements.planChecklist.innerHTML = steps.map((step, index) => {
      const isDone = step.status === "done";
      const isRunning = step.status === "running";
      const isBlocked = step.status === "blocked";
      const previousStepsDone = steps.slice(0, index).every((s) => s.status === "done");
      const canCheck = !isDone && previousStepsDone && !isBlocked;
      const isCurrent = !isDone && previousStepsDone && !isBlocked;
      const itemClass = [
        "plan-checklist-item",
        isDone ? "completed" : "",
        isCurrent ? "current" : "",
        isBlocked ? "blocked" : ""
      ].filter(Boolean).join(" ");
      const checkboxClass = ["plan-checklist-checkbox", isDone ? "checked" : ""].filter(Boolean).join(" ");
      const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
      const notes = step.notes ? `<div class="plan-checklist-notes">${this.escapeHtml(step.notes)}</div>` : "";
      return `
          <li class="${itemClass}" data-step-index="${index}" data-step-id="${step.id}">
            <button 
              class="${checkboxClass}" 
              ${!canCheck && !isDone ? "disabled" : ""}
              data-action="toggle-step"
              data-step-index="${index}"
              title="${isDone ? "Completed" : canCheck ? "Mark as done" : "Complete previous steps first"}"
            >
              ${checkIcon}
            </button>
            <div class="plan-checklist-content">
              <div class="plan-checklist-title">${this.escapeHtml(step.title)}</div>
              ${notes}
            </div>
          </li>
        `;
    }).join("");
    this.elements.planChecklist.querySelectorAll('[data-action="toggle-step"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.stepIndex || "0", 10);
        this.togglePlanStep(index);
      });
    });
  }
  this.showPlanDrawer();
};
SidePanelUI.prototype.togglePlanStep = function togglePlanStep(index) {
  if (!this.currentPlan || !this.currentPlan.steps[index]) return;
  const step = this.currentPlan.steps[index];
  const previousStepsDone = this.currentPlan.steps.slice(0, index).every((s) => s.status === "done");
  if (!previousStepsDone && step.status !== "done") {
    this.updateStatus("Complete previous steps first", "warning");
    return;
  }
  if (step.status === "done") {
    for (let i = index; i < this.currentPlan.steps.length; i++) {
      if (this.currentPlan.steps[i].status === "done") {
        this.currentPlan.steps[i].status = "pending";
      }
    }
  } else {
    step.status = "done";
  }
  this.currentPlan.updatedAt = Date.now();
  this.renderPlanDrawer(this.currentPlan);
};

// sidepanel/ui/panel-profiles.ts
SidePanelUI.prototype.createNewConfig = async function createNewConfig(name) {
  const trimmedName = (name || "").trim() || prompt("Enter profile name:") || "";
  if (!trimmedName) return;
  if (this.configs[trimmedName]) {
    alert("Profile already exists!");
    return;
  }
  this.configs[trimmedName] = {
    provider: this.elements.provider.value,
    apiKey: this.elements.apiKey.value,
    model: this.elements.model.value,
    customEndpoint: this.elements.customEndpoint.value,
    systemPrompt: this.elements.systemPrompt.value,
    temperature: Number.parseFloat(this.elements.temperature.value),
    maxTokens: Number.parseInt(this.elements.maxTokens.value),
    timeout: Number.parseInt(this.elements.timeout.value),
    sendScreenshotsAsImages: this.elements.sendScreenshotsAsImages.value === "true",
    screenshotQuality: this.elements.screenshotQuality.value,
    streamResponses: this.elements.streamResponses.value === "true",
    enableScreenshots: this.elements.enableScreenshots.value === "true"
  };
  this.refreshConfigDropdown();
  this.setActiveConfig(trimmedName, true);
  this.updateStatus(`Profile "${trimmedName}" created`, "success");
};
SidePanelUI.prototype.deleteConfig = async function deleteConfig() {
  if (this.currentConfig === "default") {
    alert("Cannot delete default profile");
    return;
  }
  if (confirm(`Delete profile "${this.currentConfig}"?`)) {
    delete this.configs[this.currentConfig];
    this.currentConfig = "default";
    this.refreshConfigDropdown();
    this.setActiveConfig(this.currentConfig, true);
    this.updateStatus("Profile deleted", "success");
  }
};
SidePanelUI.prototype.switchConfig = async function switchConfig() {
  const newConfig = this.elements.activeConfig.value;
  if (!this.configs[newConfig]) {
    alert("Profile not found");
    return;
  }
  this.configs[this.currentConfig] = this.collectCurrentFormProfile();
  this.setActiveConfig(newConfig);
  await this.persistAllSettings({ silent: true });
};
SidePanelUI.prototype.refreshConfigDropdown = function refreshConfigDropdown() {
  this.elements.activeConfig.innerHTML = "";
  if (this.elements.generalProfileSelect) {
    this.elements.generalProfileSelect.innerHTML = "";
  }
  Object.keys(this.configs).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === this.currentConfig) {
      option.selected = true;
    }
    this.elements.activeConfig.appendChild(option);
    if (this.elements.generalProfileSelect) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === this.currentConfig) {
        opt.selected = true;
      }
      this.elements.generalProfileSelect.appendChild(opt);
    }
  });
  this.refreshProfileSelectors();
  this.renderProfileGrid();
  this.updateContextUsage();
};
SidePanelUI.prototype.refreshProfileSelectors = function refreshProfileSelectors() {
  const names = Object.keys(this.configs);
  const selects = [this.elements.orchestratorProfile, this.elements.visionProfile];
  selects.forEach((select) => {
    if (!select) return;
    select.innerHTML = '<option value="">Use active config</option>';
    names.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    const currentValue = select.value;
    if (!currentValue) return;
    if (!names.includes(currentValue)) {
      select.value = "";
    }
  });
};
SidePanelUI.prototype.renderProfileGrid = function renderProfileGrid() {
  if (!this.elements.agentGrid) return;
  this.elements.agentGrid.innerHTML = "";
  const currentVision = this.elements.visionProfile?.value;
  const currentOrchestrator = this.elements.orchestratorProfile?.value;
  const configs = Object.keys(this.configs);
  if (!configs.length) {
    this.elements.agentGrid.innerHTML = '<div class="history-empty">No profiles yet.</div>';
    return;
  }
  configs.forEach((name) => {
    const card = document.createElement("div");
    card.className = "agent-card";
    if (name === this.profileEditorTarget) {
      card.classList.add("editing");
    }
    card.dataset.profile = name;
    const rolePills = ["main", "vision", "orchestrator", "aux"].map((role) => {
      const isActive = this.isProfileActiveForRole(name, role, currentVision, currentOrchestrator);
      const label = this.getRoleLabel(role);
      return `<span class="role-pill ${isActive ? "active" : ""} ${role}-pill" data-role="${role}" data-profile="${name}">${label}</span>`;
    }).join("");
    const config = this.configs[name] || {};
    card.innerHTML = `
        <div>
          <h4>${this.escapeHtml(name)}</h4>
          <span>${this.escapeHtml(config.provider || "Provider")} \xB7 ${this.escapeHtml(config.model || "Model")}</span>
        </div>
        <div class="role-pills">${rolePills}</div>
      `;
    this.elements.agentGrid.appendChild(card);
  });
};
SidePanelUI.prototype.getRoleLabel = function getRoleLabel(role) {
  switch (role) {
    case "main":
      return "Main";
    case "vision":
      return "Vision";
    case "orchestrator":
      return "Orchestrator";
    default:
      return "Team";
  }
};
SidePanelUI.prototype.isProfileActiveForRole = function isProfileActiveForRole(name, role, visionName, orchestratorName) {
  if (role === "main") return name === this.currentConfig;
  if (role === "vision") return name && visionName === name;
  if (role === "orchestrator") return name && orchestratorName === name;
  if (role === "aux") return this.auxAgentProfiles.includes(name);
  return false;
};
SidePanelUI.prototype.assignProfileRole = function assignProfileRole(profileName, role) {
  if (!profileName) return;
  if (role === "main") {
    this.setActiveConfig(profileName);
    return;
  }
  if (role === "vision") {
    this.toggleProfileRole("visionProfile", profileName);
  } else if (role === "orchestrator") {
    this.toggleProfileRole("orchestratorProfile", profileName);
  } else if (role === "aux") {
    this.toggleAuxProfile(profileName);
  }
};
SidePanelUI.prototype.toggleProfileRole = function toggleProfileRole(elementId, profileName) {
  const element = this.elements[elementId];
  if (!element) return;
  element.value = element.value === profileName ? "" : profileName;
  this.renderProfileGrid();
};
SidePanelUI.prototype.toggleAuxProfile = function toggleAuxProfile(profileName) {
  const idx = this.auxAgentProfiles.indexOf(profileName);
  if (idx === -1) {
    this.auxAgentProfiles.push(profileName);
  } else {
    this.auxAgentProfiles.splice(idx, 1);
  }
  this.auxAgentProfiles = Array.from(new Set(this.auxAgentProfiles));
  this.renderProfileGrid();
};
SidePanelUI.prototype.editProfile = function editProfile(name, silent = false) {
  if (!name || !this.configs[name]) return;
  this.profileEditorTarget = name;
  const config = this.configs[name];
  this.elements.profileEditorTitle && (this.elements.profileEditorTitle.textContent = `Editing: ${name}`);
  this.elements.profileEditorName && (this.elements.profileEditorName.value = name);
  this.elements.profileEditorProvider.value = config.provider || "openai";
  this.elements.profileEditorApiKey.value = config.apiKey || "";
  this.elements.profileEditorModel.value = config.model || "";
  this.elements.profileEditorEndpoint.value = config.customEndpoint || "";
  this.elements.profileEditorTemperature.value = config.temperature ?? 0.7;
  if (this.elements.profileEditorTemperatureValue) {
    this.elements.profileEditorTemperatureValue.textContent = this.elements.profileEditorTemperature.value;
  }
  this.elements.profileEditorMaxTokens.value = config.maxTokens || 2048;
  this.elements.profileEditorTimeout.value = config.timeout || 3e4;
  this.elements.profileEditorEnableScreenshots.value = config.enableScreenshots ? "true" : "false";
  this.elements.profileEditorSendScreenshots.value = config.sendScreenshotsAsImages ? "true" : "false";
  this.elements.profileEditorScreenshotQuality.value = config.screenshotQuality || "high";
  this.elements.profileEditorPrompt.value = config.systemPrompt || this.getDefaultSystemPrompt();
  this.toggleProfileEditorEndpoint();
  this.renderProfileGrid();
  if (!silent) {
    this.switchSettingsTab("profiles");
  }
};
SidePanelUI.prototype.collectProfileEditorData = function collectProfileEditorData() {
  return {
    provider: this.elements.profileEditorProvider.value,
    apiKey: this.elements.profileEditorApiKey.value,
    model: this.elements.profileEditorModel.value,
    customEndpoint: this.elements.profileEditorEndpoint.value,
    temperature: Number.parseFloat(this.elements.profileEditorTemperature.value) || 0.7,
    maxTokens: Number.parseInt(this.elements.profileEditorMaxTokens.value) || 2048,
    timeout: Number.parseInt(this.elements.profileEditorTimeout.value) || 3e4,
    enableScreenshots: this.elements.profileEditorEnableScreenshots.value === "true",
    sendScreenshotsAsImages: this.elements.profileEditorSendScreenshots.value === "true",
    screenshotQuality: this.elements.profileEditorScreenshotQuality.value || "high",
    systemPrompt: this.elements.profileEditorPrompt.value || this.getDefaultSystemPrompt()
  };
};
SidePanelUI.prototype.saveProfileEdits = async function saveProfileEdits() {
  const target = this.profileEditorTarget;
  if (!target || !this.configs[target]) {
    this.updateStatus("Select a profile to edit", "warning");
    return;
  }
  const existing = this.configs[target] || {};
  this.configs[target] = { ...existing, ...this.collectProfileEditorData() };
  await this.persistAllSettings({ silent: true });
  if (target === this.currentConfig) {
    this.populateFormFromConfig(this.configs[target]);
    this.toggleCustomEndpoint();
  }
  this.renderProfileGrid();
  this.updateStatus(`Profile "${target}" saved`, "success");
};
SidePanelUI.prototype.populateFormFromConfig = function populateFormFromConfig(config = {}) {
  if (this.elements.provider) this.elements.provider.value = config.provider || "openai";
  if (this.elements.apiKey) this.elements.apiKey.value = config.apiKey || "";
  if (this.elements.model) this.elements.model.value = config.model || "gpt-4o";
  if (this.elements.customEndpoint) this.elements.customEndpoint.value = config.customEndpoint || "";
  if (this.elements.systemPrompt) this.elements.systemPrompt.value = config.systemPrompt || this.getDefaultSystemPrompt();
  if (this.elements.temperature) {
    this.elements.temperature.value = config.temperature !== void 0 ? config.temperature : 0.7;
    if (this.elements.temperatureValue) {
      this.elements.temperatureValue.textContent = this.elements.temperature.value;
    }
  }
  if (this.elements.maxTokens) this.elements.maxTokens.value = config.maxTokens || 4096;
  if (this.elements.contextLimit) this.elements.contextLimit.value = config.contextLimit || 2e5;
  if (this.elements.timeout) this.elements.timeout.value = config.timeout || 3e4;
  if (this.elements.enableScreenshots) this.elements.enableScreenshots.value = config.enableScreenshots ? "true" : "false";
  if (this.elements.sendScreenshotsAsImages) this.elements.sendScreenshotsAsImages.value = config.sendScreenshotsAsImages ? "true" : "false";
  if (this.elements.screenshotQuality) this.elements.screenshotQuality.value = config.screenshotQuality || "high";
  if (this.elements.streamResponses) this.elements.streamResponses.value = config.streamResponses !== false ? "true" : "true";
  if (this.elements.showThinking) this.elements.showThinking.value = config.showThinking !== false ? "true" : "false";
  if (this.elements.autoScroll) this.elements.autoScroll.value = config.autoScroll !== false ? "true" : "false";
  if (this.elements.confirmActions) this.elements.confirmActions.value = config.confirmActions !== false ? "true" : "false";
  if (this.elements.saveHistory) this.elements.saveHistory.value = config.saveHistory !== false ? "true" : "false";
};
SidePanelUI.prototype.setActiveConfig = function setActiveConfig(name, quiet = false) {
  if (!this.configs[name]) return;
  this.currentConfig = name;
  if (this.elements.activeConfig) this.elements.activeConfig.value = name;
  this.populateFormFromConfig(this.configs[name]);
  this.toggleCustomEndpoint();
  this.renderProfileGrid?.();
  this.updateScreenshotToggleState?.();
  this.editProfile?.(name, true);
  this.updateModelDisplay();
  this.fetchAvailableModels();
  if (!quiet) {
    this.updateStatus(`Switched to configuration "${name}"`, "success");
  }
};

// sidepanel/ui/panel-scroll.ts
SidePanelUI.prototype.scrollToBottom = function scrollToBottom({ force = false } = {}) {
  if (!this.elements.chatMessages) return;
  if (!force && !this.shouldAutoScroll()) return;
  requestAnimationFrame(() => {
    this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    this.isNearBottom = true;
    this.userScrolledUp = false;
    this.updateScrollButton();
  });
};
SidePanelUI.prototype.shouldAutoScroll = function shouldAutoScroll() {
  const autoScrollEnabled = this.elements.autoScroll?.value !== "false";
  return autoScrollEnabled && !this.userScrolledUp;
};
SidePanelUI.prototype.handleChatScroll = function handleChatScroll() {
  if (!this.elements.chatMessages) return;
  const { scrollTop, scrollHeight, clientHeight } = this.elements.chatMessages;
  const nearBottom = scrollHeight - scrollTop - clientHeight < 60;
  this.isNearBottom = nearBottom;
  this.userScrolledUp = !nearBottom;
  this.recordScrollPosition();
  this.updateScrollButton();
};
SidePanelUI.prototype.recordScrollPosition = function recordScrollPosition() {
  if (!this.elements.chatMessages) return;
  this.scrollPositions.set(this.sessionId, this.elements.chatMessages.scrollTop);
};
SidePanelUI.prototype.restoreScrollPosition = function restoreScrollPosition() {
  if (!this.elements.chatMessages) return;
  const saved = this.scrollPositions.get(this.sessionId);
  if (saved !== void 0) {
    requestAnimationFrame(() => {
      this.elements.chatMessages.scrollTop = saved;
      this.handleChatScroll();
    });
  } else {
    this.scrollToBottom({ force: true });
  }
};
SidePanelUI.prototype.updateScrollButton = function updateScrollButton() {
  if (!this.elements.scrollToLatestBtn) return;
  this.elements.scrollToLatestBtn.classList.toggle("hidden", !this.userScrolledUp);
};

// sidepanel/ui/panel-settings.ts
SidePanelUI.prototype.toggleSettings = async function toggleSettings(saveOnClose = true) {
  const isOpen = this.elements.settingsPanel ? !this.elements.settingsPanel.classList.contains("hidden") : false;
  if (isOpen) {
    if (saveOnClose) {
      this.configs[this.currentConfig] = this.collectCurrentFormProfile();
      await this.persistAllSettings({ silent: true });
    }
    this.settingsOpen = false;
    this.showRightPanel(null);
    this.setNavActive("chat");
    this.updateAccessUI();
    return;
  }
  this.settingsOpen = true;
  this.accessPanelVisible = false;
  this.openSidebar();
  this.showRightPanel("settings");
  this.switchSettingsTab(this.currentSettingsTab || "general");
  this.setNavActive("settings");
  this.updateAccessUI();
};
SidePanelUI.prototype.cancelSettings = async function cancelSettings() {
  await this.loadSettings();
  await this.toggleSettings(false);
};
SidePanelUI.prototype.toggleCustomEndpoint = function toggleCustomEndpoint() {
  const provider = this.elements.provider?.value;
  const isCustom = provider === "custom" || provider === "kimi";
  if (this.elements.customEndpointGroup) {
    this.elements.customEndpointGroup.classList.toggle("required", isCustom);
  }
  if (this.elements.customEndpoint) {
    if (provider === "kimi") {
      if (!this.elements.customEndpoint.value || this.elements.customEndpoint.value === "https://openrouter.ai/api/v1") {
        this.elements.customEndpoint.value = "https://api.kimi.com/coding";
      }
      this.elements.customEndpoint.placeholder = "https://api.kimi.com/coding";
    } else if (isCustom) {
      this.elements.customEndpoint.placeholder = "https://openrouter.ai/api/v1";
    } else {
      this.elements.customEndpoint.placeholder = "Leave empty for default API URL";
    }
  }
  const modelHint = document.getElementById("modelHint");
  if (modelHint) {
    switch (provider) {
      case "anthropic":
        modelHint.textContent = "Recommended: claude-sonnet-4-20250514";
        break;
      case "openai":
        modelHint.textContent = "Recommended: gpt-4o or gpt-4-turbo";
        break;
      case "google":
        modelHint.textContent = "Recommended: gemini-2.0-flash or gemini-1.5-pro";
        break;
      case "kimi":
        modelHint.textContent = "Recommended: kimi-for-coding (or your Kimi model ID)";
        break;
      case "custom":
        modelHint.textContent = "Enter the model ID from your provider";
        break;
      default:
        modelHint.textContent = "";
    }
  }
};
SidePanelUI.prototype.validateCustomEndpoint = function validateCustomEndpoint() {
  if (!this.elements.customEndpoint) return true;
  const url = this.elements.customEndpoint.value.trim();
  if (!url) return true;
  try {
    new URL(url);
    this.elements.customEndpoint.style.borderColor = "";
    return true;
  } catch {
    this.elements.customEndpoint.style.borderColor = "var(--status-error)";
    return false;
  }
};
SidePanelUI.prototype.toggleProfileEditorEndpoint = function toggleProfileEditorEndpoint() {
  if (!this.elements.profileEditorEndpointGroup) return;
  const provider = this.elements.profileEditorProvider?.value;
  this.elements.profileEditorEndpointGroup.style.display = provider === "custom" || provider === "kimi" ? "block" : "none";
};
SidePanelUI.prototype.switchSettingsTab = function switchSettingsTab(tabName = "general") {
  if (this.currentSettingsTab === "general" && tabName === "profiles") {
    this.configs[this.currentConfig] = this.collectCurrentFormProfile();
    void this.persistAllSettings({ silent: true });
  }
  this.currentSettingsTab = tabName;
  const general = this.elements.settingsTabGeneral;
  const profiles = this.elements.settingsTabProfiles;
  general?.classList.toggle("hidden", tabName !== "general");
  profiles?.classList.toggle("hidden", tabName !== "profiles");
  this.elements.settingsTabGeneralBtn?.classList.toggle("active", tabName === "general");
  this.elements.settingsTabProfilesBtn?.classList.toggle("active", tabName === "profiles");
};
SidePanelUI.prototype.createProfileFromInput = function createProfileFromInput() {
  const name = (this.elements.newProfileNameInput?.value || "").trim();
  if (!name) {
    this.updateStatus("Enter a profile name first", "warning");
    return;
  }
  if (this.configs[name]) {
    this.updateStatus("Profile already exists", "warning");
    return;
  }
  if (this.elements.newProfileNameInput) this.elements.newProfileNameInput.value = "";
  this.createNewConfig(name);
  this.editProfile(name, true);
};
SidePanelUI.prototype.loadSettings = async function loadSettings() {
  console.log("[Parchi] loadSettings called");
  const settings = await chrome.storage.local.get([
    "visionBridge",
    "visionProfile",
    "useOrchestrator",
    "orchestratorProfile",
    "showThinking",
    "streamResponses",
    "autoScroll",
    "confirmActions",
    "saveHistory",
    "toolPermissions",
    "allowedDomains",
    "activeConfig",
    "configs",
    "auxAgentProfiles",
    "accountApiBase"
  ]);
  const storedConfigs = settings.configs || {};
  const baseConfig = {
    provider: "openai",
    apiKey: "",
    model: "gpt-4o",
    customEndpoint: "",
    systemPrompt: this.getDefaultSystemPrompt(),
    temperature: 0.7,
    maxTokens: 4096,
    contextLimit: 2e5,
    timeout: 3e4,
    sendScreenshotsAsImages: false,
    screenshotQuality: "high",
    showThinking: true,
    streamResponses: true,
    autoScroll: true,
    confirmActions: true,
    saveHistory: true,
    enableScreenshots: false
  };
  this.configs = {
    default: { ...baseConfig, ...storedConfigs.default || {} },
    ...storedConfigs
  };
  this.currentConfig = this.configs[settings.activeConfig] ? settings.activeConfig : "default";
  this.auxAgentProfiles = settings.auxAgentProfiles || [];
  if (this.elements.visionBridge)
    this.elements.visionBridge.value = settings.visionBridge !== void 0 ? String(settings.visionBridge) : "true";
  if (this.elements.visionProfile) this.elements.visionProfile.value = settings.visionProfile || "";
  if (this.elements.orchestratorToggle)
    this.elements.orchestratorToggle.value = settings.useOrchestrator !== void 0 ? String(settings.useOrchestrator) : "false";
  if (this.elements.orchestratorProfile) this.elements.orchestratorProfile.value = settings.orchestratorProfile || "";
  if (this.elements.showThinking)
    this.elements.showThinking.value = settings.showThinking !== void 0 ? String(settings.showThinking) : "true";
  if (this.elements.streamResponses)
    this.elements.streamResponses.value = settings.streamResponses !== void 0 ? String(settings.streamResponses) : "true";
  if (this.elements.autoScroll)
    this.elements.autoScroll.value = settings.autoScroll !== void 0 ? String(settings.autoScroll) : "true";
  if (this.elements.confirmActions)
    this.elements.confirmActions.value = settings.confirmActions !== void 0 ? String(settings.confirmActions) : "true";
  if (this.elements.saveHistory)
    this.elements.saveHistory.value = settings.saveHistory !== void 0 ? String(settings.saveHistory) : "true";
  const defaultPermissions = {
    read: true,
    interact: true,
    navigate: true,
    tabs: true,
    screenshots: false
  };
  const toolPermissions = {
    ...defaultPermissions,
    ...settings.toolPermissions || {}
  };
  if (this.elements.permissionRead) this.elements.permissionRead.value = String(toolPermissions.read);
  if (this.elements.permissionInteract) this.elements.permissionInteract.value = String(toolPermissions.interact);
  if (this.elements.permissionNavigate) this.elements.permissionNavigate.value = String(toolPermissions.navigate);
  if (this.elements.permissionTabs) this.elements.permissionTabs.value = String(toolPermissions.tabs);
  if (this.elements.permissionScreenshots)
    this.elements.permissionScreenshots.value = String(toolPermissions.screenshots);
  if (this.elements.allowedDomains) this.elements.allowedDomains.value = settings.allowedDomains || "";
  const fallbackAccountBase = this.getDefaultAccountApiBase();
  const accountApiBase = settings.accountApiBase || fallbackAccountBase;
  if (this.elements.accountApiBase) {
    this.elements.accountApiBase.value = accountApiBase || "";
  }
  this.accountClient.setBaseUrl(accountApiBase || "");
  if (!settings.accountApiBase && accountApiBase) {
    await chrome.storage.local.set({ accountApiBase });
  }
  this.updateAccessConfigPrompt();
  this.refreshConfigDropdown();
  this.setActiveConfig(this.currentConfig, true);
  this.toggleCustomEndpoint();
  this.updateScreenshotToggleState();
  this.editProfile(this.currentConfig, true);
};
SidePanelUI.prototype.saveSettings = async function saveSettings() {
  if ((this.elements.provider?.value === "custom" || this.elements.provider?.value === "kimi") && !this.validateCustomEndpoint()) {
    this.updateStatus("Invalid custom endpoint URL", "error");
    return;
  }
  this.configs[this.currentConfig] = this.collectCurrentFormProfile();
  await this.persistAllSettings();
  this.fetchAvailableModels();
  this.updateStatus("Settings saved successfully", "success");
};
SidePanelUI.prototype.exportSettings = async function exportSettings() {
  try {
    const keys = [
      "configs",
      "activeConfig",
      "auxAgentProfiles",
      "visionBridge",
      "visionProfile",
      "useOrchestrator",
      "orchestratorProfile",
      "showThinking",
      "streamResponses",
      "autoScroll",
      "confirmActions",
      "saveHistory",
      "toolPermissions",
      "allowedDomains",
      "accountApiBase"
    ];
    const settings = await chrome.storage.local.get(keys);
    const payload = {
      ...settings,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      exportVersion: 1
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `parchi-settings-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.updateStatus("Settings export downloaded", "success");
  } catch (error) {
    this.updateStatus("Unable to export settings", "error");
  }
};
SidePanelUI.prototype.importSettings = async function importSettings(event) {
  const input = event?.target;
  const file = input?.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const payload = {};
    const allowedKeys = [
      "configs",
      "activeConfig",
      "auxAgentProfiles",
      "visionBridge",
      "visionProfile",
      "useOrchestrator",
      "orchestratorProfile",
      "showThinking",
      "streamResponses",
      "autoScroll",
      "confirmActions",
      "saveHistory",
      "toolPermissions",
      "allowedDomains",
      "accountApiBase"
    ];
    allowedKeys.forEach((key) => {
      if (data[key] !== void 0) {
        payload[key] = data[key];
      }
    });
    if (payload.configs && typeof payload.configs !== "object") {
      throw new Error("Invalid configs payload");
    }
    await chrome.storage.local.set(payload);
    await this.loadSettings();
    this.renderProfileGrid();
    this.updateAccessUI();
    this.updateStatus("Settings imported successfully", "success");
  } catch (error) {
    this.updateStatus("Unable to import settings", "error");
  } finally {
    if (input) input.value = "";
  }
};
SidePanelUI.prototype.collectCurrentFormProfile = function collectCurrentFormProfile() {
  const current = this.configs[this.currentConfig] || {};
  return {
    provider: this.elements.provider?.value || current.provider || "openai",
    apiKey: this.elements.apiKey?.value || current.apiKey || "",
    model: this.elements.model?.value || current.model || "gpt-4o",
    customEndpoint: this.elements.customEndpoint?.value || current.customEndpoint || "",
    systemPrompt: this.elements.systemPrompt?.value || current.systemPrompt || "",
    temperature: Number.parseFloat(this.elements.temperature?.value) || current.temperature || 0.7,
    maxTokens: Number.parseInt(this.elements.maxTokens?.value) || current.maxTokens || 4096,
    contextLimit: Number.parseInt(this.elements.contextLimit?.value) || current.contextLimit || 2e5,
    timeout: Number.parseInt(this.elements.timeout?.value) || current.timeout || 3e4,
    enableScreenshots: this.elements.enableScreenshots?.value === "true" || current.enableScreenshots || false,
    sendScreenshotsAsImages: this.elements.sendScreenshotsAsImages?.value === "true" || current.sendScreenshotsAsImages || false,
    screenshotQuality: this.elements.screenshotQuality?.value || current.screenshotQuality || "high",
    showThinking: this.elements.showThinking?.value === "true",
    streamResponses: this.elements.streamResponses?.value === "true",
    autoScroll: this.elements.autoScroll?.value === "true",
    confirmActions: this.elements.confirmActions?.value === "true",
    saveHistory: this.elements.saveHistory?.value === "true"
  };
};
SidePanelUI.prototype.collectToolPermissions = function collectToolPermissions() {
  return {
    read: this.elements.permissionRead?.value !== "false",
    interact: this.elements.permissionInteract?.value !== "false",
    navigate: this.elements.permissionNavigate?.value !== "false",
    tabs: this.elements.permissionTabs?.value !== "false",
    screenshots: this.elements.permissionScreenshots?.value === "true"
  };
};
SidePanelUI.prototype.persistAllSettings = async function persistAllSettings({ silent = false } = {}) {
  const activeProfile = this.configs[this.currentConfig] || {};
  const payload = {
    provider: activeProfile.provider || "openai",
    apiKey: activeProfile.apiKey || "",
    model: activeProfile.model || "gpt-4o",
    customEndpoint: activeProfile.customEndpoint || "",
    systemPrompt: activeProfile.systemPrompt || this.getDefaultSystemPrompt(),
    temperature: activeProfile.temperature ?? 0.7,
    maxTokens: activeProfile.maxTokens || 4096,
    contextLimit: activeProfile.contextLimit || 2e5,
    timeout: activeProfile.timeout || 3e4,
    enableScreenshots: activeProfile.enableScreenshots ?? false,
    sendScreenshotsAsImages: activeProfile.sendScreenshotsAsImages ?? false,
    screenshotQuality: activeProfile.screenshotQuality || "high",
    showThinking: activeProfile.showThinking !== false,
    streamResponses: activeProfile.streamResponses !== false,
    autoScroll: activeProfile.autoScroll !== false,
    confirmActions: activeProfile.confirmActions !== false,
    saveHistory: activeProfile.saveHistory !== false,
    visionBridge: this.elements.visionBridge?.value === "true",
    visionProfile: this.elements.visionProfile?.value || "",
    useOrchestrator: this.elements.orchestratorToggle?.value === "true",
    orchestratorProfile: this.elements.orchestratorProfile?.value || "",
    toolPermissions: this.collectToolPermissions(),
    allowedDomains: this.elements.allowedDomains?.value || "",
    accountApiBase: this.elements.accountApiBase?.value?.trim() || "",
    auxAgentProfiles: this.auxAgentProfiles,
    activeConfig: this.currentConfig,
    configs: this.configs
  };
  await chrome.storage.local.set(payload);
  this.accountClient.setBaseUrl(payload.accountApiBase);
  this.updateAccessConfigPrompt();
  this.updateContextUsage();
  if (!silent) {
    this.updateStatus("Settings saved successfully", "success");
  }
};
SidePanelUI.prototype.getDefaultSystemPrompt = function getDefaultSystemPrompt() {
  return `You are a browser automation agent. You execute tasks by calling tools in a strict sequence.

<rules priority="CRITICAL">
VIOLATIONS CAUSE TASK FAILURE. NO EXCEPTIONS.

1. NO PLAN = NO ACTION
   You CANNOT call navigate, click, type, scroll, or pressKey without an active plan.
   Your FIRST tool call MUST be set_plan.

2. ACTION \u2192 VERIFY \u2192 MARK
   Every browser action MUST be followed by getContent.
   Every completed step MUST be followed by update_plan.
   
3. SEQUENTIAL EXECUTION  
   Complete step N before starting step N+1.
   Never skip update_plan. Never.

4. EVIDENCE ONLY
   Never claim to see content you didn't fetch with getContent.
   Quote actual text from getContent results.
</rules>

<execution_protocol>
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  MANDATORY SEQUENCE FOR EVERY STEP                          \u2502
\u2502                                                             \u2502
\u2502  1. CHECK: Read <execution_state> for current step          \u2502
\u2502  2. ACT: Call ONE browser tool for that step                \u2502
\u2502  3. VERIFY: Call getContent (REQUIRED - no exceptions)      \u2502
\u2502  4. MARK: Call update_plan(step_index=N, status="done")     \u2502
\u2502  5. REPEAT: Go to step 1 for next step                      \u2502
\u2502                                                             \u2502
\u2502  \u26A0\uFE0F NEVER skip steps 3 or 4. The system tracks compliance.  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</execution_protocol>

<correct_example>
User: "Find the price of AirPods on Apple's website"

\u2705 CORRECT execution:

TURN 1:
set_plan({ steps: [
  { title: "Navigate to apple.com" },
  { title: "Search for AirPods" },
  { title: "Find and extract price" },
  { title: "Report findings" }
]})

TURN 2:
navigate({ url: "https://apple.com" })

TURN 3:
getContent({ mode: "text" })  \u2190 REQUIRED after navigate

TURN 4:
update_plan({ step_index: 0, status: "done" })  \u2190 REQUIRED before step 1

TURN 5:
click({ selector: "button[aria-label='Search']" })

TURN 6:
getContent({ mode: "text" })  \u2190 REQUIRED after click

... and so on, always: action \u2192 getContent \u2192 update_plan
</correct_example>

<wrong_example>
\u274C WRONG - Missing getContent:
navigate({ url: "https://apple.com" })
update_plan({ step_index: 0, status: "done" })  \u2190 ERROR: No getContent!

\u274C WRONG - Missing update_plan:
navigate({ url: "https://apple.com" })
getContent({ mode: "text" })
click({ selector: "..." })  \u2190 ERROR: Didn't mark step 0 done!

\u274C WRONG - No plan:
navigate({ url: "https://apple.com" })  \u2190 ERROR: No plan exists!

\u274C WRONG - Vague plan steps:
set_plan({ steps: [
  { title: "Research AirPods" },      \u2190 Too vague
  { title: "Phase 1: Discovery" },    \u2190 Not an action
  { title: "Gather information" }     \u2190 What information? How?
]})
</wrong_example>

<tools>
PLANNING (use these to manage your task):
\u2022 set_plan - Create action checklist. MUST BE YOUR FIRST CALL.
\u2022 update_plan - Mark step complete. CALL AFTER EACH STEP IS VERIFIED.

BROWSER ACTIONS (require getContent after):
\u2022 navigate - Go to URL
\u2022 click - Click element by CSS selector  
\u2022 type - Enter text into input field
\u2022 pressKey - Press keyboard key (Enter, Tab, Escape)
\u2022 scroll - Scroll page (up/down/top/bottom)

READING (call after every action):
\u2022 getContent - Read page content. REQUIRED after every browser action.
\u2022 screenshot - Capture visible area (if enabled)

TABS:
\u2022 getTabs, switchTab, openTab, closeTab, focusTab, groupTabs
</tools>

<error_recovery>
If a tool fails:
1. Call getContent to understand current page state
2. Try a different CSS selector
3. Scroll to find the element  
4. Try an alternative approach
5. If stuck, explain what's blocking you

Never give up after one failure. Adapt and retry.
</error_recovery>

<output_format>
During execution: Minimal commentary. Your tool calls are your actions.

After ALL steps are marked done:
**Task:** [What was requested]
**Result:** [What you found, with quotes from getContent]
**Sources:** [URLs you visited]
</output_format>`;
};
SidePanelUI.prototype.getDefaultAccountApiBase = function getDefaultAccountApiBase() {
  try {
    const manifest = chrome.runtime.getManifest();
    const config = manifest && manifest.parchi;
    if (config && typeof config.accountApiBase === "string") {
      return config.accountApiBase.trim();
    }
  } catch (error) {
  }
  return "";
};
SidePanelUI.prototype.isAccountRequired = function isAccountRequired() {
  try {
    const manifest = chrome.runtime.getManifest();
    const config = manifest && manifest.parchi;
    if (config && typeof config.requireAccount === "boolean") {
      return config.requireAccount;
    }
  } catch (error) {
  }
  return true;
};
SidePanelUI.prototype.updateScreenshotToggleState = function updateScreenshotToggleState() {
  if (!this.elements.enableScreenshots) return;
  const wantsScreens = this.elements.enableScreenshots.value === "true";
  const visionProfile = this.elements.visionProfile?.value;
  const provider = this.elements.provider?.value;
  const hasVision = provider && provider !== "custom" || visionProfile;
  const controls = [this.elements.sendScreenshotsAsImages, this.elements.screenshotQuality];
  controls.forEach((ctrl) => {
    if (!ctrl) return;
    ctrl.disabled = !wantsScreens;
    ctrl.parentElement?.classList.toggle("disabled", !wantsScreens);
  });
  if (wantsScreens && !hasVision) {
    this.updateStatus("Enable a vision-capable profile before sending screenshots.", "warning");
  }
};

// sidepanel/ui/panel-status.ts
SidePanelUI.prototype.updateStatus = function updateStatus(text, type = "default") {
  if (this.elements.statusText) {
    this.elements.statusText.textContent = text;
  }
  const statusDot = document.getElementById("statusDot");
  if (statusDot) {
    statusDot.className = "status-dot";
    if (type === "error") statusDot.classList.add("error");
    else if (type === "warning") statusDot.classList.add("warning");
    else if (type === "active") statusDot.classList.add("active");
  }
  this.updateActivityState();
};
SidePanelUI.prototype.updateModelDisplay = function updateModelDisplay() {
  const config = this.configs[this.currentConfig] || {};
  const modelName = config.model || "";
  if (this.elements.modelSelect) {
    this.elements.modelSelect.value = modelName;
  }
};
SidePanelUI.prototype.fetchAvailableModels = async function fetchAvailableModels() {
  const config = this.configs[this.currentConfig] || {};
  const provider = config.provider || "anthropic";
  const apiKey = config.apiKey || "";
  const customEndpoint = config.customEndpoint || "";
  console.log("[Parchi] fetchAvailableModels called");
  console.log("[Parchi] currentConfig:", this.currentConfig);
  console.log("[Parchi] config:", { provider, apiKey: apiKey ? "***" : "(empty)", customEndpoint });
  const ANTHROPIC_MODELS = [
    "claude-sonnet-4-20250514",
    "claude-opus-4-20250514",
    "claude-3-7-sonnet-20250219",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022"
  ];
  const GOOGLE_MODELS = [
    "gemini-2.5-flash-preview-05-20",
    "gemini-2.5-pro-preview-05-06",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
  ];
  const OPENAI_MODELS = [
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "o1",
    "o1-mini",
    "o1-pro",
    "o3",
    "o3-mini",
    "o4-mini"
  ];
  if (provider === "anthropic") {
    this.populateModelSelect(ANTHROPIC_MODELS, config.model);
    return;
  }
  if (provider === "google") {
    this.populateModelSelect(GOOGLE_MODELS, config.model);
    return;
  }
  if (provider === "kimi") {
    this.populateModelSelect([config.model || "kimi-for-coding"], config.model);
    return;
  }
  if (provider === "openai" && !customEndpoint) {
    this.populateModelSelect(OPENAI_MODELS, config.model);
    return;
  }
  if (!apiKey && provider === "custom") {
    this.populateModelSelect([config.model || "gpt-4o"], config.model);
    return;
  }
  let baseUrl = "";
  if (customEndpoint) {
    baseUrl = customEndpoint.replace(/\/chat\/completions\/?$/i, "").replace(/\/completions\/?$/i, "").replace(/\/v1\/models\/?$/i, "").replace(/\/v1\/?$/i, "").replace(/\/+$/, "");
  } else if (provider === "openai") {
    baseUrl = "https://api.openai.com";
  }
  if (!baseUrl) {
    this.populateModelSelect([config.model || "gpt-4o"], config.model);
    return;
  }
  const modelsUrl = `${baseUrl}/v1/models`;
  console.log("[Parchi] Fetching models from:", modelsUrl);
  try {
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      console.warn("[Parchi] Failed to fetch models:", response.status, response.statusText);
      this.populateModelSelect([config.model || "gpt-4o"], config.model);
      return;
    }
    const data = await response.json();
    console.log("[Parchi] Models response:", data);
    const allModels = data.data || [];
    const activeModels = allModels.filter((m) => m.id && m.active === true).map((m) => m.id).sort((a, b) => a.localeCompare(b));
    const inactiveModels = allModels.filter((m) => m.id && m.active !== true).map((m) => m.id).sort((a, b) => a.localeCompare(b));
    const models = [...activeModels, ...inactiveModels].filter(Boolean);
    console.log("[Parchi] Found models:", models.length, "active:", activeModels.length);
    if (models.length > 0) {
      this.populateModelSelect(models, config.model);
    } else {
      this.populateModelSelect([config.model || "gpt-4o"], config.model);
    }
  } catch (error) {
    console.error("[Parchi] Error fetching models:", error);
    this.populateModelSelect([config.model || "gpt-4o"], config.model);
  }
};
SidePanelUI.prototype.populateModelSelect = function populateModelSelect(models, currentModel) {
  let select = this.elements.modelSelect;
  if (!select) {
    select = document.getElementById("modelSelect");
    if (select) {
      this.elements.modelSelect = select;
    }
  }
  if (!select) {
    console.error("[Parchi] modelSelect element not found!");
    return;
  }
  const config = this.configs[this.currentConfig] || {};
  const selectedModel = currentModel || config.model || "";
  const normalizedModels = models.filter((model) => Boolean(model && model.trim?.()));
  const fallbackModel = selectedModel || "gpt-4o";
  let finalModels = normalizedModels.length > 0 ? normalizedModels : [fallbackModel];
  if (selectedModel && !finalModels.includes(selectedModel)) {
    finalModels = [selectedModel, ...finalModels];
  }
  console.log("[Parchi] Populating model select with", finalModels.length, "models, selected:", selectedModel);
  select.innerHTML = "";
  if (!selectedModel) {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select model";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
  }
  for (const model of finalModels) {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    if (model === selectedModel) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  console.log("[Parchi] Model select now has", select.options.length, "options");
};
SidePanelUI.prototype.handleModelSelectChange = function handleModelSelectChange() {
  const select = this.elements.modelSelect;
  if (!select) return;
  const selectedModel = select.value;
  if (!selectedModel) return;
  if (this.configs[this.currentConfig]) {
    this.configs[this.currentConfig].model = selectedModel;
  }
  if (this.elements.model) {
    this.elements.model.value = selectedModel;
  }
  this.persistAllSettings({ silent: true });
};

// sidepanel/ui/panel-streaming.ts
var formatElapsed = (elapsedMs) => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1e3));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minuteLabel = minutes.toString().padStart(1, "0");
  const secondLabel = seconds.toString().padStart(2, "0");
  return `${minuteLabel}:${secondLabel}`;
};
SidePanelUI.prototype.handleAssistantStream = function handleAssistantStream(event) {
  if (event.status === "start") {
    this.isStreaming = true;
    this.clearErrorBanner();
    this.startStreamingMessage();
    this.startThinkingTimer();
  } else if (event.status === "delta") {
    this.isStreaming = true;
    this.updateStreamingMessage(event.content || "");
  } else if (event.status === "stop") {
    this.isStreaming = false;
    this.completeStreamingMessage();
    this.stopThinkingTimer();
  }
  this.updateActivityState();
};
SidePanelUI.prototype.startThinkingTimer = function startThinkingTimer() {
  if (this.thinkingTimerId) {
    window.clearInterval(this.thinkingTimerId);
  }
  this.thinkingStartedAt = Date.now();
  const updateTimer = () => {
    const elapsed = formatElapsed(Date.now() - (this.thinkingStartedAt || Date.now()));
    this.updateStatus(`Thinking ${elapsed}`, "active");
  };
  updateTimer();
  this.thinkingTimerId = window.setInterval(updateTimer, 1e3);
};
SidePanelUI.prototype.stopThinkingTimer = function stopThinkingTimer() {
  if (this.thinkingTimerId) {
    window.clearInterval(this.thinkingTimerId);
    this.thinkingTimerId = null;
  }
  this.thinkingStartedAt = null;
};
SidePanelUI.prototype.startStreamingMessage = function startStreamingMessage() {
  if (this.streamingState) return;
  const container = document.createElement("div");
  container.className = "message assistant streaming";
  container.innerHTML = `
      <div class="message-content streaming-content markdown-body">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
        <div class="stream-events"></div>
      </div>
    `;
  this.elements.chatMessages.appendChild(container);
  this.streamingState = {
    container,
    eventsEl: container.querySelector(".stream-events"),
    lastEventType: void 0,
    textEventEl: null,
    reasoningEventEl: null,
    textBuffer: "",
    reasoningBuffer: "",
    planEl: null,
    planListEl: null,
    planMetaEl: null
  };
  this.updateThinkingPanel(null, true);
  this.scrollToBottom();
};
SidePanelUI.prototype.updateStreamingMessage = function updateStreamingMessage(content) {
  if (!this.streamingState) {
    this.startStreamingMessage();
  }
  if (!this.streamingState?.eventsEl) return;
  if (this.streamingState.lastEventType !== "text") {
    const textEvent = document.createElement("div");
    textEvent.className = "stream-event stream-event-text";
    this.streamingState.eventsEl.appendChild(textEvent);
    this.streamingState.textEventEl = textEvent;
    this.streamingState.textBuffer = "";
    this.streamingState.lastEventType = "text";
  }
  this.streamingState.textBuffer = `${this.streamingState.textBuffer || ""}${content || ""}`;
  if (this.streamingState.textEventEl) {
    this.streamingState.textEventEl.innerHTML = this.renderMarkdown(this.streamingState.textBuffer || "");
  }
  this.scrollToBottom();
};
SidePanelUI.prototype.completeStreamingMessage = function completeStreamingMessage() {
  if (!this.streamingState?.container) return;
  const indicator = this.streamingState.container.querySelector(".typing-indicator");
  if (indicator) indicator.remove();
  this.streamingState.container.classList.remove("streaming");
  if (this.streamingReasoning) {
    this.updateThinkingPanel(this.streamingReasoning, false);
  } else {
    this.updateThinkingPanel(null, false);
  }
};
SidePanelUI.prototype.updateStreamReasoning = function updateStreamReasoning(delta) {
  if (!this.streamingState?.eventsEl) return;
  if (delta === null || delta === void 0) return;
  if (!delta.trim() && !this.streamingState.reasoningBuffer) return;
  if (this.streamingState.lastEventType !== "reasoning") {
    const reasoningEvent = document.createElement("div");
    reasoningEvent.className = "stream-event stream-event-reasoning";
    reasoningEvent.innerHTML = `
        <div class="stream-reasoning-label">Reasoning</div>
        <div class="stream-reasoning-content"></div>
      `;
    this.streamingState.eventsEl.appendChild(reasoningEvent);
    this.streamingState.reasoningEventEl = reasoningEvent.querySelector(
      ".stream-reasoning-content"
    );
    this.streamingState.reasoningBuffer = "";
    this.streamingState.lastEventType = "reasoning";
  }
  const nextBuffer = `${this.streamingState.reasoningBuffer || ""}${delta}`;
  this.streamingState.reasoningBuffer = nextBuffer;
  const cleaned = dedupeThinking(nextBuffer);
  if (this.streamingState.reasoningEventEl) {
    this.streamingState.reasoningEventEl.textContent = cleaned;
  }
  this.scrollToBottom();
};
SidePanelUI.prototype.applyPlanUpdate = function applyPlanUpdate(plan) {
  if (!plan) return;
  this.currentPlan = plan;
  this.renderPlanDrawer(plan);
};
SidePanelUI.prototype.applyManualPlanUpdate = function applyManualPlanUpdate(steps = []) {
  if (!steps || steps.length === 0) return;
  const now = Date.now();
  const normalizedSteps = steps.map((step, index) => {
    const status = step.status === "running" || step.status === "done" || step.status === "blocked" ? step.status : "pending";
    return {
      id: `step-${index + 1}`,
      title: step.title,
      status,
      notes: step.notes
    };
  }).filter((step) => step.title);
  if (!normalizedSteps.length) return;
  this.currentPlan = {
    steps: normalizedSteps,
    createdAt: this.currentPlan?.createdAt || now,
    updatedAt: now
  };
  if (this.currentPlan) {
    this.renderPlanDrawer(this.currentPlan);
  }
};
SidePanelUI.prototype.ensurePlanBlock = function ensurePlanBlock() {
  if (!this.streamingState?.eventsEl) return null;
  if (this.streamingState.planEl) return this.streamingState.planEl;
  const container = document.createElement("div");
  container.className = "plan-block";
  container.innerHTML = `
      <div class="plan-header">
        <span class="plan-title">Plan</span>
        <span class="plan-meta"></span>
      </div>
      <ol class="plan-steps"></ol>
    `;
  const firstChild = this.streamingState.eventsEl.firstChild;
  if (firstChild) {
    this.streamingState.eventsEl.insertBefore(container, firstChild);
  } else {
    this.streamingState.eventsEl.appendChild(container);
  }
  this.streamingState.planEl = container;
  this.streamingState.planListEl = container.querySelector(".plan-steps");
  this.streamingState.planMetaEl = container.querySelector(".plan-meta");
  return container;
};
SidePanelUI.prototype.finishStreamingMessage = function finishStreamingMessage() {
  if (!this.streamingState) return null;
  const streamingThinking = this.streamingReasoning;
  const container = this.streamingState.container;
  this.completeStreamingMessage();
  this.streamingState = null;
  this.isStreaming = false;
  this.updateActivityState();
  return { thinking: streamingThinking, container };
};

// sidepanel/ui/panel-tabs.ts
SidePanelUI.prototype.handleFileSelection = async function handleFileSelection(event) {
  const input = event.target;
  if (!input) return;
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const maxPerFile = 4e3;
  for (const file of files) {
    try {
      const text = await file.text();
      const trimmed = text.length > maxPerFile ? text.slice(0, maxPerFile) + "\n\u2026 (truncated)" : text;
      const prefix = `

[File: ${file.name}]
`;
      this.elements.userInput.value += prefix + trimmed;
    } catch (e) {
      console.warn("Failed to read file", file.name, e);
    }
  }
  input.value = "";
  this.elements.userInput.focus();
};
SidePanelUI.prototype.toggleTabSelector = async function toggleTabSelector() {
  const isHidden = this.elements.tabSelector.classList.contains("hidden");
  if (isHidden) {
    await this.loadTabs();
    this.updateTabSelectorButton();
    this.elements.tabSelector.classList.remove("hidden");
  } else {
    this.closeTabSelector();
  }
};
SidePanelUI.prototype.closeTabSelector = function closeTabSelector() {
  this.elements.tabSelector.classList.add("hidden");
};
SidePanelUI.prototype.addActiveTabToSelection = async function addActiveTabToSelection() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab || typeof activeTab.id !== "number") return;
  this.selectedTabs.set(activeTab.id, this.buildSelectedTab(activeTab));
  this.updateSelectedTabsBar();
  this.updateTabSelectorButton();
  this.loadTabs();
};
SidePanelUI.prototype.clearSelectedTabs = function clearSelectedTabs() {
  if (this.selectedTabs.size === 0) return;
  this.selectedTabs.clear();
  this.updateSelectedTabsBar();
  this.updateTabSelectorButton();
  this.loadTabs();
};
SidePanelUI.prototype.loadTabs = async function loadTabs() {
  const [tabs, groups] = await Promise.all([chrome.tabs.query({}), chrome.tabGroups.query({})]);
  this.tabGroupInfo = new Map(groups.map((group) => [group.id, group]));
  this.elements.tabList.innerHTML = "";
  const groupedTabs = /* @__PURE__ */ new Map();
  const ungroupedTabs = [];
  tabs.filter((tab) => typeof tab.id === "number").forEach((tab) => {
    if (tab.groupId !== void 0 && tab.groupId >= 0) {
      if (!groupedTabs.has(tab.groupId)) groupedTabs.set(tab.groupId, []);
      const bucket = groupedTabs.get(tab.groupId);
      if (bucket) bucket.push(tab);
    } else {
      ungroupedTabs.push(tab);
    }
  });
  const renderGroup = (label, color, groupTabs, groupId = "ungrouped") => {
    if (!groupTabs.length) return;
    const section = document.createElement("div");
    section.className = "tab-group";
    const allSelected = groupTabs.every((tab) => typeof tab.id === "number" && this.selectedTabs.has(tab.id));
    section.innerHTML = `
        <div class="tab-group-header" style="--group-color: ${color}">
          <div class="tab-group-label">
            <span>${this.escapeHtml(label)}</span>
            <span class="tab-group-count">${groupTabs.length}</span>
          </div>
          <button class="tab-group-toggle" type="button">${allSelected ? "Clear" : "Add all"}</button>
        </div>
      `;
    const toggleBtn = section.querySelector(".tab-group-toggle");
    toggleBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleGroupSelection(groupTabs, !allSelected);
    });
    groupTabs.forEach((tab) => {
      const tabId = tab.id;
      const isSelected = typeof tabId === "number" && this.selectedTabs.has(tabId);
      const item = document.createElement("div");
      item.className = `tab-item${isSelected ? " selected" : ""}`;
      const urlLabel = this.formatTabLabel(tab.url || "");
      item.innerHTML = `
          <div class="tab-item-checkbox"></div>
          <img class="tab-item-favicon" src="${tab.favIconUrl || "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23666%27%3E%3Crect width=%2724%27 height=%2724%27 rx=%274%27/%3E%3C/svg%3E"}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23666%27%3E%3Crect width=%2724%27 height=%2724%27 rx=%274%27/%3E%3C/svg%3E'">
          <div class="tab-item-text">
            <span class="tab-item-title">${this.escapeHtml(tab.title || "Untitled")}</span>
            ${urlLabel ? `<span class="tab-item-url">${this.escapeHtml(urlLabel)}</span>` : ""}
          </div>
        `;
      item.addEventListener("click", () => this.toggleTabSelection(tab, item));
      section.appendChild(item);
    });
    this.elements.tabList.appendChild(section);
  };
  groupedTabs.forEach((groupTabs, groupId) => {
    const group = this.tabGroupInfo.get(groupId);
    const label = group?.title || `Group ${groupId}`;
    const color = this.mapGroupColor(group?.color);
    renderGroup(label, color, groupTabs, groupId);
  });
  renderGroup("Ungrouped", "var(--text-tertiary)", ungroupedTabs);
};
SidePanelUI.prototype.toggleGroupSelection = function toggleGroupSelection(groupTabs, shouldSelect) {
  groupTabs.forEach((tab) => {
    if (typeof tab.id !== "number") return;
    if (shouldSelect) {
      this.selectedTabs.set(tab.id, this.buildSelectedTab(tab));
    } else {
      this.selectedTabs.delete(tab.id);
    }
  });
  this.updateSelectedTabsBar();
  this.updateTabSelectorButton();
  this.loadTabs();
};
SidePanelUI.prototype.toggleTabSelection = function toggleTabSelection(tab, itemElement) {
  if (typeof tab.id !== "number") return;
  if (this.selectedTabs.has(tab.id)) {
    this.selectedTabs.delete(tab.id);
    itemElement.classList.remove("selected");
  } else {
    this.selectedTabs.set(tab.id, this.buildSelectedTab(tab));
    itemElement.classList.add("selected");
  }
  this.updateSelectedTabsBar();
  this.updateTabSelectorButton();
  this.loadTabs();
};
SidePanelUI.prototype.buildSelectedTab = function buildSelectedTab(tab) {
  const group = this.tabGroupInfo.get(tab.groupId);
  const hasGroup = tab.groupId !== void 0 && tab.groupId >= 0;
  return {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    windowId: tab.windowId,
    groupId: tab.groupId,
    groupTitle: hasGroup ? group?.title || `Group ${tab.groupId}` : "Ungrouped",
    groupColor: hasGroup ? this.mapGroupColor(group?.color) : "var(--text-tertiary)"
  };
};
SidePanelUI.prototype.updateSelectedTabsBar = function updateSelectedTabsBar() {
  if (this.selectedTabs.size === 0) {
    this.elements.selectedTabsBar.classList.add("hidden");
    return;
  }
  this.elements.selectedTabsBar.classList.remove("hidden");
  this.elements.selectedTabsBar.innerHTML = "";
  const grouped = /* @__PURE__ */ new Map();
  this.selectedTabs.forEach((tab) => {
    const key = tab.groupId && tab.groupId >= 0 ? `group-${tab.groupId}` : "ungrouped";
    if (!grouped.has(key)) grouped.set(key, []);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(tab);
  });
  grouped.forEach((tabs) => {
    const groupTitle = tabs[0]?.groupTitle || "Ungrouped";
    const groupLabel = this.truncateText(groupTitle, 18) || "Ungrouped";
    const groupColor = tabs[0]?.groupColor || "var(--text-tertiary)";
    const groupWrap = document.createElement("div");
    groupWrap.className = "selected-tabs-group";
    groupWrap.innerHTML = `
        <div class="selected-group-label" style="--group-color: ${groupColor}">
          <span>${this.escapeHtml(groupLabel)}</span>
          <span class="selected-group-count">${tabs.length}</span>
        </div>
        <div class="selected-tabs-chips"></div>
      `;
    const chipsRow = groupWrap.querySelector(".selected-tabs-chips");
    if (!chipsRow) {
      this.elements.selectedTabsBar.appendChild(groupWrap);
      return;
    }
    tabs.forEach((tab) => {
      const chip = document.createElement("div");
      chip.className = "selected-tab-chip";
      chip.innerHTML = `
          <span>${this.escapeHtml(tab.title?.substring(0, 25) || "Tab")}${tab.title?.length > 25 ? "..." : ""}</span>
          <button title="Remove">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;
      const removeBtn = chip.querySelector("button");
      removeBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        this.selectedTabs.delete(tab.id);
        this.updateSelectedTabsBar();
        this.updateTabSelectorButton();
        this.loadTabs();
      });
      chipsRow.appendChild(chip);
    });
    this.elements.selectedTabsBar.appendChild(groupWrap);
  });
};
SidePanelUI.prototype.updateTabSelectorButton = function updateTabSelectorButton() {
  const count = this.selectedTabs.size;
  if (count > 0) {
    this.elements.tabSelectorBtn.classList.add("has-selection");
    this.elements.tabSelectorBtn.dataset.count = String(count);
  } else {
    this.elements.tabSelectorBtn.classList.remove("has-selection");
    delete this.elements.tabSelectorBtn.dataset.count;
  }
  if (this.elements.tabSelectorSummary) {
    this.elements.tabSelectorSummary.textContent = count > 0 ? `${count} selected` : "No tabs selected";
  }
};
SidePanelUI.prototype.mapGroupColor = function mapGroupColor(colorName) {
  const palette = {
    grey: "#9aa0a6",
    blue: "#4c8bf5",
    red: "#ea4335",
    yellow: "#fbbc04",
    green: "#34a853",
    pink: "#f06292",
    purple: "#a142f4",
    cyan: "#24c1e0",
    orange: "#f29900"
  };
  return palette[colorName] || "var(--text-tertiary)";
};
SidePanelUI.prototype.formatTabLabel = function formatTabLabel(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
SidePanelUI.prototype.getSelectedTabsContext = function getSelectedTabsContext() {
  if (this.selectedTabs.size === 0) return "";
  let context = "\n\n[Context from selected tabs:]\n";
  this.selectedTabs.forEach((tab) => {
    const tabTitle = tab.title || "Untitled";
    const groupLabel = tab.groupTitle ? `${tab.groupTitle} \xB7 ` : "";
    const urlLabel = tab.url || "";
    context += `- ${groupLabel}"${tabTitle}": ${urlLabel}
`;
  });
  return context;
};

// sidepanel/ui/panel-tools.ts
SidePanelUI.prototype.displayToolExecution = function displayToolExecution(toolName, args, result, toolCallId = null) {
  const entryId = toolCallId || `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let entry = this.toolCallViews.get(entryId);
  if (!entry) {
    entry = { inline: null, log: null };
    this.toolCallViews.set(entryId, entry);
    if (this.streamingState?.eventsEl) {
      if (this.currentPlan) {
        this.ensurePlanBlock();
      }
      const inlineEntry = this.createToolTreeItem(entryId, toolName, args);
      entry.inline = inlineEntry;
      this.streamingState.eventsEl.appendChild(inlineEntry.container);
      this.streamingState.lastEventType = "tool";
    }
    if (this.elements.toolLog) {
      const logEntry = this.createToolTreeItem(entryId, toolName, args);
      entry.log = logEntry;
      this.elements.toolLog.appendChild(logEntry.container);
    }
    this.scrollToBottom();
  }
  if (result !== null && result !== void 0) {
    this.updateToolMessage(entry, result);
    const isError = result && (result.error || result.success === false);
    if (isError) {
      this.showErrorBanner(`${toolName}: ${result.error || "Tool execution failed"}`);
    }
  }
  this.updateActivityToggle();
};
SidePanelUI.prototype.updateToolMessage = function updateToolMessage(entry, result) {
  if (!entry) return;
  if (entry.inline || entry.log) {
    if (entry.inline) {
      this.updateToolTreeItem(entry.inline, result);
    }
    if (entry.log) {
      const isTreeItem = entry.log.container?.classList?.contains("tool-tree-item");
      if (isTreeItem) {
        this.updateToolTreeItem(entry.log, result);
      } else {
        this.updateToolLogEntry(entry.log, result);
      }
    }
    return;
  }
  this.updateToolLogEntry(entry, result);
};
SidePanelUI.prototype.updateToolLogEntry = function updateToolLogEntry(entry, result) {
  if (!entry) return;
  const isError = result && (result.error || result.success === false);
  if (entry.details) {
    entry.details.classList.remove("running", "success", "error");
    entry.details.classList.add(isError ? "error" : "success");
    if (entry.statusEl) entry.statusEl.textContent = isError ? "Error" : "Done";
    if (entry.resultEl) {
      const resultText = this.truncateText(this.safeJsonStringify(result), 2e3);
      entry.resultEl.textContent = resultText || (isError ? "Tool failed" : "Done");
    }
    if (entry.previewEl) {
      const preview = isError ? result?.error || "Tool failed" : result?.message || result?.summary || "";
      if (preview) {
        entry.previewEl.textContent = this.truncateText(String(preview), 120);
      }
    }
    if (isError) {
      entry.details.open = true;
    }
    return;
  }
  if (entry.container) {
    entry.container.classList.remove("running", "success", "error");
    entry.container.classList.add(isError ? "error" : "success");
  }
  if (entry.statusEl) entry.statusEl.textContent = isError ? "Error" : "Done";
  if (entry.resultEl) {
    const resultText = this.truncateText(this.safeJsonStringify(result), 2e3);
    entry.resultEl.textContent = resultText || (isError ? "Tool failed" : "Done");
  }
  if (entry.previewEl) {
    const preview = isError ? result?.error || "Tool failed" : result?.message || result?.summary || "";
    if (preview) {
      entry.previewEl.textContent = this.truncateText(String(preview), 120);
    }
  }
  if (isError && entry.container) {
    entry.container.classList.add("expanded");
    if (entry.toggleBtn) {
      entry.toggleBtn.textContent = "Hide";
    }
  }
  if (this.elements.toolLog) {
    this.scrollToolLogToBottom();
  }
};
SidePanelUI.prototype.showErrorBanner = function showErrorBanner(message) {
  document.querySelectorAll(".error-banner").forEach((el) => el.remove());
  const banner = document.createElement("div");
  banner.className = "error-banner";
  banner.innerHTML = `
      <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span class="error-text">${this.escapeHtml(message)}</span>
      <button class="error-dismiss" title="Dismiss">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
  const dismissButton = banner.querySelector(".error-dismiss");
  dismissButton?.addEventListener("click", () => banner.remove());
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 8e3);
};
SidePanelUI.prototype.clearRunIncompleteBanner = function clearRunIncompleteBanner() {
  document.querySelectorAll(".run-incomplete-banner").forEach((el) => el.remove());
};
SidePanelUI.prototype.clearErrorBanner = function clearErrorBanner() {
  document.querySelectorAll(".error-banner").forEach((el) => el.remove());
};
SidePanelUI.prototype.getArgsPreview = function getArgsPreview(args) {
  if (!args) return "";
  if (args.url) return args.url.substring(0, 30) + (args.url.length > 30 ? "..." : "");
  if (args.text) return `"${args.text.substring(0, 20)}${args.text.length > 20 ? "..." : ""}"`;
  if (args.selector) return args.selector.substring(0, 25);
  if (args.key) return args.key;
  if (args.direction) return args.direction;
  if (args.type) return args.type;
  return "";
};
SidePanelUI.prototype.createToolTreeItem = function createToolTreeItem(entryId, toolName, args) {
  const container = document.createElement("div");
  container.className = "tool-tree-item running";
  container.dataset.id = entryId;
  container.dataset.start = String(Date.now());
  const argsPreview = this.getArgsPreview(args);
  const argsText = this.truncateText(this.safeJsonStringify(args), 1600);
  container.innerHTML = `
      <span class="tool-tree-status"></span>
      <div class="tool-tree-content">
        <div class="tool-tree-header">
          <span class="tool-tree-name">${this.escapeHtml(toolName || "tool")}</span>
          <span class="tool-tree-args">${this.escapeHtml(argsPreview || "")}</span>
        </div>
        <span class="tool-tree-meta">Running</span>
      </div>
    `;
  return {
    container,
    statusEl: container.querySelector(".tool-tree-meta")
  };
};
SidePanelUI.prototype.updateToolTreeItem = function updateToolTreeItem(entry, result) {
  if (!entry?.container) return;
  const isError = result && (result.error || result.success === false);
  entry.container.classList.remove("running", "success", "error");
  entry.container.classList.add(isError ? "error" : "success");
  const start = Number.parseInt(entry.container.dataset.start || "0", 10);
  const dur = start ? Date.now() - start : 0;
  if (entry.statusEl) {
    if (isError) {
      entry.statusEl.textContent = "Error";
    } else {
      entry.statusEl.textContent = dur > 0 ? `${dur}ms` : "Done";
    }
  }
};
SidePanelUI.prototype.updateActivityState = function updateActivityState() {
  if (!this.elements.statusMeta) return;
  const labels = [];
  if (this.pendingToolCount > 0) {
    labels.push(`${this.pendingToolCount} action${this.pendingToolCount > 1 ? "s" : ""} running`);
  }
  if (this.isStreaming) {
    labels.push("Streaming response");
  }
  if (this.contextUsage && this.contextUsage.maxContextTokens) {
    const used = Math.max(0, this.contextUsage.approxTokens || 0);
    const max = Math.max(1, this.contextUsage.maxContextTokens || 0);
    const usedLabel = used >= 1e4 ? `${(used / 1e3).toFixed(1)}k` : `${used}`;
    const maxLabel = max >= 1e4 ? `${(max / 1e3).toFixed(0)}k` : `${max}`;
    labels.push(`Context ~ ${usedLabel} / ${maxLabel}`);
  }
  const usageLabel = this.buildUsageLabel(this.lastUsage);
  if (usageLabel) {
    labels.push(usageLabel);
  }
  if (labels.length > 0) {
    this.elements.statusMeta.textContent = labels.join(" \xB7 ");
    this.elements.statusMeta.classList.remove("hidden");
  } else {
    this.elements.statusMeta.textContent = "";
    this.elements.statusMeta.classList.add("hidden");
  }
  this.updateActivityToggle();
};
SidePanelUI.prototype.updateActivityToggle = function updateActivityToggle() {
  const toggle = this.elements.activityToggleBtn;
  if (!toggle) return;
  const toolCount = this.toolCallViews.size;
  const hasThinking = Boolean(this.latestThinking);
  const segments = [];
  if (toolCount > 0) {
    segments.push(`${toolCount} tool${toolCount === 1 ? "" : "s"}`);
  }
  if (hasThinking) {
    segments.push("thinking");
  }
  if (this.activeToolName) {
    segments.push(`${this.activeToolName}\u2026`);
  }
  toggle.textContent = segments.length ? `Activity \xB7 ${segments.join(" \xB7 ")}` : "Activity";
  const hasActiveWork = this.pendingToolCount > 0 || this.isStreaming;
  toggle.classList.toggle("active", hasActiveWork);
};
SidePanelUI.prototype.toggleActivityPanel = function toggleActivityPanel(force) {
  const shouldOpen = typeof force === "boolean" ? force : !this.activityPanelOpen;
  this.activityPanelOpen = shouldOpen;
  if (this.elements.activityPanel) {
    this.elements.activityPanel.classList.toggle("open", shouldOpen);
    this.elements.activityPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
  }
  this.elements.activityToggleBtn?.classList.toggle("open", shouldOpen);
  this.elements.chatInterface?.classList.toggle("activity-open", shouldOpen);
  if (shouldOpen) {
    this.scrollToolLogToBottom();
  }
};
SidePanelUI.prototype.updateThinkingPanel = function updateThinkingPanel(thinking, isStreaming = false) {
  const panel = this.elements.thinkingPanel;
  if (!panel) return;
  const content = thinking ? thinking.trim() : "";
  if (content) {
    const cleaned = dedupeThinking(content);
    this.latestThinking = cleaned;
    panel.textContent = cleaned;
    panel.classList.remove("empty");
  } else {
    if (!isStreaming) {
      this.latestThinking = null;
    }
    panel.textContent = isStreaming ? "Thinking\u2026" : "No reasoning captured yet.";
    panel.classList.add("empty");
  }
  panel.classList.toggle("streaming", isStreaming);
};
SidePanelUI.prototype.resetActivityPanel = function resetActivityPanel() {
  if (this.elements.toolLog) {
    this.elements.toolLog.innerHTML = "";
  }
  if (this.elements.chatMessages) {
    const tree = this.elements.chatMessages.querySelector(".tool-tree");
    if (tree) tree.remove();
  }
  this.latestThinking = null;
  this.activeToolName = null;
  this.updateThinkingPanel(null, false);
  this.updateActivityToggle();
};
SidePanelUI.prototype.scrollToolLogToBottom = function scrollToolLogToBottom() {
  if (!this.elements.toolLog) return;
  this.elements.toolLog.scrollTop = this.elements.toolLog.scrollHeight;
};

// sidepanel/ui/panel-usage.ts
SidePanelUI.prototype.formatCurrency = function formatCurrency(amount, currency = "usd") {
  if (amount === null || amount === void 0) return "";
  const value = Number(amount) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase()
    }).format(value);
  } catch (error) {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
  }
};
SidePanelUI.prototype.formatShortDate = function formatShortDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};
SidePanelUI.prototype.formatTokenCount = function formatTokenCount(value) {
  if (!value || value <= 0) return "0";
  if (value >= 1e3) {
    const precision = value >= 1e4 ? 0 : 1;
    return `${(value / 1e3).toFixed(precision)}k`;
  }
  return `${Math.round(value)}`;
};
SidePanelUI.prototype.normalizeUsage = function normalizeUsage2(usage) {
  if (!usage) return null;
  const inputTokens = Math.max(0, usage.inputTokens || 0);
  const outputTokens = Math.max(0, usage.outputTokens || 0);
  const totalTokens = Math.max(0, usage.totalTokens || inputTokens + outputTokens);
  if (!inputTokens && !outputTokens && !totalTokens) return null;
  return { inputTokens, outputTokens, totalTokens };
};
SidePanelUI.prototype.buildUsageLabel = function buildUsageLabel(usage) {
  if (!usage) return "";
  const parts = [];
  if (usage.inputTokens) {
    parts.push(`${this.formatTokenCount(usage.inputTokens)} in`);
  }
  if (usage.outputTokens) {
    parts.push(`${this.formatTokenCount(usage.outputTokens)} out`);
  }
  if (!parts.length && usage.totalTokens) {
    parts.push(`${this.formatTokenCount(usage.totalTokens)} total`);
  }
  return parts.length ? `Tokens ${parts.join(" / ")}` : "";
};
SidePanelUI.prototype.buildMessageMeta = function buildMessageMeta(usage, modelLabel) {
  const segments = [];
  const model = modelLabel?.trim();
  if (model) {
    segments.push(model);
  }
  const usageLabel = this.buildUsageLabel(usage);
  if (usageLabel) {
    segments.push(usageLabel);
  }
  return segments.join(" \xB7 ");
};
SidePanelUI.prototype.estimateUsageFromContent = function estimateUsageFromContent(content) {
  if (!content) return null;
  const tokens = Math.ceil(content.length / 4);
  if (!tokens) return null;
  return {
    inputTokens: 0,
    outputTokens: tokens,
    totalTokens: tokens
  };
};
SidePanelUI.prototype.getActiveModelLabel = function getActiveModelLabel() {
  return this.elements.modelSelect?.value || this.configs[this.currentConfig]?.model || "";
};
SidePanelUI.prototype.updateUsageStats = function updateUsageStats(usage) {
  if (!usage) return;
  this.lastUsage = usage;
  this.sessionTokenTotals = {
    inputTokens: this.sessionTokenTotals.inputTokens + usage.inputTokens,
    outputTokens: this.sessionTokenTotals.outputTokens + usage.outputTokens,
    totalTokens: this.sessionTokenTotals.totalTokens + usage.totalTokens
  };
  this.updateActivityState();
};

// sidepanel/ui/panel-view.ts
SidePanelUI.prototype.switchView = function switchView(view) {
  if (!this.isAccessReady()) {
    this.updateAccessUI();
    return;
  }
  this.currentView = view;
  if (!this.elements.chatInterface || !this.elements.historyPanel) return;
  if (view === "history") {
    this.recordScrollPosition();
    this.elements.chatInterface.classList.add("hidden");
    this.elements.historyPanel.classList.remove("hidden");
    this.elements.viewHistoryBtn?.classList.add("active");
    this.elements.viewChatBtn?.classList.remove("active", "live-active");
  } else {
    this.elements.chatInterface.classList.remove("hidden");
    this.elements.historyPanel.classList.add("hidden");
    this.elements.viewChatBtn?.classList.add("active", "live-active");
    this.elements.viewHistoryBtn?.classList.remove("active");
    this.restoreScrollPosition();
  }
};
SidePanelUI.prototype.openSidebar = function openSidebar() {
  setSidebarOpen(this.elements, true);
};
SidePanelUI.prototype.closeSidebar = function closeSidebar() {
  setSidebarOpen(this.elements, false);
};
SidePanelUI.prototype.showRightPanel = function showRightPanel2(panelName) {
  showRightPanel(this.elements, panelName);
};
SidePanelUI.prototype.setNavActive = function setNavActive(navName) {
  updateNavActive(this.elements, navName);
};
SidePanelUI.prototype.openChatView = function openChatView() {
  this.settingsOpen = false;
  this.accessPanelVisible = false;
  this.showRightPanel(null);
  this.switchView("chat");
  this.setNavActive("chat");
  this.updateAccessUI();
};
SidePanelUI.prototype.openHistoryPanel = function openHistoryPanel() {
  this.settingsOpen = false;
  this.accessPanelVisible = false;
  this.openSidebar();
  this.showRightPanel("history");
  this.setNavActive("history");
  this.loadHistoryList();
  this.updateAccessUI();
};
SidePanelUI.prototype.openSettingsPanel = function openSettingsPanel() {
  this.settingsOpen = true;
  this.accessPanelVisible = false;
  this.openSidebar();
  this.showRightPanel("settings");
  this.switchSettingsTab(this.currentSettingsTab || "general");
  this.setNavActive("settings");
  this.updateAccessUI();
};
SidePanelUI.prototype.openAccountPanel = function openAccountPanel() {
  this.settingsOpen = false;
  this.accessPanelVisible = true;
  this.openSidebar();
  this.showRightPanel("account");
  this.setNavActive("account");
  this.updateAccessUI();
};
SidePanelUI.prototype.startNewSession = function startNewSession() {
  if (!this.isAccessReady()) {
    this.updateAccessUI();
    return;
  }
  this.displayHistory = [];
  this.contextHistory = [];
  this.sessionId = `session-${Date.now()}`;
  this.sessionStartedAt = Date.now();
  this.firstUserMessage = "";
  this.sessionTokensUsed = 0;
  this.lastUsage = null;
  this.sessionTokenTotals = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  };
  this.currentPlan = null;
  this.hidePlanDrawer();
  this.stopThinkingTimer?.();
  this.subagents.clear();
  this.activeAgent = "main";
  this.elements.chatMessages.innerHTML = "";
  this.toolCallViews.clear();
  this.updateChatEmptyState?.();
  this.resetActivityPanel();
  this.hideAgentNav();
  this.updateStatus("Ready for a new session", "success");
  this.switchView("chat");
  this.updateContextUsage();
  this.scrollToBottom({ force: true });
};

// sidepanel/ui/layout-loader.ts
var loadTemplate = async (path) => {
  try {
    const url = chrome.runtime.getURL(`sidepanel/templates/${path}`);
    console.log(`[LayoutLoader] Loading template: ${path} from ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${path} - Status: ${response.status}`);
    }
    const text = await response.text();
    console.log(`[LayoutLoader] Template loaded: ${path} (${text.length} chars)`);
    return text;
  } catch (error) {
    console.error(`[LayoutLoader] Error loading template ${path}:`, error);
    return `<div class="template-error" style="padding: 20px; color: #ff6b6b;">Failed to load: ${path}</div>`;
  }
};
var replaceWithHtml = (root, selector, html) => {
  const target = root.querySelector(selector);
  if (!target) {
    console.warn(`[LayoutLoader] Target not found: ${selector}`);
    return;
  }
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const element = template.content.firstElementChild;
  if (element) {
    target.replaceWith(element);
    console.log(`[LayoutLoader] Replaced: ${selector}`);
  } else {
    console.warn(`[LayoutLoader] No element created for: ${selector}`);
  }
};
var loadPanelLayout = async () => {
  console.log("[LayoutLoader] Starting layout load...");
  const appRoot = document.getElementById("appRoot");
  if (!appRoot) {
    console.error("[LayoutLoader] appRoot not found!");
    return;
  }
  try {
    console.log("[LayoutLoader] Loading templates...");
    const [
      sidebarShell,
      mainContent,
      historyPanel,
      settingsPanel,
      settingsGeneral,
      settingsProfiles,
      accountPanel,
      accountAuth,
      accountBilling,
      accountMain,
      tabSelector
    ] = await Promise.all([
      loadTemplate("sidebar-shell.html"),
      loadTemplate("main.html"),
      loadTemplate("panels/history.html"),
      loadTemplate("panels/settings.html"),
      loadTemplate("panels/settings-general.html"),
      loadTemplate("panels/settings-profiles.html"),
      loadTemplate("panels/account.html"),
      loadTemplate("panels/account-auth.html"),
      loadTemplate("panels/account-billing.html"),
      loadTemplate("panels/account-main.html"),
      loadTemplate("tab-selector.html")
    ]);
    console.log("[LayoutLoader] All templates loaded, building DOM...");
    appRoot.className = "app-container";
    appRoot.innerHTML = "";
    const appContainer = appRoot;
    appContainer.insertAdjacentHTML("beforeend", sidebarShell.trim());
    console.log("[LayoutLoader] Sidebar shell inserted");
    appContainer.insertAdjacentHTML("beforeend", mainContent.trim());
    console.log("[LayoutLoader] Main content inserted");
    const rightPanels = appContainer.querySelector("#rightPanelPanels");
    if (rightPanels) {
      rightPanels.insertAdjacentHTML("beforeend", (historyPanel + settingsPanel + accountPanel).trim());
      console.log("[LayoutLoader] Right panels inserted");
    } else {
      console.warn("[LayoutLoader] #rightPanelPanels not found");
    }
    replaceWithHtml(appContainer, "#settingsTabGeneral", settingsGeneral);
    replaceWithHtml(appContainer, "#settingsTabProfiles", settingsProfiles);
    replaceWithHtml(appContainer, "#authPanel", accountAuth);
    replaceWithHtml(appContainer, "#billingPanel", accountBilling);
    replaceWithHtml(appContainer, "#accountPanel", accountMain);
    const modalRoot = document.getElementById("modalRoot");
    if (modalRoot) {
      modalRoot.innerHTML = tabSelector;
      console.log("[LayoutLoader] Modal root setup complete");
    }
    console.log("[LayoutLoader] Layout load complete!");
  } catch (error) {
    console.error("[LayoutLoader] Critical error loading layout:", error);
    appRoot.innerHTML = `
      <div style="padding: 20px; color: #ff6b6b; text-align: center;">
        <h3>Failed to load extension UI</h3>
        <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        <p>Please try reloading the extension.</p>
      </div>
    `;
  }
};

// sidepanel/panel.ts
var init2 = async () => {
  await loadPanelLayout();
  const ui = new SidePanelUI();
  window.sidePanelUI = ui;
};
void init2();
//# sourceMappingURL=panel.js.map
