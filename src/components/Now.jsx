import { getProject, now } from "../data/portfolio";

const release = getProject("sable").downloadUrl;

// "1 Nov 2026" reads better than the ISO date. The T00:00 keeps it from slipping a day in other timezones.
const updated = new Date(`${now.updated}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

export default function Now() {
    return (
        <section id="now" aria-labelledby="now-heading" className="relative z-10 px-6 pb-10 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <div className="grid max-w-3xl gap-x-6 gap-y-2 border-l-2 border-pencil/50 bg-pencil/5 py-3.5 pl-4 pr-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-col">
                        <h2 id="now-heading" className="font-serif text-xl italic text-paper">
                            On my desk
                        </h2>
                        <time dateTime={now.updated} className="font-mono text-xs text-pencil">{updated}</time>
                    </div>
                    <p className="self-center text-sm leading-relaxed text-neutral-300">
                        {now.text}{" "}
                        <a href={release} className="whitespace-nowrap text-green-400 underline underline-offset-4 hover:text-green-300">View the GitHub release</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
