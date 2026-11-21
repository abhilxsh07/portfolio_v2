import { profile, usesIntro } from "./portfolio.js";
import { copy } from "./copy.js";
import { ready } from "./ready.js";

export const SITE_URL = "https://abhilashkar.dev";
export const BRAIN_PATH = "/brain";
export const BRAIN_MAP_PATH = `${BRAIN_PATH}?view=map`;
export const BLOG_PATH = "/blog";

const fixedPages = [
    {
        path: "/",
        title: "Abhilash Kar — Full-stack developer · Forma Labs",
        description: "Abhilash Kar, full-stack developer and co-founder of Forma Labs, a two-person product studio. Made sable, a native dark-mode PDF reader for Windows, now in public alpha. CSE student at SRMIST.",
        socialDescription: "I build web apps and Windows software. Co-founder of Forma Labs and CSE student at SRMIST. Made sable, a native dark-mode PDF reader for Windows (public alpha)."
    },
    { path: "/work", title: "Work · Abhilash Kar", description: "Selected projects" },
    { path: "/uses", title: "Uses · Abhilash Kar", description: usesIntro },
    { path: "/contact", title: "Contact · Abhilash Kar", description: profile.contact }
];

const brainName = BRAIN_PATH[1].toUpperCase() + BRAIN_PATH.slice(2);

const newPages = [
    { id: "uses-v2", path: "/uses", heading: "Uses", intro: "uses.intro", description: copy.uses.intro },
    { id: "brain", path: BRAIN_PATH, heading: brainName, intro: "brain.intro", description: copy.brain.intro },
    { id: "blog", path: BLOG_PATH, heading: "Blog", intro: "blog.intro", description: copy.blog.intro },
    { id: "log", path: "/log", heading: "Log", intro: "log.intro", description: copy.log.intro },
    { id: "colophon", path: "/colophon", heading: "Colophon", description: copy.colophon.body }
].map((page) => ({
    ...page,
    title: `${page.heading} · ${profile.name}`,
    description: page.description ?? ""
}));

export function markdownPath(path) {
    return (path === "/" ? "/index" : path) + ".md";
}

export function livePages() {
    const openPages = newPages.filter(({ id }) => ready[id]);
    return [...fixedPages.filter(({ path }) => !openPages.some((page) => page.path === path)), ...openPages];
}

export function navigation(preview) {
    const live = new Set(livePages().map(({ path }) => path));
    return [
        { label: "Work", path: "/work", href: "/work" },
        { label: brainName, path: BRAIN_PATH, href: BRAIN_MAP_PATH },
        { label: "Blog", path: BLOG_PATH, href: BLOG_PATH },
        { label: "Uses", path: "/uses", href: preview ? "/uses-v2" : "/uses" },
        { label: "Contact", path: "/contact", href: "/contact" }
    ].filter(({ path }) => preview || live.has(path));
}

export function previewPage(path) {
    if (path === "/uses-v2") return newPages[0];
    return newPages.find((page) => page.path === path) ?? null;
}

export function contentPages({ notes, posts }, preview = false) {
    return [
        { entries: notes, base: BRAIN_PATH, flag: "brain", id: "brain-note", summary: "hint" },
        { entries: posts, base: BLOG_PATH, flag: "blog", id: "blog-post", summary: "summary" }
    ].flatMap(({ entries, base, flag, id, summary }) => {
        if (!preview && !ready[flag]) return [];
        return entries.filter((entry) => preview || !entry.draft).map((entry) => ({
            id,
            path: `${base}/${entry.slug}`,
            title: `${entry.title} · ${profile.name}`,
            heading: entry.title,
            description: entry[summary] ?? "",
            entry
        }));
    });
}

export const notFoundPage = {
    title: "Not found · Abhilash Kar",
    description: copy.notFound.body
};
