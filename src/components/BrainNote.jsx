import { lazy, Suspense, useEffect, useState } from "react";
import Copy from "./Copy";
import MarkdownBody from "./MarkdownBody";
import PageShell from "./PageShell";
import { brainRegions } from "../data/brain";
import { copy } from "../data/copy";
import { BRAIN_PATH, BLOG_PATH } from "../data/pages";
import { ready } from "../data/ready";
import { resolve } from "../lib/router";
import { readVisited, writeVisited } from "../lib/brainVisited";
import content from "../generated/index.json";

const BrainMap = lazy(() => import("./BrainMap"));

const files = import.meta.glob("../generated/brain/*.json", { import: "default" });
const bodies = Object.fromEntries(Object.entries(files).map(([file, load]) => [
    file,
    lazy(async () => {
        const { html } = await load();
        return {
            default: function NoteBody() {
                return <MarkdownBody html={html} />;
            }
        };
    })
]));

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default function BrainNote({ note, showSlots }) {
    const { slug, title, region, state, pencilled, inked, minutes, tags } = note;
    const [newlyOpened] = useState(() => readVisited().includes(slug) ? null : slug);
    const { doodle } = brainRegions.find(({ id }) => id === region);
    const pencil = state === "pencil";
    const tone = pencil ? "text-[#a3a3a3]" : "text-[#e5e5e5]";
    const showDrawings = ready.brain || showSlots;
    const Body = bodies[`../generated/brain/${slug}.json`];
    const backlinks = note.backlinks
        .map(({ kind, slug }) => resolve(`${kind === "note" ? BRAIN_PATH : BLOG_PATH}/${slug}`))
        .filter(Boolean);

    useEffect(() => {
        const visited = readVisited();
        if (!visited.includes(slug)) writeVisited([...visited, slug]);
    }, [slug]);

    return (
        <PageShell
            title={title}
            headingColor={tone}
            beforeTitle={
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <a href={showSlots ? `${BRAIN_PATH}?slots=1` : BRAIN_PATH} className="inline-flex min-h-11 items-center font-mono text-xs text-pencil hover:text-green-400">Back to Brain</a>
                    {showDrawings && <img src={`/drawings/${doodle}`} alt="" className="h-10 w-14 object-contain" />}
                    {showDrawings && pencil && <img src="/drawings/pencil-note.svg" alt="" className="h-10 w-14 object-contain" />}
                    {note.draft && <span className="font-mono text-xs text-neutral-400">Draft</span>}
                </div>
            }
        >
            <p className="-mt-6 mb-5 font-mono text-xs text-neutral-400">
                {"pencilled "}
                <time dateTime={pencilled}>{dateFormat.format(new Date(pencilled + "T00:00:00Z"))}</time>
                {inked && (
                    <>
                        {" · inked "}
                        <time dateTime={inked}>{dateFormat.format(new Date(inked + "T00:00:00Z"))}</time>
                    </>
                )}
                {` · ${minutes} min`}
            </p>
            {tags.length > 0 && (
                <ul aria-label="Tags" className="mb-7 flex flex-wrap gap-3 font-mono text-xs text-neutral-400">
                    {tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
            )}
            <article className={tone}>
                <Body />
            </article>
            {backlinks.length > 0 && (
                <section className="mt-10 border-t border-neutral-800 pt-5">
                    <h2 className="mb-3 font-serif text-xl italic text-paper">
                        {copy.brain.backlinks !== null || showSlots ? <Copy k="brain.backlinks" /> : "Linked from"}
                    </h2>
                    <ul className="space-y-2">
                        {backlinks.map(({ path, heading }) => (
                            <li key={path}><a href={path} className="text-sm text-neutral-300 underline underline-offset-4 hover:text-green-400">{heading}</a></li>
                        ))}
                    </ul>
                </section>
            )}
            {content.map && (
                <div className="mt-10">
                    <Suspense fallback={null}>
                        <BrainMap map={content.map} centre={`note:${slug}`} newlyOpened={newlyOpened} showSlots={showSlots} />
                    </Suspense>
                </div>
            )}
        </PageShell>
    );
}
