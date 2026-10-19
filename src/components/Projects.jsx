import { projects, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";
import ProjectLinks from "./ProjectLinks";
import ScreenGallery from "./ScreenGallery";
import ultronImage from "../assets/myUltron.webp";
import sableReader from "../assets/sable/reader.png";
import sableSepia from "../assets/sable/sepia.png";
import sableFind from "../assets/sable/find.png";
import sableOutline from "../assets/sable/outline.png";
import cursusBoard from "../assets/cursus/board.png";
import cursusTable from "../assets/cursus/table.png";
import cursusChat from "../assets/cursus/chat.png";
import cursusQuiz from "../assets/cursus/quiz.png";

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
const sablePipeline = [
    ["01 / Open", "Parse the PDF", "PDFium on its own thread"],
    ["02 / Render", "Draw each page", "PDFium page bitmaps"],
    ["03 / Filter", "Apply the preset", "Direct2D on the GPU"],
    ["04 / Read", "Tabs, Find, outline", "WinUI 3 shell"]
];
const sableDecisions = [
    [
        "The filter only touches the page",
        "Presets change how pages are drawn, not the UI, thumbnails or printouts, so documents still print in their real colours."
    ],
    [
        "Parity before features",
        "Same presets, filter math, shortcuts, settings keys and command line as NightPDF first. Comments, Fill & Sign and page tools come after."
    ],
    ["Keep PDFium off the UI thread", "Opening and rendering run on the engine's own thread, away from the window."],
    [
        "Everything stays local",
        "No accounts and no cloud. Features that need a server, or don't fit a GPLv2 licence, are left out."
    ]
];

const cursusScreens = [
    {
        title: "Board",
        image: cursusBoard,
        alt: "Cursus collection board with study tasks arranged into To study, In progress, and Reviewed columns"
    },
    {
        title: "Table",
        image: cursusTable,
        alt: "The same Cursus study tasks in a table with status, priority, and due-date properties"
    },
    {
        title: "Grounded chat",
        image: cursusChat,
        alt: "Cursus material chat showing an example discussion about database indexes with a source reference"
    },
    {
        title: "Quiz",
        image: cursusQuiz,
        alt: "Cursus quiz with a selected answer, progress, and an explanation about database indexes"
    }
];
const cursusPipeline = [
    ["01 / Upload", "PDFs and images", "Private Supabase Storage"],
    ["02 / Process", "Convert and index", "Inngest background jobs"],
    ["03 / Retrieve", "Find relevant chunks", "Postgres + pgvector"],
    ["04 / Study", "Chat, summaries, quizzes", "Next.js + OpenAI"]
];
const cursusDecisions = [
    [
        "Keep user data separate",
        "Supabase row-level security and private storage scope access to each user's material."
    ],
    ["Bound AI spending", "Per-user daily request and token budgets reserve capacity before model work begins."],
    [
        "Fail closed in production",
        "Protected requests are refused when the production rate limiter is absent or unavailable."
    ],
    [
        "Validate the upload itself",
        "File-size, MIME, extension, and magic-byte checks verify uploads before processing."
    ]
];
function Pipeline({ label, steps, footnote }) {
    return (
        <div>
            <h3 className="text-sm text-white font-mono mb-4">{label}</h3>
            <ol aria-label={label} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {steps.map(([step, title, detail]) => (
                    <li key={step} className="rounded-lg border border-neutral-700 bg-neutral-950/60 p-4">
                        <p className="text-xs text-green-400 font-mono">{step}</p>
                        <p className="text-sm text-white mt-3">{title}</p>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{detail}</p>
                    </li>
                ))}
            </ol>
            <p className="text-xs text-neutral-400 mt-4 leading-relaxed">{footnote}</p>
        </div>
    );
}

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

function Feature({ project, label, large, gallery, summary, children }) {
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
                    {project.note && (
                        <p className="text-sm text-neutral-300 leading-relaxed mt-4">
                            {project.note}
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
                <div className="px-6 md:px-9 pb-9 space-y-9">
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
            <Pipeline
                label="From file to page"
                steps={sablePipeline}
                footnote="The filter is applied when a page is drawn. The file itself never changes."
            />
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
            gallery={
                <ScreenGallery name="Cursus" screens={cursusScreens} caption="Product screens · sample study data." />
            }
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
            <Pipeline
                label="From upload to answer"
                steps={cursusPipeline}
                footnote="The Next.js app coordinates authenticated requests. Calendar sync is a separate, one-way integration for dated workspace items."
            />
            <Decisions items={cursusDecisions} />
        </Feature>
    );
}

export default function Projects() {
    return (
        <section id="projects" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading as="h1" title="Work" note="Selected projects" />
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
