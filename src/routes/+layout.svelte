<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { base, resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const tayFlapjackWoff2 = `${base}/fonts/tay-flapjack/TAYFlapjack.woff2`;
	const tayFlapjackWoff = `${base}/fonts/tay-flapjack/TAYFlapjack.woff`;
	const sourceSerif400Woff2 = `${base}/fonts/source-serif-4/source-serif-4-latin-400-normal.woff2`;
	const sourceSerif400Woff = `${base}/fonts/source-serif-4/source-serif-4-latin-400-normal.woff`;
	const sourceSerif400ItalicWoff2 = `${base}/fonts/source-serif-4/source-serif-4-latin-400-italic.woff2`;
	const sourceSerif400ItalicWoff = `${base}/fonts/source-serif-4/source-serif-4-latin-400-italic.woff`;
	const sourceSerif700Woff2 = `${base}/fonts/source-serif-4/source-serif-4-latin-700-normal.woff2`;
	const sourceSerif700Woff = `${base}/fonts/source-serif-4/source-serif-4-latin-700-normal.woff`;
	const sourceSerif700ItalicWoff2 = `${base}/fonts/source-serif-4/source-serif-4-latin-700-italic.woff2`;
	const sourceSerif700ItalicWoff = `${base}/fonts/source-serif-4/source-serif-4-latin-700-italic.woff`;

	onMount(() => {
		const fontFaces = [
			new FontFace('TAY Flapjack', `url('${tayFlapjackWoff2}') format('woff2'), url('${tayFlapjackWoff}') format('woff')`, {
				weight: '400',
				style: 'normal',
				display: 'swap'
			}),
			new FontFace('Source Serif 4', `url('${sourceSerif400Woff2}') format('woff2'), url('${sourceSerif400Woff}') format('woff')`, {
				weight: '400',
				style: 'normal',
				display: 'swap'
			}),
			new FontFace(
				'Source Serif 4',
				`url('${sourceSerif400ItalicWoff2}') format('woff2'), url('${sourceSerif400ItalicWoff}') format('woff')`,
				{
					weight: '400',
					style: 'italic',
					display: 'swap'
				}
			),
			new FontFace('Source Serif 4', `url('${sourceSerif700Woff2}') format('woff2'), url('${sourceSerif700Woff}') format('woff')`, {
				weight: '700',
				style: 'normal',
				display: 'swap'
			}),
			new FontFace(
				'Source Serif 4',
				`url('${sourceSerif700ItalicWoff2}') format('woff2'), url('${sourceSerif700ItalicWoff}') format('woff')`,
				{
					weight: '700',
					style: 'italic',
					display: 'swap'
				}
			)
		];

		void Promise.all(
			fontFaces.map(async (fontFace) => {
				const loadedFont = await fontFace.load();
				document.fonts.add(loadedFont);
			})
		);
	});

	let { children } = $props();
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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Preload critical webfonts -->
	<link rel="preload" as="font" href={tayFlapjackWoff2} type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" as="font" href={sourceSerif400Woff2} type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<a class="skip-link" href="#stories">Skip to stories</a>

<header class="site-header">
	<div class="nav-shell">
		<div class="brand-lockup">
			<a href={resolve('/')} class="site-name" aria-label="Graffu home">
				<span>Graffu<span class="brand-stop">.</span></span>
			</a>
			<p class="site-tagline">Visual stories that simply explain data.</p>
		</div>

		<div class="nav-actions">
			<button class="theme-toggle" type="button" onclick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} aria-pressed={theme === 'dark'}>
				<span class="theme-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
				<span class="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
			</button>
		</div>
	</div>
</header>

{@render children()}

<style>
	.skip-link {
		position: absolute;
		z-index: 200;
		top: -5rem;
		left: 1rem;
		padding: 0.65rem 1rem;
		background: var(--page-highlight);
		color: #17231f;
		font-weight: 700;
	}

	.skip-link:focus { top: 0.5rem; }

	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--page-background);
		border-bottom: 1px solid var(--page-line);
		backdrop-filter: blur(18px);
	}

	.nav-shell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		width: min(100% - 3rem, 1320px);
		min-height: 100px;
		margin: 0 auto;
	}

	.site-name {
		display: inline-flex;
		align-items: center;
		gap: 0.38rem;
		font-family: system-ui, sans-serif;
		font-size: clamp(1.9rem, 3vw, 2.3rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.055em;
		text-decoration: none;
		white-space: nowrap;
	}

	.brand-stop { color: var(--page-accent); }
	.brand-lockup { display: grid; gap: 0.25rem; }
	.site-tagline { margin: 0; color: var(--page-ink); font-family: var(--font-serif); font-size: 0.9rem; line-height: 1.25; }
	.nav-actions { display: flex; align-items: center; margin-left: auto; }

	.theme-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.55rem 0;
		border: 0;
		background: none;
		color: var(--page-ink);
		font: 700 0.85rem system-ui, sans-serif;
		cursor: pointer;
	}
	.theme-icon { font-size: 1.5rem; line-height: 1; transition: transform 0.25s ease; }
	.theme-toggle:hover .theme-icon { transform: rotate(-22deg); }
	:global(:focus-visible) { outline: 3px solid var(--page-accent); outline-offset: 4px; }

	@media (max-width: 760px) {
		.nav-shell { width: min(100% - 2rem, 1320px); min-height: 88px; gap: 0.8rem; }
		.theme-label { display: none; }
	}

	@media (max-width: 430px) {
		.site-name { font-size: 1.65rem; }
		.site-tagline { font-size: 0.78rem; white-space: nowrap; }
		.nav-shell { gap: 0.45rem; }
	}
</style>
