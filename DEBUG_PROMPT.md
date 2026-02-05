# 🔍 DEBUG PROMPT - AI Browser Extension

## Problema
A extensão carrega (sidepanel abre), os templates HTML são carregados com sucesso (verificado no console), mas o conteúdo não é renderizado na tela - fica escuro/preto.

## Logs do Console (Sucesso no carregamento)
```
[LayoutLoader] Starting layout load...
[LayoutLoader] Loading templates...
[LayoutLoader] Template loaded: sidebar-shell.html (4030 chars)
[LayoutLoader] Template loaded: main.html (12587 chars)
[LayoutLoader] Template loaded: panels/history.html (482 chars)
[LayoutLoader] Template loaded: panels/settings.html (741 chars)
[LayoutLoader] Template loaded: panels/settings-general.html (7636 chars)
[LayoutLoader] Template loaded: panels/settings-profiles.html (13670 chars)
[LayoutLoader] Template loaded: panels/account-auth.html (3672 chars)
[LayoutLoader] Template loaded: panels/account-billing.html (1999 chars)
[LayoutLoader] Template loaded: panels/account.html (346 chars)
[LayoutLoader] Template loaded: panels/account-main.html (6250 chars)
[LayoutLoader] Template loaded: tab-selector.html (1963 chars)
[LayoutLoader] All templates loaded, building DOM...
[LayoutLoader] Sidebar shell inserted
[LayoutLoader] Main content inserted
[LayoutLoader] Right panels inserted
[LayoutLoader] Replaced: #settingsTabGeneral
[LayoutLoader] Replaced: #settingsTabProfiles
[LayoutLoader] Replaced: #authPanel
[LayoutLoader] Replaced: #billingPanel
[LayoutLoader] Replaced: #accountPanel
[LayoutLoader] Modal root setup complete
[LayoutLoader] Layout load complete!
[parchi] init() starting...
[parchi] loadSettings done...
[parchi] init() complete
```

## Estrutura do Projeto

### panel.html
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>AI Browser</title>
        <link rel="stylesheet" href="panel.css" />
    </head>
    <body>
        <div id="appRoot" class="app-container" style="min-height: 100vh; background: hsl(30, 5%, 10.5%);">
            <div style="padding: 20px; color: #666;">Loading...</div>
        </div>
        <div id="modalRoot"></div>
        <script src="panel.js" type="module"></script>
    </body>
</html>
```

### panel.css (importa outros CSS)
```css
@import url("./styles/base.css");
@import url("./styles/layout.css");
@import url("./styles/chat.css");
@import url("./styles/composer.css");
@import url("./styles/tools.css");
@import url("./styles/panels.css");
@import url("./styles/utilities.css");
```

### sidebar-shell.html (template carregado)
```html
<aside id="sidebar" class="sidebar">
    <div class="sidebar-header">
        <div class="brand">
            <span class="mascot" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="18" height="18">...</svg>
            </span>
            <span class="brand-name">AI Browser</span>
        </div>
        ...
    </div>
</aside>
```

### main.html (template carregado)
```html
<main class="main-content">
    <div id="chatInterface" class="chat-area">
        <div id="chatEmptyState" class="chat-empty-state">
            <div class="chat-empty-orb"></div>
            <div class="chat-empty-title">Ready when you are</div>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
    </div>
    ...
</main>
```

## CSS Relevante (base.css)
```css
:root {
  --background: hsl(30, 5%, 10.5%);
  --foreground: #e8e4dd;
  --card: hsl(30, 5%, 12%);
  --border: hsl(30, 5%, 20%);
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  background: var(--background);
  color: var(--foreground);
}

#appRoot {
  height: 100%;
  width: 100%;
}
```

## CSS Relevante (layout.css)
```css
.app-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  order: 2;
}

.sidebar.closed {
  transform: translateX(100%);
  position: absolute;
  right: 0;
  z-index: 50;
}

.main-content {
  order: 1;
}
```

## Código de Inserção (layout-loader.ts)
```typescript
appContainer.insertAdjacentHTML('beforeend', sidebarShell.trim());
appContainer.insertAdjacentHTML('beforeend', mainContent.trim());

const rightPanels = appContainer.querySelector('#rightPanelPanels');
rightPanels?.insertAdjacentHTML('beforeend', (historyPanel + settingsPanel + accountPanel).trim());
```

## Observações
1. Templates são carregados via fetch() com sucesso
2. DOM é construído dinamicamente
3. init() completa sem erros
4. Tela fica escura/preto
5. Nenhum erro no console

## Possíveis Causas
1. CSS pode estar escondendo elementos (display: none, visibility: hidden, opacity: 0)
2. Altura/largura dos containers pode ser 0
3. Z-index ou stacking context issues
4. Sidebar pode estar com classe 'closed' por padrão
5. Cor de fundo escura (--background) pode estar cobrindo tudo

## O que precisamos descobrir
1. Por que o conteúdo não aparece se os templates foram inseridos?
2. Qual elemento está cobrindo a tela?
3. Os elementos estão no DOM? (verificar com DevTools Elements)
4. As classes CSS estão aplicadas corretamente?

## Para Reproduzir
1. Carregar extensão no Chrome
2. Abrir sidepanel
3. Abrir DevTools (F12)
4. Ver console - logs aparecem
5. Tela fica escura

## Solicitação de Ajuda
Analisar:
1. Os templates HTML carregados
2. O CSS aplicado
3. A estrutura DOM criada
4. Identificar por que o conteúdo não é visível
5. Sugerir correções ou diagnósticos adicionais
