import { readFileSync } from "node:fs";
import { copy } from "../src/data/copy.js";
import { uses } from "../src/data/portfolio.js";
import { ready } from "../src/data/ready.js";
import { brainRegions } from "../src/data/brain.js";

const copyGroups = {
    "uses-v2": ["uses"],
    brain: ["brain"],
    blog: ["blog", "doodle"],
    log: ["log"],
    colophon: ["colophon"]
};

const drawings = {
    "uses-v2": ["desk.svg", "doodle-laptop.svg", "doodle-pen.svg", "doodle-mug.svg", "doodle-phone.svg", "doodle-book.svg", "doodle-brush.svg"],
    brain: ["pencil-note.svg", ...brainRegions.map(({ doodle }) => doodle)],
    blog: ["floor.svg", "first-doodle.json"],
    log: [],
    colophon: []
};

function isPlaceholder(file) {
    let drawing;
    try {
        drawing = readFileSync(`public/drawings/${file}`, "utf8");
    } catch (error) {
        if (error.code === "ENOENT") return true;
        throw error;
    }
    return file.endsWith(".json") ? JSON.parse(drawing).placeholder === true : drawing.includes('data-placeholder="true"');
}

const missing = [];
for (const [page, isReady] of Object.entries(ready)) {
    if (!isReady) continue;
    for (const group of copyGroups[page]) {
        for (const [key, value] of Object.entries(copy[group])) {
            if (value === null) missing.push(`copy: ${group}.${key}`);
        }
    }
    for (const file of drawings[page]) {
        if (isPlaceholder(file)) missing.push(`drawing: ${file}`);
    }
    if (page === "uses-v2") {
        for (const { id, heading, items } of uses) {
            if (heading === null) missing.push(`copy: uses.${id}.heading`);
            for (const { name, text } of items) {
                if (text === null) missing.push(`copy: uses.${id}.${name}.text`);
            }
        }
    }
}

if (missing.length) {
    console.error(missing.join("\n"));
    process.exitCode = 1;
}
