import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import { VitePWA } from 'vite-plugin-pwa'

// 读取 package.json 中的版本号
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const version = packageJson.version

export default defineConfig({
  root: 'src/renderer',
  base: './',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@': resolve(__dirname, 'src/renderer/src')
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Novel Forge',
        short_name: 'NovelForge',
        description: 'Next Generation AI Novel Workspace',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // 更新 CSP：
        // - 允许连接 GitHub API
        // - 放宽 connect-src，支持访问任意后端主机（方便局域网 / 服务器部署）
        return html.replace(
          /<meta\s+http-equiv=["']Content-Security-Policy["'].*?>/i,
          '<meta http-equiv="Content-Security-Policy" content="' +
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' data: https://fonts.gstatic.com; " +
          "connect-src * https://api.github.com;" +
          '">'
        )
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:20489',
        changeOrigin: true,
      },
      '/imgs': {
        target: 'http://127.0.0.1:20489',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) return 'element-plus';
            if (id.includes('codemirror') || id.includes('@codemirror')) return 'codemirror';
            if (id.includes('vue') || id.includes('pinia')) return 'vue-vendor';
            if (id.includes('cytoscape')) return 'cytoscape';
            if (id.includes('mermaid')) return 'mermaid';
            return 'vendor'; // 其他所有依赖打入 vendor
          }
        }
      }
    }
  }
})
