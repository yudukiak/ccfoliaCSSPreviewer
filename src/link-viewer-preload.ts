import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("linkViewer", {
  onNavigate: (callback: (url: string) => void) => {
    const listener = (_event: IpcRendererEvent, url: string) => {
      callback(url);
    };
    ipcRenderer.on("link-viewer:navigate", listener);
    return () => {
      ipcRenderer.removeListener("link-viewer:navigate", listener);
    };
  },
});
