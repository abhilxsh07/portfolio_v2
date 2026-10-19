import { projects, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";
import ProjectLinks from "./ProjectLinks";
import cursusImage from "../assets/Cursus.webp";
import ultronImage from "../assets/myUltron.webp";

const decisions = [
    ["Keep user data separate", "Supabase row-level security and private storage scope access to each user's material."],
    ["Bound AI spending", "Per-user daily request and token budgets reserve capacity before model work begins."],
    ["Fail closed in production", "Protected requests are refused when the production rate limiter is absent or unavailable."],
    ["Validate the upload itself", "File-size, MIME, extension, and magic-byte checks verify uploads before processing."],
];
const pipeline = [
    ["01 / Upload", "PDFs and images", "Private Supabase Storage"],
    ["02 / Process", "Convert and index", "Inngest background jobs"],
    ["03 / Retrieve", "Find relevant chunks", "Postgres + pgvector"],
    ["04 / Study", "Chat, summaries, quizzes", "Next.js + OpenAI"],
];

function CursusFeature() {
    const project = getProject("cursus");
    return (
        <article id="cursus" className="rounded-2xl border border-neutral-700 bg-neutral-900/60 overflow-hidden mb-8">
            <div className="p-6 md:p-9 grid md:grid-cols-[1.15fr_1fr] gap-8 items-center">
                <div>
                    <p className="text-xs text-green-400 font-mono mb-4">FEATURED / {project.status.toUpperCase()}</p>
                    <h3 className="text-4xl md:text-5xl text-white font-light tracking-tight">{project.title}</h3>
                    <p className="text-lg text-neutral-200 mt-3">{project.subtitle}</p>
                    <p className="text-sm text-neutral-400 leading-relaxed mt-5">{project.description}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-5 mb-5">{project.role}</p>
                    <ProjectLinks project={project} />
                </div>
                <figure>
                    <a href={cursusImage} target="_blank" rel="noopener noreferrer" aria-label="Open full-size Cursus landing page screenshot">
                        <img src={cursusImage} width="1919" height="939" loading="lazy" alt="Cursus landing page introducing its study workspace, boards, calendar sync, and grounded chat" className="w-full rounded-lg border border-neutral-800" />
                    </a>
                    <figcaption className="text-xs text-neutral-400 mt-3 leading-relaxed">The Cursus landing page. Open the image for a closer look.</figcaption>
                </figure>
            </div>
            <details className="group border-t border-neutral-800">
                <summary className="cursor-pointer px-6 md:px-9 py-5 text-sm font-mono text-neutral-200 hover:text-green-400">Inside Cursus — architecture & engineering decisions</summary>
                <div className="px-6 md:px-9 pb-9 space-y-9">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div><h4 className="text-sm text-white font-mono mb-3">The problem</h4><p className="text-sm text-neutral-400 leading-relaxed">Course material is spread across files and deadlines. I built a workspace where the material itself becomes the starting point for study: organize it, ask questions, and practice from the same source.</p></div>
                        <div><h4 className="text-sm text-white font-mono mb-3">What I built</h4><p className="text-sm text-neutral-400 leading-relaxed">The full-stack study workspace: collections and views, private uploads, background indexing, grounded AI tools, and one-way Google Calendar sync.</p></div>
                    </div>
                    <div>
                        <h4 className="text-sm text-white font-mono mb-4">From upload to answer</h4>
                        <ol aria-label="Cursus upload and retrieval architecture" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {pipeline.map(([step, title, detail]) => <li key={step} className="rounded-lg border border-neutral-700 bg-neutral-950/60 p-4"><p className="text-xs text-green-400 font-mono">{step}</p><p className="text-sm text-white mt-3">{title}</p><p className="text-xs text-neutral-400 mt-2 leading-relaxed">{detail}</p></li>)}
                        </ol>
                        <p className="text-xs text-neutral-400 mt-4 leading-relaxed">The Next.js app coordinates authenticated requests. Calendar sync is a separate, one-way integration for dated workspace items.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {decisions.map(([title, description]) => <div key={title}><h4 className="text-sm text-white mb-2">{title}</h4><p className="text-sm text-neutral-400 leading-relaxed">{description}</p></div>)}
                    </div>
                    <div className="border-l-2 border-neutral-600 pl-4"><h4 className="text-sm text-white mb-2">A deliberate tradeoff</h4><p className="text-sm text-neutral-400 leading-relaxed">Background ingestion keeps document processing out of the upload request, but material needs to finish indexing before it can support chat. Calendar sync goes from Cursus to Google Calendar; it does not reconcile edits in both directions.</p></div>
                    <p className="text-xs text-neutral-400 font-mono leading-relaxed">{project.tech.join(" · ")}</p>
                </div>
            </details>
        </article>
    );
}

export default function Projects() {
    return (
        <section id="projects" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading title="Work" note="products, tools, and experiments" />
                <CursusFeature />
                <div className="grid md:grid-cols-2 gap-4">
                    {projects.filter((project) => project.group === "selected").map((project) => (
                        <article id={project.id} key={project.id} className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-600 transition-colors">
                            {project.id === "ultron" && <img src={ultronImage} loading="lazy" width="1919" height="939" alt="Ultron 9.0 hackathon website" className="w-full aspect-[2/1] object-cover object-top rounded-lg border border-neutral-800 mb-5" />}
                            <div className="flex flex-wrap justify-between gap-2 items-baseline"><h3 className="text-xl text-white font-mono">{project.title}</h3><span className="text-[11px] font-mono text-neutral-400">{project.status}</span></div>
                            <p className="text-sm text-neutral-300 mt-3 leading-relaxed">{project.description}</p>
                            <p className="text-xs text-neutral-400 font-mono mt-4">{project.role}</p>
                            <p className="text-sm text-neutral-300 border-l-2 border-green-400/40 pl-3 mt-4 leading-relaxed">{project.proof}</p>
                            <p className="text-xs text-neutral-400 mt-5 mb-5 leading-relaxed">{project.tech.join(" · ")}</p>
                            <div className="mt-auto"><ProjectLinks project={project} /></div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
