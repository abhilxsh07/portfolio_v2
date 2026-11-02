// Authored from the sable walkthrough brief. Coordinates express explanatory layout,
// not deployment topology or measured latency. Related nodes can share a stage.
const node = (id, x, y, width, title, subtitle, kind, glyph) =>
    ({ id, x, y, width, height: 68, title, subtitle, kind, glyph });
const edge = (id, from, to, label, options = {}) =>
    ({ id, from, to, label, ...options });

export const architectureGraphs = {
    sable: {
        width: 1400, height: 790,
        figure: "01",
        footnote: "LOCAL FILE → NATIVE THREADS → PIXELS",
        controlLabel: "Control / bypass",
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
    }
};
