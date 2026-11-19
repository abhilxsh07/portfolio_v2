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

The site has six pages: `/`, `/work`, `/stack`, `/experience`, `/uses` and `/contact`. Uses is linked from the footer, not the main nav. `src/lib/router.js` handles them without a routing library, and `vercel.json` sends every path to `index.html`. Hash links that point inside a collapsed `<details>` (Earlier work, the case studies) open it before scrolling.

Edit profile, projects, skills, and experience in `src/data/portfolio.js`. The page and terminal share those records. On project cards, `role` is the "my part" line, `proof` is the "outcome" line, and `note` holds status or credit text. Leave missing URLs as `null`; the card just drops that link.

sable screenshots live in `src/assets/sable/` (development build, November 2026, sample document; the highlight, underline and note were made in sable itself). Cursus is shown with an illustration, `src/components/CursusOverview.jsx`, not a screenshot; the old captures in `src/assets/cursus/` aren't used. Metadata is in `index.html`; the social image is `public/og-preview.png`.

## Work page

Each case study has a card and a short write-up inside "Inside …: how it works". sable also has the full architecture map behind "Explore the full architecture", which is lazy-loaded so it isn't in the main bundle. [WALKTHROUGHS.md](WALKTHROUGHS.md) has the details.

## Terminal

Click terminal or press Ctrl+K (Cmd+K on macOS). Type `help` for commands or `/` to search. Escape closes it. Doom opens in a separate sandboxed window on desktop. Both load the first time they're opened and stay mounted after that.

## Deployment

Vercel builds with `npm run build`. `vercel.json` sets response headers and the résumé redirect. Local Vite preview does not apply those settings.

The résumé is served from `public/resume.pdf`. `/resume` redirects to `/resume.pdf` on Vercel.

The contact form uses Web3Forms. Mock submissions when testing. Discord verification is at `/.well-known/discord`.

Before publishing, check mobile layout, section links, keyboard focus, reduced motion, and terminal commands. Run `npm audit --omit=dev` for dependency advisories.

## Dependency cleanup

Removed ten unused packages and switched animation imports to `motion/react`.
