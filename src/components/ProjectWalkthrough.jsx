import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react";
import ArchitectureGraph from "./ArchitectureGraph";
import useReducedMotion from "../hooks/useReducedMotion";
import { presets, presetFilter } from "../data/walkthroughs";
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
            <p className="tour-paper-body">Good tools get out of the way. Keep the words clear, the page quiet, and the original file intact.</p>
            <div className="tour-paper-chart" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <p className="tour-paper-body">The same page. A different way to read.</p>
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

const sampleChunks = [
    ["[0]", "An index helps a database locate rows without scanning the whole table."],
    ["[1]", "Indexes use storage and add work when rows are inserted or updated."],
    ["[2]", "Choose indexes around the queries the application actually runs."]
];

function CursusPreview({ flow, stage }) {
    const [answer, setAnswer] = useState(null);
    const scene = stage.scene;
    return (
        <figure className="tour-preview tour-cursus-preview">
            <figcaption className="tour-eyebrow">Fictional study example · local simulation</figcaption>
            <div className="tour-study-sample">
                <div className="tour-sample-header"><span className="tour-file-type">TXT</span><span>Database field notes<small>Sample content written for this tour</small></span></div>
                {flow.id === "calendar" ? (
                    <div className="tour-calendar-sample">
                        <p className="tour-sample-label">Separate workspace item</p>
                        <p className="tour-sample-title">Review database indexes</p>
                        <div className="tour-date-card"><span>NOV</span><strong>12</strong><span>All day</span></div>
                        <p className="tour-small-note">{scene === "calendar" ? "One-way sync → Google Calendar event" : "Dated item → queued job → event"}</p>
                    </div>
                ) : scene === "quiz" ? (
                    <div className="tour-quiz-sample">
                        <p className="tour-sample-label">Try a sample question</p>
                        <p className="tour-sample-title">What is a trade-off of adding an index?</p>
                        {["It removes all storage costs.", "It adds work on writes.", "It replaces every table scan.", "It guarantees faster queries."].map((option, index) => (
                            <button type="button" key={option} disabled={answer !== null} aria-pressed={answer === index} onClick={() => setAnswer(index)} className={`tour-quiz-option ${answer !== null && index === 1 ? "is-correct" : ""} ${answer === index && index !== 1 ? "is-wrong" : ""}`}>
                                <span>{String.fromCharCode(65 + index)}</span>{option}
                            </button>
                        ))}
                        {answer !== null && <p className="tour-answer-feedback" role="status">{answer === 1 ? "Correct. " : "The answer is B. "}Indexes use storage and need maintenance when rows change. [1] <button type="button" onClick={() => setAnswer(null)}>Restart sample</button></p>}
                    </div>
                ) : scene === "answer" ? (
                    <div className="tour-answer-sample">
                        <p className="tour-sample-label">Question</p><p className="tour-sample-title">Why not index every column?</p>
                        <p>Indexes help locate rows, but each one costs storage and adds work on writes. [0] [1]</p>
                        <div className="tour-citation-note">[0] and [1] refer to chunks, not PDF pages. This example is not generated live.</div>
                    </div>
                ) : scene === "summary" ? (
                    <div className="tour-summary-sample"><p className="tour-sample-label">Revision summary</p><p className="tour-sample-title">Indexes: speed with a cost</p><ul><li>Locate rows without a full scan. [0]</li><li>Account for storage and write overhead. [1]</li><li>Choose around real query patterns. [2]</li></ul><p className="tour-small-note">Illustrative output · kept in browser state</p></div>
                ) : ["chunks", "ready", "retrieve", "generate", "validate"].includes(scene) ? (
                    <div className="tour-chunks">
                        <p className="tour-sample-label">{scene === "retrieve" ? "Illustrative retrieved excerpts" : "Illustrative document chunks"}</p>
                        {sampleChunks.map(([label, text]) => <div key={label} className="tour-chunk"><span>{label}</span><p>{text}</p></div>)}
                        <p className="tour-small-note">{scene === "ready" ? "Conversion ready + index ready → study tools enabled" : scene === "retrieve" ? "At most six chunks from one owned material" : "Chunk indices travel with the reference text"}</p>
                    </div>
                ) : (
                    <div className="tour-notes-sample"><p className="tour-sample-label">{scene === "question" ? "Question saved before generation" : scene === "stored" ? "Stored privately, waiting for conversion" : "Original study material"}</p><p className="tour-sample-title">Database indexes</p><p>{sampleChunks[0][1]}</p><p>{sampleChunks[1][1]}</p><p>{sampleChunks[2][1]}</p></div>
                )}
            </div>
            <div className="tour-preview-caption"><span className="tour-status-dot" aria-hidden="true" />{stage.output}</div>
        </figure>
    );
}

export function CursusOverview() {
    return (
        <figure className="cursus-overview">
            <figcaption className="tour-eyebrow">Cursus / engineering map</figcaption>
            <div className="cursus-overview-document"><span className="tour-file-type">PDF</span><div>Your course material<small>Private upload · owned by one user</small></div></div>
            <div className="cursus-overview-route" aria-hidden="true"><span /><IconArrowRight size={18} /><span /></div>
            <div className="cursus-overview-engine"><span className="tour-eyebrow">Convert → chunk → embed</span><p>Notes become searchable.</p><div className="cursus-vector-bars" aria-hidden="true">{[36, 68, 48, 86, 58, 74, 40, 92, 52, 66, 44, 80].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
            <div className="cursus-overview-outputs"><span>Grounded chat</span><span>Summaries</span><span>Quizzes</span></div>
            <p className="tour-small-note">Explore the paths in “Inside Cursus” below.</p>
        </figure>
    );
}

export default function ProjectWalkthrough({ tour }) {
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
            <div className="tour-heading"><p className="tour-eyebrow">Interactive architecture / {tour.id === "sable" ? "01" : "02"}</p><h3>{tour.title}</h3><p>{tour.intro}</p></div>
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
                        {tour.id === "sable" && <div className="tour-presets" role="group" aria-label="Illustration preset">{presets.map((item) => <button type="button" key={item.id} aria-pressed={presetId === item.id} onClick={() => setPresetId(item.id)}>{item.label}</button>)}</div>}
                        {tour.id === "sable" ? <SablePreview flow={flow} stage={stage} preset={preset} /> : <CursusPreview key={`${flow.id}-${stage.id}`} flow={flow} stage={stage} />}
                    </div>
                </div>
            </div>
            <p className="tour-takeaway">{flow.takeaway}</p>
            <p className="tour-small-note tour-provenance">{tour.sourceNote}</p>
        </section>
    );
}
