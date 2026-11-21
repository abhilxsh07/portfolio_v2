import PageShell from "./PageShell";
import { copy } from "../data/copy";
import log from "../generated/site-log.json";

export default function SiteLog({ showSlots }) {
    return (
        <PageShell title="Log" intro={copy.log.intro !== null || showSlots ? "log.intro" : null}>
            {log.length === 0 ? <p className="border-t border-neutral-800 pt-4 text-sm text-neutral-400">No entries yet.</p> : (
                <ul className="divide-y divide-neutral-800/60">
                    {log.map(({ hash, date, message }) => (
                        <li key={hash} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 text-sm text-neutral-300">
                            <time dateTime={date} className="font-mono text-xs text-pencil">{date}</time>
                            <span>{message}</span>
                        </li>
                    ))}
                </ul>
            )}
        </PageShell>
    );
}
