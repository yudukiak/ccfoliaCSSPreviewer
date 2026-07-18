import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchText: (url: string) =>
    ipcRenderer.invoke('fetch-text', url) as Promise<string>,
  openDevTools: () => ipcRenderer.invoke('open-devtools') as Promise<void>,
  openLinkDevTools: () =>
    ipcRenderer.invoke('open-link-devtools') as Promise<void>,
  onUpdateReady: (callback: (payload: { version: string }) => void) => {
    const listener = (
      _event: IpcRendererEvent,
      payload: { version: string },
    ) => {
      callback(payload);
    };
    ipcRenderer.on('update:ready', listener);
    return () => {
      ipcRenderer.removeListener('update:ready', listener);
    };
  },
  installUpdate: () => ipcRenderer.invoke('update:install') as Promise<void>,
});
