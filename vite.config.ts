import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { markdownPlugin } from './plugins/vite-plugin-markdown';

export default defineConfig({
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), markdownPlugin()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
