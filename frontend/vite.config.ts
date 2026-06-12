import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiTarget =
      env.VITE_API_URL ||
      env.VITE_API_BASE_URL ||
      env.REACT_APP_API_URL ||
      env.API_BASE_URL ||
      'http://127.0.0.1:8000';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: apiTarget.replace(/\/api\/?$/, ''),
            changeOrigin: true,
          },
          '/media': {
            target: apiTarget.replace(/\/api\/?$/, ''),
            changeOrigin: true,
          },
          '/static': {
            target: apiTarget.replace(/\/api\/?$/, ''),
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
