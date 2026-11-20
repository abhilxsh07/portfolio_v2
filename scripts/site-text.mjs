import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { copy } from "../src/data/copy.js";
import { profile, projects, getProject, now, experience, experienceIntro, legacyUses, uses, builtWith, alsoUse, contactLinks } from "../src/data/portfolio.js";
import { SITE_URL, markdownPath } from "../src/data/pages.js";

export function escapeText(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const log = JSON.parse(readFileSync("src/generated/site-log.json", "utf8"));
const siteTitle = profile.name;
const dateOf = (page) => page.entry?.date ?? page.entry?.inked ?? page.entry?.pencilled;
const link = (label, href) => `[${label}](${href})`;

function markdownBody(page, pages) {
    switch (page.id ?? page.path) {
        case "/":
            return [
                profile.intro, profile.context, profile.proof,
                "## Selected work",
                ...["sable", "cursus"].map((id) => {
                    const project = getProject(id);
                    return `- ${link(project.title, "/work#" + id)} — ${project.subtitle}`;
                }),
                "## Now", now.text
            ].join("\n\n");
        case "/work":
            return [
                ...projects.map(({ title, description, role, liveUrl, repoUrl }) => [
                    `## ${title}`, description, role,
                    [liveUrl && link("Live site", liveUrl), repoUrl && link("Source", repoUrl)].filter(Boolean).join(" · ")
                ].filter(Boolean).join("\n\n")),
                "## Experience", experienceIntro,
                ...experience.map(({ title, company, date, status, description }) => [
                    `### ${title} · ${company}`, date || status, description
                ].filter(Boolean).join("\n\n"))
            ].join("\n\n");
        case "/uses":
            return [
                page.description,
                ...legacyUses.map(({ heading, items }) => `## ${heading}\n\n${items.map((item) => "- " + item).join("\n")}`),
                "## Stack",
                ...builtWith.map(({ projectId, skills }) => `- ${link(getProject(projectId).title, "/work#" + projectId)} — ${skills.join(", ")}`),
                "## Also use", alsoUse.join(", ")
            ].join("\n\n");
        case "uses-v2":
            return [
                copy.uses.intro,
                ...uses.map(({ heading, items }) => `## ${heading}\n\n${items.map(({ name, href, text, since }) =>
                    `- ${[href ? link(name, href) : name, text, since].filter(Boolean).join(" ")}`).join("\n")}`)
            ].join("\n\n");
        case "/contact":
            return [profile.contact, contactLinks.map(({ label, href }) => `- ${link(label, href)}`).join("\n")].join("\n\n");
        case "brain":
        case "blog": {
            const id = page.id === "brain" ? "brain-note" : "blog-post";
            const entries = pages.filter((entry) => entry.id === id);
            return [page.description, entries.length
                ? entries.map(({ heading, path }) => `- ${link(heading, path)}`).join("\n")
                : (page.id === "blog" ? copy.blog.empty : null)
            ].filter(Boolean).join("\n\n");
        }
        case "brain-note":
        case "blog-post": {
            const folder = page.id === "brain-note" ? "brain" : "blog";
            const { markdown } = JSON.parse(readFileSync(`src/generated/${folder}/${page.entry.slug}.json`, "utf8"));
            return [page.description, markdown.trim()].filter(Boolean).join("\n\n");
        }
        case "log":
            return [copy.log.intro, log.map(({ date, message }) => `- ${date} — ${message}`).join("\n")].filter(Boolean).join("\n\n");
        case "colophon":
            return copy.colophon.body;
    }
}

export function writeDiscovery(pages) {
    const today = new Date().toISOString().slice(0, 10);
    const sitemap = pages.map((page) => `    <url><loc>${escapeText(SITE_URL + page.path)}</loc><lastmod>${dateOf(page) ?? today}</lastmod></url>`).join("\n");
    writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);

    const home = pages.find(({ path }) => path === "/");
    const items = pages.filter(({ id, entry }) => id === "blog-post" || (id === "brain-note" && entry.state === "ink"))
        .sort((a, b) => dateOf(b).localeCompare(dateOf(a)) || a.path.localeCompare(b.path))
        .map((page) => {
            const href = escapeText(SITE_URL + page.path);
            const date = new Date(dateOf(page) + "T00:00:00Z").toUTCString();
            return [
                "        <item>",
                `            <title>${escapeText(page.heading)}</title>`,
                `            <link>${href}</link>`,
                `            <guid>${href}</guid>`,
                `            <description>${escapeText(page.description)}</description>`,
                `            <pubDate>${date}</pubDate>`,
                "        </item>"
            ].join("\n");
        });
    writeFileSync("dist/rss.xml", [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "    <channel>",
        `        <title>${escapeText(siteTitle)}</title>`,
        `        <link>${SITE_URL}/</link>`,
        `        <description>${escapeText(home.description)}</description>`,
        ...items,
        "    </channel>",
        "</rss>",
        ""
    ].join("\n"));

    const listing = [`# ${siteTitle}`, "", `> ${home.description}`, ""];
    for (const page of pages) {
        const title = page.heading ?? page.title.split(" · ", 1)[0];
        const description = page.description.replace(/\s+/g, " ").trim();
        const pathname = markdownPath(page.path);
        const file = "dist" + pathname;
        listing.push(`- ${link(title, SITE_URL + pathname)}${description ? ": " + description : ""}`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, [`# ${title}`, "", markdownBody(page, pages), ""].join("\n"));
    }
    writeFileSync("dist/llms.txt", listing.join("\n") + "\n");
}
