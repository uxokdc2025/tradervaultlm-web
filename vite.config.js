import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Seamless.ai homepage — Vite + React.
// The .jsx component modules use the classic in-browser prototype style
// (React used as a global-ish namespace), so allow JSX in .jsx files.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
