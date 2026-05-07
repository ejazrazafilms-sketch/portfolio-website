import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        work: resolve('work.html'),
        commercial: resolve('commercial.html')
      }
    }
  }
});
