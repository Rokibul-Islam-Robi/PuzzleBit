import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three', 'gsap'],
          audio: ['howler']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['three', 'gsap', 'howler']
  },
  
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}); 