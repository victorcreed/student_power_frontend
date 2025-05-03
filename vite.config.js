import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': {},
      'import.meta.env.REACT_APP_API_BASE_URL': JSON.stringify(env.REACT_APP_API_BASE_URL || ''),
      'import.meta.env.REACT_APP_AUTH_SIGNUP_ENDPOINT': JSON.stringify(env.REACT_APP_AUTH_SIGNUP_ENDPOINT || ''),
      'import.meta.env.REACT_APP_ENVIRONMENT': JSON.stringify(env.REACT_APP_ENVIRONMENT || mode)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom']
          }
        }
      }
    }
  };
});
