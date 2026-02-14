import { cn } from "../../lib/utils";

export default function BorderBeam({
    size = 150,
    duration = 8,
    borderWidth = 1,
    className = ""
}) {
    return (
        <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ padding: borderWidth }}
        >
            <div
                className={cn(
                    "absolute inset-0 rounded-[inherit]",
                    "bg-[length:300%_300%]",
                    "animate-[border-beam-spin_var(--duration)_linear_infinite]",
                    className
                )}
                style={{
                    "--duration": `${duration}s`,
                    background: `conic-gradient(from var(--border-beam-angle, 0deg), transparent 0%, transparent 25%, rgba(163,163,163,0.4) 50%, transparent 75%, transparent 100%)`,
                    mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: borderWidth
                }}
            />
        </div>
    );
}
