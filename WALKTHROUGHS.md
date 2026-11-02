# Project walkthroughs

The sable and Cursus case studies on `/work` come in three layers.

1. The project card: what it is, its status, my part, one outcome, and links.
   Those lines come from `role`, `proof` and `note` in `src/data/portfolio.js`.
2. The short write-up inside "Inside …: how it works", written in
   `src/components/Projects.jsx`: the idea, a four or five step flow
   (`FlowSteps.jsx`), three decisions, and the limits. This is the version most
   people will read, and it should make sense without the map.
3. The full explorer behind "Explore the full architecture"
   (`ArchitectureExplorer.jsx`). It lazy-loads `ProjectWalkthrough.jsx`, which
   pulls in the atlas and both data files, so none of that ships in the main
   bundle. Closing the case study unmounts it.

Explorer flow content lives in `src/data/walkthroughs.js`; scoped styles are in
`src/components/ProjectWalkthrough.css`. No services are contacted by the tours.
Examples are fictional, deterministic browser illustrations.

Inside the explorer, the main view is an architecture atlas in `src/components/ArchitectureGraph.jsx`.
Its authored nodes, subsystem boundaries, orthogonal edges and stage-to-component
mappings live in `src/data/architectureGraphs.js`. `ArchitectureGraph.css` owns its
styles. sable has 18 nodes and 20 edges; Cursus has 20 nodes and 23 edges.
Counts describe the explanatory diagram, not measured runtime activity.

The reference's spatial presentation informed this redesign. No code, diagram
assets, or styling were copied from Perf Sentinel. Nodes and wiring describe the
two supplied codebase briefs. The atlas supplements the detailed stage inspector
and fictional result previews.

## Source basis

Checked on 1 November 2026 against:

- `D:/NightPdf/rework/sable-walkthrough-brief.md`, describing `91f77a8`.
- `C:/Users/Abhilash Kar/Downloads/codingStuff/Cursus/cursus-public/cursus-walkthrough-brief.md`,
  describing `ccfe3d6` on `fix/security-audit`.

Both repositories are private. On 2 November 2026 an anonymous request for
`github.com/abhilxsh07/sable` returned 404, so sable's stages name their modules
without linking to them, and the project card has no Source action. If the repo
goes public later, link files at a commit that matches these descriptions and
review the two together. Don't reuse line numbers from a different commit.

Cursus has no repository links. Its private module names explain ownership.
Cursus's UI came from a design system that isn't mine, so the old product
screenshots aren't shown anywhere. The card uses an original illustration
(`CursusOverview.jsx`), labelled as one, and the tour doesn't reuse those
screenshots, styles, components or assets.

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

## Phones

Under 700px the short flow becomes a vertical list with 15px body text and no
panning or zooming. The atlas is still there behind the same button, with
larger stage text at that width, but its map labels stay small; that's why
nothing in the short version depends on it. "Back to the short version" closes it.

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
