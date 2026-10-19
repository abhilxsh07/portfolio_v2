# abhilashkar.dev

My portfolio, built with React, Vite, Tailwind CSS, and Motion.

## Local development

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

`npm run lint` checks the source. `npm run build` creates `dist/`; `npm run preview` serves it locally.

## Content

The site has five pages: `/`, `/work`, `/stack`, `/experience` and `/contact`. `src/lib/router.js` handles them without a routing library, and `vercel.json` sends every path to `index.html`.

Edit profile, projects, skills, and experience in `src/data/portfolio.js`. The page and terminal share those records. Leave missing URLs as `null`.

sable screens live in `src/assets/sable/` and use a sample document; Cursus screens live in `src/assets/cursus/` and use sample study data. Metadata is in `index.html`; the social image is `public/og-preview.png`.

## Terminal

Click Terminal or press Ctrl+K (Cmd+K on macOS). Type `help` for commands or `/` to search. Escape closes it. Doom opens in a separate sandboxed window on desktop.

## Deployment

Vercel builds with `npm run build`. `vercel.json` sets response headers and the résumé redirect. Local Vite preview does not apply those settings.

The contact form uses Web3Forms. Mock submissions when testing. Discord verification is at `/.well-known/discord`.

Before publishing, check mobile layout, section links, keyboard focus, reduced motion, and terminal commands. Run `npm audit --omit=dev` for dependency advisories.

## Dependency cleanup

Removed ten unused packages and switched animation imports to `motion/react`. On 19 October 2026, a production dependency audit found three affected packages. Compatible updates cleared those advisories:

| Package | Before | After |
| --- | --- | --- |
| nanoid | 3.3.15 | 3.3.20 |
| postcss | 8.5.16 | 8.5.31 |
| source-map-js | 1.2.1 | 1.2.2 |

The [dated audit record](public/engineering/dependency-audit-2026-10-19.json) includes lockfile hashes and advisory links. This covers dependency advisories, not the whole application's security.
