import { projects } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Building() {
    return (
        <section id="building" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Building" note="Experiments and paused work" />
                <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                    {projects.filter((project) => project.buildingNote).map((project) => (
                        <article id={project.group === "building" ? project.id : undefined} key={project.id} className="py-6 grid sm:grid-cols-[170px_1fr_auto] gap-3 sm:gap-6 items-start">
                            <h3 className="text-white text-sm font-mono">{project.group === "building" ? project.title : <a href={`#${project.id}`} className="hover:text-green-400">{project.title} ↗</a>}</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">{project.buildingNote}</p>
                            <span className={`text-xs font-mono ${project.status === "On hold" ? "text-amber-300" : "text-green-400"}`}>{project.status}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
