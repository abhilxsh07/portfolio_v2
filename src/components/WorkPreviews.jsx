import { getProject } from "../data/portfolio";
import CursusOverview from "./CursusOverview";
import sableReader from "../assets/sable/reader.png";

const previews = [
    {
        project: getProject("sable"),
        status: "In development",
        visual: (
            <img
                src={sableReader}
                width={1440}
                height={774}
                loading="lazy"
                alt="sable showing a sample document with the Default night preset and page thumbnails"
                className="w-full aspect-[1440/774] object-cover object-top border-b border-neutral-800"
            />
        )
    },
    {
        project: getProject("cursus"),
        status: "Shelved · sign-ups closed",
        visual: (
            <div className="p-4 border-b border-neutral-800">
                <CursusOverview />
            </div>
        )
    }
];

// One native project and one web one, straight under the hero.
export default function WorkPreviews() {
    return (
        <section aria-labelledby="work-preview-heading" className="relative z-10 px-6 md:px-16 lg:px-24 pb-14">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h2 id="work-preview-heading" className="font-mono text-sm text-green-400">
                        selected work
                    </h2>
                    <a href="/work" className="min-h-11 inline-flex items-center font-mono text-xs text-neutral-400 hover:text-white">
                        all projects <span aria-hidden="true" className="ml-1">→</span>
                    </a>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {previews.map(({ project, status, visual }) => (
                        <a
                            key={project.id}
                            href={`/work#${project.id}`}
                            className="group flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-600 transition-colors"
                        >
                            {visual}
                            <span className="flex flex-col flex-1 p-5">
                                <span className="font-mono text-xs text-neutral-400">{status}</span>
                                <span className="text-xl text-white font-mono mt-2">{project.title}</span>
                                <span className="text-sm text-neutral-200 mt-1">{project.subtitle}</span>
                                <span className="text-sm text-neutral-400 leading-relaxed mt-3">{project.role}</span>
                                <span className="mt-auto pt-4 font-mono text-xs text-neutral-300 group-hover:text-green-400 transition-colors">
                                    Read the case study <span aria-hidden="true">→</span>
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
