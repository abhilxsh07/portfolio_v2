import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconDeviceGamepad2, IconMinus, IconSquare, IconX, IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

const MIN_W = 320;
const MIN_H = 240;
const HEADER_H = 40;
const DEFAULT_W = 640;
const DEFAULT_H = 480;

const DOOM_URL = "https://thedoggybrad.github.io/doom_on_js-dos/";

// Resize handle definitions: position class + cursor + which edges move
const HANDLES = [
    { id: "n",  cls: "top-0 left-2 right-2 h-1.5 cursor-n-resize",         dx: 0, dy: 1, dw: 0, dh: 1 },
    { id: "s",  cls: "bottom-0 left-2 right-2 h-1.5 cursor-s-resize",      dx: 0, dy: 0, dw: 0, dh: -1 },
    { id: "w",  cls: "top-2 bottom-2 left-0 w-1.5 cursor-w-resize",        dx: 1, dy: 0, dw: 1, dh: 0 },
    { id: "e",  cls: "top-2 bottom-2 right-0 w-1.5 cursor-e-resize",       dx: 0, dy: 0, dw: -1, dh: 0 },
    { id: "nw", cls: "top-0 left-0 w-3 h-3 cursor-nw-resize",              dx: 1, dy: 1, dw: 1, dh: 1 },
    { id: "ne", cls: "top-0 right-0 w-3 h-3 cursor-ne-resize",             dx: 0, dy: 1, dw: -1, dh: 1 },
    { id: "sw", cls: "bottom-0 left-0 w-3 h-3 cursor-sw-resize",           dx: 1, dy: 0, dw: 1, dh: -1 },
    { id: "se", cls: "bottom-0 right-0 w-3 h-3 cursor-se-resize",          dx: 0, dy: 0, dw: -1, dh: -1 },
];

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export default function DoomPopup({ isOpen, onClose }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Stored pre-maximize geometry
    const preMax = useRef({ x: 0, y: 0, w: DEFAULT_W, h: DEFAULT_H });
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
    const resizeStart = useRef(null);
    const iframeRef = useRef(null);

    // Center on open
    useEffect(() => {
        if (isOpen) {
            const cx = Math.round((window.innerWidth - DEFAULT_W) / 2);
            const cy = Math.round((window.innerHeight - DEFAULT_H) / 2);
            setPos({ x: Math.max(0, cx), y: Math.max(0, cy) });
            setSize({ w: DEFAULT_W, h: DEFAULT_H });
            setIsMinimized(false);
            setIsMaximized(false);
            setLoadError(false);
            setIframeLoaded(false);
        }
    }, [isOpen]);

    // Note: Escape key does NOT close the DOOM popup.
    // The iframe has its own event context, so Escape inside the game
    // stays in-game. Escape outside the iframe may close the terminal
    // (which is expected terminal behavior) but not this popup.

    // ----- DRAG -----
    const onDragStart = useCallback((e) => {
        if (isMaximized) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };

        const onMove = (ev) => {
            const dx = ev.clientX - dragStart.current.mx;
            const dy = ev.clientY - dragStart.current.my;
            const newX = clamp(dragStart.current.px + dx, 0, window.innerWidth - size.w);
            const newY = clamp(dragStart.current.py + dy, 0, window.innerHeight - HEADER_H);
            setPos({ x: newX, y: newY });
        };
        const onUp = () => {
            setIsDragging(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, [pos, size.w, isMaximized]);

    // ----- RESIZE -----
    const onResizeStart = useCallback((e, handle) => {
        if (isMaximized || isMinimized) return;
        e.preventDefault();
        e.stopPropagation();
        resizeStart.current = { mx: e.clientX, my: e.clientY, ...pos, ...size, handle };

        const onMove = (ev) => {
            const s = resizeStart.current;
            const dxMouse = ev.clientX - s.mx;
            const dyMouse = ev.clientY - s.my;

            let newX = s.x, newY = s.y, newW = s.w, newH = s.h;

            // Horizontal
            if (handle.id.includes("e")) {
                newW = clamp(s.w + dxMouse, MIN_W, window.innerWidth - s.x);
            }
            if (handle.id.includes("w")) {
                const delta = clamp(s.w - dxMouse, MIN_W, window.innerWidth) - s.w;
                newW = s.w - delta;
                newX = s.x + delta;
                // re-clamp
                newW = clamp(s.w + dxMouse * -1 + (s.w + dxMouse * -1 < MIN_W ? MIN_W - (s.w + dxMouse * -1) : 0), MIN_W, window.innerWidth);
                // Simpler approach for west edge:
                const proposedW = s.w - dxMouse;
                if (proposedW >= MIN_W) {
                    newW = proposedW;
                    newX = s.x + dxMouse;
                } else {
                    newW = MIN_W;
                    newX = s.x + (s.w - MIN_W);
                }
            }

            // Vertical
            if (handle.id.includes("s")) {
                newH = clamp(s.h + dyMouse, MIN_H, window.innerHeight - s.y);
            }
            if (handle.id.includes("n")) {
                const proposedH = s.h - dyMouse;
                if (proposedH >= MIN_H) {
                    newH = proposedH;
                    newY = s.y + dyMouse;
                } else {
                    newH = MIN_H;
                    newY = s.y + (s.h - MIN_H);
                }
            }

            newX = Math.max(0, newX);
            newY = Math.max(0, newY);

            setPos({ x: newX, y: newY });
            setSize({ w: newW, h: newH });
        };

        const onUp = () => {
            resizeStart.current = null;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, [pos, size, isMaximized, isMinimized]);

    // ----- WINDOW CONTROLS -----
    const toggleMinimize = useCallback(() => {
        setIsMinimized((prev) => !prev);
    }, []);

    const toggleMaximize = useCallback(() => {
        if (isMaximized) {
            setPos({ x: preMax.current.x, y: preMax.current.y });
            setSize({ w: preMax.current.w, h: preMax.current.h });
            setIsMaximized(false);
        } else {
            preMax.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
            setPos({ x: 0, y: 0 });
            setSize({ w: window.innerWidth, h: window.innerHeight });
            setIsMaximized(true);
            setIsMinimized(false);
        }
    }, [isMaximized, pos, size]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleRetry = useCallback(() => {
        setLoadError(false);
        setIframeLoaded(false);
    }, []);

    // Pointer overlay to prevent iframe from stealing mouse during drag/resize
    const showOverlay = isDragging || resizeStart.current !== null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed z-[60] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-black/60 flex flex-col"
                    role="dialog"
                    aria-label="DOOM game window"
                    style={{
                        left: isMaximized ? 0 : pos.x,
                        top: isMaximized ? 0 : pos.y,
                        width: isMaximized ? "100vw" : size.w,
                        height: isMinimized ? "auto" : (isMaximized ? "100vh" : size.h),
                    }}
                >
                    {/* Resize handles */}
                    {!isMaximized && !isMinimized && HANDLES.map((h) => (
                        <div
                            key={h.id}
                            className={`absolute z-30 ${h.cls}`}
                            onMouseDown={(e) => onResizeStart(e, h)}
                        />
                    ))}

                    {/* Header / Title Bar */}
                    <div
                        className={`flex items-center justify-between px-3 py-2 bg-neutral-800 border-b border-neutral-700 shrink-0 select-none ${
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        }`}
                        onMouseDown={onDragStart}
                    >
                        <div className="flex items-center gap-2">
                            <IconDeviceGamepad2 className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-white font-mono">DOOM</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Minimize */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                                className="w-6 h-6 rounded flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <IconMinus className="w-3.5 h-3.5" />
                            </button>
                            {/* Maximize */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                                className="w-6 h-6 rounded flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <IconSquare className="w-3 h-3" />
                            </button>
                            {/* Close */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                                className="w-6 h-6 rounded flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <IconX className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    {!isMinimized && (
                        <div className="flex-1 bg-black relative min-h-0">
                            {/* Pointer-event overlay during drag/resize */}
                            {showOverlay && (
                                <div className="absolute inset-0 z-20" />
                            )}

                            {loadError ? (
                                /* Error state */
                                <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                                    <IconAlertTriangle className="w-10 h-10 text-neutral-500" />
                                    <p className="text-sm text-neutral-300 font-mono text-center">
                                        Failed to load DOOM
                                    </p>
                                    <p className="text-xs text-neutral-500 font-mono text-center">
                                        Check your connection and try again.
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors text-sm font-medium font-mono cursor-pointer"
                                    >
                                        <IconRefresh className="w-4 h-4" />
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                /* DOOM iframe */
                                <>
                                    {!iframeLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <span className="text-sm text-neutral-500 font-mono">Loading DOOM...</span>
                                        </div>
                                    )}
                                    <iframe
                                        ref={iframeRef}
                                        key={loadError ? "retry" : "doom"}
                                        src={DOOM_URL}
                                        title="DOOM"
                                        className="w-full h-full border-0"
                                        style={{ display: iframeLoaded ? "block" : "block", opacity: iframeLoaded ? 1 : 0 }}
                                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                        allow="autoplay; fullscreen; gamepad"
                                        onLoad={() => setIframeLoaded(true)}
                                        onError={() => setLoadError(true)}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
