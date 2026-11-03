import { readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { defineConfig } from 'vite';

// Relative base so the built site works from any sub-path (GitHub Pages, OSS, nginx sub-dir, file server).
export default defineConfig({
  base: './',
  define: {
    __MEDIA_BUILD__: JSON.stringify(randomUUID()),
    __MEDIA_FILES__: JSON.stringify(readdirSync(new URL('./public/', import.meta.url), { recursive: true })
      .filter(file => file.endsWith('.mp4')).map(file => file.replaceAll('\\', '/')).sort()),
  },
  server: { port: 5173, host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 800,
  },
});
