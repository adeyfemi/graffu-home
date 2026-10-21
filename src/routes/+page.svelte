<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { SITE_URL } from '$lib/constants.js';
	import top39Cover from '$lib/assets/story-screenshots/top-39.svg';
	import clubCover from '$lib/assets/story-screenshots/club-vs-country.webp';
	import stories from '../data/stories.json';

	const storyDetails: Record<string, { category: string; description: string; image: string; alt: string }> = {
		'/top-39/': {
			category: 'Film & culture',
			description: 'explore the numbers behind the films of black actors',
			image: top39Cover,
			alt: 'Illustrated artwork from the Top 39 visual story'
		},
		'/club-v-country/': {
			category: 'Football & the world',
			description: 'Follow the movement of football players between national and club teams',
			image: clubCover,
			alt: 'World map and data visuals from the Club vs Country story'
		}
	};

	const visibleStories = stories.filter((story) => story.show === '1');
	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		const preference = window.matchMedia('(prefers-color-scheme: dark)');
		const followSystem = () => {
			try {
				if (localStorage.getItem('graffu-theme')) return;
			} catch {
				// Follow the system theme when storage is unavailable.
			}
			theme = preference.matches ? 'dark' : 'light';
			document.documentElement.dataset.theme = theme;
		};
		preference.addEventListener('change', followSystem);
		return () => preference.removeEventListener('change', followSystem);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('graffu-theme', theme);
		} catch {
			// The switch still works if the browser blocks local storage.
		}
	}

	function hrefFor(url: string): string {
		return url.startsWith('/') && !url.startsWith('//') ? resolve(url as Pathname) : url;
	}

	const title = 'GRAFFU — Visual stories that make data feel human';
	const description = 'Interactive visual stories about culture, sport, and the ideas hiding in data.';
	const canonical = `${SITE_URL}/`;
	const ogImage = `${SITE_URL}/og-club-vs-country.jpg`;
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'GRAFFU',
		url: canonical,
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

<main id="main-content">
	<!-- <section class="hero" aria-labelledby="hero-heading">
		<div class="hero-inner">
			<div class="hero-copy">
				<p class="eyebrow"><span class="eyebrow-spark" aria-hidden="true">✳</span> A home for visual stories</p>
				<h1 id="hero-heading">Data has stories.<br /><span class="highlight">We draw them out.</span></h1>
				<div class="hero-bottom">
					<p>We make curious, visual essays that turn numbers into something you can see, explore, and feel.</p>
					<a href="#stories" class="text-link">Explore our stories <span aria-hidden="true">↘</span></a>
				</div>
			</div>
			<div class="hero-note" aria-hidden="true">
				<div class="note-head"><span>GRAFFU / FIELD NOTES</span><span>01—∞</span></div>
				<div class="note-art"><span class="note-ring ring-one"></span><span class="note-ring ring-two"></span><span class="note-center">✳</span><span class="note-dot dot-one"></span><span class="note-dot dot-two"></span></div>
				<div class="note-foot"><span>LOOK CLOSER</span><span>↗</span></div>
			</div>
		</div>
	</section> -->

	<section class="stories-section" id="stories" aria-labelledby="stories-heading">
		<h1 class="visually-hidden" id="stories-heading">Graffu stories</h1>

		<ul class="story-grid">
			{#each visibleStories as story, index (story.url)}
				{@const details = storyDetails[story.url]}
				<li>
					<!-- The story sheet may also contain off-site destinations. -->
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="story-card" href={hrefFor(story.url)}>
						<div class="card-topline"><span>{story.title.replace(/:$/, '')}</span><span>{details?.category ?? 'Visual story'}</span></div>
						<div class={index % 2 === 0 ? 'artwork artwork--first' : 'artwork artwork--second'}>
							{#if details?.image}
								<img src={details.image} alt={details.alt} loading={index === 0 ? 'eager' : 'lazy'} />
							{:else}
								<span class="artwork-fallback" aria-hidden="true">✳</span>
							{/if}
						</div>
						<div class="card-body">
							<h3>{story.subtitle}</h3>
							<p class="card-description">{details?.description ?? 'A visual story made for the curious.'}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- <section class="about-section" id="about" aria-labelledby="about-heading">
		<div class="about-mark" aria-hidden="true">✳</div>
		<div>
			<p class="eyebrow">A little about us</p>
			<h2 id="about-heading">Made for the<br /><em>curious mind.</em></h2>
		</div>
		<p>GRAFFU is a place for stories told with data, design, and a healthy dose of curiosity. We believe the best way to understand something is to get close enough to explore it.</p>
	</section> -->
</main>

<footer class="site-footer">
	<div class="footer-inner">
		<a href={resolve('/')} class="footer-brand" aria-label="Graffu home">
			<span>Graffu<span class="footer-brand-stop">.</span></span>
		</a>
		<div class="footer-actions">
			<button class="theme-toggle" type="button" onclick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} aria-pressed={theme === 'dark'}>
				<span class="theme-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
				<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
			</button>
			<a href="#main-content">Back to top ↑</a>
		</div>
	</div>
</footer>

<style>
	.hero, .stories-section, .about-section, .footer-inner { width: min(100% - 3rem, 1320px); margin-inline: auto; }
	.hero { padding: clamp(4rem, 8vw, 7.5rem) 0 clamp(5rem, 8vw, 8rem); }
	.hero-inner { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.75fr); gap: clamp(2rem, 6vw, 7rem); align-items: center; }
	.eyebrow { display: flex; align-items: center; gap: 0.7rem; margin: 0; color: var(--page-accent-strong); font: 800 0.75rem system-ui, sans-serif; letter-spacing: 0.13em; text-transform: uppercase; }
	.eyebrow-spark { font-size: 1.55rem; line-height: 0.75; }
	.hero h1 { max-width: 900px; margin: 1.8rem 0 2rem; font-family: var(--font-display); font-size: clamp(3.5rem, 7.2vw, 7.4rem); font-weight: 400; line-height: 1.01; letter-spacing: -0.06em; }
	.highlight { position: relative; z-index: 0; white-space: nowrap; }
	.highlight::after { content: ''; position: absolute; z-index: -1; left: 0; right: -0.02em; bottom: 0.09em; height: 0.27em; border-radius: 50%; background: var(--page-highlight); transform: rotate(-1deg); }
	.hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; max-width: 750px; }
	.hero-bottom p { max-width: 450px; margin: 0; color: var(--page-muted); font-size: clamp(1.12rem, 1.6vw, 1.35rem); line-height: 1.5; }
	.text-link { display: inline-flex; align-items: center; gap: 0.7rem; flex: none; padding-bottom: 0.25rem; border-bottom: 2px solid var(--page-accent); color: var(--page-ink); font: 800 0.85rem system-ui, sans-serif; text-decoration: none; }
	.text-link span { font-size: 1.25rem; transition: transform 0.2s ease; }
	.text-link:hover span { transform: translate(3px, 3px); }
	.hero-note { min-height: 380px; padding: 1.35rem; border: 1px solid var(--page-line); border-radius: 12px; background: var(--page-soft); transform: rotate(3deg); box-shadow: var(--page-shadow); }
	.note-head, .note-foot { display: flex; justify-content: space-between; gap: 1rem; font: 800 0.7rem system-ui, sans-serif; letter-spacing: 0.1em; }
	.note-art { position: relative; display: grid; place-items: center; height: 295px; overflow: hidden; }
	.note-ring { position: absolute; display: block; width: 220px; height: 220px; border: 25px solid var(--page-accent); border-radius: 50%; transform: rotate(-25deg) scaleY(0.72); }
	.ring-two { width: 315px; height: 315px; border-color: var(--page-ink); border-width: 2px; transform: rotate(26deg) scaleY(0.62); }
	.note-center { position: relative; font: 400 7.5rem/1 var(--font-display); color: var(--page-highlight); text-shadow: 3px 3px 0 var(--page-ink); }
	.note-dot { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: var(--page-highlight); }
	.dot-one { top: 45px; left: 32px; }.dot-two { right: 20px; bottom: 48px; width: 10px; height: 10px; background: var(--page-accent); }
	.note-foot { padding-top: 0.75rem; border-top: 1px solid var(--page-line); }
	.note-foot span:last-child { font-size: 1.3rem; line-height: 0.65; }
	.stories-section { scroll-margin-top: 110px; padding-top: clamp(2rem, 4vw, 3.5rem); padding-bottom: clamp(5rem, 9vw, 9rem); }
	.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
	.story-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 2.3vw, 2rem); margin: 0; padding: 0; list-style: none; }
	.story-card { display: block; height: 100%; padding: 1rem; border: 1px solid var(--page-line); border-radius: 15px; background: var(--page-card); color: var(--page-ink); text-decoration: none; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
	.story-card:hover { transform: translateY(-7px); border-color: var(--page-accent); box-shadow: var(--page-shadow); }
	.story-card:focus-visible { outline: 3px solid var(--page-accent); outline-offset: 4px; }
	.card-topline { display: flex; justify-content: space-between; gap: 1rem; padding: 0.3rem 0.25rem 0.9rem; color: var(--page-muted); font: 800 0.72rem system-ui, sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }
	.artwork { position: relative; display: grid; place-items: center; height: clamp(270px, 31vw, 430px); overflow: hidden; border-radius: 8px; }
	.artwork--first { background: #efb1c5; }.artwork--second { background: #9cd6d1; }
	.artwork img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.2, 0.65, 0.3, 1); }
	.story-card:hover .artwork img { transform: scale(1.055); }
	.artwork-fallback { font: 400 9rem var(--font-display); color: var(--page-ink); }
	.card-body { padding: 1.2rem 0.25rem 0.25rem; }
	.card-body h3 { margin: 0 0 0.55rem; font-family: var(--font-serif); font-size: clamp(1.6rem, 2.35vw, 2.55rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
	.card-description { margin: 0; color: var(--page-muted); font-size: 0.875rem; line-height: 1.45; white-space: nowrap; }
	.about-section { scroll-margin-top: 110px; display: grid; grid-template-columns: auto 1.3fr 1fr; align-items: center; gap: clamp(1.5rem, 4vw, 5rem); padding: clamp(2rem, 5vw, 4.5rem); margin-bottom: clamp(4rem, 8vw, 7rem); border-radius: 18px; background: var(--page-highlight); color: #17231f; }
	.about-mark { font-size: clamp(5rem, 10vw, 10rem); line-height: 0.8; }
	.about-section .eyebrow { color: #075e46; }
	.about-section h2 { margin: 0.6rem 0 0; font-family: var(--font-display); font-size: clamp(2.5rem, 4vw, 4.5rem); font-weight: 400; letter-spacing: -0.055em; }
	.about-section h2 em { font-family: var(--font-serif); font-weight: 400; }
	.about-section > p { max-width: 390px; margin: 0; font-size: 1.14rem; line-height: 1.55; }
	.site-footer { border-top: 1px solid var(--page-line); }
	.footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; min-height: 115px; }
	.footer-brand { display: inline-flex; align-items: center; font: 800 2rem/1 system-ui, sans-serif; letter-spacing: -0.06em; text-decoration: none; white-space: nowrap; }
	.footer-brand-stop { color: var(--page-accent); }
	.footer-actions { display: flex; align-items: center; gap: 1.5rem; font: 700 0.8rem system-ui, sans-serif; }
	.footer-actions a { text-decoration: none; }
	.footer-actions a:hover { color: var(--page-accent); }
	.theme-toggle { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0; border: 0; background: none; color: var(--page-ink); font: inherit; cursor: pointer; }
	.theme-icon { font-size: 1.35rem; line-height: 1; transition: transform 0.25s ease; }
	.theme-toggle:hover .theme-icon { transform: rotate(-22deg); }
	.theme-toggle:focus-visible, .footer-actions a:focus-visible { outline: 3px solid var(--page-accent); outline-offset: 4px; }
	@media (max-width: 1000px) { .hero-inner { grid-template-columns: 1fr; }.hero-note { display: none; }.hero h1 { max-width: 800px; }.about-section { grid-template-columns: auto 1fr; }.about-section > p { grid-column: 2; } }
	@media (max-width: 1280px) { .card-description { white-space: normal; } }
	@media (max-width: 760px) { .hero, .stories-section, .about-section, .footer-inner { width: min(100% - 2rem, 1320px); }.hero { padding-block: 4rem 5rem; }.hero h1 { font-size: clamp(3.1rem, 10vw, 5rem); }.hero-bottom { display: block; }.text-link { margin-top: 1.5rem; }.story-grid { grid-template-columns: 1fr; }.artwork { height: clamp(260px, 63vw, 430px); }.about-section { grid-template-columns: 1fr; }.about-mark { font-size: 5rem; }.about-section > p { grid-column: auto; }.footer-inner { align-items: flex-start; flex-direction: column; gap: 1rem; padding-block: 2rem; }.footer-actions { flex-wrap: wrap; } }
	@media (max-width: 440px) { .hero h1 { font-size: 3.05rem; }.highlight { white-space: normal; }.card-body h3 { font-size: 1.75rem; } }
</style>
