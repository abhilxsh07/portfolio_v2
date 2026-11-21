import { lazy, Suspense, useState } from "react";
import PageShell from "./PageShell";
import { brainRegions } from "../data/brain";
import { copy } from "../data/copy";
import { BRAIN_PATH } from "../data/pages";
import content from "../generated/index.json";
import { navigate } from "../lib/router";

const loadMap = () => import("./BrainMap");
const BrainMap = lazy(loadMap);
const viewKey = "brain-view:v1";

function readView() {
    try {
        return localStorage.getItem(viewKey) === "map" ? "map" : "list";
    } catch {
        return "list";
    }
}

const notes = [...content.notes].sort((a, b) => (b.inked ?? b.pencilled).localeCompare(a.inked ?? a.pencilled));

function BrainList() {
    return (
        <div className="space-y-10">
            {brainRegions.map(({ id, label }) => {
                const group = notes.filter(({ region }) => region === id);
                if (!group.length) return null;
                return (
                    <section key={id}>
                        <h2 className="mb-2 border-b border-pencil/25 pb-2 font-serif text-xl italic text-paper">{label}</h2>
                        <ul className="divide-y divide-neutral-800/60">
                            {group.map(({ slug, title, hint, state, draft }) => (
                                <li key={slug}>
                                    <a href={`${BRAIN_PATH}/${slug}`} className="group flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-3">
                                        <span className={`h-2 w-2 shrink-0 rounded-full border ${state === "ink" ? "border-neutral-300 bg-neutral-300" : "border-neutral-400"} ${draft ? "opacity-50" : ""}`} aria-hidden="true" />
                                        <span className="sr-only">{state === "ink" ? "Ink" : "Pencil"}</span>
                                        <span className="font-mono text-sm text-neutral-200 group-hover:text-green-400">{title}</span>
                                        {hint && <span className="text-sm text-neutral-400">{hint}</span>}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}

export default function Brain({ title, search, showSlots }) {
    const [preferred, setPreferred] = useState(readView);
    const requested = new URLSearchParams(search).get("view");
    const view = requested === "map" || requested === "list" ? requested : preferred;

    function choose(next) {
        setPreferred(next);
        try {
            localStorage.setItem(viewKey, next);
        } catch {
            // The tab still changes for this visit.
        }
        if (requested && requested !== next) {
            const params = new URLSearchParams(search);
            params.set("view", next);
            navigate(`${BRAIN_PATH}?${params}`);
        }
    }

    return (
        <PageShell title={title} intro={copy.brain.intro !== null || showSlots ? "brain.intro" : null}>
            {content.map ? (
                <>
                    <div role="tablist" aria-label="Note views" className="-ml-3 mb-4 flex gap-3 px-3" onPointerEnter={loadMap} onFocus={loadMap}>
                        {["list", "map"].map((tab) => (
                            <button
                                key={tab}
                                id={`notes-${tab}-tab`}
                                type="button"
                                role="tab"
                                aria-selected={view === tab}
                                aria-controls={`notes-${tab}-panel`}
                                tabIndex={view === tab ? 0 : -1}
                                className={`min-h-11 px-2 font-mono text-sm ${view === tab ? "border-b border-green-400 text-green-400" : "text-neutral-400 hover:text-white"}`}
                                onClick={() => choose(tab)}
                                onKeyDown={(event) => {
                                    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                                    event.preventDefault();
                                    const next = event.key === "Home" ? "list" : event.key === "End" ? "map" : tab === "list" ? "map" : "list";
                                    choose(next);
                                    document.getElementById(`notes-${next}-tab`).focus();
                                }}
                            >
                                {tab === "list" ? "List" : "Map"}
                            </button>
                        ))}
                    </div>
                    <div role="tabpanel" id="notes-list-panel" aria-labelledby="notes-list-tab" hidden={view !== "list"}>
                        {view === "list" && <BrainList />}
                    </div>
                    <div role="tabpanel" id="notes-map-panel" aria-labelledby="notes-map-tab" hidden={view !== "map"}>
                        {view === "map" && (
                            <Suspense fallback={null}>
                                <BrainMap map={content.map} showSlots={showSlots} />
                            </Suspense>
                        )}
                    </div>
                </>
            ) : <BrainList />}
        </PageShell>
    );
}
