import { useEffect, useRef, useState } from "react";
import { uses } from "../data/portfolio";

const items = uses.flatMap(({ items }) => items.filter(({ desk }) => desk));

export default function Desk({ onPoint, onFocus, showPlaceholder }) {
    const drawing = useRef(null);
    const [hasDrawing, setHasDrawing] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetch("/drawings/desk.svg", { signal: controller.signal })
            .then((response) => response.ok ? response.text() : null)
            .then((source) => {
                if (!source || controller.signal.aborted) return;
                const svg = new DOMParser().parseFromString(source, "image/svg+xml").documentElement;
                if (svg.localName !== "svg" || (svg.dataset.placeholder === "true" && !showPlaceholder)) {
                    drawing.current.replaceChildren();
                    setHasDrawing(false);
                    return;
                }
                svg.setAttribute("role", "group");
                svg.setAttribute("aria-label", "Desk");
                for (const { desk, name } of items) {
                    const object = svg.querySelector(`#${desk}`);
                    if (!object) continue;
                    const link = svg.ownerDocument.createElementNS(svg.namespaceURI, "a");
                    link.setAttribute("href", `#uses-${desk}`);
                    link.setAttribute("aria-label", name);
                    link.setAttribute("data-desk", desk);
                    object.setAttribute("pointer-events", "all");
                    object.replaceWith(link);
                    link.append(object);
                }
                drawing.current.replaceChildren(svg);
                setHasDrawing(true);
            }, () => {});
        return () => controller.abort();
    }, [showPlaceholder]);

    return (
        <div className={hasDrawing ? "mb-9" : "hidden"}>
            <div
                ref={drawing}
                className="hidden md:block [&>svg]:h-auto [&>svg]:w-full [&_a]:cursor-pointer"
                onPointerOver={(event) => onPoint(event.target.closest("[data-desk]")?.dataset.desk)}
                onPointerOut={(event) => onPoint(event.relatedTarget?.closest?.("[data-desk]")?.dataset.desk)}
                onFocus={(event) => onFocus(event.target.closest("[data-desk]")?.dataset.desk)}
                onBlur={() => onFocus(null)}
            />
            {hasDrawing && <img src="/drawings/desk.svg" alt="Desk" className="w-full md:hidden" />}
        </div>
    );
}
