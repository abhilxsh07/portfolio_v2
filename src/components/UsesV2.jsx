import { useState } from "react";
import Copy from "./Copy";
import Desk from "./Desk";
import PageShell from "./PageShell";
import { copy } from "../data/copy";
import { uses } from "../data/portfolio";
import { ready } from "../data/ready";

const sectionLabels = {
    laptop: "Hardware",
    code: "Code",
    drawing: "Creative tools",
    fuel: "Fuel",
    stack: "Stack",
    retired: "Retired"
};

export default function UsesV2({ showSlots }) {
    const [pointed, setPointed] = useState(null);
    const [focused, setFocused] = useState(null);
    const active = pointed ?? focused;

    return (
        <PageShell title="Uses" intro={copy.uses.intro || showSlots ? "uses.intro" : null}>
            <Desk onPoint={setPointed} onFocus={setFocused} showPlaceholder={showSlots} />
            <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                {uses.map(({ id, heading, doodle, items }) => (
                    <section
                        key={id}
                        id={id === "stack" ? id : `uses-${id}-section`}
                        className="grid gap-3 py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:py-6"
                    >
                        <h2 className="flex items-start gap-2.5 pt-1 font-serif text-xl italic text-paper">
                            {(ready["uses-v2"] || showSlots) && <img src={`/drawings/${doodle}`} alt="" className="h-6 w-7 shrink-0 object-contain" />}
                            {heading !== null || showSlots
                                ? <Copy k={`uses.${id}.heading`} value={heading} />
                                : sectionLabels[id]}
                        </h2>
                        <ul className={`grid min-w-0 gap-x-5 gap-y-1 ${items.length > 2 && id !== "stack" && !showSlots ? "sm:grid-cols-2" : ""}`}>
                            {items.map(({ name, href, since, text, desk, retired }) => (
                                <li
                                    key={name}
                                    id={desk ? `uses-${desk}` : undefined}
                                    tabIndex={desk ? -1 : undefined}
                                    className={`min-w-0 rounded-md px-2 py-1.5 text-sm leading-relaxed [overflow-wrap:anywhere] transition-colors ${retired ? "text-neutral-400" : "text-neutral-200"} ${desk && desk === active ? "bg-green-400/10" : ""}`}
                                >
                                    {href ? (
                                        <a href={href} target="_blank" rel="noopener" className="underline decoration-neutral-600 underline-offset-4 hover:text-green-400 hover:decoration-current">
                                            {name}
                                        </a>
                                    ) : <span>{name}</span>}
                                    {since && <span className="ml-2 font-mono text-xs text-neutral-400">{since}</span>}
                                    {(text !== null || showSlots) && (
                                        <p className="mt-1 text-neutral-400"><Copy k={`uses.${id}.${name}.text`} value={text} /></p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageShell>
    );
}
