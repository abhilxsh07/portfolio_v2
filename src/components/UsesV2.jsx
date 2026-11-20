import Copy from "./Copy";
import PageShell from "./PageShell";
import { uses } from "../data/portfolio";

export default function UsesV2() {
    return (
        <PageShell title="Uses" intro="uses.intro">
            <img src="/drawings/desk.svg" alt="Desk" className="mb-12 w-full" />
            <div className="space-y-12">
                {uses.map(({ id, heading, doodle, items }) => (
                    <section key={id} id={id} className="space-y-4">
                        <h2 className="flex items-center gap-3 font-mono text-sm text-green-400">
                            <img src={`/drawings/${doodle}`} alt="" className="h-9 w-12 object-contain" />
                            <Copy k={`uses.${id}.heading`} value={heading} />
                        </h2>
                        <ul className="space-y-2">
                            {items.map(({ name, href, since, text, retired }) => (
                                <li key={name} className={`break-words rounded px-3 py-2 text-sm leading-relaxed ${retired ? "text-neutral-400" : "text-neutral-300"}`}>
                                    {href ? (
                                        <a href={href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-green-400">
                                            {name}
                                        </a>
                                    ) : <span>{name}</span>}
                                    {text !== null && " "}
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
