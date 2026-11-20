import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fixedPages, notFoundPage, SITE_URL } from "../src/data/pages.js";

const index = readFileSync("dist/index.html", "utf8");

function escapeHtml(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function pageHtml({ title, description, socialDescription = description, path }) {
    const pageTitle = escapeHtml(title);
    const summary = escapeHtml(description);
    const socialSummary = escapeHtml(socialDescription);
    const url = path ? escapeHtml(SITE_URL + path) : null;

    return index
        .replace(/<title>[^<]*<\/title>/, () => `<title>${pageTitle}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, (_, start) => start + summary)
        .replace(/(<meta (?:property="og|name="twitter):title" content=")[^"]*/g, (_, start) => start + pageTitle)
        .replace(/(<meta (?:property="og|name="twitter):description" content=")[^"]*/g, (_, start) => start + socialSummary)
        .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, () => url ? `<link rel="canonical" href="${url}" />` : "")
        .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, () => url ? `<meta property="og:url" content="${url}" />` : "");
}

for (const page of fixedPages) {
    const file = page.path === "/" ? "dist/index.html" : `dist${page.path}.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageHtml(page));
}

writeFileSync("dist/404.html", pageHtml(notFoundPage));
