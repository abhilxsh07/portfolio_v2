import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconExternalLink } from "@tabler/icons-react";
import ArchitectureGraph from "./ArchitectureGraph";
import useReducedMotion from "../hooks/useReducedMotion";
import { presets, presetFilter, sableTour } from "../data/walkthroughs";
import "./ProjectWalkthrough.css";

function tourReducer(state, action) {
    switch (action.type) {
        case "flow": return { flow: action.id, index: 0, playing: false };
        case "navigate": return { flow: action.id, index: action.index, playing: false };
        case "jump": return { ...state, index: action.index, playing: false };
        case "move": return { ...state, index: Math.max(0, Math.min(action.last, state.index + action.direction)), playing: false };
        case "play": return { ...state, index: state.index === action.last ? 0 : state.index, playing: !state.playing };
        case "tick": return { ...state, index: Math.min(action.last, state.index + 1), playing: state.index + 1 < action.last };
        case "pause": return state.playing ? { ...state, playing: false } : state;
        default: return state;
    }
}

function Paper({ small = false }) {
    return (
        <div className={`tour-paper ${small ? "tour-paper-small" : ""}`}>
            <span className="tour-paper-kicker">FIELD NOTES / 01</span>
            <p className="tour-paper-title">A little more<br />contrast.</p>
            <p className="tour-paper-body">The filter only changes what you see. The file on disk stays exactly as it was.</p>
            <div className="tour-paper-chart" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <p className="tour-paper-body">The same page, before and after the filter.</p>
            <span className="tour-paper-number">01</span>
        </div>
    );
}

function SablePreview({ flow, stage, preset }) {
    const filtered = ["filtered", "find"].includes(stage.scene);
    const bypass = ["thumbnails", "print"].includes(flow.id);
    return (
        <figure className="tour-preview">
            <figcaption className="tour-eyebrow">Illustrated output · not the app</figcaption>
            <div className={`tour-reader ${stage.scene ? "" : "tour-reader-pending"}`}>
                {stage.scene ? (
                    <div className="tour-paper-stack">
                        <div style={{ filter: filtered ? presetFilter(preset.values) : "none" }}>
                            <Paper small={flow.id === "thumbnails"} />
                        </div>
                        {stage.scene === "find" && <span className="tour-find-highlight">contrast</span>}
                        {stage.scene === "thumbnails" && <span className="tour-mini-page" aria-hidden="true">02</span>}
                    </div>
                ) : (
                    <div className="tour-file-placeholder"><span aria-hidden="true">PDF</span><p>sample-notes.pdf</p><small>{stage.output}</small></div>
                )}
            </div>
            <div className="tour-preview-caption">
                <span className={`tour-status-dot ${filtered ? "is-filtered" : ""}`} aria-hidden="true" />
                {filtered ? `${preset.label} · page image filtered` : bypass ? "Original colours · filter bypassed" : "Original colours · before the filter"}
            </div>
            {flow.id === "preset" && <p className="tour-small-note">Same uploaded bitmap → six updated matrices → redraw.</p>}
            {flow.id === "find" && <p className="tour-small-note">The highlight is a separate overlay above the page filter.</p>}
            <p className="tour-small-note">Browser illustration of the filter order; sable draws with Direct2D.</p>
        </figure>
    );
}

const tours = { sable: sableTour };

export default function ProjectWalkthrough({ tourId }) {
    const tour = tours[tourId];
    const [state, dispatch] = useReducer(tourReducer, { flow: tour.flows[0].id, index: 0, playing: false });
    const [presetId, setPresetId] = useState("default");
    const reducedMotion = useReducedMotion();
    const container = useRef(null);
    const flow = tour.flows.find((item) => item.id === state.flow);
    const stage = flow.steps[state.index];
    const last = flow.steps.length - 1;
    const preset = presets.find((item) => item.id === presetId);
    const canPlay = !reducedMotion;
    const playing = state.playing && canPlay;

    useEffect(() => {
        if (!playing) return;
        const timer = window.setTimeout(() => dispatch({ type: "tick", last }), 5000);
        return () => window.clearTimeout(timer);
    }, [playing, state.index, last]);

    useEffect(() => {
        const element = container.current;
        const details = element.closest("details");
        const pause = () => dispatch({ type: "pause" });
        const onVisibility = () => { if (document.hidden) pause(); };
        const onToggle = () => { if (!details.open) pause(); };
        const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
        observer.observe(element);
        details?.addEventListener("toggle", onToggle);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            observer.disconnect();
            details?.removeEventListener("toggle", onToggle);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    const move = (direction) => dispatch({ type: "move", direction, last });
    const togglePlayback = () => dispatch({ type: "play", last });

    return (
        <section ref={container} className="project-tour" data-tour={tour.id} aria-label={`${tour.id} interactive walkthrough`}>
            <div className="tour-heading"><p className="tour-eyebrow">Interactive architecture</p><h3>{tour.title}</h3><p>{tour.intro}</p></div>
            <div className="tour-flow-switch" role="group" aria-label={`${tour.id} walkthrough flows`}>
                {tour.flows.map((item) => <button type="button" key={item.id} aria-pressed={flow.id === item.id} onClick={() => dispatch({ type: "flow", id: item.id })}>{item.label}</button>)}
            </div>
            <div className="tour-canvas" tabIndex={0} role="group" aria-label={`${tour.id} stages. Use left and right arrows to step${canPlay ? ", Space to play or pause" : ""}.`} aria-keyshortcuts={canPlay ? "ArrowLeft ArrowRight Home End Space" : "ArrowLeft ArrowRight Home End"}
                onKeyDown={(event) => {
                    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
                    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
                    if (event.key === "Home" || event.key === "End") { event.preventDefault(); dispatch({ type: "jump", index: event.key === "Home" ? 0 : last }); }
                    if (event.key === " " && canPlay) { event.preventDefault(); togglePlayback(); }
                }}>
                <ArchitectureGraph
                    tour={tour} flow={flow} index={state.index} stage={stage}
                    playing={playing} canPlay={canPlay} reducedMotion={reducedMotion}
                    onMove={move} onPlay={togglePlayback}
                    onStep={(index) => dispatch({ type: "jump", index })}
                    onNavigate={(id, index) => dispatch({ type: "navigate", id, index })}
                />
                <div className="tour-stage-layout">
                    <div className="tour-detail" aria-live={playing ? "off" : "polite"} aria-atomic="true">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div key={`${flow.id}-${stage.id}`} initial={reducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.14 }}>
                                <p className="tour-eyebrow">{stage.owner}</p><h4>{stage.title}</h4>
                                {stage.badge && <span className="tour-stage-badge">{stage.badge}</span>}
                                <p className="tour-description">{stage.description}</p>
                                <dl className="tour-io"><div><dt>IN</dt><dd>{stage.input}</dd></div><div><dt>OUT</dt><dd>{stage.output}</dd></div></dl>
                                {stage.failure && <details className="tour-failure"><summary>When something fails</summary><p>{stage.failure}</p></details>}
                                <div className="tour-source"><span className="tour-eyebrow">{stage.href ? "Source file" : "Module · private repo"}</span>{stage.href ? <a href={stage.href} target="_blank" rel="noreferrer">{stage.file}<IconExternalLink size={14} aria-hidden="true" /></a> : <code>{stage.file}</code>}</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div>
                        <div className="tour-presets" role="group" aria-label="Illustration preset">{presets.map((item) => <button type="button" key={item.id} aria-pressed={presetId === item.id} onClick={() => setPresetId(item.id)}>{item.label}</button>)}</div>
                        <SablePreview flow={flow} stage={stage} preset={preset} />
                    </div>
                </div>
            </div>
            <p className="tour-takeaway">{flow.takeaway}</p>
            <p className="tour-small-note tour-provenance">{tour.sourceNote}</p>
        </section>
    );
}
