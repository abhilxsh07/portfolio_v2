import { projects, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";
import ProjectLinks from "./ProjectLinks";
import ScreenGallery from "./ScreenGallery";
import ProjectIndex from "./ProjectIndex";
import ProjectWalkthrough, { CursusOverview } from "./ProjectWalkthrough";
import { sableTour, cursusTour } from "../data/walkthroughs";
import ultronImage from "../assets/myUltron.webp";
import sableReader from "../assets/sable/reader.png";
import sableSepia from "../assets/sable/sepia.png";
import sableFind from "../assets/sable/find.png";
import sableOutline from "../assets/sable/outline.png";

const sableScreens = [
    {
        title: "Night",
        image: sableReader,
        alt: "sable showing a document with the Default night filter and page thumbnails in the right rail"
    },
    { title: "Sepia", image: sableSepia, alt: "The same document with the Sepia preset applied" },
    {
        title: "Find",
        image: sableFind,
        alt: "Find with six matches for the word contrast, the current match highlighted in orange"
    },
    {
        title: "Outline",
        image: sableOutline,
        alt: "The document outline sidebar showing nested chapters and sections"
    }
];
const sableDecisions = [
    [
        "The filter only touches the page",
        "Presets change how pages are drawn, not the UI, thumbnails or printouts, so documents still print in their real colours."
    ],
    [
        "Keep the familiar filter behavior",
        "Presets, filter order, shortcuts and settings follow NightPDF. The native shell and Direct2D rendering are part of the rewrite."
    ],
    ["Keep PDFium off the UI thread", "Opening and rendering run on the engine's own thread, away from the window."],
    [
        "Everything stays local",
        "No accounts and no cloud. Features that need a server, or don't fit a GPLv2 licence, are left out."
    ]
];

const cursusDecisions = [
    [
        "Keep user data separate",
        "Supabase row-level security and private storage scope access to each user's material."
    ],
    ["Bound AI spending", "Chat and study generation reserve daily capacity; indexing checks the budget. Conversion records usage without daily-budget gating."],
    [
        "Fail closed in production",
        "Protected requests are refused when the production rate limiter is absent or unavailable."
    ],
    [
        "Validate the upload itself",
        "File-size, MIME, extension, and magic-byte checks verify uploads before processing."
    ]
];
function Decisions({ items }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {items.map(([title, description]) => (
                <div key={title}>
                    <h3 className="text-sm text-white mb-2">{title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
                </div>
            ))}
        </div>
    );
}

function Feature({ project, label, large, gallery, summary, note = project.note, children }) {
    return (
        <article
            id={project.id}
            className="rounded-2xl border border-neutral-700 bg-neutral-900/60 overflow-hidden mb-8"
        >
            <div
                className={`p-6 md:p-9 grid gap-8 items-center ${large ? "lg:grid-cols-[1fr_1.15fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}
            >
                <div>
                    <p className={`text-xs font-mono mb-4 ${large ? "text-green-400" : "text-amber-300"}`}>{label}</p>
                    <h2
                        className={`text-white font-light tracking-tight ${large ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}
                    >
                        {project.title}
                    </h2>
                    <p className="text-lg text-neutral-200 mt-3">{project.subtitle}</p>
                    <p className="text-sm text-neutral-400 leading-relaxed mt-5">{project.description}</p>
                    {note && (
                        <p className="text-sm text-neutral-300 leading-relaxed mt-4">
                            {note}
                        </p>
                    )}
                    <div className="mt-5"><ProjectLinks project={project} /></div>
                </div>
                {gallery}
            </div>
            <details className="group border-t border-neutral-800">
                <summary className="cursor-pointer px-6 md:px-9 py-5 text-sm font-mono text-neutral-200 hover:text-green-400">
                    {summary}
                </summary>
                <div className="px-4 sm:px-6 md:px-9 pb-9 space-y-9">
                    {children}
                    <p className="text-xs text-neutral-400 font-mono leading-relaxed">{project.tech.join(" · ")}</p>
                </div>
            </details>
        </article>
    );
}

function SableFeature() {
    const project = getProject("sable");
    return (
        <Feature
            project={project}
            label={`FEATURED / ${project.status.toUpperCase()}`}
            large
            summary="Inside sable: how it works"
            gallery={
                <ScreenGallery
                    name="sable"
                    screens={sableScreens}
                    width={1440}
                    height={774}
                    caption="Alpha build · a sample document written for these screenshots."
                />
            }
        >
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm text-white font-mono mb-3">The problem</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        NightPDF was a dark-mode PDF reader built on Electron and PDF.js, and it has since been
                        archived. sable keeps what made it useful, the night filter and its presets, and rebuilds the
                        rest as a native Windows app.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm text-white font-mono mb-3">What I built</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        A native rewrite in C++/WinRT: the WinUI 3 shell, the PDFium engine layer, the Direct2D filter,
                        and the reading tools so far. That means tabs, Find, text selection across pages, thumbnails,
                        the outline and printing.
                    </p>
                </div>
            </div>
            <ProjectWalkthrough tour={sableTour} />
            <Decisions items={sableDecisions} />
            <div className="border-l-2 border-neutral-600 pl-4">
                <h3 className="text-sm text-white mb-2">Current limits</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                    Going native means sable is Windows-only, and it inherits PDFium's limits. OCR, redaction and adding
                    passwords are out for now.
                </p>
            </div>
        </Feature>
    );
}
function CursusCaseStudy() {
    const project = getProject("cursus");
    return (
        <Feature
            project={project}
            label={`CASE STUDY / ${project.status.toUpperCase()}`}
            summary="Inside Cursus: how it works"
            gallery={<CursusOverview />}
        >
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm text-white font-mono mb-3">The problem</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        Course material is spread across files and deadlines. I built a workspace where the material
                        itself becomes the starting point for study: organize it, ask questions, and practice from the
                        same source.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm text-white font-mono mb-3">What I built</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        The full-stack study workspace: collections and views, private uploads, background indexing,
                        grounded AI tools, and one-way Google Calendar sync.
                    </p>
                </div>
            </div>
            <ProjectWalkthrough tour={cursusTour} />
            <Decisions items={cursusDecisions} />
        </Feature>
    );
}

export default function Projects() {
    return (
        <section id="projects" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-7xl mx-auto">
                <SectionHeading as="h1" title="Work" note="Selected projects" />
                <ProjectIndex />
                <SableFeature />
                <CursusCaseStudy />
                <h2 className="text-lg text-white mt-12 mb-5">More work</h2>
                <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                    {projects
                        .filter((project) => project.group === "selected")
                        .map((project) => (
                            <article
                                id={project.id}
                                key={project.id}
                                className={`py-6 grid gap-5 ${project.id === "ultron" ? "sm:grid-cols-[160px_minmax(0,1fr)]" : ""}`}
                            >
                                {project.id === "ultron" && (
                                    <img
                                        src={ultronImage}
                                        loading="lazy"
                                        width="1919"
                                        height="939"
                                        alt="Ultron 9.0 hackathon website"
                                        className="w-full max-w-xs aspect-[2/1] object-cover object-top rounded-lg border border-neutral-800"
                                    />
                                )}
                                <div>
                                    <div className="flex flex-wrap justify-between gap-2 items-baseline">
                                        <h3 className="text-lg text-white font-mono">{project.title}</h3>
                                        <span className="text-xs text-neutral-400">{project.status}</span>
                                    </div>
                                    <p className="text-sm text-neutral-300 mt-2 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                                        <p className="text-xs text-neutral-400 leading-relaxed">{project.tech.join(" · ")}</p>
                                        <ProjectLinks project={project} />
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>
            </div>
        </section>
    );
}
