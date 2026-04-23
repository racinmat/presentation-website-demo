import { defineConfig } from 'astro/config';

// Set site to your actual Cloudflare Pages URL or custom domain after first deploy.
export default defineConfig({
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
