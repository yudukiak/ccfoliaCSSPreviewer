import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchText: (url: string) => ipcRenderer.invoke('fetch-text', url) as Promise<string>,
});
