import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Addons-maker/' : '/',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
