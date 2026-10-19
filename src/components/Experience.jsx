import { experience, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Experience() {
    return (
        <section id="experience" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Experience" note="work, community, and education" />
                <div className="border-l border-neutral-800 ml-1 space-y-8">
                    {experience.map((entry) => (
                        <article key={entry.id} className="relative pl-7">
                            <span aria-hidden="true" className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-green-400" />
                            <div className="flex flex-wrap justify-between gap-2">
                                <h3 className="font-mono text-base text-white">{entry.title} <span className="text-neutral-400">/ {entry.company}</span></h3>
                                <span className="text-xs text-neutral-400 font-mono">{entry.date || entry.status}</span>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl mt-3">{entry.description}</p>
                            {entry.projectId && <a href={`#${entry.projectId}`} className="inline-block text-xs text-green-400 font-mono mt-3 hover:underline">View {getProject(entry.projectId).title} <span aria-hidden="true">↗</span></a>}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
