// Stage text is condensed from the sable codebase brief (91f77a8).
// The repo went public with v1.0.0-alpha.1; stages still name modules without linking until they are checked against a release commit.
const step = (id, title, owner, description, input, output, file, extra = {}) => ({
    id, title, owner, description, input, output, file, ...extra
});

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
    intro: "Pick a route to follow a file through sable's threads, caches and draw calls, or click any part to see what it does.",
    sourceNote: "Describes a November 2026 development build, before v1.0.0-alpha.1. Modules are named, not linked; the source is at github.com/abhilxsh07/sable.",
    flows: [
        {
            id: "read", label: "Read", result: "A filtered page", takeaway: "The file and cached pixels keep their original colours. The filter runs when the page is drawn.",
            steps: [
                step("choose", "Choose a PDF", "WinUI · UI thread", "The file picker returns a path. An already-open file selects its existing tab; a new file gets a viewer and session.", "File on disk", "Tab + queued open", "app/MainWindow.xaml.cpp", { failure: "Picker failures appear in an InfoBar." }),
                step("parse", "Read and parse", "PDFium thread", "Read the file into memory, then let PDFium load it and collect page sizes, labels and permissions. The original file is not locked.", "Path + optional password", "Document + page metadata", "app/pdf/document.cpp", { failure: "Unreadable, damaged or protected PDFs produce an error or password prompt." }),
                step("schedule", "Choose visible pages", "WinUI · UI thread", "Lay out the document and request visible pages plus one neighbour on each side. Reuse GPU bitmaps or the CPU cache before requesting a render.", "Viewport + page sizes", "Page render request", "app/ViewerPage.xaml.cpp"),
                step("render", "Rasterize the page", "PDFium thread", "PDFium renders annotations and form fields into an unfiltered BGRA bitmap on white. Rendering stays off the window's UI thread.", "Page + pixel dimensions", "Original-colour bitmap", "app/pdf/document.cpp", { scene: "raster", failure: "An empty render is marked failed rather than requested repeatedly." }),
                step("cache", "Cache and upload", "WinUI · UI thread", "Return through DispatcherQueue, discard stale results, cache the bitmap and upload a GPU copy. The CPU page cache has a 256 MiB budget.", "BGRA bitmap", "Cached + uploaded page", "app/ViewerPage.xaml.cpp", { scene: "raster", failure: "Device loss leaves a placeholder until the device is rebuilt." }),
                step("filter", "Filter and draw", "Direct2D · draw", "Draw the uploaded bitmap through six colour-matrix effects. Direct2D tries hardware first and can fall back to WARP software rendering.", "Same bitmap + six matrices", "Night page on screen", "app/pdf/page_filter.cpp", { scene: "filtered", badge: "Filter applied", failure: "Device recovery re-uploads nearby pages from the cache." })
            ]
        },
        {
            id: "preset", label: "Switch preset", result: "New colours, same bitmap", takeaway: "No PDFium call. No new page raster. A preset change rewrites six matrices and redraws the uploaded bitmap.",
            steps: [
                step("select", "Choose a preset", "WinUI · UI thread", "The selected preset becomes six slider values. Every tab in the same window receives them; other windows keep their own settings.", "Preset name", "Six slider values", "app/helpers/sliders.cpp", { scene: "filtered" }),
                step("matrices", "Update six matrices", "Direct2D · UI thread", "Build six 5×4 colour matrices and update the existing effects. Each effect clamps its output before the next one runs.", "Slider values", "Updated colour matrices", "app/pdf/page_filter.cpp", { scene: "filtered", badge: "No re-render" }),
                step("redraw", "Redraw the surface", "Direct2D · draw", "Invalidate the surface and draw from the GPU bitmaps already in memory. Changing the preset never asks PDFium to render again.", "Existing GPU bitmap", "Same page, new colours", "app/ViewerPage.xaml.cpp", { scene: "filtered", badge: "No re-render" })
            ]
        },
        {
            id: "thumbnails", label: "Thumbnails", result: "Original-colour thumbnails", takeaway: "Thumbnails share the render queue and CPU cache, but their images bypass the night filter.",
            steps: [
                step("strip", "Lay out the strip", "WinUI · UI thread", "Build thumbnail positions at 98 DIPs wide, with heights based on each page. Recycle buttons outside the nearby strip viewport.", "Page sizes", "Thumbnail positions", "app/helpers/thumbnails.cpp"),
                step("queue", "Queue small renders", "WinUI · UI thread", "Visible document pages take priority. Once those requests are served, use the same render slot for nearby thumbnails at display scale.", "Strip viewport", "Small page requests", "app/ViewerPage.xaml.cpp"),
                step("render", "Rasterize small", "PDFium thread", "Render through the same PDFium path as full pages, using a smaller width and height.", "Small page request", "Original-colour bitmap", "app/pdf/session.cpp", { scene: "raster", failure: "Empty thumbnail results are marked failed." }),
                step("show", "Show the thumbnail", "WinUI · UI thread", "Copy the result into a WriteableBitmap and display it as an Image. Clicking the thumbnail navigates to that page.", "Bitmap", "Unfiltered thumbnail", "app/ViewerPage.xaml.cpp", { scene: "thumbnails", badge: "Filter bypassed" })
            ]
        },
        {
            id: "find", label: "Find", result: "Highlights over a filtered page", takeaway: "The page is filtered first. Find highlights are drawn afterward, so their colours bypass the filter (inferred from draw order).",
            steps: [
                step("query", "Wait for typing", "WinUI · UI thread", "Ctrl+F opens Find. A text or option change cancels the prior search, clears its results and starts a 150 ms debounce timer.", "Search text", "One current query", "app/ViewerFind.cpp", { scene: "filtered" }),
                step("scan", "Scan each page", "PDFium thread", "Read and normalize Unicode text, then find matches. One page runs per engine job so rendering can run between searches.", "Query + page text", "Character match ranges", "app/pdf/search.cpp", { scene: "filtered", failure: "Search failure clears matches. Results are capped at 50,000." }),
                step("boxes", "Locate the matches", "PDFium → UI thread", "Merge current-generation updates on the UI thread. Request character rectangles for matching pages in view and scroll to the active match.", "Match ranges", "Highlight rectangles", "app/ViewerSelection.cpp", { scene: "filtered" }),
                step("paint", "Paint the highlights", "Direct2D · draw", "Draw yellow matches and an orange active match over the already-filtered page. This is a separate overlay, not part of the page bitmap.", "Filtered page + rectangles", "Visible search matches", "app/ViewerFind.cpp", { scene: "find", badge: "Overlay bypasses filter" })
            ]
        },
        {
            id: "print", label: "Print", result: "Original colours on paper", takeaway: "Print uses its own raster path. Neither the screen's night preset nor its zoom determines the printed colours.",
            steps: [
                step("dialog", "Open print options", "WinUI · UI thread", "Ctrl+P opens the Windows print dialog for the document. Page ranges, paper size and orientation belong to the print task.", "Document + window", "Windows print task", "app/printing/controller.cpp", { failure: "If the modern print UI is unavailable, use the legacy print dialog and GDI path." }),
                step("preview", "Render the preview", "PDFium thread", "Render a separate unfiltered preview, capped at 96 DPI times preview scale and 4,096 pixels on its long side.", "Print page + preview size", "Original-colour preview", "app/printing/preview.cpp", { scene: "raster" }),
                step("tiles", "Render print tiles", "PDFium thread", "Render at printer DPI in bounded tiles for the modern print path. The night-filter chain is not used.", "Page + printer DPI", "Original-colour tiles", "app/printing/job.cpp", { scene: "raster", badge: "Filter bypassed" }),
                step("output", "Send to the printer", "Direct2D print control", "Submit the modern print job through Direct2D print control. The document's original colours reach the output.", "Print tiles", "Printed document", "app/printing/graphics.cpp", { scene: "print", badge: "Filter bypassed" })
            ]
        }
    ]
};
