// Editorial summaries of the two walkthrough briefs, reviewed 2026-11-01.
// sable behavior: local 91f77a8. Links: GitHub-confirmed public 8e4aca7.
// Link to whole files: the brief's newer line numbers do not apply to that snapshot.
const publicSable = "https://github.com/abhilxsh07/sable/blob/8e4aca7274da75d423e8183f094dcb18d7a5f6ab/";
const step = (id, title, owner, description, input, output, file, extra = {}) => ({
    id, title, owner, description, input, output, file, ...extra
});
const sableStep = (...args) => {
    const item = step(...args);
    return { ...item, href: publicSable + item.file };
};

export const presets = [
    { id: "default", label: "Default", values: [7, 95, 95, 55, 180, 0] },
    { id: "sepia", label: "Sepia", values: [0, 0, 25, 100, 0, -30] },
    { id: "redeye", label: "Redeye", values: [8, 100, 92, 100, 295, -6] },
    { id: "original", label: "Original", values: [0, 0, 0, 0, 0, 0] }
];

// NightPDF's CSS order, also used by sable's six separate clamped matrices.
export function presetFilter(values) {
    const [darkness, grayscale, inversion, sepia, hue, brightness] = values;
    return `brightness(${(100 - darkness) / 100}) grayscale(${grayscale / 100}) invert(${inversion / 100}) sepia(${sepia / 100}) hue-rotate(${hue}deg) brightness(${(brightness + 100) / 100})`;
}

export const sableTour = {
    id: "sable",
    title: "How a file becomes a filtered page",
    intro: "Explore the threads, caches and drawing paths inside sable. Choose a route to trace it through the system, or select any component to inspect its role.",
    sourceNote: "Development-build walkthrough. Source links open the published 8e4aca7 snapshot; files may differ from the newer build.",
    flows: [
        {
            id: "read", label: "Read", result: "A filtered page", takeaway: "The file and cached pixels keep their original colours. The filter runs when the page is drawn.",
            steps: [
                sableStep("choose", "Choose a PDF", "WinUI · UI thread", "The file picker returns a path. An already-open file selects its existing tab; a new file gets a viewer and session.", "File on disk", "Tab + queued open", "app/MainWindow.xaml.cpp", { failure: "Picker failures appear in an InfoBar." }),
                sableStep("parse", "Read and parse", "PDFium thread", "Read the file into memory, then let PDFium load it and collect page sizes, labels and permissions. The original file is not locked.", "Path + optional password", "Document + page metadata", "app/pdf/document.cpp", { failure: "Unreadable, damaged or protected PDFs produce an error or password prompt." }),
                sableStep("schedule", "Choose visible pages", "WinUI · UI thread", "Lay out the document and request visible pages plus one neighbour on each side. Reuse GPU bitmaps or the CPU cache before requesting a render.", "Viewport + page sizes", "Page render request", "app/ViewerPage.xaml.cpp"),
                sableStep("render", "Rasterize the page", "PDFium thread", "PDFium renders annotations and form fields into an unfiltered BGRA bitmap on white. Rendering stays off the window's UI thread.", "Page + pixel dimensions", "Original-colour bitmap", "app/pdf/document.cpp", { scene: "raster", failure: "An empty render is marked failed rather than requested repeatedly." }),
                sableStep("cache", "Cache and upload", "WinUI · UI thread", "Return through DispatcherQueue, discard stale results, cache the bitmap and upload a GPU copy. The CPU page cache has a 256 MiB budget.", "BGRA bitmap", "Cached + uploaded page", "app/ViewerPage.xaml.cpp", { scene: "raster", failure: "Device loss leaves a placeholder until the device is rebuilt." }),
                sableStep("filter", "Filter and draw", "Direct2D · draw", "Draw the uploaded bitmap through six colour-matrix effects. Direct2D tries hardware first and can fall back to WARP software rendering.", "Same bitmap + six matrices", "Night page on screen", "app/pdf/page_filter.cpp", { scene: "filtered", badge: "Filter applied", failure: "Device recovery re-uploads nearby pages from the cache." })
            ]
        },
        {
            id: "preset", label: "Switch preset", result: "New colours, same bitmap", takeaway: "No PDFium call. No new page raster. A preset change rewrites six matrices and redraws the uploaded bitmap.",
            steps: [
                sableStep("select", "Choose a preset", "WinUI · UI thread", "The selected preset becomes six slider values. Every tab in the same window receives them; other windows keep their own settings.", "Preset name", "Six slider values", "app/helpers/sliders.cpp", { scene: "filtered" }),
                sableStep("matrices", "Update six matrices", "Direct2D · UI thread", "Build six 5×4 colour matrices and update the existing effects. Each effect clamps its output before the next one runs.", "Slider values", "Updated colour matrices", "app/pdf/page_filter.cpp", { scene: "filtered", badge: "No re-render" }),
                sableStep("redraw", "Redraw the surface", "Direct2D · draw", "Invalidate the surface and draw from the GPU bitmaps already in memory. Changing the preset never asks PDFium to render again.", "Existing GPU bitmap", "Same page, new colours", "app/ViewerPage.xaml.cpp", { scene: "filtered", badge: "No re-render" })
            ]
        },
        {
            id: "thumbnails", label: "Thumbnails", result: "Original-colour thumbnails", takeaway: "Thumbnails share the render queue and CPU cache, but their images bypass the night filter.",
            steps: [
                sableStep("strip", "Lay out the strip", "WinUI · UI thread", "Build thumbnail positions at 98 DIPs wide, with heights based on each page. Recycle buttons outside the nearby strip viewport.", "Page sizes", "Thumbnail positions", "app/helpers/thumbnails.cpp"),
                sableStep("queue", "Queue small renders", "WinUI · UI thread", "Visible document pages take priority. Once those requests are served, use the same render slot for nearby thumbnails at display scale.", "Strip viewport", "Small page requests", "app/ViewerPage.xaml.cpp"),
                sableStep("render", "Rasterize small", "PDFium thread", "Render through the same PDFium path as full pages, using a smaller width and height.", "Small page request", "Original-colour bitmap", "app/pdf/session.cpp", { scene: "raster", failure: "Empty thumbnail results are marked failed." }),
                sableStep("show", "Show the thumbnail", "WinUI · UI thread", "Copy the result into a WriteableBitmap and display it as an Image. Clicking the thumbnail navigates to that page.", "Bitmap", "Unfiltered thumbnail", "app/ViewerPage.xaml.cpp", { scene: "thumbnails", badge: "Filter bypassed" })
            ]
        },
        {
            id: "find", label: "Find", result: "Highlights over a filtered page", takeaway: "The page is filtered first. Find highlights are drawn afterward, so their colours bypass the filter (inferred from draw order).",
            steps: [
                sableStep("query", "Wait for typing", "WinUI · UI thread", "Ctrl+F opens Find. A text or option change cancels the prior search, clears its results and starts a 150 ms debounce timer.", "Search text", "One current query", "app/ViewerFind.cpp", { scene: "filtered" }),
                sableStep("scan", "Scan each page", "PDFium thread", "Read and normalize Unicode text, then find matches. One page runs per engine job so rendering can run between searches.", "Query + page text", "Character match ranges", "app/pdf/search.cpp", { scene: "filtered", failure: "Search failure clears matches. Results are capped at 50,000." }),
                sableStep("boxes", "Locate the matches", "PDFium → UI thread", "Merge current-generation updates on the UI thread. Request character rectangles for matching pages in view and scroll to the active match.", "Match ranges", "Highlight rectangles", "app/ViewerSelection.cpp", { scene: "filtered" }),
                sableStep("paint", "Paint the highlights", "Direct2D · draw", "Draw yellow matches and an orange active match over the already-filtered page. This is a separate overlay, not part of the page bitmap.", "Filtered page + rectangles", "Visible search matches", "app/ViewerFind.cpp", { scene: "find", badge: "Overlay bypasses filter" })
            ]
        },
        {
            id: "print", label: "Print", result: "Original colours on paper", takeaway: "Print uses its own raster path. Neither the screen's night preset nor its zoom determines the printed colours.",
            steps: [
                sableStep("dialog", "Open print options", "WinUI · UI thread", "Ctrl+P opens the Windows print dialog for the document. Page ranges, paper size and orientation belong to the print task.", "Document + window", "Windows print task", "app/printing/controller.cpp", { failure: "If the modern print UI is unavailable, use the legacy print dialog and GDI path." }),
                sableStep("preview", "Render the preview", "PDFium thread", "Render a separate unfiltered preview, capped at 96 DPI times preview scale and 4,096 pixels on its long side.", "Print page + preview size", "Original-colour preview", "app/printing/preview.cpp", { scene: "raster" }),
                sableStep("tiles", "Render print tiles", "PDFium thread", "Render at printer DPI in bounded tiles for the modern print path. The night-filter chain is not used.", "Page + printer DPI", "Original-colour tiles", "app/printing/job.cpp", { scene: "raster", badge: "Filter bypassed" }),
                sableStep("output", "Send to the printer", "Direct2D print control", "Submit the modern print job through Direct2D print control. The document's original colours reach the output.", "Print tiles", "Printed document", "app/printing/graphics.cpp", { scene: "print", badge: "Filter bypassed" })
            ]
        }
    ]
};

const gather = (id, kind) => step(id, "Gather ordered context", "Next.js + Postgres", "Check authentication, origin, rate, ownership and readiness. Pack chunks from the start within an 8,000-token reference budget, then reserve a daily AI request. This path does not run similarity search.", "Material + options", "Ordered reference text", `src/app/api/study-tools/${kind}/route.ts`, { scene: "chunks", failure: "Missing chunks return 409. Guard or budget failures stop generation." });
const generate = (id, kind) => step(id, "Generate structured output", "Next.js → OpenAI", kind === "summary" ? "Request a summary with an overview, key points, terms and revision checklist using a strict JSON schema." : "Request multiple-choice questions with four options, an answer index, explanation and source indices using a strict JSON schema.", "Reference text + options", "Candidate JSON", "src/lib/study-tools/generate.ts", { scene: "generate", failure: "Provider or empty-output failures return an error; no application repair loop is implemented." });
const validate = (id) => step(id, "Validate the response", "Next.js server", "Parse JSON with Zod and reject source indices outside the supplied context. Quizzes also check duplicate questions and requested count. Index membership does not prove factual support.", "Candidate JSON", "Validated study payload", "src/lib/study-tools/generate.ts", { scene: "validate", failure: "Invalid output is rejected. Study content is not saved to a database table." });

export const cursusTour = {
    id: "cursus",
    title: "How notes become grounded study tools",
    intro: "Explore the boundaries between the browser, server, background jobs, database and providers. Choose a route or follow a component. Examples are fictional and run locally.",
    sourceNote: "Private repository · module names only. This diagram explains checked-out code, not a verified live deployment.",
    flows: [
        {
            id: "upload", label: "Upload & index", result: "Searchable notes", takeaway: "Conversion and indexing have separate readiness states. Chat and study tools wait until both are ready.",
            steps: [
                step("validate", "Validate the upload", "Next.js server action", "Require a user, origin and rate slot. Check the file's size, extension, MIME and magic bytes before storing it. Accepted types are PDF, PNG and JPEG; the validator caps files at 20 MiB.", "File + session", "Accepted file bytes", "src/lib/materials/upload.ts", { failure: "Invalid files and guard failures return an error before storage work." }),
                step("store", "Store and queue", "Supabase → Inngest", "Put the original in private study-materials Storage, insert a materials row and send material/uploaded to start conversion.", "Accepted bytes", "Private object + conversion event", "src/app/(app)/workspace/materials/actions.ts", { scene: "stored", failure: "Initial event-send failure is logged but upload still succeeds; no durable resend exists here." }),
                step("extract", "Extract the document", "Inngest background job", "PDFs with at least 200 trimmed text characters use local extraction. Lower-text PDFs and images go to OpenAI transcription.", "Original PDF or image", "Raw document text", "src/lib/materials/convert.ts", { scene: "text", failure: "Corrupt or empty extraction stops. Conversion has three configured retries for retryable failures." }),
                step("clean", "Clean and save", "Inngest → OpenAI", "Every extraction path gets one AI cleanup pass. Save clean Markdown and conversion readiness, then durably queue the indexing event.", "Extracted text", "Clean Markdown + index event", "src/lib/inngest/functions.ts", { scene: "text", failure: "Save and event errors enter background retries. Conversion is not blocked by the daily budget." }),
                step("chunk", "Chunk the Markdown", "Inngest background job", "Pack Markdown blocks up to 900 tokens before overlap, then prepend up to 100 trailing tokens from the prior chunk. The final chunk can exceed 900. Check the daily AI budget.", "Clean Markdown", "Sequential text chunks", "src/lib/rag/chunk-markdown.ts", { scene: "chunks", failure: "Missing content or a reached budget stops indexing; budget retry is manual after reset." }),
                step("embed", "Embed and persist", "OpenAI → Postgres", "Create 1,536-dimensional embeddings, replace the material's chunk rows, then mark indexing ready. The browser refreshes while work is in flight.", "Text chunks", "Searchable vectors + ready status", "src/lib/inngest/functions.ts", { scene: "ready", failure: "Provider and database failures retry. Chunk replacement is delete-then-insert, not a transaction here." })
            ]
        },
        {
            id: "chat", label: "Grounded chat", result: "An answer with chunk references", takeaway: "Chat searches one material for up to six chunks. Bracketed references are document chunk indices, not page numbers or clickable citations.",
            steps: [
                step("guard", "Authorize the question", "Browser → Next.js", "POST a question for one material. Check user, origin, rate, ownership, conversion and index readiness. Reserve a daily request before paid calls.", "Question + material", "Authorized request", "src/app/api/chat/route.ts", { failure: "Auth, rate, budget and readiness failures stop before generation." }),
                step("save", "Save the question", "Next.js → Postgres", "Reuse an owned session for the material or create one. Save the user message before asking the model.", "Authorized question", "Saved session + user message", "src/lib/rag/sessions.ts", { scene: "question", failure: "The saved question survives a later generation failure." }),
                step("retrieve", "Retrieve the evidence", "OpenAI + pgvector", "Embed the question, then use cosine-distance ordering to fetch up to six chunks from this material and user. No minimum similarity threshold is implemented.", "Question embedding", "Ranked chunks + recent history", "src/lib/rag/retrieve.ts", { scene: "retrieve", failure: "Retrieval errors end the stream. Empty results still proceed with an explicit no-excerpts prompt." }),
                step("stream", "Stream the answer", "OpenAI → Next.js → browser", "Ask the model to use the supplied excerpts and cite zero-based chunk indices. Forward text deltas through a server-sent event stream.", "Evidence + history + question", "Answer text with bracketed indices", "src/lib/rag/prompts.ts", { scene: "answer", failure: "An exception sends a stream error. Per-claim citation validation is not implemented for chat." }),
                step("persist", "Save the answer", "Next.js → Postgres", "Save completed assistant text, token totals and all retrieved chunk IDs. Send done only after saving; the browser displays sanitized Markdown.", "Completed answer", "Persisted answer + finished stream", "src/lib/rag/sessions.ts", { scene: "answer", failure: "A save failure reports an error even if the browser already received answer text." })
            ]
        },
        {
            id: "summary", label: "Summary", result: "A revision summary", takeaway: "Summaries use ordered chunks rather than chat's top-six similarity search. Later notes can be omitted when the reference budget is full.",
            steps: [
                gather("gather", "summary"), generate("generate", "summary"), validate("validate"),
                step("read", "Read and revise", "Browser", "Show the returned overview, key points, terms and checklist. Generated summaries stay in mounted browser state; persistence is not implemented in this route.", "Validated summary", "Revision notes", "src/components/study-tools/SummaryView.tsx", { scene: "summary" })
            ]
        },
        {
            id: "quiz", label: "Quiz", result: "Practice with explanations", takeaway: "Quizzes and summaries both start from indexed chunks. A summary is not the quiz's input, and Restart reuses questions without another API call.",
            steps: [
                gather("gather", "mcq"), generate("generate", "mcq"), validate("validate"),
                step("practice", "Answer and review", "Browser", "Select an answer, reveal its explanation and advance. Restart uses the same questions. Scores and attempts are local state, not persisted database records.", "Validated questions + choice", "Feedback + local progress", "src/components/study-tools/quiz-state.ts", { scene: "quiz" })
            ]
        },
        {
            id: "calendar", label: "Calendar sync", result: "An all-day Google event", takeaway: "This is a separate, one-way flow for dated workspace items. Connecting also queues reconciliation of existing items; it is not triggered by chat or quiz completion.",
            steps: [
                step("consent", "Connect with Google", "Browser → Google → Next.js", "Start OAuth consent with a random state value. Validate its digest on callback, exchange the code and store an encrypted refresh token.", "Signed-in consent", "Stored calendar connection", "src/app/api/calendar/google/callback/route.ts", { failure: "Invalid state or token-exchange failures return a safe settings error." }),
                step("change", "Queue an item change", "Next.js → Inngest", "A dated workspace-item mutation emits a calendar event after the database write. Initial connection separately queues a reconciliation job.", "Workspace item mutation", "Calendar job event", "src/lib/calendar/events.ts", { scene: "item", failure: "There is no durable initial mutation-event outbox; delivery failure can leave the item unsynced." }),
                step("plan", "Plan the sync", "Inngest + Postgres", "Load the owned item, date property, connection and prior event link. Plan an upsert or a deletion; jobs for an item are serialized.", "Item + existing event link", "Calendar mutation plan", "src/lib/calendar/sync-plan.ts", { scene: "plan", failure: "Missing connections become a no-op. Retryable job failures have three configured retries." }),
                step("apply", "Apply the change", "Inngest → Google Calendar", "Obtain an access token in memory, then create or patch an all-day event. Deletions remove remote events and links when required.", "Mutation plan", "Google event + local link", "src/lib/calendar/sync.ts", { scene: "calendar", failure: "Revoked tokens stop sync. A missing remote event is recreated; create-then-link failure can duplicate on retry." })
            ]
        }
    ]
};
