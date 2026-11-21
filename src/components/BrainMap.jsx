import { useEffect, useId, useRef, useState } from "react";
import { IconFocusCentered, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { motion } from "motion/react";
import Copy from "./Copy";
import { brainScene } from "../data/brain";
import { copy } from "../data/copy";
import { BRAIN_PATH, BLOG_PATH } from "../data/pages";
import { ready } from "../data/ready";
import { readVisited, writeVisited } from "../lib/brainVisited";
import useReducedMotion from "../hooks/useReducedMotion";

const { width, height, labelSize } = brainScene;
const minZoom = .65;
const maxZoom = 4;
const zoomStep = 1.25;

const dots = [
    "M-8-1Q-8-7-1-8Q5-9 8-3Q9 4 3 7Q-5 9-8 3Z",
    "M-8 1Q-9-5-2-7Q5-9 7-4Q11 1 5 7Q-1 10-6 6Z",
    "M-7-3Q-3-9 3-8Q8-5 8 1Q7 8 0 8Q-8 7-7-3Z",
    "M-7-2Q-6-7 1-8Q8-7 9 0Q8 6 2 8Q-8 8-8 3Z"
];

const arrowKeys = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
};

function hash(slug) {
    return [...slug].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) >>> 0, 0);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function noteFrame(nodes, centre) {
    if (!centre || !nodes.length) return { x: width / 2, y: height / 2, width, height };
    const left = Math.min(...nodes.map(({ x, size, label }) => Math.min(x - size, x + (label?.x ?? 0))));
    const right = Math.max(...nodes.map(({ x, size, label, title }) => Math.max(x + size, x + (label?.x ?? 0) + (title?.length ?? 0) * labelSize * .62)));
    const top = Math.min(...nodes.map(({ y, size, label }) => Math.min(y - size, y + (label?.y ?? 0) - labelSize)));
    const bottom = Math.max(...nodes.map(({ y, size, label }) => Math.max(y + size, y + (label?.y ?? 0) + 6)));
    return {
        x: (left + right) / 2,
        y: (top + bottom) / 2,
        width: Math.max(360, right - left + 104),
        height: Math.max(260, bottom - top + 100)
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

function BrainOutline({ id }) {
    return (
        <g aria-hidden="true" pointerEvents="none">
            <defs>
                <linearGradient id={id + "-tissue"} x2="0" y2="1">
                    <stop stopColor="#26382e" stopOpacity=".68" />
                    <stop offset="1" stopColor="#202a23" stopOpacity=".74" />
                </linearGradient>
                <g id={id + "-hemisphere"}>
                    <path
                        d="M 558 164 C 562 105 531 67 486 62 C 455 36 405 38 370 57 C 333 38 279 51 252 76
                            C 199 71 158 106 148 145 C 98 161 76 203 88 243 C 58 273 50 322 72 352
                            C 54 391 71 435 96 456 C 79 504 105 548 135 564 C 130 611 162 635 197 643
                            C 211 686 251 704 287 692 C 316 722 357 728 393 710 C 435 731 472 714 492 690
                            C 540 693 563 658 559 620 C 550 588 565 562 556 532 C 542 500 561 478 555 449
                            C 544 414 565 390 556 360 C 548 322 565 299 558 266 C 549 226 565 200 558 164 Z"
                        fill={`url(#${id}-tissue)`}
                        stroke="#728d79"
                        strokeWidth="2"
                    />
                    <path
                        d="M 522 156 C 485 116 431 143 401 106 C 370 77 316 83 285 101
                            M 459 77 C 484 91 497 111 491 128 M 266 86 C 237 101 226 122 231 147
                            M 138 191 C 186 158 216 178 246 207 C 268 230 299 229 320 211
                            M 101 287 C 135 245 192 259 219 281 C 244 302 272 306 293 293
                            M 159 261 C 181 272 182 298 168 323 C 154 348 158 370 180 381
                            M 470 172 C 451 207 469 230 504 242 C 528 251 534 274 526 297
                            M 116 433 C 154 407 187 429 210 448 C 234 469 272 465 294 445
                            M 144 537 C 193 508 216 534 254 553 C 279 565 308 561 332 542
                            M 214 624 C 239 606 263 615 283 634 C 303 655 334 659 355 643
                            M 338 693 C 369 667 411 671 436 687 M 492 657 C 517 645 530 622 522 601"
                        fill="none"
                        stroke="#68806e"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        opacity=".43"
                    />
                </g>
            </defs>
            <use href={`#${id}-hemisphere`} />
            <use href={`#${id}-hemisphere`} transform={`translate(${width} 0) scale(-1 1)`} />
        </g>
    );
}

export default function BrainMap({ map, centre, newlyOpened, showSlots }) {
    const reduced = useReducedMotion();
    const ids = useId();
    const surface = useRef(null);
    const drag = useRef(null);
    const pointer = useRef(null);
    const [visited, setVisited] = useState(readVisited);
    const [pointed, setPointed] = useState(null);
    const [focused, setFocused] = useState(null);
    const [tapped, setTapped] = useState(null);
    const active = pointed ?? focused ?? tapped;
    const showDrawings = ready.brain || showSlots;
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

    const controlsClass = "grid size-11 place-items-center rounded-md text-neutral-300 enabled:hover:bg-neutral-800 enabled:hover:text-paper disabled:opacity-40";
    const activeName = positions.get(active)?.title;

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                <div className="flex flex-wrap items-center justify-end gap-x-4 border-b border-neutral-800 px-2 sm:justify-between sm:px-3">
                    <p className="hidden pl-1 font-mono text-xs text-neutral-400 sm:block">Drag to pan · Ctrl or ⌘ + scroll to zoom</p>
                    <div role="group" aria-label="Map zoom controls" className="flex items-center gap-1">
                        <button type="button" className={controlsClass} onClick={() => zoom(1 / zoomStep)} disabled={camera.zoom <= minZoom} aria-label="Zoom out" title="Zoom out">
                            <IconZoomOut size={19} aria-hidden="true" />
                        </button>
                        <output aria-label="Map zoom" className="w-13 text-center font-mono text-xs tabular-nums text-pencil">{Math.round(camera.zoom * 100)}%</output>
                        <button type="button" className={controlsClass} onClick={() => zoom(zoomStep)} disabled={camera.zoom >= maxZoom} aria-label="Zoom in" title="Zoom in">
                            <IconZoomIn size={19} aria-hidden="true" />
                        </button>
                        <button type="button" className={controlsClass} onClick={fit} aria-label="Fit map" title="Fit map">
                            <IconFocusCentered size={19} aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <div className="brain-map-surface relative">
                    <svg
                        ref={surface}
                        viewBox={viewBox}
                        className={`block w-full cursor-grab touch-none active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-400 ${centre ? "h-[clamp(21rem,46vw,31rem)]" : "h-[clamp(25rem,63vw,44rem)]"}`}
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
                        <defs>
                            <filter id={ids + "-fog"} x="-30%" y="-30%" width="160%" height="160%">
                                <feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="13" />
                                <feColorMatrix type="matrix" values="0 0 0 0 .62 0 0 0 0 .62 0 0 0 0 .62 0 0 .7 0 0 .12" />
                                <feComposite in2="SourceAlpha" operator="in" />
                                <feGaussianBlur stdDeviation=".65" />
                            </filter>
                            {showDrawings && (
                                <mask id={ids + "-mark"} maskContentUnits="objectBoundingBox" style={{ maskType: "alpha" }}>
                                    <image href="/drawings/red-pen-circle.svg" width="1" height="1" preserveAspectRatio="none" />
                                </mask>
                            )}
                        </defs>
                        {showDrawings ? (
                            <image href="/drawings/brain-outline.svg" width={width} height={height} opacity=".55" pointerEvents="none" aria-hidden="true" />
                        ) : <BrainOutline id={ids} />}
                        <g aria-hidden="true" pointerEvents="none">
                            {edges.map(([from, to]) => {
                                const a = positions.get(from);
                                const b = positions.get(to);
                                const lit = from === (active ?? centre) || to === (active ?? centre);
                                return <line key={from + " " + to} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={lit ? "#73cf94" : "#7c8776"} strokeWidth={lit ? 1.7 : 1.05} opacity={active && !lit ? .23 : .68} />;
                            })}
                        </g>
                        {nodes.map(({ id, kind, slug, title, x, y, size, degree, draft, label }) => {
                            const post = kind === "post";
                            const current = centre === id;
                            const lit = current || nearby?.has(id);
                            const colour = lit ? "#8ee5a9" : draft ? "#dec4a5" : "#e8e6db";
                            const seen = title && visited.includes(slug);
                            const fresh = newlyOpened === slug;
                            const rotation = hash(slug) % 21 - 10;
                            const href = `${post ? BLOG_PATH : BRAIN_PATH}/${slug}${showSlots ? "?slots=1" : ""}`;
                            const labelClass = !centre && degree < 3 && id !== active ? "hidden md:block" : "";
                            const mark = (
                                <>
                                    <circle className="brain-map-hit" r={size + 12} fill="transparent" />
                                    {draft ? (
                                        <g opacity={title ? 1 : .48}>
                                            <circle r={size + 1} fill="#161f18" stroke={colour} strokeWidth="1.2" />
                                            <path d="M-3.5-3.5 3.5 3.5 M-3.5 3.5 3.5-3.5" stroke={colour} strokeWidth="1.45" fill="none" />
                                        </g>
                                    ) : post ? (
                                        <rect x={-size / 2} y={-size / 2} width={size} height={size} fill={colour} />
                                    ) : (
                                        <path d={dots[hash(slug) % dots.length]} fill={colour} transform={`scale(${size / 8})`} />
                                    )}
                                    {!draft && !post && (
                                        <motion.circle
                                            r={size + 4}
                                            fill="#a3a3a3"
                                            filter={`url(#${ids}-fog)`}
                                            initial={fresh && !reduced ? { opacity: .9 } : false}
                                            animate={{ opacity: seen || fresh ? 0 : .9 }}
                                            transition={{ duration: reduced ? 0 : .3 }}
                                            pointerEvents="none"
                                        />
                                    )}
                                    {(seen || fresh) && !post && (showDrawings ? (
                                        <rect x={-size - 6} y={-size - 5} width={(size + 6) * 2} height={(size + 5) * 2}
                                            fill="#f87171" mask={`url(#${ids}-mark)`} transform={`rotate(${rotation})`} pointerEvents="none" />
                                    ) : <circle r={size + 6} fill="none" stroke={colour} opacity=".75" pointerEvents="none" />)}
                                    {title && (
                                        <text
                                            x={label?.x ?? size + 9}
                                            y={label?.y ?? 5}
                                            fill={colour}
                                            stroke="#131b15"
                                            strokeWidth="3"
                                            strokeLinejoin="round"
                                            paintOrder="stroke"
                                            fontSize={labelSize}
                                            className={`font-mono ${labelClass}`}
                                        >
                                            {title}
                                        </text>
                                    )}
                                </>
                            );
                            return (
                                <g key={id} transform={`translate(${x} ${y})`} opacity={nearby && !lit ? .36 : 1}>
                                    {title ? (
                                        <a
                                            href={href}
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
                    {activeName && (
                        <p className="pointer-events-none absolute inset-x-3 bottom-2 mx-auto w-fit max-w-[90%] rounded border border-neutral-700 bg-neutral-950 px-2.5 py-1 font-mono text-xs text-paper md:hidden">
                            {activeName}
                        </p>
                    )}
                </div>
            </div>
            <p id={ids + "-keys"} className="sr-only">Use plus and minus to zoom, the arrow keys to pan, and 0 to fit the map.</p>
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
