# GRAFFU — home

The homepage for [graffu.com](https://graffu.com): a list of visual data stories. Each story is a separate app with its own repo and its own Netlify site. This site links to them and serves them under its domain through Netlify proxy rules.

Built with SvelteKit (Svelte 5), Tailwind CSS 4 and `@sveltejs/adapter-static`. Every page is prerendered to static HTML.

## How it works

```
Browser ──► graffu.com                    ──► Home site (this repo)
Browser ──► graffu.com/top-39/...         ──► Home site proxies to ──► top-39.netlify.app
Browser ──► graffu.com/club-v-country/... ──► Home site proxies to ──► club-v-country.netlify.app
```

- `graffu.com` (primary) and `www.graffu.com` (redirects to primary) are attached to **this** Netlify site.
- Each story is its own Netlify site, deployed from its own GitHub repo, and reachable at its default `*.netlify.app` address. No custom domain is attached to the story sites.
- This site's [netlify.toml](netlify.toml) holds a **proxy rewrite** (status `200`) for each story. Netlify fetches the content from the story site behind the scenes, so the address bar stays on `graffu.com/story-name/...`. A `301`/`302` would send visitors to the `netlify.app` URL instead, so don't change the status code.

`netlify.toml` is the list of which paths map to which Netlify sites.

## Getting started

Requires Node 22.

```sh
npm install
npm run dev        # dev server for localhost
npm run build      # static build into ./build
npm run preview    # serve the production build locally
```

Other scripts:

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run check`  | Type-check with `svelte-check`                 |
| `npm run lint`   | Prettier check + ESLint                        |
| `npm run format` | Format everything with Prettier                |
| `npm run gdoc`   | Pull the story list from Google Sheets (below) |

## Project layout

```
src/
  routes/
    +page.svelte        Story list, SEO/Open Graph tags, JSON-LD
    +layout.svelte      Site shell
    +layout.ts          prerender = true
    brand.css           Brand tokens
    layout.css          Global styles
  data/stories.json     Story list (generated from the Google doc — don't edit by hand)
  lib/constants.js      SITE_URL and other shared constants
scripts/fetch-google.js Google Sheets / Docs fetcher
google.config.js        Which Google files to fetch and where to write them
static/                 Fonts, robots.txt, sitemap.xml, OG image
netlify.toml            Build settings and story proxy rules
```

## Managing stories

The story list lives in a [Google Sheet](https://docs.google.com/spreadsheets/d/1J8LW0B3oyUdH1qU1R2Ul2YnUOp7Satk6v1JYdzZBNow). Each row has these columns:

| Column     | Meaning                                                      |
| ---------- | ------------------------------------------------------------ |
| `url`      | Link to the story. A site path like `/top-39`, or a full URL |
| `title`    | Card title, e.g. `Project 100:`                              |
| `subtitle` | Card subtitle, e.g. `Club vs Country`                        |
| `image`    | Reserved for a card image (currently unused)                 |
| `show`     | `1` to show the story. Any other value hides it              |

`npm run gdoc` downloads the sheet as CSV, keeps the rows where `show` is `1`, and writes them to `src/data/stories.json`. The sheet must be viewable by anyone with the link.

A GitHub Action ([.github/workflows/gdoc.yml](.github/workflows/gdoc.yml)) runs this every day at 7am Eastern. When the data has changed, it commits the new `stories.json` to `main`, which starts a Netlify deploy. You can also run it by hand from the Actions tab.

`google.config.js` can list more files. An entry with a `gid` is fetched as a sheet tab; an entry without one is fetched as a Google Doc and parsed with [ArchieML](http://archieml.org/).

## Requirements for each story

A story proxied under a subfolder must work when served from `/story-name/`. In the story's own repo:

1. **Set a base path.** Root-relative links (`/css/style.css`, `<a href="/about">`) resolve against `graffu.com`, not `graffu.com/story-name/`, and will 404.
   - SvelteKit: `kit.paths.base = '/story-name'` in `svelte.config.js`, and build links and asset URLs with `base` from `$app/paths`.
   - Vite: `base: '/story-name/'` in `vite.config.js`.
   - Plain HTML: use relative paths, or `<base href="/story-name/">`.
2. **Keep the story's own `netlify.app` URL working.** With a base path set, built pages reference `/story-name/...`. Add this to the story's `netlify.toml` so the same files resolve when served from the story site's root:

   ```toml
   [[redirects]]
     from = "/story-name/*"
     to = "/:splat"
     status = 200
   ```

3. **Avoid absolute URLs to the `netlify.app` host** in HTML, canonical tags, Open Graph tags, sitemaps or JavaScript. They send visitors off `graffu.com`.
4. **Don't attach a custom domain to the story site.** Serving the same content from several addresses causes duplicate URLs and confusing redirects.

## Adding a new story

1. Create a Netlify site from the story's GitHub repo and note its `*.netlify.app` address.
2. In the story's repo, set the base path and add the extra rewrite described above, then deploy.
3. Add a proxy rule to this repo's `netlify.toml`, pointing at the `.netlify.app` address (not a custom domain):

   ```toml
   [[redirects]]
     from = "/my-story/*"
     to = "https://my-story.netlify.app/:splat"
     status = 200
     force = true
   ```

   `*` is a wildcard and `:splat` is replaced with whatever it matched, so `graffu.com/my-story/about/` is fetched from `https://my-story.netlify.app/about/`. The `/my-story` prefix is stripped before the request reaches the story site. Rules match top to bottom and the first match wins, so keep story rules above any catch-all rule.

4. Add a row to the Google Sheet with `url` set to `/my-story` and `show` set to `1`, then run `npm run gdoc` (or wait for the daily run).
5. Add the story's URL to `static/sitemap.xml`. The sitemap is kept by hand.
6. Test in a private window: load `graffu.com/my-story/` and `graffu.com/my-story` (no trailing slash), click through several pages, hard-refresh a deep link, and watch the network tab for any request that goes to `graffu.com/...` without the prefix or to `netlify.app`.

## Deployment

Netlify builds the site with `npm run build` and publishes `build/`. Settings are in [netlify.toml](netlify.toml). Every push to `main` deploys.

Set the `BASE_PATH` environment variable to serve the site from a subfolder instead of the domain root. Canonical and Open Graph URLs come from `SITE_URL` in [src/lib/constants.js](src/lib/constants.js).

## Domains and DNS

- DNS is managed at the domain registrar. The apex and `www` records point to Netlify.
- In Netlify (Domain management), `graffu.com` is the primary domain for this site. A custom domain can only be attached to one Netlify site at a time, so if the domain is ever moved to a different site, remove it from this one first.
- Netlify recommends Netlify DNS when an apex domain is the primary domain. If DNS issues appear, look there first.
- Story sites keep working at their `*.netlify.app` addresses whatever happens to the custom domain.

## Limits and gotchas

- **One hop only.** Netlify limits rewrites to one hop, so this site can proxy to a story site, but that story can't proxy onward to a third Netlify site.
- **Same team.** Rewrites between Netlify sites on different teams aren't allowed.
- **Timeout.** Proxied requests time out after 26 seconds. This matters only if a story does slow server-side work.
- **Renaming a Netlify site** changes its `netlify.app` address and breaks the matching rule here. Update `netlify.toml` at the same time.
- **Redirect order matters.** If a proxied path 404s or returns the wrong page, check rule order and whether another rule or a `_redirects` file matches first.

## Troubleshooting

| Symptom                                                         | Likely cause                                                                                       |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Pages load but CSS, images or JS 404 under `/story-name/`       | Missing base path; assets requested from `graffu.com/...` instead of `graffu.com/story-name/...`   |
| Address bar changes to `netlify.app`                            | Rule status isn't `200`, or the story issues its own redirects or uses absolute `netlify.app` URLs |
| Story works at `netlify.app` but not under the subfolder        | Base path not set, or proxy rule missing or in the wrong order                                     |
| Story works under the subfolder but its `netlify.app` URL fails | The `/story-name/* → /:splat` rewrite is missing in the story's repo                               |
| `/story-name` (no slash) 404s                                   | Missing bare-path rule or trailing-slash redirect                                                  |
| Deep link fails on hard refresh                                 | Client-side routing fallback not configured for the base path                                      |

## Reference

Netlify docs: [Rewrites and proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies), [Redirect options](https://docs.netlify.com/manage/routing/redirects/redirect-options/), [Custom domains](https://docs.netlify.com/create/domain-management/), [Manage multiple domains](https://docs.netlify.com/manage/domains/manage-domains/manage-multiple-domains/).
