import { defineConfig } from 'astro/config';

// Replace <your-project>.pages.dev with your actual Cloudflare Pages domain.
// If you add a custom domain, update site accordingly.
export default defineConfig({
  site: 'https://<your-project>.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
