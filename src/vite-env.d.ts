/// <reference types="vite/client" />

export interface ElectronWebViewElement extends HTMLElement {
  src: string;
  insertCSS: (css: string) => Promise<string>;
  removeInsertedCSS: (key: string) => Promise<void>;
  executeJavaScript: (
    code: string,
    userGesture?: boolean,
  ) => Promise<unknown>;
  openDevTools: () => void;
}

declare global {
  const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
  const MAIN_WINDOW_VITE_NAME: string;
  const LINK_VIEWER_VITE_DEV_SERVER_URL: string;
  const LINK_VIEWER_VITE_NAME: string;

  interface Window {
    electronAPI: {
      fetchText: (url: string) => Promise<string>;
      openDevTools: () => Promise<void>;
      openLinkDevTools: () => Promise<void>;
      onUpdateReady: (
        callback: (payload: { version: string }) => void,
      ) => () => void;
      installUpdate: () => Promise<void>;
    };
    linkViewer: {
      onNavigate: (callback: (url: string) => void) => () => void;
    };
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<ElectronWebViewElement> & {
          src?: string;
          partition?: string;
          allowpopups?: string | boolean;
        },
        ElectronWebViewElement
      >;
    }
  }
}

export {};
