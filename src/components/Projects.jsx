import { projects, getProject } from "../data/portfolio";
import SectionHeading from "./SectionHeading";
import ProjectLinks from "./ProjectLinks";
import ScreenGallery from "./ScreenGallery";
import Contribution from "./Contribution";
import FlowSteps from "./FlowSteps";
import ArchitectureExplorer from "./ArchitectureExplorer";
import CursusOverview from "./CursusOverview";
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
const sableFlow = [
    { title: "PDF", text: "Read into memory and parsed by PDFium. The file on disk isn't locked or changed." },
    { title: "Background render", text: "PDFium rasterises the visible pages, plus one either side, on its own thread." },
    { title: "Original pixels, cached", text: "The unfiltered bitmap is cached and uploaded to the GPU as is." },
    { title: "Display filter", text: "Direct2D runs it through six colour matrices, one per filter step." },
    { title: "Reading view", text: "The filtered page lands on screen. Find highlights are drawn after the filter." }
];
const sableBranches = [
    { title: "Switching presets", text: "New matrix values and a redraw of the bitmap already on the GPU. PDFium isn't asked again." },
    { title: "Thumbnails", text: "Same render queue at a smaller size, shown without the filter." },
    { title: "Printing", text: "Its own unfiltered render at printer resolution, in tiles. Never touches the night filter." }
];
const sableDecisions = [
    [
        "Filter at draw time, not in the file",
        "The cached bitmap is always the original, so a preset change is just new matrix values and a redraw. Nothing about the night colours leaks into thumbnails or print."
    ],
    [
        "PDFium never runs on the UI thread",
        "Opening, rendering and text search happen on one engine thread. Results come back through the window's DispatcherQueue and stale ones are thrown away, so a heavy page can take its time without freezing the window."
    ],
    [
        "NightPDF's behaviour, not its code",
        "Preset values, filter order, shortcuts and settings keys match NightPDF, so it feels the same if you're switching over. The native shell and the Direct2D rendering are new."
    ]
];

const cursusFlow = [
    { title: "Private upload", text: "Checked for size, extension, MIME type and magic bytes, then stored in a private bucket." },
    { title: "Conversion", text: "A background job pulls the text out (or transcribes scans and images) and cleans it into Markdown." },
    { title: "Indexing", text: "The Markdown is split into overlapping chunks and embedded into pgvector." },
    { title: "Ready to study", text: "Chat and the study tools unlock only once conversion and indexing are both marked ready." }
];
const cursusBranches = [
    { title: "Chat", text: "Embeds the question and pulls up to six of the closest chunks from that one file." },
    { title: "Summaries and quizzes", text: "Pack the file's chunks in order within a token budget, then validate the model's JSON before showing it." },
    { title: "Calendar sync", text: "A separate one-way job. Dated workspace items become all-day Google Calendar events." }
];
const cursusDecisions = [
    [
        "Each person's files stay theirs",
        "Row-level security and a private bucket scope every file to its owner. Uploads are checked down to the magic bytes before anything is stored, so a renamed file can't pass as a PDF."
    ],
    [
        "Readiness is explicit",
        "Conversion and indexing are separate background jobs with their own ready flags. The study tools stay off until both are set, so nobody chats with half a document."
    ],
    [
        "Model calls are budgeted and checked",
        "Chat and study generation reserve against a daily per-user budget, and indexing checks it too; conversion logs usage without being blocked. In production, protected routes refuse requests when the rate limiter is down, and study output has to pass schema validation before it's shown."
    ]
];

function Decisions({ items }) {
    return (
        <div>
            <h3 className="text-sm text-white font-mono mb-4">Decisions that mattered</h3>
            <div className="grid md:grid-cols-3 gap-6">
                {items.map(([title, description]) => (
                    <div key={title}>
                        <h4 className="text-[15px] md:text-sm text-white mb-2">{title}</h4>
                        <p className="text-[15px] md:text-sm text-neutral-400 leading-relaxed">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Prose({ title, children }) {
    return (
        <div className="max-w-3xl">
            <h3 className="text-sm text-white font-mono mb-3">{title}</h3>
            <div className="space-y-3 text-[15px] md:text-sm text-neutral-400 leading-relaxed">{children}</div>
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
                    <p className="text-xs font-mono mb-4 text-neutral-400">{label}</p>
                    <h2
                        className={`text-white font-light tracking-tight ${large ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}
                    >
                        {project.title}
                    </h2>
                    <p className="text-lg text-neutral-200 mt-3">{project.subtitle}</p>
                    <p className="text-sm text-neutral-400 leading-relaxed mt-4">{project.description}</p>
                    <Contribution project={project} className="mt-5" />
                    {project.note && <p className="text-sm text-neutral-400 leading-relaxed mt-4">{project.note}</p>}
                    <p className="text-xs text-neutral-400 font-mono mt-5">{project.tech.slice(0, 4).join(" · ")}</p>
                    <div className="mt-4"><ProjectLinks project={project} /></div>
                </div>
                {/* On phones the screenshot goes first, otherwise it's a full screen of text before any proof */}
                <div className={large ? "order-first lg:order-none" : ""}>{gallery}</div>
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
            label={`featured · ${project.status.toLowerCase()}`}
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
            <Prose title="The idea">
                <p>
                    sable is built around one rule: change how a page looks on screen, never what's in the document.
                    Each page is rendered once in its original colours, and the night preset only applies when that
                    page is drawn. The reading view goes dark, while thumbnails and printouts keep the colours the
                    document actually has.
                </p>
                <p>
                    NightPDF did this as an Electron app on PDF.js, and it's archived now. I kept what was worth
                    keeping (the filter, its presets, the shortcuts) and rebuilt everything around it as a native
                    Windows app.
                </p>
            </Prose>
            <FlowSteps
                label="From file to filtered page"
                steps={sableFlow}
                branchesLabel="Other paths"
                branches={sableBranches}
            />
            <Decisions items={sableDecisions} />
            <Prose title="Limits and what's next">
                <p>
                    It's Windows-only, which is the point of going native. OCR, redaction and adding passwords are out
                    for now. The next milestone is feature parity with NightPDF; new features come after that.
                </p>
            </Prose>
            <ArchitectureExplorer tourId="sable" name="sable" />
        </Feature>
    );
}

function CursusCaseStudy() {
    const project = getProject("cursus");
    return (
        <Feature
            project={project}
            label={`case study · ${project.status.toLowerCase()}`}
            summary="Inside Cursus: how it works"
            gallery={<CursusOverview />}
        >
            <Prose title="The idea">
                <p>
                    Your own course material becomes the context. You upload notes, and chat, summaries and quizzes
                    work from those files. Most of the engineering went into what surrounds that: who can see a file,
                    when it's ready to use, and how much each person can spend on model calls.
                </p>
            </Prose>
            <FlowSteps
                label="From upload to study material"
                steps={cursusFlow}
                branchesLabel="Then three separate paths"
                branches={cursusBranches}
                accent="text-amber-300"
            />
            <Decisions items={cursusDecisions} />
            <Prose title="Limits, and why it's paused">
                <p>
                    If I picked it back up, I'd fix three things first. Summaries and quiz results only live in the
                    browser, so they're gone on reload. If the first background event fails to send after an upload,
                    the file can sit unconverted with nothing to retry it; it needs an outbox. And answers reference
                    chunks of the text as [0], [1] and so on, not page numbers, which is less useful than it looks
                    and doesn't prove a claim is right.
                </p>
                <p>
                    I stopped development after Notion shipped similar features, and closed sign-ups.
                </p>
            </Prose>
            <ArchitectureExplorer tourId="cursus" name="Cursus" />
        </Feature>
    );
}

const jumpLinks = [
    ["sable", "#sable"],
    ["Cursus", "#cursus"],
    ["More work", "#more-work"],
    ["Experiments", "#building"],
    ["Earlier work", "#earlier-work"],
    ["Everything", "#all-projects"]
];

export default function Projects() {
    return (
        <section id="projects" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-7xl mx-auto">
                <SectionHeading as="h1" title="Work" note="Selected projects" />
                <nav aria-label="On this page" className="-mt-6 mb-8 flex flex-wrap gap-x-5 font-mono text-xs">
                    {jumpLinks.map(([label, href]) => (
                        <a key={href} href={`/work${href}`} className="min-h-11 inline-flex items-center text-neutral-400 hover:text-green-400 transition-colors">
                            {label}
                        </a>
                    ))}
                </nav>
                <SableFeature />
                <CursusCaseStudy />
                <h2 id="more-work" className="text-lg text-white mt-12 mb-5 scroll-mt-24">More work</h2>
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
                                    <p className="text-sm text-neutral-300 mt-2 leading-relaxed max-w-3xl">{project.description}</p>
                                    <Contribution project={project} className="mt-3 max-w-3xl" />
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
