import { fileURLToPath, resolve } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import reactRefresh from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import { routeBuilderPlugin } from 'vite-plugin-route-builder'
import tsconfigPaths from 'vite-tsconfig-paths'

import PKG from './package.json'

const ROOT = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
      hotKeys: ['altKey'],
    }),
    reactRefresh(),
    tsconfigPaths(),
    checker({
      typescript: true,
      enableBuild: true,
    }),
    tailwindcss(),
    routeBuilderPlugin({
      pagePattern: `${resolve(ROOT, './src/pages')}/**/*.tsx`,
      outputPath: `${resolve(ROOT, './src/generated-routes.ts')}`,
      enableInDev: true,
    }),
  ],
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  optimizeDeps: {
    exclude: ['@vitejs/plugin-react'],
  },
  define: {
    APP_DEV_CWD: JSON.stringify(process.cwd()),
    APP_NAME: JSON.stringify(PKG.name),
  },
})
