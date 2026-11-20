import PageShell from "./PageShell";
import { brainRegions } from "../data/brain";
import { BRAIN_PATH } from "../data/pages";
import content from "../generated/index.json";

const notes = [...content.notes].sort((a, b) => (b.inked ?? b.pencilled).localeCompare(a.inked ?? a.pencilled));

export default function Brain({ title }) {
    return (
        <PageShell title={title} intro="brain.intro">
            <div className="space-y-10">
                {brainRegions.map(({ id, label }) => {
                    const group = notes.filter(({ region }) => region === id);
                    if (!group.length) return null;
                    return (
                        <section key={id}>
                            <h2 className="mb-3 font-mono text-sm text-green-400">{label}</h2>
                            <ul className="divide-y divide-neutral-800/60">
                                {group.map(({ slug, title, hint, state, draft }) => (
                                    <li key={slug}>
                                        <a href={`${BRAIN_PATH}/${slug}`} className="group flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-3">
                                            <span className={`h-2 w-2 shrink-0 rounded-full border ${state === "ink" ? "border-neutral-300 bg-neutral-300" : "border-neutral-400"} ${draft ? "opacity-50" : ""}`} aria-hidden="true" />
                                            <span className="sr-only">{state === "ink" ? "Ink" : "Pencil"}</span>
                                            <span className="font-mono text-sm text-neutral-200 group-hover:text-green-400">{title}</span>
                                            {hint && <span className="text-sm text-neutral-400">{hint}</span>}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </PageShell>
    );
}
