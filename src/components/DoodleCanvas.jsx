import { useEffect, useRef, useState } from "react";
import Copy from "./Copy";
import useReducedMotion from "../hooks/useReducedMotion";
import { startDoodles } from "../lib/doodles";

const inks = [
    { name: "Green", color: "#4ade80" },
    { name: "Red pen", color: "#f87171" },
    { name: "Pencil", color: "#a3a3a3" }
];

export default function DoodleCanvas() {
    const canvas = useRef(null);
    const actions = useRef(null);
    const reduced = useReducedMotion();
    const reducedRef = useRef(reduced);
    const [ink, setInk] = useState(inks[0].color);
    const [count, setCount] = useState(0);

    useEffect(() => {
        reducedRef.current = reduced;
    }, [reduced]);

    useEffect(() => {
        const doodles = startDoodles(canvas.current, setCount, () => reducedRef.current);
        actions.current = doodles;
        return () => doodles.destroy();
    }, []);

    return (
        <>
            <canvas
                ref={canvas}
                role="img"
                aria-label={`Doodle box, ${count} ${count === 1 ? "doodle" : "doodles"}`}
                className="block h-[240px] w-full touch-none rounded-lg bg-neutral-900/60 ring-1 ring-neutral-800 md:h-[320px]"
                onPointerDown={(event) => {
                    if (event.button === 0) actions.current?.begin(event, ink);
                }}
                onPointerMove={(event) => actions.current?.move(event)}
                onPointerUp={(event) => actions.current?.end(event)}
                onPointerCancel={(event) => actions.current?.end(event)}
            />
            <p className="mt-3 font-mono text-xs text-neutral-400"><Copy k="doodle.hint" /></p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div role="group" aria-label="Ink" className="flex">
                    {inks.map(({ name, color }) => (
                        <button
                            key={name}
                            type="button"
                            aria-label={name}
                            aria-pressed={ink === color}
                            className={`grid min-h-11 min-w-11 place-items-center rounded ${ink === color ? "bg-neutral-800" : "hover:bg-neutral-900"}`}
                            onClick={() => setInk(color)}
                        >
                            <span className="h-3 w-3 rounded-full" style={{ background: color }} />
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
        </>
    );
}
