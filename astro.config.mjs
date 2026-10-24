import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
    port: 4321,
  },
  // La verificación de origen se implementa en `src/middleware.ts` porque la
  // integrada compara contra una URL sin puerto en el adapter Node.
  security: {
    checkOrigin: false,
  },
  devToolbar: {
    enabled: false,
  },
});
