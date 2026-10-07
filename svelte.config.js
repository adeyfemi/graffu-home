import adapter from '@sveltejs/adapter-static';
import { relative, sep } from 'node:path';
import { readFileSync } from 'node:fs';

// Story paths like /top-39 are proxied to other sites by netlify.toml redirects,
// so they don't exist as routes here. Skip them when prerendering.
const proxiedPaths = JSON.parse(readFileSync(new URL('./src/data/stories.json', import.meta.url), 'utf8'))
	.map((story) => story.url)
	.filter((url) => url.startsWith('/') && !url.startsWith('//'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: { base: process.env.BASE_PATH || '' },
		prerender: {
			handleHttpError: ({ path, status, message }) => {
				const base = process.env.BASE_PATH || '';
				if (status === 404 && proxiedPaths.some((p) => path === base + p || path.startsWith(base + p + '/'))) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
