import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: (filePath) => {
        const isDatabaseFile =
          filePath.endsWith('/db.json') || filePath.endsWith('\\db.json');

        const isSeedFile =
          filePath.endsWith('/db.seed.json') ||
          filePath.endsWith('\\db.seed.json');

        return isDatabaseFile || isSeedFile;
      },
    },
  },
});
