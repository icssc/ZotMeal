import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          devOptions: {
              enabled: true
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,png}']
          },

          manifest: {
              name: 'Zotmeal',
              description: 'zotmeal',
              theme_color: '#FBFBFB',
              icons: [
                  {
                      src: 'imageAssets/FaviconSet/android-chrome-192x192.png',
                      sizes: '192x192',
                      type: 'image/png'
                  },
                  {
                      src: 'imageAssets/FaviconSet/android-chrome-512x512.png',
                      sizes: '512x512',
                      type: 'image/png'
                  },
                  {
                      src: 'imageAssets/FaviconSet/android-chrome-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: "any"
                  },
                  {
                      src: 'imageAssets/FaviconSet/android-chrome-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: "maskable"
                  }
              ]
          }
      })
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
