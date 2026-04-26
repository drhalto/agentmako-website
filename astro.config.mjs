import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://agentmako.drhalto.com',
  trailingSlash: 'ignore',
  build: {
    // 'preserve' = file pages emit foo.html, index.astro emits foo/index.html.
    // Matches our existing URL shape: /docs/foo.html for leaves, /docs/ for hubs.
    format: 'preserve',
  },
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const hubPaths = new Set(['/blog', '/docs', '/docs/concepts', '/docs/recipes', '/docs/tools']);
        const hasExtension = /\.[^/]+$/.test(url.pathname);

        if (url.pathname !== '/' && !hasExtension) {
          if (hubPaths.has(url.pathname)) {
            url.pathname += '/';
          } else {
            url.pathname += '.html';
          }
        }

        item.url = url.toString();
        return item;
      },
    }),
  ],
});
