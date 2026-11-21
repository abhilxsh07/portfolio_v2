const key = "brain-visited:v1";

export function readVisited() {
    try {
        const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(stored) ? stored.filter((slug) => typeof slug === "string") : [];
    } catch {
        return [];
    }
}

export function writeVisited(slugs) {
    try {
        localStorage.setItem(key, JSON.stringify(slugs));
    } catch {
        // The notes still work when storage is blocked.
    }
}
