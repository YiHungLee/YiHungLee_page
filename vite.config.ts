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
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // React 核心
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              // 圖示庫
              'icons': ['lucide-react', '@phosphor-icons/react'],
              // Markdown 處理
              'markdown': ['marked', 'gray-matter'],
            },
          },
        },
      },
});
