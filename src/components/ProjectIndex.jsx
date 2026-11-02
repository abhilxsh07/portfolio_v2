import { projects } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

// Everything on the page, bucketed by status. Lives at the bottom now so the
// actual work comes first; the jump links at the top cover quick navigation.
const groups = [
    { label: "building", statuses: ["In development", "In progress"] },
    { label: "shipped", statuses: ["Live", "Usable", "Built"] },
    { label: "paused", statuses: ["Shelved", "On hold"] }
];

export default function ProjectIndex() {
    return (
        <section id="all-projects" className="relative z-10 px-6 md:px-16 lg:px-24 pb-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Everything" note="By status" />
                <nav aria-label="All projects" className="grid sm:grid-cols-3 gap-8">
                    {groups.map(({ label, statuses }) => {
                        const items = projects.filter(
                            (project) => project.group !== "earlier" && statuses.includes(project.status)
                        );
                        if (!items.length) return null;
                        return (
                            <div key={label}>
                                <h3 className="font-mono text-xs text-green-400 mb-3">{label}</h3>
                                <ul className="space-y-3">
                                    {items.map((project) => (
                                        <li key={project.id}>
                                            <a href={`/work#${project.id}`} className="group block">
                                                <span className="font-mono text-sm text-white group-hover:text-green-400 transition-colors">
                                                    {project.title}
                                                </span>
                                                <span className="block text-xs text-neutral-400 leading-relaxed mt-0.5">
                                                    {project.subtitle}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
}
