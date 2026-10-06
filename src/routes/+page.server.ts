import { SITE_URL } from '$lib/constants.js';
import stories from '../data/stories.json';
import { screenshotFor } from './screenshots';

// Turn a story link into an absolute URL we can fetch at build time.
function absoluteUrl(url: string): string | undefined {
	try {
		return new URL(url, `${SITE_URL}/`).href;
	} catch {
		return undefined;
	}
}

// Pull the og:image (or twitter:image) out of a page's HTML, resolved against the page URL.
function findShareImage(html: string, pageUrl: string): string | undefined {
	for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
		const key = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1].toLowerCase();
		if (key !== 'og:image' && key !== 'twitter:image') continue;

		const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
		if (content) return new URL(content, pageUrl).href;
	}
	return undefined;
}

async function fetchShareImage(url: string): Promise<string | undefined> {
	const pageUrl = absoluteUrl(url);
	if (!pageUrl) return undefined;

	try {
		const response = await fetch(pageUrl, { signal: AbortSignal.timeout(5000) });
		if (!response.ok) return undefined;
		return findShareImage(await response.text(), response.url);
	} catch {
		// Unreachable or slow sites just get no image rather than failing the build.
		return undefined;
	}
}

// Runs at build time (the site is prerendered), so these fetches happen once per deploy.
export async function load() {
	const fallbackImages: Record<string, string> = {};

	await Promise.all(
		stories
			.filter((story) => !screenshotFor(story.image))
			.map(async (story) => {
				const image = await fetchShareImage(story.url);
				if (image) fallbackImages[story.url] = image;
			})
	);

	return { fallbackImages };
}
