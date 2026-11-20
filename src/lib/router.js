import { useSyncExternalStore } from "react";

import { fixedPages } from "../data/pages";

const movedPages = {
    "/stack": "/uses#stack",
    "/experience": "/work#experience"
};

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener) {
    listeners.add(listener);
    window.addEventListener("popstate", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("popstate", listener);
    };
}

export function normalize(path) {
    return path.replace(/\/+$/, "") || "/";
}

export function useLocation() {
    const href = useSyncExternalStore(subscribe, () => {
        const path = window.location.pathname;
        return movedPages[normalize(path)] ?? path + window.location.hash;
    });
    const hashAt = href.indexOf("#");
    return {
        path: normalize(hashAt === -1 ? href : href.slice(0, hashAt)),
        hash: hashAt === -1 ? "" : href.slice(hashAt)
    };
}

export function resolve(path) {
    const normalized = normalize(path);
    return fixedPages.find((page) => page.path === normalized) ?? null;
}

export function isPage(url) {
    const path = normalize(url.pathname);
    return url.origin === window.location.origin && (resolve(path) !== null || Object.hasOwn(movedPages, path));
}

export function scrollToHash(hash, behavior = "auto") {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    // A target inside a closed <details> has no layout box, so open its containers first.
    for (let box = target.parentElement?.closest("details"); box; box = box.parentElement?.closest("details")) {
        box.open = true;
    }
    target.scrollIntoView({ block: "start", behavior });
    // Only things that opted in with tabindex (like <main> for the skip link) take focus.
    if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
}

export function navigate(to) {
    const url = new URL(to, window.location.href);
    const moved = movedPages[normalize(url.pathname)];
    if (moved) {
        const [path, hash] = moved.split("#");
        url.pathname = path;
        url.hash = hash;
    }
    if (url.href === window.location.href) {
        // Clicking the link for the page you're already on just takes you back to the spot.
        if (url.hash) scrollToHash(url.hash);
        else window.scrollTo({ top: 0, behavior: "instant" });
        return;
    }
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    notify();
}
