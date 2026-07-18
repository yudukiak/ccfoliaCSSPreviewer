// Electron Forge の renderer 本体設定。
// ESM-only プラグイン対応のため .mts。

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { version } = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
) as { version: string };

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-title-version',
      transformIndexHtml(html) {
        return html.replace(
          /<title>CCFOLIA CSS Previewer<\/title>/,
          `<title>CCFOLIA CSS Previewer v${version}</title>`,
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
