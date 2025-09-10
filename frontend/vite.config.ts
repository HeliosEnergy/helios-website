import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 9725,
		host: true,
		proxy: {
			'/itu-proxy': {
				target: 'https://bbmaps.itu.int',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/itu-proxy/, ''),
				secure: false
			}
		}
	},
})