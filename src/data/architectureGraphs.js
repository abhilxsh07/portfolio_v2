// Authored from the walkthrough briefs. Coordinates express explanatory layout,
// not deployment topology or measured latency. Related nodes can share a stage.
const node = (id, x, y, width, title, subtitle, kind, glyph) =>
    ({ id, x, y, width, height: 68, title, subtitle, kind, glyph });
const edge = (id, from, to, label, options = {}) =>
    ({ id, from, to, label, ...options });

export const architectureGraphs = {
    sable: {
        width: 1400, height: 790,
        title: "Inside a native PDF reader",
        subtitle: "A page travels between threads. Its colours change only at draw time.",
        zones: [
            { x: 24, y: 90, width: 210, height: 650, title: "LOCAL INPUTS", subtitle: "Files stay on this device", kind: "local" },
            { x: 260, y: 90, width: 285, height: 650, title: "WINUI 3", subtitle: "Window · UI thread", kind: "ui" },
            { x: 574, y: 90, width: 300, height: 450, title: "PDFIUM ENGINE", subtitle: "One dedicated thread", kind: "engine" },
            { x: 574, y: 564, width: 300, height: 176, title: "PAGE CACHE", subtitle: "Back on the UI thread", kind: "data" },
            { x: 905, y: 90, width: 245, height: 650, title: "DIRECT2D", subtitle: "Hardware or WARP fallback", kind: "render" },
            { x: 1180, y: 90, width: 196, height: 650, title: "OUTPUTS", subtitle: "Separate paths, shared file", kind: "output" }
        ],
        nodes: [
            node("file", 48, 170, 162, "PDF on disk", "Original bytes", "local", "file"),
            node("settings", 48, 475, 162, "Preferences", "Local config.json", "local", "settings"),
            node("picker", 285, 155, 235, "Open document", "Picker · drop · command line", "ui", "folder"),
            node("tabs", 285, 265, 235, "Tab + session", "DispatcherQueue callbacks", "ui", "layers"),
            node("viewport", 285, 375, 235, "Visible pages", "Viewport + one neighbour", "ui", "scan"),
            node("preset", 285, 535, 235, "Preset controls", "Six slider values", "ui", "sliders"),
            node("session", 600, 155, 248, "Read + parse", "FPDF_LoadMemDocument64", "engine", "cpu"),
            node("raster", 600, 265, 248, "Page rasterizer", "PDFium → unfiltered BGRA", "engine", "image"),
            node("search", 600, 375, 248, "Text + Find", "Unicode scan · character boxes", "engine", "search"),
            node("printjob", 600, 465, 248, "Print renderer", "Preview + printer-DPI tiles", "engine", "printer"),
            node("cache", 600, 615, 248, "CPU bitmap cache", "256 MiB · keyed by page + size", "data", "database"),
            node("texture", 930, 180, 195, "GPU bitmap", "Uploaded original pixels", "render", "layers"),
            node("matrix", 930, 355, 195, "Six colour matrices", "Clamp after every effect", "render", "sliders"),
            node("surface", 930, 515, 195, "Drawing surface", "VirtualSurfaceImageSource", "render", "scan"),
            node("thumb", 1200, 170, 155, "Thumbnails", "Original colours", "output", "grid"),
            node("page", 1200, 355, 155, "Reading page", "Night preset applied", "output", "book"),
            node("highlight", 1200, 515, 155, "Find overlay", "Drawn after the filter", "output", "search"),
            node("printer", 1200, 650, 155, "Print output", "Original colours", "output", "printer")
        ],
        edges: [
            edge("open", "file", "picker", ".pdf", { labelAt: [246, 177] }),
            edge("tab", "picker", "tabs", "open", { fromPort: "bottom", toPort: "top" }),
            edge("parse", "tabs", "session", "queue open", { via: [[556, 299], [556, 189]], labelAt: [559, 240] }),
            edge("layout", "session", "viewport", "page sizes · UI callback", { fromPort: "left", toPort: "right", via: [[562, 189], [562, 409]] }),
            edge("schedule", "viewport", "raster", "render request", { via: [[562, 409], [562, 299]], labelAt: [560, 344] }),
            edge("render", "session", "raster", "page key", { fromPort: "bottom", toPort: "top" }),
            edge("store", "raster", "cache", "BGRA · callback", { via: [[861, 299], [861, 649]], labelAt: [860, 554] }),
            edge("upload", "cache", "texture", "upload / reuse", { via: [[888, 649], [888, 214]], labelAt: [889, 270] }),
            edge("pixels", "texture", "matrix", "same bitmap", { fromPort: "bottom", toPort: "top", labelAt: [1027, 308] }),
            edge("draw", "matrix", "surface", "filtered image", { fromPort: "bottom", toPort: "top", labelAt: [1027, 470] }),
            edge("read", "surface", "page", "draw", { via: [[1165, 549], [1165, 389]] }),
            edge("load-settings", "settings", "preset", "values", { via: [[247, 509], [247, 569]] }),
            edge("update", "preset", "matrix", "update matrices · no PDFium call", { via: [[558, 569], [558, 556], [894, 556], [894, 389]], labelAt: [720, 550], type: "control" }),
            edge("thumbnail", "raster", "thumb", "small render · bypass filter", { via: [[882, 299], [882, 142], [1164, 142], [1164, 204]], labelAt: [1027, 136], type: "bypass" }),
            edge("find-request", "tabs", "search", "query · 150 ms debounce", { via: [[552, 299], [552, 452], [585, 452], [585, 409]] }),
            edge("text-boxes", "search", "viewport", "character boxes · UI callback", { fromPort: "left", toPort: "right" }),
            edge("find-overlay", "search", "highlight", "match rectangles · bypass filter", { via: [[885, 409], [885, 453], [1165, 453], [1165, 549]], labelAt: [1027, 447], type: "bypass" }),
            edge("composite", "surface", "highlight", "overlay", { type: "bypass" }),
            edge("print-request", "tabs", "printjob", "Ctrl+P", { via: [[550, 299], [550, 499]], type: "control" }),
            edge("print", "printjob", "printer", "printer DPI · bypass filter", { via: [[891, 499], [891, 714], [1164, 714], [1164, 684]], labelAt: [1030, 708], type: "bypass" })
        ],
        routes: {
            read: { steps: [["file", "picker", "tabs"], ["session"], ["viewport"], ["raster"], ["cache", "texture"], ["matrix", "surface", "page"]], edges: ["open", "tab", "parse", "layout", "schedule", "render", "store", "upload", "pixels", "draw", "read"] },
            preset: { steps: [["settings", "preset"], ["matrix"], ["texture", "surface", "page"]], edges: ["load-settings", "update", "pixels", "draw", "read"] },
            thumbnails: { steps: [["tabs", "viewport"], ["session"], ["raster"], ["cache", "thumb"]], edges: ["schedule", "render", "store", "thumbnail"] },
            find: { steps: [["tabs"], ["session", "search"], ["viewport"], ["matrix", "surface", "highlight"]], edges: ["find-request", "text-boxes", "find-overlay", "pixels", "draw", "composite"] },
            print: { steps: [["tabs"], ["printjob"], ["printjob"], ["printer"]], edges: ["print-request", "print"] }
        },
        callouts: [
            { x: 402, y: 690, text: "PRESET CHANGE ≠ PAGE RE-RENDER", kind: "ui" },
            { x: 1027, y: 625, text: "ONLY PAGE IMAGES ARE FILTERED", kind: "render" }
        ]
    },
    cursus: {
        width: 1400, height: 790,
        title: "From private notes to grounded study",
        subtitle: "A background indexing path, two AI context strategies, and a separate calendar integration.",
        zones: [
            { x: 24, y: 90, width: 230, height: 650, title: "BROWSER", subtitle: "User actions · local state", kind: "ui" },
            { x: 284, y: 90, width: 270, height: 650, title: "NEXT.JS SERVER", subtitle: "Auth · ownership · budgets", kind: "engine" },
            { x: 584, y: 90, width: 260, height: 650, title: "INNGEST", subtitle: "Checkpointed background work", kind: "jobs" },
            { x: 874, y: 90, width: 240, height: 650, title: "SUPABASE", subtitle: "Private storage · Postgres", kind: "data" },
            { x: 1144, y: 90, width: 232, height: 650, title: "PROVIDERS", subtitle: "Explicit external boundaries", kind: "output" }
        ],
        nodes: [
            node("upload", 49, 160, 180, "Upload material", "PDF · PNG · JPEG", "ui", "upload"),
            node("question", 49, 325, 180, "Ask a question", "One owned material", "ui", "message"),
            node("tools", 49, 490, 180, "Study tools", "Summary or quiz", "ui", "book"),
            node("calendar", 49, 650, 180, "Calendar + items", "Consent · dated item edits", "ui", "calendar"),
            node("guards", 310, 160, 218, "Upload guards", "Session · origin · rate · bytes", "engine", "shield"),
            node("chat", 310, 325, 218, "Grounded chat", "Reserve → retrieve → stream", "engine", "message"),
            node("study", 310, 490, 218, "Study generation", "Ordered context → strict JSON", "engine", "braces"),
            node("oauth", 310, 650, 218, "OAuth callback", "Validate state · encrypt token", "engine", "key"),
            node("convert", 610, 160, 208, "Convert material", "Extract → clean Markdown", "jobs", "file"),
            node("index", 610, 325, 208, "Index material", "Chunk → embed → persist", "jobs", "grid"),
            node("events", 610, 490, 208, "Background events", "Upload · indexing · calendar", "jobs", "bolt"),
            node("sync", 610, 650, 208, "Calendar sync", "Plan · upsert · delete", "jobs", "calendar"),
            node("storage", 900, 160, 188, "Private originals", "study-materials bucket", "data", "folder"),
            node("vectors", 900, 325, 188, "Chunks + vectors", "pgvector · 1,536 dimensions", "data", "database"),
            node("messages", 900, 490, 188, "Chat history", "Question first · answer last", "data", "layers"),
            node("tokens", 900, 650, 188, "Calendar state", "Connections + event links", "data", "key"),
            node("transcribe", 1170, 160, 180, "Transcribe + clean", "OpenAI Responses / Files", "output", "spark"),
            node("embeddings", 1170, 325, 180, "Embeddings", "Chunks + chat questions", "output", "grid"),
            node("responses", 1170, 490, 180, "Generate output", "Stream text or schema JSON", "output", "spark"),
            node("google", 1170, 650, 180, "Google Calendar", "One-way · all-day events", "output", "calendar")
        ],
        edges: [
            edge("validate", "upload", "guards", "file + session", { labelAt: [270, 185] }),
            edge("store", "guards", "storage", "private original", { fromPort: "top", toPort: "top", via: [[419, 141], [994, 141]], labelAt: [710, 135] }),
            edge("enqueue", "storage", "events", "material/uploaded", { fromPort: "bottom", toPort: "right", via: [[994, 252], [858, 252], [858, 524]] }),
            edge("claim", "events", "convert", "claim + download", { fromPort: "left", toPort: "left", via: [[570, 524], [570, 194]], type: "control" }),
            edge("extract", "storage", "convert", "download bytes", { fromPort: "left", toPort: "right" }),
            edge("transcribe", "convert", "transcribe", "low-text PDF / image + cleanup", { fromPort: "bottom", toPort: "bottom", via: [[714, 256], [1260, 256]], labelAt: [1030, 250] }),
            edge("clean", "convert", "index", "clean Markdown", { fromPort: "bottom", toPort: "top", labelAt: [714, 283] }),
            edge("embed", "index", "embeddings", "text chunks", { fromPort: "top", toPort: "top", via: [[714, 294], [1260, 294]], labelAt: [1020, 288] }),
            edge("persist", "embeddings", "vectors", "vectors", { fromPort: "left", toPort: "right" }),
            edge("ask", "question", "chat", "question", { labelAt: [269, 350] }),
            edge("question-embedding", "chat", "embeddings", "embed question", { fromPort: "top", toPort: "top", via: [[419, 273], [1260, 273]], type: "control" }),
            edge("retrieve", "vectors", "chat", "top 6 · one material", { fromPort: "bottom", toPort: "bottom", via: [[994, 435], [419, 435]], labelAt: [710, 429] }),
            edge("save", "chat", "messages", "persist question / completed answer", { via: [[559, 359], [559, 460], [850, 460], [850, 524]], labelAt: [714, 454] }),
            edge("chat-generate", "chat", "responses", "evidence + history → SSE", { fromPort: "bottom", toPort: "top", via: [[419, 416], [1130, 416], [1130, 468], [1260, 468]], labelAt: [785, 410] }),
            edge("choose-tool", "tools", "study", "options", { labelAt: [269, 515] }),
            edge("ordered-context", "vectors", "study", "ordered chunks · 8k reference budget", { fromPort: "bottom", toPort: "top", via: [[994, 447], [561, 447], [561, 475], [419, 475]] }),
            edge("study-generate", "study", "responses", "strict JSON + source indices", { fromPort: "bottom", toPort: "bottom", via: [[419, 590], [1260, 590]], labelAt: [990, 584] }),
            edge("consent", "calendar", "oauth", "OAuth consent", { labelAt: [269, 674] }),
            edge("token", "oauth", "tokens", "encrypted connection", { fromPort: "top", toPort: "top", via: [[419, 620], [994, 620]], labelAt: [710, 614] }),
            edge("item-change", "calendar", "events", "dated item change · separate flow", { fromPort: "bottom", toPort: "left", via: [[139, 730], [572, 730], [572, 524]], labelAt: [420, 724], type: "control" }),
            edge("calendar-event", "events", "sync", "calendar job", { fromPort: "bottom", toPort: "top", type: "control" }),
            edge("load-link", "tokens", "sync", "connection + prior link", { fromPort: "left", toPort: "right" }),
            edge("calendar-write", "sync", "google", "all-day event · one-way", { fromPort: "bottom", toPort: "bottom", via: [[714, 726], [1260, 726]], labelAt: [1030, 720] })
        ],
        routes: {
            upload: { steps: [["upload", "guards"], ["storage", "events"], ["convert", "transcribe"], ["convert"], ["index"], ["embeddings", "vectors"]], edges: ["validate", "store", "enqueue", "claim", "extract", "transcribe", "clean", "embed", "persist"] },
            chat: { steps: [["question", "chat"], ["messages"], ["embeddings", "vectors"], ["responses"], ["messages", "question"]], edges: ["ask", "save", "question-embedding", "retrieve", "chat-generate"] },
            summary: { steps: [["tools", "study", "vectors"], ["responses"], ["study"], ["tools"]], edges: ["choose-tool", "ordered-context", "study-generate"] },
            quiz: { steps: [["tools", "study", "vectors"], ["responses"], ["study"], ["tools"]], edges: ["choose-tool", "ordered-context", "study-generate"] },
            calendar: { steps: [["calendar", "oauth", "tokens"], ["events"], ["sync", "tokens"], ["google"]], edges: ["consent", "token", "item-change", "calendar-event", "load-link", "calendar-write"] }
        },
        callouts: []
    }
};
