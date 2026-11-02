import { projects } from "../data/portfolio";
import ProjectLinks from "./ProjectLinks";

const earlier = projects.filter((project) => project.group === "earlier");

// Collapsed by default. scrollToHash opens it when a link points at something inside.
export default function EarlierWork() {
    return (
        <section id="earlier-work" className="relative z-10 px-6 md:px-16 lg:px-24 pb-16">
            <div className="max-w-5xl mx-auto">
                <details className="group border-y border-neutral-800">
                    <summary className="cursor-pointer py-5 flex items-baseline justify-between gap-3 text-neutral-200 hover:text-green-400">
                        <h2 className="text-lg font-light">Earlier work</h2>
                        <span className="font-mono text-xs text-neutral-400">
                            {earlier.length} older projects <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">›</span>
                        </span>
                    </summary>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-8">
                        {earlier.map((project) => (
                            <article id={project.id} key={project.id} className="flex flex-col border-t border-neutral-700 pt-5">
                                <h3 className="text-sm text-white font-mono">{project.title}</h3>
                                <p className="text-sm text-neutral-300 leading-relaxed mt-3">{project.description}</p>
                                <p className="text-xs text-neutral-400 mt-3 mb-5">{project.role}</p>
                                <div className="mt-auto">
                                    <ProjectLinks project={project} />
                                </div>
                            </article>
                        ))}
                    </div>
                </details>
            </div>
        </section>
    );
}
