<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { SITE_URL } from '$lib/constants.js';
	import stories from '../data/stories.json';

	// Site-relative URLs ("/club-vs-country") get the base path; anything else is left as-is.
	function hrefFor(url: string): string {
		return url.startsWith('/') && !url.startsWith('//') ? resolve(url as Pathname) : url;
	}

	const title = 'GRAFFU — Visual stories that simply explain data';
	const description = 'Visual stories that simply explain data.';
	const canonical = `${SITE_URL}/`;
	const ogImage = `${SITE_URL}/og-club-vs-country.jpg`;

	// Escape `<` so the serialized data can never break out of the <script> tag.
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'GRAFFU',
		url: `${SITE_URL}/`,
		description
	}).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="GRAFFU" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${jsonLd}</scr` + `ipt>`}
</svelte:head>

<main class="story-list">
	<h1 class="visually-hidden">Stories</h1>
	<ul>
		{#each stories as story (story.url)}
			<li>
				<!-- URLs come from the stories sheet and may point off-site -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={hrefFor(story.url)} class="story-card">
					<span class="story-card__title">{story.title}</span>
					<span class="story-card__dek">{story.subtitle}</span>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style>
	.story-list {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	.story-list ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.story-list li + li {
		margin-top: 1rem;
	}

	.story-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.25rem 1.5rem;
		background: var(--color-cream-50);
		border: 1.5px solid var(--color-cream-400);
		border-radius: 6px;
		font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', sans-serif;
		color: var(--color-cream-900);
		text-decoration: none;
		line-height: 1.3;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.story-card:hover {
		border-color: var(--color-brand);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
	}

	.story-card:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 3px;
	}

	.story-card__title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-brand);
	}

	.story-card__dek {
		font-size: 1.375rem;
		font-weight: 600;
	}

	.story-card:hover .story-card__dek {
		color: var(--color-accent-red);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
