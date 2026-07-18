import {
  app,
  BrowserWindow,
  ipcMain,
  net,
  type WebContents,
} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

ipcMain.handle('fetch-text', async (_event, url: string) => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    throw new Error('Invalid URL');
  }

  const response = await net.fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${url}`);
  }

  return response.text();
});

ipcMain.handle('open-devtools', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.webContents.openDevTools();
});

ipcMain.handle('open-link-devtools', () => {
  openLinkWindowDevTools();
});

const ALLOWED_LINK_HOSTS = new Set([
  'yudukiak.github.io',
  'ydk.vc',
  'ccfolia.com',
]);

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

let linkWindow: BrowserWindow | null = null;
let linkWindowReady = false;
let pendingLinkUrl: string | null = null;
let pendingOpenLinkDevTools = false;

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

function openLinkWindowDevTools() {
  if (linkWindow && !linkWindow.isDestroyed()) {
    if (linkWindowReady) {
      focusLinkWindowDevTools();
      return;
    }
    pendingOpenLinkDevTools = true;
    return;
  }

  pendingOpenLinkDevTools = true;
  openOrFocusLinkWindow('https://ydk.vc');
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

function openOrFocusLinkWindow(url: string) {
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
      new URL("link_viewer.html", `${LINK_VIEWER_VITE_DEV_SERVER_URL}/`).href,
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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.setMenu(null);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openOrFocusLinkWindow(url);
    return { action: 'deny' };
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// <webview> タグが適用される前に発火するイベント
app.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    // <webview> タグにミュートを適用
    contents.setAudioMuted(true);
  }
});
