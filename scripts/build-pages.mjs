import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { contentPages, livePages, markdownPath, notFoundPage, SITE_URL } from "../src/data/pages.js";
import { escapeText, feedPages, writeDiscovery } from "./site-text.mjs";

const index = readFileSync("dist/index.html", "utf8");
const content = JSON.parse(readFileSync("src/generated/index.json", "utf8"));

const pages = [...livePages(), ...contentPages(content)];
const hasFeed = feedPages(pages).length > 0;

function pageHtml({ title, description, socialDescription = description, path, entry }) {
    const pageTitle = escapeText(title);
    const summary = escapeText(description);
    const socialSummary = escapeText(socialDescription);
    const url = path ? escapeText(SITE_URL + path) : null;

    return index
        .replace(/<title>[^<]*<\/title>/, () => `<title>${pageTitle}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, (_, start) => start + summary)
        .replace(/(<meta (?:property="og|name="twitter):title" content=")[^"]*/g, (_, start) => start + pageTitle)
        .replace(/(<meta (?:property="og|name="twitter):description" content=")[^"]*/g, (_, start) => start + socialSummary)
        .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, () => url ? `<link rel="canonical" href="${url}" />` : "")
        .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, () => url ? `<meta property="og:url" content="${url}" />` : "")
        .replace('property="og:type" content="website"', `property="og:type" content="${entry ? "article" : "website"}"`)
        .replace("</head>", () => [
            hasFeed && `    <link rel="alternate" type="application/rss+xml" title="Abhilash Kar" href="/rss.xml" />\n`,
            path && `    <link rel="alternate" type="text/markdown" href="${escapeText(SITE_URL + markdownPath(path))}" />\n`,
            "</head>"
        ].filter(Boolean).join(""));
}

for (const page of pages) {
    const file = page.path === "/" ? "dist/index.html" : `dist${page.path}.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageHtml(page));
}

writeFileSync("dist/404.html", pageHtml(notFoundPage));
writeDiscovery(pages);
