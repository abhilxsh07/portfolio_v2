import { profile, usesIntro } from "./portfolio.js";
import { copy } from "./copy.js";

export const SITE_URL = "https://abhilashkar.dev";
export const BRAIN_PATH = "/brain";

export const fixedPages = [
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

export const notFoundPage = {
    title: "Not found · Abhilash Kar",
    description: copy.notFound.body
};
