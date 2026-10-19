import { useSyncExternalStore } from "react";

export const pages = {
    "/": "Abhilash Kar — Full-stack developer · Forma Labs",
    "/work": "Work · Abhilash Kar",
    "/stack": "Stack · Abhilash Kar",
    "/experience": "Experience · Abhilash Kar",
    "/contact": "Contact · Abhilash Kar"
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
    const href = useSyncExternalStore(subscribe, () => window.location.pathname + window.location.hash);
    const hashAt = href.indexOf("#");
    return {
        path: normalize(hashAt === -1 ? href : href.slice(0, hashAt)),
        hash: hashAt === -1 ? "" : href.slice(hashAt)
    };
}

export function isPage(url) {
    return url.origin === window.location.origin && normalize(url.pathname) in pages;
}

export function scrollToHash(hash, behavior = "auto") {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView({ block: "start", behavior });
}

export function navigate(to) {
    const url = new URL(to, window.location.href);
    if (url.href === window.location.href) {
        // Clicking the link for the page you're already on just takes you back to the spot.
        if (url.hash) scrollToHash(url.hash);
        else window.scrollTo({ top: 0, behavior: "instant" });
        return;
    }
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    notify();
}
