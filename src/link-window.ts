import { BrowserWindow, ipcMain, type WebContents } from 'electron';
import path from 'node:path';

const ALLOWED_LINK_HOSTS = new Set([
  'yudukiak.github.io',
  'ydk.vc',
  'ccfolia.com',
]);

const DEFAULT_LINK_URL = 'https://ydk.vc';

let linkWindow: BrowserWindow | null = null;
let linkWindowReady = false;
let pendingLinkUrl: string | null = null;
let pendingOpenLinkDevTools = false;

function isAllowedLinkUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' && ALLOWED_LINK_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
}

function sendLinkNavigate(url: string) {
  if (!linkWindow || linkWindow.isDestroyed()) return;

  if (linkWindowReady) {
    linkWindow.webContents.send('link-viewer:navigate', url);
    return;
  }

  pendingLinkUrl = url;
}

function focusLinkWindowDevTools() {
  if (!linkWindow || linkWindow.isDestroyed()) return;
  linkWindow.webContents.openDevTools();
  linkWindow.focus();
}

function attachLinkWebviewGuards(webContents: WebContents) {
  webContents.on('will-navigate', (event, navUrl) => {
    if (!isAllowedLinkUrl(navUrl)) {
      event.preventDefault();
    }
  });

  webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedLinkUrl(url)) {
      sendLinkNavigate(url);
    }
    return { action: 'deny' };
  });
}

export function openOrFocusLinkWindow(url: string) {
  if (!isAllowedLinkUrl(url)) return;

  if (linkWindow && !linkWindow.isDestroyed()) {
    sendLinkNavigate(url);
    linkWindow.focus();
    return;
  }

  linkWindowReady = false;
  pendingLinkUrl = url;

  linkWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      preload: path.join(__dirname, 'link-viewer-preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  linkWindow.setMenu(null);

  linkWindow.webContents.on('did-attach-webview', (_event, webContents) => {
    attachLinkWebviewGuards(webContents);
  });

  linkWindow.webContents.on('did-finish-load', () => {
    linkWindowReady = true;
    if (pendingLinkUrl && linkWindow && !linkWindow.isDestroyed()) {
      linkWindow.webContents.send('link-viewer:navigate', pendingLinkUrl);
      pendingLinkUrl = null;
    }
    if (pendingOpenLinkDevTools) {
      pendingOpenLinkDevTools = false;
      focusLinkWindowDevTools();
    }
  });

  linkWindow.on('closed', () => {
    linkWindow = null;
    linkWindowReady = false;
    pendingLinkUrl = null;
    pendingOpenLinkDevTools = false;
  });

  if (LINK_VIEWER_VITE_DEV_SERVER_URL) {
    void linkWindow.loadURL(
      new URL('link_viewer.html', `${LINK_VIEWER_VITE_DEV_SERVER_URL}/`).href,
    );
  } else {
    void linkWindow.loadFile(
      path.join(
        __dirname,
        `../renderer/${LINK_VIEWER_VITE_NAME}/link_viewer.html`,
      ),
    );
  }
}

export function openLinkWindowDevTools() {
  if (linkWindow && !linkWindow.isDestroyed()) {
    if (linkWindowReady) {
      focusLinkWindowDevTools();
      return;
    }
    pendingOpenLinkDevTools = true;
    return;
  }

  pendingOpenLinkDevTools = true;
  openOrFocusLinkWindow(DEFAULT_LINK_URL);
}

export function registerLinkWindowIpc() {
  ipcMain.handle('open-link-devtools', () => {
    openLinkWindowDevTools();
  });
}
