# abhilashkar.dev

Abhilash Kar's portfolio: shipped products, current experiments, and an interactive terminal. Built with React 19, Vite 7, Tailwind CSS 4, and Motion, with Vercel Analytics and Speed Insights.

![Portfolio preview](public/og-preview.png)

## Run locally

Use a Node.js version supported by Vite 7 (20.19+ or 22.12+), and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. To check and preview the production build:

```sh
npm run lint
npm run build
npm run preview
```

## Edit the content

`src/data/portfolio.js` contains the profile, navigation, projects, project-backed skill groups, experience, and contact links. Both the page and terminal use this content. Each project needs a stable ID; use `null` for unavailable links. Keep private source repositories unlinked.

`src/components/Projects.jsx` contains the Cursus case study. `src/components/CursusGallery.jsx` provides four product screens and an accessible full-size viewer. The screens render Cursus's actual components with labelled sample study data; they do not expose a live account. Capture provenance is recorded in `src/assets/cursus/README.md`.

`src/components/EngineeringNotes.jsx` presents the dated dependency-audit write-up. `src/lib/terminalContent.js` formats the shared content for terminal commands. The other sections are individual components under `src/components/`.

Crawler-facing metadata lives in `index.html`. Keep its role, studio description, stack, and preview text consistent with the shared profile. The 1200×630 social preview is `public/og-preview.png`; `public/sitemap.xml` records the last published content date.

## Terminal

Click **Launch Terminal**, or press **Ctrl+K** on Windows/Linux and **⌘K** on macOS. Type `/` for the searchable command list, use the arrow keys for command history, and press Escape to close.

Commands include `about`, `skills`, `projects`, `experience`, `contact`, `cat resume.txt`, `neofetch`, `coffee`, and `doom`. Doom runs in a sandboxed external iframe on desktop. The terminal restores focus to its trigger. Motion settings follow the visitor's reduced-motion preference.

## Deployment and integrations

Vercel builds with `npm run build` and serves `dist/`. `vercel.json` configures response headers and the `/resume` redirect. Vite's local preview does not apply those Vercel settings; verify them on a Vercel preview deployment.

The résumé currently redirects to Google Drive and needs an owner-supplied update. A legacy `public/resume.pdf` is retained until the canonical résumé is confirmed.

The contact form posts to Web3Forms using its public client access key, including the `botcheck` honeypot. Browser validation of the form should intercept requests and mock both success and failure responses; do not send test messages to the live inbox.

Security headers include HSTS, nosniff, frame denial, a referrer policy, a permissions policy, and an **enforced Content Security Policy**. The production build was exercised locally with the same response policy: gallery, fonts, terminal, intercepted form submission, and actual external Doom frame navigation produced no application CSP violations. Platform telemetry was intercepted for testing; actual gameplay was not tested. Re-check the Vercel preview after deployment, since Vercel's platform scripts differ from the local server and preview access may require sign-in.

Discord verification is served from `public/.well-known/discord`.

## Dependency audit

On 19 October 2026, the recovered hardening baseline reproduced **three production-dependency advisories**. Compatible updates to `nanoid`, `postcss`, and `source-map-js` brought `npm audit --omit=dev` to **zero**. The [public evidence summary](public/engineering/dependency-audit-2026-10-19.json) records the lockfile blobs, commands, counts, versions, and advisory URLs. This is a dated dependency check, not a security guarantee for the application. The earlier “8 → 0” claim is not used without its original report.

## Contributing

Work on a feature branch, run lint and the production build, inspect phone/tablet/desktop layouts, and open a pull request for a Vercel preview. Verify section links, terminal commands, keyboard focus, reduced motion, and mocked contact-form responses when changing those features. Do not commit local caches or generated builds.
