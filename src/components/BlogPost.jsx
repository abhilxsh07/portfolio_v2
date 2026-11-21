import { lazy } from "react";
import MarkdownBody from "./MarkdownBody";
import PageShell from "./PageShell";
import { BLOG_PATH, BRAIN_PATH } from "../data/pages";
import { resolve } from "../lib/router";

const files = import.meta.glob("../generated/blog/*.json", { import: "default" });
const bodies = Object.fromEntries(Object.entries(files).map(([file, load]) => [
    file,
    lazy(async () => {
        const { html } = await load();
        return {
            default: function PostBody() {
                return <MarkdownBody as="article" html={html} />;
            }
        };
    })
]));

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function BlogPost({ post }) {
    const { slug, title, date, minutes, links } = post;
    const Body = bodies[`../generated/blog/${slug}.json`];
    const notes = links.map((note) => resolve(`${BRAIN_PATH}/${note}`)).filter(Boolean);

    return (
        <PageShell title={title} beforeTitle={
            <a href={BLOG_PATH} className="mb-4 inline-flex min-h-11 items-center font-mono text-xs text-pencil hover:text-green-400">Back to Blog</a>
        }>
            <p className="-mt-6 mb-7 font-mono text-xs text-neutral-400">
                <time dateTime={date}>{dateFormat.format(new Date(date + "T00:00:00Z"))}</time>
                {` · ${minutes} min`}
            </p>
            <Body />
            {notes.length > 0 && (
                <section className="mt-10 border-t border-neutral-800 pt-5">
                    <h2 className="mb-3 font-mono text-sm text-green-400">Notes</h2>
                    <ul className="space-y-2">
                        {notes.map(({ path, heading }) => (
                            <li key={path}><a href={path} className="text-sm text-neutral-300 underline underline-offset-4 hover:text-green-400">{heading}</a></li>
                        ))}
                    </ul>
                </section>
            )}
        </PageShell>
    );
}
