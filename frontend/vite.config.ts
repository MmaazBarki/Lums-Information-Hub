import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '2f7b-202-142-155-154.ngrok-free.app',
      // Allow any subdomain on ngrok-free.app
      '.ngrok-free.app'
    ],
    // Allow connections from any IP address
    host: true,
    // You can uncomment the following if you need to specify a port
    // port: 5173
  }
})
