import { lazy, Suspense, useEffect, useRef, useState } from "react";

// The full map is most of the page's JavaScript, so it only loads once someone asks for it.
const ProjectWalkthrough = lazy(() => import("./ProjectWalkthrough"));

export default function ArchitectureExplorer({ tourId, name }) {
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const openButton = useRef(null);
    const backButton = useRef(null);
    const toggled = useRef(false);

    // Move focus with the swap, otherwise it falls back to <body>.
    useEffect(() => {
        if (!toggled.current) return;
        (open ? backButton : openButton).current?.focus();
    }, [open]);

    // Closing the case study unmounts the map instead of leaving it running out of sight.
    useEffect(() => {
        if (!open) return;
        const details = root.current?.closest("details");
        if (!details) return;
        const onToggle = () => {
            if (!details.open) setOpen(false);
        };
        details.addEventListener("toggle", onToggle);
        return () => details.removeEventListener("toggle", onToggle);
    }, [open]);

    const show = (value) => {
        toggled.current = true;
        setOpen(value);
    };

    return (
        <div ref={root}>
            {open ? (
                <>
                    <div className="flex justify-end mb-3">
                        <button
                            ref={backButton}
                            type="button"
                            onClick={() => show(false)}
                            className="min-h-11 max-w-full px-4 py-2 rounded-lg border border-neutral-700 text-sm font-mono text-neutral-300 hover:text-white hover:border-neutral-500 [overflow-wrap:anywhere]"
                        >
                            Back to the short version
                        </button>
                    </div>
                    <Suspense
                        fallback={
                            <p className="min-h-[520px] grid place-items-center rounded-xl border border-neutral-800 text-sm font-mono text-neutral-400">
                                Loading the map…
                            </p>
                        }
                    >
                        <ProjectWalkthrough tourId={tourId} />
                    </Suspense>
                </>
            ) : (
                <div className="rounded-xl border border-dashed border-neutral-700 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[15px] md:text-sm text-neutral-400 leading-relaxed max-w-xl">
                        The full map traces every path through {name} stage by stage, with the module behind each
                        one and what happens when something fails.
                    </p>
                    <button
                        ref={openButton}
                        type="button"
                        onClick={() => show(true)}
                        className="min-h-11 max-w-full px-4 py-2 rounded-lg border border-neutral-600 bg-neutral-900 text-sm font-mono text-neutral-200 hover:text-white hover:border-neutral-400 [overflow-wrap:anywhere]"
                    >
                        Explore the full architecture
                    </button>
                </div>
            )}
        </div>
    );
}
