import { projects } from "../data/portfolio";
import SectionHeading from "./SectionHeading";
import ProjectLinks from "./ProjectLinks";

export default function EarlierWork() {
    return (
        <section id="earlier-work" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Earlier work" note="where some of it started" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {projects
                        .filter((project) => project.group === "earlier")
                        .map((project) => (
                            <article
                                id={project.id}
                                key={project.id}
                                className="flex flex-col border-t border-neutral-700 pt-5"
                            >
                                <h3 className="text-sm text-white font-mono">{project.title}</h3>
                                <p className="text-xs text-neutral-400 leading-relaxed mt-3">{project.description}</p>
                                <p className="text-xs text-neutral-400 mt-3 mb-5">{project.role}</p>
                                <div className="mt-auto">
                                    <ProjectLinks project={project} />
                                </div>
                            </article>
                        ))}
                </div>
            </div>
        </section>
    );
}
