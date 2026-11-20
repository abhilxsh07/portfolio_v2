import { useEffect, useRef } from "react";
import { uses } from "../data/portfolio";

const items = uses.flatMap(({ items }) => items.filter(({ desk }) => desk));

export default function Desk({ onPoint, onFocus }) {
    const drawing = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch("/drawings/desk.svg", { signal: controller.signal })
            .then((response) => response.ok ? response.text() : null)
            .then((source) => {
                if (!source || controller.signal.aborted) return;
                const svg = new DOMParser().parseFromString(source, "image/svg+xml").documentElement;
                if (svg.localName !== "svg") return;
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
            }, () => {});
        return () => controller.abort();
    }, []);

    return (
        <div className="mb-12">
            <div
                ref={drawing}
                className="peer hidden md:block [&>svg]:h-auto [&>svg]:w-full [&_a]:cursor-pointer"
                onPointerOver={(event) => onPoint(event.target.closest("[data-desk]")?.dataset.desk)}
                onPointerOut={(event) => onPoint(event.relatedTarget?.closest?.("[data-desk]")?.dataset.desk)}
                onFocus={(event) => onFocus(event.target.closest("[data-desk]")?.dataset.desk)}
                onBlur={() => onFocus(null)}
            />
            <img src="/drawings/desk.svg" alt="Desk" className="w-full md:hidden md:peer-empty:block" />
        </div>
    );
}
