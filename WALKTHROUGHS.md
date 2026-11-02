# Project walkthroughs

`src/components/ProjectWalkthrough.jsx` is shared by sable and Cursus on `/work`.
Flow content lives in `src/data/walkthroughs.js`; scoped styles are in
`src/components/ProjectWalkthrough.css`. No services are contacted by the tours.
Examples are fictional, deterministic browser illustrations.

The primary view is an architecture atlas in `src/components/ArchitectureGraph.jsx`.
Its authored nodes, subsystem boundaries, orthogonal edges and stage-to-component
mappings live in `src/data/architectureGraphs.js`. `ArchitectureGraph.css` owns its
styles. sable has 18 nodes and 20 edges; Cursus has 20 nodes and 23 edges.
Counts describe the explanatory diagram, not measured runtime activity.

The reference's spatial presentation informed this redesign. No code, diagram
assets, or styling were copied from Perf Sentinel. Nodes and wiring describe the
two supplied codebase briefs. The atlas supplements the detailed stage inspector
and fictional result previews.

## Source basis

Reviewed on 1 November 2026 against:

- `D:/NightPdf/rework/sable-walkthrough-brief.md`, describing `91f77a8`.
- `C:/Users/Abhilash Kar/Downloads/codingStuff/Cursus/cursus-public/cursus-walkthrough-brief.md`,
  describing `ccfe3d6` on `fix/security-audit`.

sable's GitHub `main` was independently checked through the GitHub API and
resolved to `8e4aca7274da75d423e8183f094dcb18d7a5f6ab`. Links open whole files
at that published snapshot. Do not use the newer brief's line numbers there.
The tour labels the snapshot difference. Recheck public availability before
updating the pinned SHA, then review the descriptions and source files together.

Cursus has no repository links. Its private module names explain ownership.
The existing Cursus product gallery was replaced with an original engineering
map because the brief associates its product styling with Memoria. The tour
does not reuse those screenshots, styles, components or assets.

## Deliberate boundaries

- sable's preview uses browser CSS in the documented filter order. It is an
  illustration, not a Direct2D renderer or a pixel-equivalence measurement.
- Presets match the brief. “Original” uses the zero values behind Custom,
  without simulating the app's custom-slider panel.
- Thumbnails and printing bypass the filter. Find's overlay bypass is marked
  as an inference from the native draw order.
- Cursus chat uses up to six chunks from one material, without a similarity
  threshold. Chunk citations remain plain bracketed text, not page links.
- Study tools pack ordered context rather than using chat retrieval. The quiz
  example offers local feedback and restart; it does not call a model.
- Calendar is a separate one-way path. Initial consent also starts a separate
  reconciliation job; subsequent dated-item edits use the mutation path shown.
- Stages summarize several native/code steps. Failure notes describe actual
  limits, including initial event-delivery gaps and nontransactional indexing.

## Interaction checks

Select a flow, click any numbered stage, or focus the diagram and use Left/Right,
Home/End. Space toggles playback; playback advances every five seconds and stops
at the last stage. Manual navigation and flow changes pause playback. Closing
the project details, leaving the viewport or hiding the document also pauses it.
Reduced-motion users keep manual controls with playback disabled and no motion
transitions. The two tours own independent state.

Check at desktop and narrow widths, including long module names, selected quiz
answers, focus outlines and bypassing the filter after changing the preset.

## Architecture controls

- Click a component to select its stage. A component on another path switches
  to that path; the same subsystem can participate in several stages.
- System map retains all architecture context. Isolate path dims unrelated
  components and edges. Dashed wires represent control/event or bypass paths.
- Plus/minus zoom; 0 and the fit control restore the map. Drag empty space to
  pan. Subsystem headings focus their boundary. Follow active step centers and
  enlarges the current component as stages change, including on narrow screens.
- Fullscreen includes its own flow switcher, stage rail, playback and source
  control. Escape uses the browser's normal fullscreen exit.
- Signals travel along active SVG paths only during playback and are omitted
  for reduced motion. They illustrate flow; they do not represent real requests.
- The minimap shows the viewport and fits the system on click. The stage rail
  follows the selected stage horizontally without moving the page vertically.
