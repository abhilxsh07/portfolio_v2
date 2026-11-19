# Project walkthroughs

The case studies on `/work` come in layers. sable has all three; Cursus stops
at the second, since it's paused and the short version covers it.

1. The project card: what it is, its status, my part, one outcome, and links.
   Those lines come from `role`, `proof` and `note` in `src/data/portfolio.js`.
2. The short write-up inside "Inside …: how it works", written in
   `src/components/Projects.jsx`: the idea, a four or five step flow
   (`FlowSteps.jsx`), three decisions, and the limits. This is the version most
   people will read, and it should make sense without the map.
3. The full explorer behind "Explore the full architecture"
   (`ArchitectureExplorer.jsx`). It lazy-loads `ProjectWalkthrough.jsx`, which
   pulls in the atlas and its data files, so none of that ships in the main
   bundle. Closing the case study unmounts it.

Explorer flow content lives in `src/data/walkthroughs.js`; scoped styles are in
`src/components/ProjectWalkthrough.css`. No services are contacted by the tours.
Examples are fictional, deterministic browser illustrations.

Inside the explorer, the main view is an architecture atlas in `src/components/ArchitectureGraph.jsx`.
Its authored nodes, subsystem boundaries, orthogonal edges and stage-to-component
mappings live in `src/data/architectureGraphs.js`. `ArchitectureGraph.css` owns its
styles. The sable map has 18 nodes and 20 edges. That describes the diagram,
not measured runtime activity.

The reference's spatial presentation informed this redesign. No code, diagram
assets, or styling were copied from Perf Sentinel. Nodes and wiring describe the
sable codebase brief. The atlas supplements the detailed stage inspector
and fictional result previews.

## Source basis

Checked on 1 November 2026 against
`D:/NightPdf/rework/sable-walkthrough-brief.md`, describing `91f77a8`. The
Cursus short write-up is based on its brief for `ccfe3d6` on `fix/security-audit`.

sable's repo went public with v1.0.0-alpha.1 on 17 November 2026, and the
project card now links to the source and the release. The stages still name
their modules without linking to them. To link them, pick a commit that matches
these descriptions and review the two together. Don't reuse line numbers from a different commit.

Cursus's UI came from a design system that isn't mine, so the old product
screenshots aren't shown anywhere. The card uses an original illustration
(`CursusOverview.jsx`), labelled as one.

Cursus used to have its own explorer too. It was cut on 2 November 2026 as
too much depth for a paused project; it's in the history before that if it
ever needs to come back.

## Deliberate boundaries

- sable's preview uses browser CSS in the documented filter order. It is an
  illustration, not a Direct2D renderer or a pixel-equivalence measurement.
- Presets match the brief. “Original” uses the zero values behind Custom,
  without simulating the app's custom-slider panel.
- Thumbnails and printing bypass the filter. Find's overlay bypass is marked
  as an inference from the native draw order.
- Stages summarize several native/code steps. Failure notes describe actual
  limits.

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
transitions.

Check at desktop and narrow widths, including long module names, focus outlines
and bypassing the filter after changing the preset.

## Architecture controls

- Click a component to select its stage. A component on another path switches
  to that path; the same subsystem can participate in several stages.
- System map retains all architecture context. Isolate path dims unrelated
  components and edges. Dashed wires represent control or bypass paths.
- Plus/minus zoom; 0 and the fit control restore the map. Drag empty space to
  pan. Subsystem headings focus their boundary. Follow active step centers and
  enlarges the current component as stages change, including on narrow screens.
- Fullscreen includes its own flow switcher, stage rail, playback and source
  control. Escape uses the browser's normal fullscreen exit.
- Signals travel along active SVG paths only during playback and are omitted
  for reduced motion. They illustrate flow; they do not represent real requests.
- The minimap shows the viewport and fits the system on click. The stage rail
  follows the selected stage horizontally without moving the page vertically.
