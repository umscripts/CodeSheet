import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set the base path for your application; adjust if using a subdirectory
  build: {
    outDir: 'dist', // Make sure this matches your Netlify publish directory
  },
  server: {
    port: 5173, // Specify the port for local development
  },
});
