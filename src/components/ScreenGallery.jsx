import { useRef, useState } from "react";
import { IconArrowsMaximize, IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react";

export default function ScreenGallery({ name, screens, caption, width = 1440, height = 900 }) {
    const [selected, setSelected] = useState(0);
    const dialog = useRef(null);
    const screen = screens[selected];
    const move = (direction) => setSelected((index) => (index + direction + screens.length) % screens.length);

    return (
        <div>
            <figure>
                <button
                    type="button"
                    onClick={() => dialog.current.showModal()}
                    aria-label={`Expand ${name} screenshot: ${screen.title}`}
                    className="group relative block w-full overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950 text-left cursor-zoom-in"
                >
                    <img
                        src={screen.image}
                        width={width}
                        height={height}
                        loading="lazy"
                        alt={screen.alt}
                        className="w-full"
                    />
                    <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md border border-neutral-600 bg-neutral-950/90 px-2 py-1 text-[10px] text-neutral-200 font-mono">
                        <IconArrowsMaximize size={13} aria-hidden="true" /> Expand
                    </span>
                </button>
                <figcaption className="text-sm text-neutral-300 mt-3 leading-relaxed">{caption}</figcaption>
            </figure>
            <div role="group" aria-label={`${name} screenshots`} className="flex flex-wrap gap-2 mt-3">
                {screens.map((item, index) => (
                    <button
                        key={item.title}
                        type="button"
                        aria-pressed={selected === index}
                        onClick={() => setSelected(index)}
                        className={`text-xs min-h-11 font-mono rounded-md border px-3 py-2 transition-colors ${selected === index ? "border-neutral-500 bg-neutral-800 text-white" : "border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600"}`}
                    >
                        {item.title}
                    </button>
                ))}
            </div>
            <dialog
                ref={dialog}
                aria-label={`${name} screenshot viewer`}
                className="screen-gallery-dialog m-auto w-[min(96vw,1440px)] max-w-none max-h-[95vh] overflow-auto rounded-xl border border-neutral-700 bg-neutral-950 text-white p-3 sm:p-5"
                onClick={(event) => {
                    if (event.target === event.currentTarget) dialog.current.close();
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        event.preventDefault();
                        move(event.key === "ArrowLeft" ? -1 : 1);
                    }
                }}
            >
                <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="font-mono text-sm">
                        {name} / {screen.title}{" "}
                        <span className="text-neutral-400 ml-2">
                            {selected + 1} of {screens.length}
                        </span>
                    </p>
                    <button
                        type="button"
                        onClick={() => dialog.current.close()}
                        aria-label={`Close ${name} screenshot`}
                        className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800"
                    >
                        <IconX size={20} />
                    </button>
                </div>
                <img
                    src={screen.image}
                    width={width}
                    height={height}
                    alt={screen.alt}
                    className="w-full max-h-[75vh] object-contain rounded-md"
                />
                <div className="flex items-center justify-between gap-4 mt-3">
                    <button
                        type="button"
                        onClick={() => move(-1)}
                        aria-label={`Previous ${name} screenshot`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-800"
                    >
                        <IconArrowLeft size={16} /> Previous
                    </button>
                    <p className="hidden sm:block text-xs text-neutral-400">← → to browse · Esc to close</p>
                    <button
                        type="button"
                        onClick={() => move(1)}
                        aria-label={`Next ${name} screenshot`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-800"
                    >
                        Next <IconArrowRight size={16} />
                    </button>
                </div>
            </dialog>
        </div>
    );
}
