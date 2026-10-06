<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { SITE_URL } from '$lib/constants.js';
	import stories from '../data/stories.json';
	import { screenshotFor } from './screenshots';

	let { data } = $props();

	// Prefer the sheet's image; otherwise use the linked page's og:image, fetched at build time.
	function imageFor(story: (typeof stories)[number]): string | undefined {
		return screenshotFor(story.image) ?? data.fallbackImages[story.url];
	}

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

<div class="snap-container">

	{#each stories as story, i (story.url)}
		{@const img = imageFor(story)}
		<div class="page page--story">
			<!-- URLs come from the stories sheet and may point off-site -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={hrefFor(story.url)} class="story-card">
				{#if img}
					<img src={img} alt={story.title} class="story-card__img" />
				{/if}
				<div class="story-card__body">
					<svelte:element this={i === 0 ? 'h1' : 'h2'} class="story-card__title">{story.title}</svelte:element>
					<p class="story-card__dek">{story.subtitle}</p>
				</div>
			</a>
		</div>
	{/each}

</div>

<style>
	.snap-container {
		position: fixed;
		top: 52px;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
	}

	.page {
		scroll-snap-align: start;
		height: calc(100vh - 52px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3.5rem 1rem 1rem;
		box-sizing: border-box;
	}

	.page--intro  { background: #e8e6e0; }
	.page--story  { background: #f5f4f0; }
	.page--next   { background: #edecea; }

	.story-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		border: 1.5px solid #d0cec9;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		background: #fff;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.story-card:hover {
		border-color: #aaa;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
	}

	.story-card__img {
		display: block;
		width: 100%;
		flex: 1 1 0;
		min-height: 0;
		object-fit: cover;
	}

	.story-card__body {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
		padding: 1.25rem 1.5rem 1.5rem;
	}

	.story-card__title {
		flex: 0 0 auto;
		font-size: clamp(3.5rem, 5vw, 4rem);
		font-weight: 800;
		line-height: 1.1;
		margin: 0;
		color: #111;
	}

	.story-card__dek {
		flex: 1 1 0;
		font-size: 1.25rem;
		line-height: 1.6;
		color: #555;
		margin: 0;
	}

	@media (max-width: 600px) {
		.story-card__body {
			flex-direction: column;
			gap: 0.75rem;
			padding: 1rem 1.25rem 1.25rem;
		}

		.story-card__title {
			font-size: 2rem;
		}

		.story-card__dek {
			font-size: 1rem;
			line-height: 1.5;
		}
	}
</style>
