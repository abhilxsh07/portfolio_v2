import PageShell from "./PageShell";
import log from "../generated/site-log.json";

export default function SiteLog() {
    return (
        <PageShell title="Log" intro="log.intro">
            <ul className="divide-y divide-neutral-800/60">
                {log.map(({ hash, date, message }) => (
                    <li key={hash} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 text-sm text-neutral-300">
                        <time dateTime={date} className="font-mono text-xs text-neutral-400">{date}</time>
                        <span>{message}</span>
                    </li>
                ))}
            </ul>
        </PageShell>
    );
}
