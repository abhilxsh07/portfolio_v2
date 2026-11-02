import { now } from "../data/portfolio";

// "1 Nov 2026" reads better than the ISO date. The T00:00 keeps it from slipping a day in other timezones.
const updated = new Date(`${now.updated}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

export default function Now() {
    return (
        <section id="now" aria-labelledby="now-heading" className="relative z-10 px-6 md:px-16 lg:px-24 pb-12">
            <div className="max-w-5xl mx-auto">
                <div className="border-l-2 border-green-400/60 pl-5 max-w-2xl">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 id="now-heading" className="font-mono text-sm text-green-400">
                            now
                        </h2>
                        <span className="font-mono text-xs text-neutral-400">updated {updated}</span>
                    </div>
                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed mt-3">{now.text}</p>
                </div>
            </div>
        </section>
    );
}
