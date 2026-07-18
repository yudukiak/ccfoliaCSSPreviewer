import {
  app,
  autoUpdater,
  BrowserWindow,
  ipcMain,
} from 'electron';

const GITHUB_OWNER = 'yudukiak';
const GITHUB_REPO = 'ccfoliaCSSPreviewer';

let mainWindowRef: BrowserWindow | null = null;
let updateReadyVersion: string | null = null;
let autoUpdateInitialized = false;

function supportsAutoUpdate(): boolean {
  return (
    app.isPackaged &&
    (process.platform === 'win32' || process.platform === 'darwin')
  );
}

function getFeedUrl(): string {
  return `https://update.electronjs.org/${GITHUB_OWNER}/${GITHUB_REPO}/${process.platform}/${app.getVersion()}`;
}

function notifyUpdateReady(version: string) {
  updateReadyVersion = version;
  const win =
    mainWindowRef && !mainWindowRef.isDestroyed()
      ? mainWindowRef
      : BrowserWindow.getAllWindows()[0];
  if (win && !win.isDestroyed()) {
    win.webContents.send('update:ready', { version });
  }
}

export function registerAutoUpdateIpc() {
  ipcMain.handle('update:install', () => {
    if (!supportsAutoUpdate()) return;
    autoUpdater.quitAndInstall();
  });
}

export function initAutoUpdate(mainWindow: BrowserWindow) {
  mainWindowRef = mainWindow;
  mainWindow.on('closed', () => {
    if (mainWindowRef === mainWindow) {
      mainWindowRef = null;
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (updateReadyVersion) {
      notifyUpdateReady(updateReadyVersion);
    }
  });

  if (!supportsAutoUpdate() || autoUpdateInitialized) return;
  autoUpdateInitialized = true;

  try {
    autoUpdater.setFeedURL({ url: getFeedUrl() });
  } catch (error) {
    console.error('[auto-update] setFeedURL failed', error);
    return;
  }

  autoUpdater.on('error', (error) => {
    console.error('[auto-update] error', error);
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('[auto-update] checking for update');
  });

  autoUpdater.on('update-available', () => {
    console.log('[auto-update] update available, downloading in background');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[auto-update] update not available');
  });

  autoUpdater.on('update-downloaded', (_event, _releaseNotes, releaseName) => {
    const version =
      typeof releaseName === 'string' && releaseName.length > 0
        ? releaseName
        : '新しいバージョン';
    console.log('[auto-update] update downloaded', version);
    notifyUpdateReady(version);
  });

  try {
    autoUpdater.checkForUpdates();
  } catch (error) {
    console.error('[auto-update] checkForUpdates failed', error);
  }
}
