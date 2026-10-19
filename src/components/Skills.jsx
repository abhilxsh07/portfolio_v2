import { builtWith, alsoUse, learning, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Skills() {
    return (
        <section id="skills" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Built with" note="the stack, with the work to show for it" />
                <div className="grid sm:grid-cols-2 gap-3">
                    {builtWith.map(({ projectId, skills }) => (
                        <a key={projectId} href={`#${projectId}`} className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-neutral-600 transition-colors">
                            <span className="text-sm text-green-400 font-mono">{getProject(projectId).title} <span aria-hidden="true">↗</span></span>
                            <p className="text-sm text-neutral-300 leading-relaxed mt-3">{skills.join(" · ")}</p>
                        </a>
                    ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-8 mt-10">
                    <div><h3 className="text-sm font-mono text-white mb-3">Also use</h3><p className="text-sm text-neutral-400 leading-relaxed">{alsoUse.join(" · ")}</p></div>
                    <div><h3 className="text-sm font-mono text-white mb-3">Learning</h3><p className="text-sm text-neutral-400 leading-relaxed">{learning.join(" · ")}</p></div>
                </div>
            </div>
        </section>
    );
}
