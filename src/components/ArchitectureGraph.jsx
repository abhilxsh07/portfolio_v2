import { useEffect, useId, useRef, useState } from "react";
import {
    IconFileText, IconSettings, IconFolder, IconLayersIntersect, IconScan,
    IconAdjustmentsHorizontal, IconCpu, IconPhoto, IconSearch, IconPrinter,
    IconDatabase, IconLayoutGrid, IconBook2,
    IconZoomIn, IconZoomOut, IconFocusCentered, IconMaximize, IconMinimize,
    IconArrowLeft, IconArrowRight, IconPlayerPlay, IconPlayerPause, IconExternalLink
} from "@tabler/icons-react";
import { architectureGraphs } from "../data/architectureGraphs";
import "./ArchitectureGraph.css";

const glyphs = {
    file: IconFileText, settings: IconSettings, folder: IconFolder,
    layers: IconLayersIntersect, scan: IconScan, sliders: IconAdjustmentsHorizontal,
    cpu: IconCpu, image: IconPhoto, search: IconSearch, printer: IconPrinter,
    database: IconDatabase, grid: IconLayoutGrid, book: IconBook2
};

function port(node, side) {
    if (side === "top") return [node.x + node.width / 2, node.y];
    if (side === "bottom") return [node.x + node.width / 2, node.y + node.height];
    if (side === "left") return [node.x, node.y + node.height / 2];
    return [node.x + node.width, node.y + node.height / 2];
}

// Round the corners of an orthogonal route without a graph/layout dependency.
function roundedRoute(points) {
    let path = `M ${points[0].join(" ")}`;
    for (let index = 1; index < points.length - 1; index++) {
        const [previous, point, next] = [points[index - 1], points[index], points[index + 1]];
        const before = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
        const after = Math.hypot(next[0] - point[0], next[1] - point[1]);
        const radius = Math.min(8, before / 2, after / 2);
        if (!before || !after) continue;
        const start = point.map((value, axis) => value + (previous[axis] - value) * radius / before);
        const end = point.map((value, axis) => value + (next[axis] - value) * radius / after);
        path += ` L ${start.join(" ")} Q ${point.join(" ")} ${end.join(" ")}`;
    }
    return `${path} L ${points.at(-1).join(" ")}`;
}

function edgePath(edge, nodes) {
    const source = nodes.find((node) => node.id === edge.from);
    const target = nodes.find((node) => node.id === edge.to);
    const forward = source.x < target.x;
    const start = port(source, edge.fromPort || (forward ? "right" : "left"));
    const end = port(target, edge.toPort || (forward ? "left" : "right"));
    const middle = edge.via || (start[0] !== end[0] && start[1] !== end[1]
        ? [[(start[0] + end[0]) / 2, start[1]], [(start[0] + end[0]) / 2, end[1]]]
        : []);
    return roundedRoute([start, ...middle, end]);
}

export default function ArchitectureGraph({ tour, flow, index, stage, playing, canPlay,
    reducedMotion, onMove, onPlay, onStep, onNavigate }) {
    const graph = architectureGraphs[tour.id];
    const route = graph.routes[flow.id];
    const root = useRef(null);
    const viewport = useRef(null);
    const rail = useRef(null);
    const drag = useRef(null);
    const instance = useId().replace(/:/g, "");
    const [size, setSize] = useState({ width: 1000, height: 565 });
    const [camera, setCamera] = useState({ zoom: 1, x: 0, y: 0 });
    const [focusPath, setFocusPath] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [fullscreenError, setFullscreenError] = useState("");
    const [following, setFollowing] = useState(false);
    const activeNodes = new Set(route.steps[index]);
    const routeNodes = new Set(route.steps.flat());
    const pastNodes = new Set(route.steps.slice(0, index).flat());
    const routeEdges = new Set(route.edges);
    // Keep the legend and minimap below the drawing area, clear of output nodes.
    const drawingHeight = Math.max(120, size.height - 82);
    const fit = Math.min(size.width / graph.width, drawingHeight / graph.height);
    const primary = graph.nodes.find((node) => node.id === route.steps[index].at(-1));
    const followZoom = Math.min(8, size.width / (primary.width + 150) / fit);
    const viewCamera = following ? {
        zoom: followZoom,
        x: (graph.width / 2 - primary.x - primary.width / 2) * fit * followZoom,
        y: (graph.height / 2 - primary.y - primary.height / 2) * fit * followZoom
    } : camera;
    const scale = fit * viewCamera.zoom;
    const offsetX = (size.width - graph.width * scale) / 2 + viewCamera.x;
    const offsetY = (drawingHeight - graph.height * scale) / 2 + viewCamera.y;

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        observer.observe(viewport.current);
        const onFullscreen = () => setFullscreen(document.fullscreenElement === root.current);
        document.addEventListener("fullscreenchange", onFullscreen);
        return () => {
            observer.disconnect();
            document.removeEventListener("fullscreenchange", onFullscreen);
        };
    }, []);

    useEffect(() => {
        const selected = rail.current.querySelector('[aria-current="step"]');
        if (!selected) return;
        rail.current.scrollTo({
            left: selected.offsetLeft - rail.current.offsetLeft - (rail.current.clientWidth - selected.offsetWidth) / 2,
            behavior: reducedMotion ? "instant" : "smooth"
        });
    }, [flow.id, index, reducedMotion]);

    const zoom = (amount) => {
        setFollowing(false);
        setCamera({ ...viewCamera, zoom: Math.min(8, Math.max(0.75, viewCamera.zoom + amount)) });
    };
    const reset = () => { setFollowing(false); setCamera({ zoom: 1, x: 0, y: 0 }); };
    const expand = async () => {
        try {
            if (document.fullscreenElement === root.current) await document.exitFullscreen();
            else await root.current.requestFullscreen();
        } catch {
            setFullscreenError("Fullscreen is unavailable in this browser. You can still zoom and drag the map.");
        }
    };
    const selectNode = (id) => {
        if (activeNodes.has(id)) return;
        const currentIndex = route.steps.findIndex((items) => items.includes(id));
        if (currentIndex !== -1) { onStep(currentIndex); return; }
        const alternative = Object.entries(graph.routes).find(([, value]) => value.steps.some((items) => items.includes(id)));
        if (alternative) onNavigate(alternative[0], alternative[1].steps.findIndex((items) => items.includes(id)));
    };
    const focusZone = (zone) => {
        setFollowing(false);
        const nextZoom = Math.min(8, Math.min(size.width / (zone.width + 80), drawingHeight / (zone.height + 80)) / fit);
        setCamera({
            zoom: nextZoom,
            x: (graph.width / 2 - zone.x - zone.width / 2) * fit * nextZoom,
            y: (graph.height / 2 - zone.y - zone.height / 2) * fit * nextZoom
        });
    };

    return (
        <div ref={root} className="architecture" data-path-focus={focusPath} data-playing={playing} data-following={following}>
            <header className="architecture-toolbar">
                <div className="architecture-identity">
                    <span className="architecture-logo" aria-hidden="true"><IconCpu size={19} /></span>
                    <div><span className="architecture-kicker">{tour.id} / system atlas</span><strong>Explore the architecture</strong></div>
                </div>
                <div className="architecture-fullscreen-flows" role="group" aria-label={`${tour.id} fullscreen flows`}>
                    {tour.flows.map((item) => (
                        <button type="button" key={item.id} aria-pressed={item.id === flow.id} onClick={() => onNavigate(item.id, 0)}>{item.label}</button>
                    ))}
                </div>
                <div className="architecture-view-switch" role="group" aria-label={`${tour.id} graph view`}>
                    <button type="button" aria-pressed={!focusPath} onClick={() => setFocusPath(false)}>System map</button>
                    <button type="button" aria-pressed={focusPath} onClick={() => setFocusPath(true)}>Isolate path</button>
                </div>
                <div className="architecture-tools">
                    <button type="button" onClick={() => zoom(-0.5)} aria-label={`Zoom out ${tour.id} graph`} disabled={viewCamera.zoom <= .75}><IconZoomOut size={16} /></button>
                    <span className="architecture-zoom">{Math.round(viewCamera.zoom * 100)}%</span>
                    <button type="button" onClick={() => zoom(.5)} aria-label={`Zoom in ${tour.id} graph`} disabled={viewCamera.zoom >= 8}><IconZoomIn size={16} /></button>
                    <button type="button" onClick={reset} aria-label={`Fit ${tour.id} graph`}><IconFocusCentered size={16} /></button>
                    <button type="button" onClick={expand} aria-label={`${fullscreen ? "Exit fullscreen" : "Expand"} ${tour.id} graph`}>{fullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}</button>
                </div>
            </header>
            <div className="architecture-flow-strip">
                <span><i />{flow.label}</span>
                <button type="button" aria-pressed={following} onClick={() => setFollowing((value) => !value)}>Follow active step</button>
                <span className="architecture-live-label">{playing ? "TRACING PATH" : "INTERACTIVE SYSTEM MAP"}</span>
            </div>
            <div ref={viewport} className="architecture-viewport" tabIndex={0} role="group"
                aria-label={`${tour.id} architecture map. Drag empty space to pan. Use plus and minus to zoom, 0 to fit, arrows to step.`}
                onKeyDown={(event) => {
                    if (event.target !== event.currentTarget || event.metaKey || event.ctrlKey || event.altKey) return;
                    if (["+", "=", "-", "0", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
                    if (event.key === "+" || event.key === "=") zoom(.25);
                    if (event.key === "-") zoom(-.25);
                    if (event.key === "0") reset();
                    if (event.key === "ArrowLeft") onMove(-1);
                    if (event.key === "ArrowRight") onMove(1);
                    if (event.key === " " && canPlay) onPlay();
                }}
                onPointerDown={(event) => {
                    if (event.target.closest("button, a") || event.button !== 0) return;
                    setFollowing(false);
                    drag.current = { x: event.clientX, y: event.clientY, camera: viewCamera };
                    event.currentTarget.setPointerCapture(event.pointerId);
                    event.currentTarget.dataset.dragging = "true";
                }}
                onPointerMove={(event) => {
                    if (!drag.current) return;
                    setCamera({ ...drag.current.camera, x: drag.current.camera.x + event.clientX - drag.current.x, y: drag.current.camera.y + event.clientY - drag.current.y });
                }}
                onPointerUp={(event) => { drag.current = null; event.currentTarget.dataset.dragging = "false"; }}
                onPointerCancel={(event) => { drag.current = null; event.currentTarget.dataset.dragging = "false"; }}>
                <div className="architecture-scene" style={{ width: graph.width, height: graph.height, transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})` }}>
                    <div className="architecture-map-heading"><span>FIG. {graph.figure}</span><div><strong>{graph.title}</strong><p>{graph.subtitle}</p></div></div>
                    {graph.zones.map((zone) => (
                        <div key={zone.title} className="architecture-zone" data-kind={zone.kind} style={{ left: zone.x, top: zone.y, width: zone.width, height: zone.height }}>
                            <button type="button" onClick={() => focusZone(zone)} aria-label={`Focus ${tour.id} subsystem: ${zone.title}`}><span>{zone.title}</span><IconFocusCentered size={12} /></button>
                            <p>{zone.subtitle}</p>
                        </div>
                    ))}
                    <svg className="architecture-wires" width={graph.width} height={graph.height} aria-hidden="true">
                        <defs>
                            <marker id={`${instance}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker>
                            <filter id={`${instance}-glow`}><feGaussianBlur stdDeviation="3" /></filter>
                        </defs>
                        {graph.edges.map((edge) => {
                            const path = edgePath(edge, graph.nodes);
                            const relevant = routeEdges.has(edge.id);
                            const active = relevant && (activeNodes.has(edge.to) || activeNodes.has(edge.from));
                            const visited = relevant && pastNodes.has(edge.from) && pastNodes.has(edge.to);
                            return (
                                <g key={edge.id} className="architecture-edge" data-relevant={relevant} data-active={active} data-visited={visited} data-type={edge.type || "data"}>
                                    {active && <path d={path} className="architecture-wire-glow" filter={`url(#${instance}-glow)`} />}
                                    <path d={path} className="architecture-wire" markerEnd={`url(#${instance}-arrow)`} />
                                    {edge.labelAt && <text x={edge.labelAt[0]} y={edge.labelAt[1]} className="architecture-edge-label" textAnchor="middle">{edge.label}</text>}
                                    {active && playing && !reducedMotion && <circle r="3.4" className="architecture-signal"><animateMotion dur="2.8s" repeatCount="indefinite" path={path} /></circle>}
                                </g>
                            );
                        })}
                    </svg>
                    {graph.nodes.map((node) => {
                        const Icon = glyphs[node.glyph];
                        const active = activeNodes.has(node.id);
                        return (
                            <button type="button" key={node.id} className="architecture-node" data-node={node.id} data-kind={node.kind}
                                data-active={active} data-relevant={routeNodes.has(node.id)} data-visited={pastNodes.has(node.id)}
                                style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
                                onClick={() => selectNode(node.id)} aria-label={`${tour.id} component: ${node.title}`} aria-pressed={active}>
                                <span className="architecture-node-icon"><Icon size={17} stroke={1.5} /></span>
                                <span className="architecture-node-copy"><strong>{node.title}</strong><small>{node.subtitle}</small></span>
                                <span className="architecture-node-port architecture-node-port-in" /><span className="architecture-node-port architecture-node-port-out" />
                                {active && <span className="architecture-node-beacon" aria-hidden="true" />}
                            </button>
                        );
                    })}
                    {graph.callouts.map((callout) => <div key={callout.text} className="architecture-callout" data-kind={callout.kind} style={{ left: callout.x, top: callout.y }}>{callout.text}</div>)}
                    <div className="architecture-map-footnote"><span>CLICK A COMPONENT TO TRACE ITS ROLE</span><span>{graph.footnote}</span></div>
                </div>
                <div className="architecture-legend" aria-label="Connection legend"><span><i />Data flow</span><span><i className="is-control" />{graph.controlLabel}</span><span><i className="is-active" />Selected path</span></div>
                <button type="button" className="architecture-minimap" onClick={reset} aria-label={`Reset ${tour.id} minimap to fit`}>
                    <svg viewBox={`0 0 ${graph.width} ${graph.height}`} aria-hidden="true">
                        {graph.zones.map((zone) => <rect key={zone.title} x={zone.x} y={zone.y} width={zone.width} height={zone.height} className="architecture-minimap-zone" />)}
                        {graph.nodes.map((node) => <rect key={node.id} x={node.x} y={node.y} width={node.width} height={node.height} className={routeNodes.has(node.id) ? "is-relevant" : ""} />)}
                        <rect className="architecture-minimap-window" x={-offsetX / scale} y={-offsetY / scale} width={size.width / scale} height={drawingHeight / scale} />
                    </svg>
                </button>
                <span className="architecture-pan-hint">DRAG TO PAN <b>·</b> + / − TO ZOOM</span>
            </div>
            <div ref={rail} className="architecture-step-rail" aria-label={`${flow.label} stages`}>
                {flow.steps.map((item, stepIndex) => <button type="button" key={item.id} aria-label={`Stage ${stepIndex + 1}: ${item.title}`} aria-current={stepIndex === index ? "step" : undefined} onClick={() => onStep(stepIndex)}><span>{String(stepIndex + 1).padStart(2, "0")}</span>{item.title}</button>)}
            </div>
            <footer className="architecture-playback">
                <div className="architecture-playback-buttons">
                    <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Previous ${tour.id} stage`}><IconArrowLeft size={16} /></button>
                    <button type="button" onClick={onPlay} disabled={!canPlay} className="architecture-play-button" aria-label={`${playing ? "Pause" : "Play"} ${tour.id} walkthrough`}>{playing ? <IconPlayerPause size={15} /> : <IconPlayerPlay size={15} />}{playing ? "Pause" : index === flow.steps.length - 1 ? "Replay" : "Trace path"}</button>
                    <button type="button" onClick={() => onMove(1)} disabled={index === flow.steps.length - 1} aria-label={`Next ${tour.id} stage`}><IconArrowRight size={16} /></button>
                </div>
                <div className="architecture-now"><span>STEP {String(index + 1).padStart(2, "0")} / {String(flow.steps.length).padStart(2, "0")}</span><strong>{stage.title}</strong><small>{stage.output}</small></div>
                <div className="architecture-live-source">{stage.href ? <a href={stage.href} target="_blank" rel="noreferrer">Source <IconExternalLink size={13} /></a> : <span>Private module</span>}<small>{reducedMotion ? "Manual · reduced motion" : "← → step · Space to trace"}</small></div>
            </footer>
            {fullscreenError && <p className="architecture-error" role="status">{fullscreenError}</p>}
        </div>
    );
}
