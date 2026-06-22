import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    watch: { usePolling: true },
    open: true ,
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,
        rewrite: (path) => path,  // 保留 /api 前缀
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // SSE 请求：确保流式传输不被缓存
            if (req.headers.accept === 'text/event-stream') {
              proxyReq.setHeader('Accept', 'text/event-stream')
              proxyReq.setHeader('Cache-Control', 'no-cache')
            }
          })
        }
      }
    } 
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
