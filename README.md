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

The top navigation shows Brain, Blog and the new Uses page in local development. Add `?slots=1` to a preview URL to see the copy and drawings that still need filling in. Production links follow the flags in `src/data/ready.js`. The router lives in `src/lib/router.js`, and the production build writes HTML for the live routes. Hash links that point inside a collapsed `<details>` (Earlier work, the case studies) open it before scrolling.

Edit profile, projects, skills, and experience in `src/data/portfolio.js`. The page and terminal share those records. On project cards, `role` is the "my part" line, `proof` is the "outcome" line, and `note` holds status or credit text. Leave missing URLs as `null`; the card just drops that link.

sable screenshots live in `src/assets/sable/` (development build, November 2026, sample document; the highlight, underline and note were made in sable itself). Cursus is shown with an illustration, `src/components/CursusOverview.jsx`, not a screenshot; the old captures in `src/assets/cursus/` aren't used. Metadata is in `index.html`; the social image is `public/og-preview.png`.

## Blog posts

Create a Markdown file under `src/content/blog/` named `YYYY-MM-DD-post-slug.md`, for example `2026-11-21-first-post.md`. Start with this frontmatter and write the post below the second `---`.

```md
---
title: "My first post"
date: 2026-11-21
summary: "One sentence about the post."
tags: []
draft: true
---

Write the post here.
```

If the dev server is running, run `node scripts/build-content.mjs --dev` from the project directory and refresh `/blog`. `npm run dev` also rebuilds the content on startup. Set `draft: false` when the post is ready to publish. The Blog flag in `src/data/ready.js` controls whether the section goes live.

## Work page

Each case study has a card and a short write-up in its expandable section. The sable architecture map loads when you select "Explore the full architecture". [WALKTHROUGHS.md](WALKTHROUGHS.md) has the details.

## Terminal

Click terminal or press Ctrl+K (Cmd+K on macOS). Type `help` for commands or `/` to search. In the local preview, `brain` opens the map, `ls brain` lists notes, `cat brain/hi-stranger` shows a note’s details, and `blog` opens the Blog. Escape closes the terminal. Doom opens in a separate sandboxed window on desktop. Both load the first time they're opened and stay mounted after that.

## Deployment

Vercel builds with `npm run build`. `vercel.json` sets response headers and the résumé redirect. Local Vite preview does not apply those settings.

The résumé is served from `public/resume.pdf`. `/resume` redirects to `/resume.pdf` on Vercel.

The contact form uses Web3Forms. Mock submissions when testing. Discord verification is at `/.well-known/discord`.

Before publishing, check mobile layout, section links, keyboard focus, reduced motion, and terminal commands. Run `npm audit --omit=dev` for dependency advisories.

## Dependency cleanup

Removed ten unused packages and switched animation imports to `motion/react`.
