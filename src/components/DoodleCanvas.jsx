import { useEffect, useRef, useState } from "react";
import Copy from "./Copy";
import { copy } from "../data/copy";
import { ready } from "../data/ready";
import useReducedMotion from "../hooks/useReducedMotion";
import { startDoodles } from "../lib/doodles";

const inks = [
    { name: "Green", color: "#4ade80" },
    { name: "Red pen", color: "#f87171" },
    { name: "Pencil", color: "#a3a3a3" }
];

export default function DoodleCanvas({ showSlots }) {
    const canvas = useRef(null);
    const actions = useRef(null);
    const reduced = useReducedMotion();
    const reducedRef = useRef(reduced);
    const [ink, setInk] = useState(inks[0].color);
    const [count, setCount] = useState(0);
    const showFloor = ready.blog || showSlots;
    const hasHint = copy.doodle.hint !== null || showSlots;

    useEffect(() => {
        reducedRef.current = reduced;
    }, [reduced]);

    useEffect(() => {
        const doodles = startDoodles(canvas.current, setCount, () => reducedRef.current, showFloor);
        actions.current = doodles;
        return () => doodles.destroy();
    }, [showFloor]);

    return (
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
            {!hasHint && (
                <p id="doodle-hint" className="border-b border-neutral-800 px-3 py-2.5 text-xs text-neutral-400">
                    Draw on the canvas with a mouse, finger, or pen.
                </p>
            )}
            <canvas
                ref={canvas}
                role="img"
                aria-label={`Doodle box, ${count} ${count === 1 ? "doodle" : "doodles"}`}
                aria-describedby="doodle-hint"
                className="block h-[240px] w-full cursor-crosshair touch-none bg-neutral-950 bg-[radial-gradient(circle,rgb(203_179_151/.19)_1px,transparent_1px)] bg-size-[18px_18px] md:h-[320px]"
                onPointerDown={(event) => {
                    if (event.button === 0) actions.current?.begin(event, ink);
                }}
                onPointerMove={(event) => actions.current?.move(event)}
                onPointerUp={(event) => actions.current?.end(event)}
                onPointerCancel={(event) => actions.current?.end(event)}
            />
            <div className="flex flex-wrap items-center justify-between gap-x-4 border-t border-neutral-800 px-2 text-xs sm:px-3">
                <div role="group" aria-label="Ink" className="flex">
                    {inks.map(({ name, color }) => (
                        <button
                            key={name}
                            type="button"
                            aria-label={name}
                            aria-pressed={ink === color}
                            className="grid min-h-11 min-w-11 place-items-center rounded hover:bg-neutral-900"
                            onClick={() => setInk(color)}
                        >
                            <span className={`h-3 w-3 rounded-full ${ink === color ? "ring-1 ring-neutral-300 ring-offset-4 ring-offset-neutral-950" : ""}`} style={{ background: color }} />
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap font-mono text-neutral-300">
                    <button type="button" className="min-h-11 px-2 hover:text-green-400" onClick={() => actions.current?.undo()}>Undo</button>
                    <button type="button" className="min-h-11 px-2 hover:text-green-400" onClick={() => {
                        if (window.confirm("Clear your doodles?")) actions.current?.clear();
                    }}>Clear</button>
                    <button type="button" className="min-h-11 px-2 hover:text-green-400" onClick={() => actions.current?.save()}>Save as PNG</button>
                </div>
            </div>
            {hasHint && (
                <p id="doodle-hint" className="border-t border-neutral-800 px-3 py-2.5 text-xs text-neutral-400">
                    <Copy k="doodle.hint" />
                </p>
            )}
        </div>
    );
}
