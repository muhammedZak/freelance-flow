import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
});
