import { profile, usesIntro } from "./portfolio.js";
import { copy } from "./copy.js";
import { ready } from "./ready.js";

export const SITE_URL = "https://abhilashkar.dev";
export const BRAIN_PATH = "/brain";

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
    { id: "blog", path: "/blog", heading: "Blog", intro: "blog.intro", description: copy.blog.intro },
    { id: "log", path: "/log", heading: "Log", intro: "log.intro", description: copy.log.intro },
    { id: "colophon", path: "/colophon", heading: "Colophon", description: copy.colophon.body }
].map((page) => ({
    ...page,
    title: `${page.heading} · ${profile.name}`,
    description: page.description ?? ""
}));

export function livePages() {
    const openPages = newPages.filter(({ id }) => ready[id]);
    return [...fixedPages.filter(({ path }) => !openPages.some((page) => page.path === path)), ...openPages];
}

export const navigation = [
    { label: "Work", href: "/work" },
    { label: brainName, href: BRAIN_PATH },
    { label: "Blog", href: "/blog" },
    { label: "Uses", href: "/uses" },
    { label: "Contact", href: "/contact" }
].filter(({ href }) => livePages().some(({ path }) => path === href));

export function previewPage(path) {
    if (path === "/uses-v2") return newPages[0];
    return newPages.find((page) => page.path === path) ?? null;
}

export const notFoundPage = {
    title: "Not found · Abhilash Kar",
    description: copy.notFound.body
};
