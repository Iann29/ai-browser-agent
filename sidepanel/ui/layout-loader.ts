const loadTemplate = async (path: string): Promise<string> => {
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
    // Return a fallback/error message instead of failing completely
    return `<div class="template-error" style="padding: 20px; color: #ff6b6b;">Failed to load: ${path}</div>`;
  }
};

const replaceWithHtml = (root: HTMLElement, selector: string, html: string) => {
  const target = root.querySelector(selector);
  if (!target) {
    console.warn(`[LayoutLoader] Target not found: ${selector}`);
    return;
  }
  
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const element = template.content.firstElementChild;
  
  if (element) {
    target.replaceWith(element);
    console.log(`[LayoutLoader] Replaced: ${selector}`);
  } else {
    console.warn(`[LayoutLoader] No element created for: ${selector}`);
  }
};

export const loadPanelLayout = async (): Promise<void> => {
  console.log('[LayoutLoader] Starting layout load...');
  
  const appRoot = document.getElementById('appRoot');
  if (!appRoot) {
    console.error('[LayoutLoader] appRoot not found!');
    return;
  }

  try {
    console.log('[LayoutLoader] Loading templates...');
    
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
      tabSelector,
    ] = await Promise.all([
      loadTemplate('sidebar-shell.html'),
      loadTemplate('main.html'),
      loadTemplate('panels/history.html'),
      loadTemplate('panels/settings.html'),
      loadTemplate('panels/settings-general.html'),
      loadTemplate('panels/settings-profiles.html'),
      loadTemplate('panels/account.html'),
      loadTemplate('panels/account-auth.html'),
      loadTemplate('panels/account-billing.html'),
      loadTemplate('panels/account-main.html'),
      loadTemplate('tab-selector.html'),
    ]);

    console.log('[LayoutLoader] All templates loaded, building DOM...');

    appRoot.className = 'app-container';
    appRoot.innerHTML = '';
    const appContainer = appRoot as HTMLElement;

    // Insert main structure
    appContainer.insertAdjacentHTML('beforeend', sidebarShell.trim());
    console.log('[LayoutLoader] Sidebar shell inserted');
    
    appContainer.insertAdjacentHTML('beforeend', mainContent.trim());
    console.log('[LayoutLoader] Main content inserted');

    // Insert panels
    const rightPanels = appContainer.querySelector('#rightPanelPanels') as HTMLElement | null;
    if (rightPanels) {
      rightPanels.insertAdjacentHTML('beforeend', (historyPanel + settingsPanel + accountPanel).trim());
      console.log('[LayoutLoader] Right panels inserted');
    } else {
      console.warn('[LayoutLoader] #rightPanelPanels not found');
    }

    // Replace placeholders
    replaceWithHtml(appContainer, '#settingsTabGeneral', settingsGeneral);
    replaceWithHtml(appContainer, '#settingsTabProfiles', settingsProfiles);
    replaceWithHtml(appContainer, '#authPanel', accountAuth);
    replaceWithHtml(appContainer, '#billingPanel', accountBilling);
    replaceWithHtml(appContainer, '#accountPanel', accountMain);

    // Setup modal root
    const modalRoot = document.getElementById('modalRoot');
    if (modalRoot) {
      modalRoot.innerHTML = tabSelector;
      console.log('[LayoutLoader] Modal root setup complete');
    }

    console.log('[LayoutLoader] Layout load complete!');
  } catch (error) {
    console.error('[LayoutLoader] Critical error loading layout:', error);
    // Show error in UI
    appRoot.innerHTML = `
      <div style="padding: 20px; color: #ff6b6b; text-align: center;">
        <h3>Failed to load extension UI</h3>
        <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        <p>Please try reloading the extension.</p>
      </div>
    `;
  }
};
