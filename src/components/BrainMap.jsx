import { useEffect, useId, useRef, useState } from "react";
import { IconArrowUpRight, IconMinus, IconPlus } from "@tabler/icons-react";
import Copy from "./Copy";
import { brainScene } from "../data/brain";
import { copy } from "../data/copy";
import { BRAIN_PATH, BLOG_PATH } from "../data/pages";
import { readVisited, writeVisited } from "../lib/brainVisited";

const { width, height, labelSize } = brainScene;
const minZoom = .65;
const maxZoom = 4;
const zoomStep = 1.25;
const activeColour = "#8bd8a6";

const arrowKeys = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
};

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function noteFrame(nodes, centre) {
    if (!centre || !nodes.length) return { x: width / 2, y: height / 2, width, height };

    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    for (const { x, y, size, label, title } of nodes) {
        const textWidth = (title?.length ?? 0) * labelSize * .62;
        const anchor = label?.anchor === "end" ? 1 : label?.anchor === "middle" ? .5 : 0;
        const labelLeft = x + (label?.x ?? 0) - textWidth * anchor;
        const labelY = y + (label?.y ?? 0);
        left = Math.min(left, x - size, labelLeft);
        right = Math.max(right, x + size, labelLeft + textWidth);
        top = Math.min(top, y - size, labelY - labelSize);
        bottom = Math.max(bottom, y + size, labelY + 6);
    }

    return {
        x: (left + right) / 2,
        y: (top + bottom) / 2,
        width: Math.max(360, right - left + 112),
        height: Math.max(260, bottom - top + 112)
    };
}

function keepInFrame(camera, frame) {
    return {
        ...camera,
        x: clamp(camera.x, frame.x - frame.width / 2, frame.x + frame.width / 2),
        y: clamp(camera.y, frame.y - frame.height / 2, frame.y + frame.height / 2)
    };
}

function zoomMap(camera, factor, point = camera) {
    const zoom = clamp(camera.zoom * factor, minZoom, maxZoom);
    const ratio = camera.zoom / zoom;
    return {
        zoom,
        x: point.x + (camera.x - point.x) * ratio,
        y: point.y + (camera.y - point.y) * ratio
    };
}

function noteHref({ kind, slug }, showSlots) {
    return `${kind === "post" ? BLOG_PATH : BRAIN_PATH}/${slug}${showSlots ? "?slots=1" : ""}`;
}

export default function BrainMap({ map, centre, showSlots }) {
    const ids = useId();
    const surface = useRef(null);
    const drag = useRef(null);
    const pointer = useRef(null);
    const [visited, setVisited] = useState(readVisited);
    const [pointed, setPointed] = useState(null);
    const [focused, setFocused] = useState(null);
    const [tapped, setTapped] = useState(null);
    const active = pointed ?? focused ?? tapped;
    const positions = new Map(map.nodes.map((node) => [node.id, node]));

    const neighbours = (id) => {
        const related = new Set([id]);
        for (const [from, to] of map.edges) {
            if (from === id) related.add(to);
            if (to === id) related.add(from);
        }
        return related;
    };

    const shown = centre ? neighbours(centre) : null;
    const nearby = active ? neighbours(active) : null;
    const nodes = map.nodes.filter(({ id }) => !shown || shown.has(id));
    const edges = map.edges.filter(([from, to]) => !shown || (shown.has(from) && shown.has(to)));
    const listed = map.nodes.filter(({ kind, title }) => kind === "note" && title);
    const opened = listed.filter(({ slug }) => visited.includes(slug)).length;
    const frame = noteFrame(nodes, centre);
    const [camera, setCamera] = useState(() => ({ x: frame.x, y: frame.y, zoom: 1 }));
    const viewWidth = frame.width / camera.zoom;
    const viewHeight = frame.height / camera.zoom;
    const viewBox = [camera.x - viewWidth / 2, camera.y - viewHeight / 2, viewWidth, viewHeight].join(" ");

    useEffect(() => {
        const chart = surface.current;
        const limits = { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
        const onWheel = (event) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(chart.getScreenCTM().inverse());
            const delta = clamp(event.deltaY * (event.deltaMode === 1 ? 16 : 1), -100, 100);
            setCamera((current) => keepInFrame(zoomMap(current, Math.exp(-delta * .005), point), limits));
        };
        chart.addEventListener("wheel", onWheel, { passive: false });
        return () => chart.removeEventListener("wheel", onWheel);
    }, [frame.x, frame.y, frame.width, frame.height]);

    const zoom = (factor) => setCamera((current) => zoomMap(current, factor));
    const fit = () => setCamera({ x: frame.x, y: frame.y, zoom: 1 });

    function panStart(event) {
        if (event.button !== 0 || !event.isPrimary || event.target.closest("a")) return;
        const chart = event.currentTarget;
        drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            scale: chart.getScreenCTM().inverse().a,
            camera
        };
        chart.setPointerCapture(event.pointerId);
        setPointed(null);
        setTapped(null);
    }

    function panMove(event) {
        const start = drag.current;
        if (!start || start.id !== event.pointerId) return;
        setCamera(keepInFrame({
            ...start.camera,
            x: start.camera.x - (event.clientX - start.x) * start.scale,
            y: start.camera.y - (event.clientY - start.y) * start.scale
        }, frame));
    }

    function panEnd(event) {
        if (drag.current?.id === event.pointerId) drag.current = null;
    }

    function handleKeys(event) {
        if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
        const shift = arrowKeys[event.key];
        if (shift) {
            event.preventDefault();
            setCamera((current) => keepInFrame({
                ...current,
                x: current.x + shift[0] * viewWidth * .12,
                y: current.y + shift[1] * viewHeight * .12
            }, frame));
        } else if (["+", "=", "-", "0"].includes(event.key)) {
            event.preventDefault();
            if (event.key === "0") fit();
            else zoom(event.key === "-" ? 1 / zoomStep : zoomStep);
        }
    }

    function focusNode(event, id, x, y) {
        setFocused(id);
        if (!event.currentTarget.matches(":focus-visible")) return;
        const plot = surface.current.getBoundingClientRect();
        const box = event.currentTarget.getBoundingClientRect();
        if (box.left < plot.left || box.right > plot.right || box.top < plot.top || box.bottom > plot.bottom) {
            setCamera((current) => keepInFrame({ ...current, x, y }, frame));
        }
    }

    const controlClass = "grid min-h-11 min-w-10 place-items-center rounded text-neutral-300 enabled:hover:bg-neutral-800 enabled:hover:text-paper disabled:opacity-40";
    const picked = positions.get(tapped);
    const mapHeight = centre ? "h-[clamp(21rem,46vw,29rem)]" : "h-[clamp(16rem,76vw,22rem)] md:h-auto md:aspect-[7/4]";
    const overview = !centre && camera.zoom < 2;
    const overviewSize = camera.zoom <= 1.25 ? "text-[36px] md:text-base" : "text-[24px] md:text-base";
    const regionNotes = new Map();
    for (const node of nodes) {
        if (node.title && node.degree > (regionNotes.get(node.region)?.degree ?? -1)) {
            regionNotes.set(node.region, node);
        }
    }

    return (
        <div>
            <div className="relative isolate overflow-hidden rounded-xl border border-neutral-800 bg-[#111]">
                <div
                    role="group"
                    aria-label="Map zoom controls"
                    className="absolute right-3 top-3 z-10 flex items-center rounded-lg border border-neutral-800 bg-neutral-950 p-0.5"
                >
                    <button type="button" className={controlClass} onClick={() => zoom(1 / zoomStep)} disabled={camera.zoom <= minZoom} aria-label="Zoom out" title="Zoom out">
                        <IconMinus size={16} aria-hidden="true" />
                    </button>
                    <button type="button" className={controlClass + " min-w-13 px-1 font-mono text-xs tabular-nums"} onClick={fit} aria-label="Fit map" title="Fit map" aria-describedby={ids + "-zoom"}>
                        <span id={ids + "-zoom"} aria-live="polite">{Math.round(camera.zoom * 100)}%</span>
                    </button>
                    <button type="button" className={controlClass} onClick={() => zoom(zoomStep)} disabled={camera.zoom >= maxZoom} aria-label="Zoom in" title="Zoom in">
                        <IconPlus size={16} aria-hidden="true" />
                    </button>
                </div>
                <svg
                    ref={surface}
                    viewBox={viewBox}
                    className={`brain-map block w-full cursor-grab touch-none active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-400 ${mapHeight}`}
                    role="group"
                    tabIndex={0}
                    aria-label="Notes map"
                    aria-describedby={ids + "-keys"}
                    onKeyDown={handleKeys}
                    onPointerDown={panStart}
                    onPointerMove={panMove}
                    onPointerUp={panEnd}
                    onPointerCancel={panEnd}
                    onLostPointerCapture={panEnd}
                    onPointerLeave={() => setPointed(null)}
                >
                    <g aria-hidden="true" pointerEvents="none">
                        {edges.map(([from, to]) => {
                            const a = positions.get(from);
                            const b = positions.get(to);
                            const lit = from === (active ?? centre) || to === (active ?? centre);
                            return (
                                <line
                                    key={from + " " + to}
                                    x1={a.x}
                                    y1={a.y}
                                    x2={b.x}
                                    y2={b.y}
                                    stroke={lit ? activeColour : "#383838"}
                                    opacity={lit ? .65 : active ? .46 : 1}
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </g>
                    {nodes.map((node) => {
                        const { id, kind, slug, title, region, x, y, size, label } = node;
                        const current = centre === id;
                        const lit = current || nearby?.has(id);
                        const seen = kind === "note" && visited.includes(slug);
                        const fill = lit ? activeColour : seen ? "#d6d3d1" : "#8a8a8a";
                        const dotSize = size * .68;
                        const mobileNote = active ?? regionNotes.get(region)?.id;
                        const mark = (
                            <>
                                <circle className="brain-map-hit [r:27px] md:[r:18px]" r={size + 12} fill="transparent" />
                                {kind === "post" ? (
                                    <rect x={-dotSize} y={-dotSize} width={dotSize * 2} height={dotSize * 2} rx="1.5" fill={fill} />
                                ) : <circle r={dotSize} fill={fill} stroke={fill} strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="md:stroke-0" />}
                                {title && (
                                    <text
                                        x={label?.x ?? size + 10}
                                        y={label?.y ?? 5}
                                        textAnchor={label?.anchor}
                                        fill={lit ? activeColour : "#d6d3d1"}
                                        fontSize={labelSize}
                                        className={`font-sans select-none ${overview ? overviewSize : ""} ${overview && id !== mobileNote ? "hidden md:block" : ""}`}
                                    >
                                        {title}
                                    </text>
                                )}
                            </>
                        );
                        return (
                            <g key={id} transform={`translate(${x} ${y})`} opacity={title ? (nearby && !lit ? .58 : 1) : .42}>
                                {title ? (
                                    <a
                                        href={noteHref(node, showSlots)}
                                        aria-label={title}
                                        aria-current={current ? "page" : undefined}
                                        className="cursor-pointer"
                                        onPointerDown={(event) => { pointer.current = event.pointerType; }}
                                        onPointerEnter={(event) => { if (event.pointerType !== "touch") setPointed(id); }}
                                        onPointerLeave={() => setPointed(null)}
                                        onFocus={(event) => focusNode(event, id, x, y)}
                                        onBlur={() => setFocused(null)}
                                        onClick={(event) => {
                                            if (event.detail && pointer.current === "touch" && window.matchMedia("(max-width: 767px)").matches && tapped !== id) {
                                                event.preventDefault();
                                                setTapped(id);
                                            }
                                        }}
                                    >
                                        {mark}
                                    </a>
                                ) : <g aria-hidden="true">{mark}</g>}
                            </g>
                        );
                    })}
                </svg>
                {picked?.title && (
                    <a
                        href={noteHref(picked, showSlots)}
                        className="absolute inset-x-3 bottom-3 mx-auto flex min-h-11 w-fit max-w-[90%] items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-paper hover:text-green-400 md:hidden"
                    >
                        {picked.title} <IconArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
                    </a>
                )}
            </div>
            <p id={ids + "-keys"} className="sr-only">Use the arrow keys to pan, plus or minus to zoom, and 0 to fit the map.</p>
            {!centre && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 font-mono text-xs text-neutral-400">
                    <p>{copy.brain.opened !== null || showSlots ? <Copy k="brain.opened" /> : "Notes opened"} <span>{opened} of {listed.length}</span></p>
                    <button
                        type="button"
                        disabled={opened === 0}
                        className="min-h-11 px-2 enabled:hover:text-green-400 disabled:opacity-50"
                        onClick={() => {
                            writeVisited([]);
                            setVisited([]);
                        }}
                    >
                        {copy.brain.rubOut !== null || showSlots ? <Copy k="brain.rubOut" /> : "Clear opened notes"}
                    </button>
                </div>
            )}
        </div>
    );
}
