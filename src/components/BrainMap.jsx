import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import Copy from "./Copy";
import { BRAIN_PATH, BLOG_PATH } from "../data/pages";
import { readVisited, writeVisited } from "../lib/brainVisited";
import useReducedMotion from "../hooks/useReducedMotion";

const width = 760;
const height = 520;

const dots = [
    "M-8-1Q-8-7-1-8Q5-9 8-3Q9 4 3 7Q-5 9-8 3Z",
    "M-8 1Q-9-5-2-7Q5-9 7-4Q11 1 5 7Q-1 10-6 6Z",
    "M-7-3Q-3-9 3-8Q8-5 8 1Q7 8 0 8Q-8 7-7-3Z",
    "M-7-2Q-6-7 1-8Q8-7 9 0Q8 6 2 8Q-6 8-8 3Z"
];

function hash(slug) {
    return [...slug].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) >>> 0, 0);
}

export default function BrainMap({ map, centre, newlyOpened }) {
    const reduced = useReducedMotion();
    const ids = useId();
    const [visited, setVisited] = useState(readVisited);
    const [pointed, setPointed] = useState(null);
    const [focused, setFocused] = useState(null);
    const [tapped, setTapped] = useState(null);
    const pointer = useRef(null);
    const active = tapped ?? pointed ?? focused;
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
    let viewBox = `0 0 ${width} ${height}`;
    if (centre) {
        const left = Math.max(0, Math.min(...nodes.map(({ x }) => x)) - 72);
        const top = Math.max(0, Math.min(...nodes.map(({ y }) => y)) - 58);
        const right = Math.min(width, Math.max(...nodes.map(({ x }) => x)) + 100);
        const bottom = Math.min(height, Math.max(...nodes.map(({ y }) => y)) + 58);
        viewBox = `${left} ${top} ${right - left} ${bottom - top}`;
    }

    return (
        <div>
            <svg
                viewBox={viewBox}
                className={centre ? "h-44 w-full" : "aspect-[4/5] w-full md:aspect-[19/13]"}
                aria-label="Notes map"
                onPointerLeave={() => setPointed(null)}
            >
                <defs>
                    <filter id={ids + "-fog"} x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="13" />
                        <feColorMatrix type="matrix" values="0 0 0 0 .62 0 0 0 0 .62 0 0 0 0 .62 0 .7 0 0 .12" />
                        <feComposite in2="SourceAlpha" operator="in" />
                        <feGaussianBlur stdDeviation=".65" />
                    </filter>
                    <mask id={ids + "-mark"} maskContentUnits="objectBoundingBox" style={{ maskType: "alpha" }}>
                        <image href="/drawings/red-pen-circle.svg" width="1" height="1" preserveAspectRatio="none" />
                    </mask>
                </defs>
                <image href="/drawings/brain-outline.svg" width={width} height={height} opacity=".45" />
                <g aria-hidden="true">
                    {edges.map(([from, to]) => {
                        const a = positions.get(from);
                        const b = positions.get(to);
                        const lit = from === active || to === active;
                        return <line key={from + " " + to} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={lit ? "#4ade80" : "#404040"} opacity={active && !lit ? .25 : .65} />;
                    })}
                </g>
                {nodes.map(({ id, kind, slug, title, x, y, size, degree, draft, label }) => {
                    const post = kind === "post";
                    const lit = nearby?.has(id);
                    const colour = lit ? "#4ade80" : "#d4d4d4";
                    const seen = title && visited.includes(slug);
                    const fresh = newlyOpened === slug;
                    const rotation = hash(slug) % 21 - 10;
                    const href = `${post ? BLOG_PATH : BRAIN_PATH}/${slug}`;
                    const mark = (
                        <>
                            <circle r={size + 10} fill="transparent" />
                            {draft ? (
                                <path d="M-4-4 4 4 M-4 4 4-4" stroke={colour} strokeWidth="1.5" fill="none" opacity={title ? ".72" : ".55"} />
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
                            {seen && !post && (
                                <rect x={-size - 6} y={-size - 5} width={(size + 6) * 2} height={(size + 5) * 2}
                                    fill="#f87171" mask={`url(#${ids}-mark)`} transform={`rotate(${rotation})`} pointerEvents="none" />
                            )}
                            {title && (
                                <text x={label?.x ?? size + 5} y={label?.y ?? 4} fill={colour} fontSize="12" className={`font-mono ${degree >= 3 || id === active ? "" : "hidden md:block"}`} pointerEvents="none">
                                    {title}
                                </text>
                            )}
                        </>
                    );
                    return (
                        <g key={id} transform={`translate(${x} ${y})`} opacity={nearby && !lit ? .25 : 1}>
                            {title ? (
                                <a
                                    href={href}
                                    aria-label={title}
                                    className="cursor-pointer"
                                    onPointerDown={(event) => { pointer.current = event.pointerType; }}
                                    onPointerEnter={(event) => { if (event.pointerType !== "touch") setPointed(id); }}
                                    onPointerLeave={() => setPointed(null)}
                                    onFocus={() => setFocused(id)}
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
            {!centre && (
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-neutral-400">
                    <p><Copy k="brain.opened" /> <span>{opened} of {listed.length}</span></p>
                    <button
                        type="button"
                        aria-label="Clear opened notes"
                        className="min-h-11 px-2 hover:text-green-400"
                        onClick={() => {
                            writeVisited([]);
                            setVisited([]);
                        }}
                    >
                        <Copy k="brain.rubOut" />
                    </button>
                </div>
            )}
        </div>
    );
}
