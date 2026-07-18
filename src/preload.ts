import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchText: (url: string) =>
    ipcRenderer.invoke('fetch-text', url) as Promise<string>,
  openDevTools: () => ipcRenderer.invoke('open-devtools') as Promise<void>,
  openLinkDevTools: () =>
    ipcRenderer.invoke('open-link-devtools') as Promise<void>,
});
