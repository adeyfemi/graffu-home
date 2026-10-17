import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/top-39': {
				target: 'https://top-39.netlify.app',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/top-39/, '')
			},
			'/club-v-country': {
				target: 'https://club-v-country.netlify.app',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/club-v-country/, '')
			}
		}
	}
});
