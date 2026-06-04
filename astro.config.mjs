// @ts-check
import { defineConfig, envField } from 'astro/config'

import icon from 'astro-icon'

import cloudflare from '@astrojs/cloudflare'

import sitemap from '@astrojs/sitemap';

import playformCompress from '@playform/compress'

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.darwindelgado.com',
  integrations: [
    icon({
      include: {
        carbon: [
          'calendar',
          'location',
          'launch',
          'email',
          'logo-github',
          'logo-linkedin',
          'attachment',
          'document-pdf',
          'sun',
          'moon',
          'logo-medium',
          'information-filled'
        ],
      },
    }),
    sitemap(),
    react(),
    playformCompress()
  ],
  build: {
    inlineStylesheets: 'always',
  },
  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        context: 'server',
        access: "secret",
        default: ''
      }),
      WAKATIME_UUID: envField.string({
        context: 'server',
        access: "secret",
        default: ''
      }),
    },
  },
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      experimental: { remoteBindings: true },
    },
    imageService: 'compile',
  }),
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      // @ts-ignore
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },

    plugins: [tailwindcss()],
  },
})