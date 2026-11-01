import { projects } from "../data/portfolio";

// Bucket by status so the list stays honest when something stalls. Earlier work has its own section further down.
const groups = [
    { label: "building", statuses: ["In development", "In progress"] },
    { label: "shipped", statuses: ["Live", "Usable", "Built"] },
    { label: "shelved", statuses: ["Shelved", "On hold"] }
];

export default function ProjectIndex() {
    return (
        <nav aria-label="All projects" className="grid sm:grid-cols-3 gap-8 mb-14">
            {groups.map(({ label, statuses }) => {
                const items = projects.filter(
                    (project) => project.group !== "earlier" && statuses.includes(project.status)
                );
                if (!items.length) return null;
                return (
                    <div key={label}>
                        <h2 className="font-mono text-xs text-green-400 mb-3">{label}</h2>
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
    );
}
