import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import { Marked } from "marked";
import markedFootnote from "marked-footnote";
import { brainRegions } from "../src/data/brain.js";
import { BRAIN_PATH } from "../src/data/pages.js";
import { ready } from "../src/data/ready.js";
import { copy } from "../src/data/copy.js";
import { layoutBrain } from "./layout-brain.mjs";

const development = process.argv.includes("--dev");
const content = new URL("../src/content/", import.meta.url);
const output = new URL("../src/generated/", import.meta.url);
const regions = new Set(brainRegions.map(({ id }) => id));

function date(value, field, file) {
    const text = value instanceof Date && Number.isFinite(value.getTime()) ? value.toISOString().slice(0, 10) : value;
    const parsed = new Date(`${text}T00:00:00Z`);
    if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
        throw new Error(`Expected ${field} in YYYY-MM-DD format: ${file}`);
    }
    return text;
}

function readEntries(folder) {
    const directory = new URL(folder + "/", content);
    if (!existsSync(directory)) return [];
    const blog = folder === "blog";
    const entries = [];
    const slugs = new Set();
    for (const file of readdirSync(directory).sort()) {
        if (!file.endsWith(".md")) continue;
        const path = `${folder}/${file}`;
        const filename = file.slice(0, -3);
        const slug = blog ? filename.replace(/^\d{4}-\d{2}-\d{2}-/, "") : filename;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || (blog && slug === filename) || slugs.has(slug)) {
            throw new Error(`Invalid or repeated slug: ${path}`);
        }
        const { data, content: markdown } = matter(readFileSync(new URL(file, directory), "utf8"));
        if (typeof data.title !== "string" || !data.title.trim()) {
            throw new Error(`Missing title: ${path}`);
        }
        const tags = data.tags ?? [];
        if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
            throw new Error(`Expected tags to be a list of strings: ${path}`);
        }
        if (data.draft != null && typeof data.draft !== "boolean") {
            throw new Error(`Expected draft to be true or false: ${path}`);
        }
        if (!blog && (!regions.has(data.region) || !["pencil", "ink"].includes(data.state))) {
            throw new Error(`Invalid note region or state: ${path}`);
        }
        slugs.add(slug);
        const shared = { slug, title: data.title, tags: [...new Set(tags)], draft: data.draft === true };
        const details = blog
            ? { date: date(data.date, "date", path), summary: data.summary ?? null }
            : {
                region: data.region,
                state: data.state,
                pencilled: date(data.pencilled, "pencilled", path),
                inked: data.inked == null ? null : date(data.inked, "inked", path),
                hint: data.hint ?? null
            };
        entries.push({ ...shared, ...details, markdown });
    }
    return entries;
}

const notes = readEntries("brain");
const posts = readEntries("blog");
const notesBySlug = new Map(notes.map((note) => [note.slug, note]));

function renderEntry({ markdown }) {
    const links = new Set();
    let words = 0;
    const parser = new Marked(markedFootnote(), {
        extensions: [{
            name: "wikiLink",
            level: "inline",
            start(source) {
                return source.indexOf("[[");
            },
            tokenizer(source) {
                const match = /^\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:\|([^\]\n]+))?\]\]/.exec(source);
                if (!match) return;
                const [, slug, label] = match;
                return { type: "wikiLink", raw: match[0], slug, label: label ?? notesBySlug.get(slug)?.title ?? slug };
            },
            renderer({ slug, label }) {
                const note = notesBySlug.get(slug);
                const text = label.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                const linkText = !note || note.draft ? `<s title="not written yet">${text}</s>` : text;
                return note && (development || (ready.brain && !note.draft)) ? `<a href="${BRAIN_PATH}/${slug}">${linkText}</a>` : linkText;
            }
        }],
        walkTokens(token) {
            if (token.type === "wikiLink") links.add(token.slug);
            const text = token.type === "wikiLink" ? token.label : (token.type === "text" && !token.tokens ? token.text : "");
            words += text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
        }
    });
    const html = parser.parse(markdown);
    return { html, links: [...links], minutes: Math.max(1, Math.ceil(words / 200)) };
}

function writeEntries(folder, entries) {
    const directory = new URL(folder + "/", output);
    mkdirSync(directory, { recursive: true });
    const filenames = new Set();
    const index = [];
    for (const entry of entries) {
        if (entry.draft && !development) continue;
        const { markdown, ...details } = entry;
        const { html, links, minutes } = renderEntry(entry);
        const filename = entry.slug + ".json";
        filenames.add(filename);
        writeFileSync(new URL(filename, directory), JSON.stringify({ html, markdown }) + "\n");
        index.push({ ...details, links, minutes });
    }
    for (const file of readdirSync(directory)) {
        if (/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(file) && !filenames.has(file)) unlinkSync(new URL(file, directory));
    }
    return index;
}

const noteIndex = writeEntries("brain", notes);
const postIndex = writeEntries("blog", posts);
for (const note of noteIndex) note.backlinks = [];
const indexedNotes = new Map(noteIndex.map((note) => [note.slug, note]));
for (const [kind, entries] of [["note", noteIndex], ["post", postIndex]]) {
    for (const entry of entries) {
        for (const slug of entry.links) indexedNotes.get(slug)?.backlinks.push({ kind, slug: entry.slug });
    }
}

const map = development || ready.brain
    ? layoutBrain(notes.map((note) => ({
        ...note, links: indexedNotes.get(note.slug)?.links ?? renderEntry(note).links
    })), development || ready.blog ? postIndex : [], development)
    : undefined;
const colophon = (development || ready.colophon) && copy.colophon.body !== null ? renderEntry({ markdown: copy.colophon.body }).html : null;
writeFileSync(new URL("colophon.json", output), JSON.stringify({ html: colophon }) + "\n");
writeFileSync(new URL("index.json", output), JSON.stringify({ notes: noteIndex, posts: postIndex, map }) + "\n");
