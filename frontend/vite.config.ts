import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to the backend server
      '/api': {
        target: 'http://localhost:5001', // Updated backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Optional: Set to false if backend uses http
        // Optional: Rewrite path if necessary (usually not needed if backend expects /api prefix)
        // rewrite: (path) => path.replace(/^\/api/, '') 
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // console.log('Sending Request to the Target:', req.method, req.url);
            // console.log(' -> Target Path:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    },
    allowedHosts: [
      '2f7b-202-142-155-154.ngrok-free.app',
      '.ngrok-free.app'
    ],
    host: true,
    // port: 5173
  }
})
