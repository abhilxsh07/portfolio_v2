import Copy from "./Copy";
import DoodleBox from "./DoodleBox";
import PageShell from "./PageShell";
import { BLOG_PATH } from "../data/pages";
import { copy } from "../data/copy";
import content from "../generated/index.json";

const posts = [...content.posts].sort((a, b) => b.date.localeCompare(a.date));
const years = [...new Set(posts.map(({ date }) => date.slice(0, 4)))];
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default function Blog({ showSlots }) {
    return (
        <PageShell title="Blog" intro={copy.blog.intro || showSlots ? "blog.intro" : null}>
            {posts.length === 0 ? (
                <p className="border-y border-neutral-800 py-4 text-sm text-neutral-400">
                    {copy.blog.empty !== null || showSlots ? <Copy k="blog.empty" /> : "No posts yet."}
                </p>
            ) : (
                <div className="space-y-9">
                    {years.map((year) => (
                        <section key={year}>
                            <h2 className="mb-3 font-mono text-sm text-green-400">{year}</h2>
                            <ul className="divide-y divide-neutral-800/60">
                                {posts.filter(({ date }) => date.startsWith(year)).map(({ slug, title, date, minutes }) => (
                                    <li key={slug}>
                                        <a href={`${BLOG_PATH}/${slug}`} className="group flex min-h-11 flex-wrap items-baseline gap-3 py-3 text-sm">
                                            <time dateTime={date} className="w-16 font-mono text-xs text-neutral-400">{dateFormat.format(new Date(date + "T00:00:00Z"))}</time>
                                            <span className="font-mono text-neutral-200 group-hover:text-green-400">{title}</span>
                                            <span className="font-mono text-xs text-neutral-400">{minutes} min</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
            <DoodleBox showSlots={showSlots} />
        </PageShell>
    );
}
