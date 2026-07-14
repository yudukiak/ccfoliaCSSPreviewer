/// <reference types="vite/client" />

export interface ElectronWebViewElement extends HTMLElement {
  src: string;
  insertCSS: (css: string) => Promise<string>;
  removeInsertedCSS: (key: string) => Promise<void>;
  executeJavaScript: (
    code: string,
    userGesture?: boolean,
  ) => Promise<unknown>;
}

declare global {
  interface Window {
    electronAPI: {
      fetchText: (url: string) => Promise<string>;
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
