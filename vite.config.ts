import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    // Local-dev only: Vite serves the frontend on 5173; API routes under
    // /api are Vercel serverless functions, which only run under
    // `vercel dev` (started separately on 3000). This just forwards them
    // through so the app can be exercised locally with one `npm run dev`.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
