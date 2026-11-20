import { useState } from "react";
import Copy from "./Copy";
import Desk from "./Desk";
import PageShell from "./PageShell";
import { uses } from "../data/portfolio";

export default function UsesV2() {
    const [pointed, setPointed] = useState(null);
    const [focused, setFocused] = useState(null);
    const active = pointed ?? focused;

    return (
        <PageShell title="Uses" intro="uses.intro">
            <Desk onPoint={setPointed} onFocus={setFocused} />
            <div className="space-y-12">
                {uses.map(({ id, heading, doodle, items }) => (
                    <section key={id} id={id === "stack" ? id : `uses-${id}-section`} className="space-y-4">
                        <h2 className="flex items-center gap-3 font-mono text-sm text-green-400">
                            <img src={`/drawings/${doodle}`} alt="" className="h-9 w-12 object-contain" />
                            <Copy k={`uses.${id}.heading`} value={heading} />
                        </h2>
                        <ul className="space-y-2">
                            {items.map(({ name, href, since, text, desk, retired }) => (
                                <li
                                    key={name}
                                    id={desk ? `uses-${desk}` : undefined}
                                    tabIndex={desk ? -1 : undefined}
                                    className={`break-words rounded px-3 py-2 text-sm leading-relaxed transition-colors ${retired ? "text-neutral-400" : "text-neutral-300"} ${desk && desk === active ? "bg-green-400/10" : ""}`}
                                >
                                    {href ? (
                                        <a href={href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-green-400">
                                            {name}
                                        </a>
                                    ) : <span>{name}</span>}
                                    {" "}
                                    <Copy k={`uses.${id}.${name}.text`} value={text} />
                                    {since && <span className="ml-2 font-mono text-xs text-neutral-400">{since}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageShell>
    );
}
