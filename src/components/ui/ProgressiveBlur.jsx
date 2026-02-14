export default function ProgressiveBlur({ height = "80px", position = "bottom", className = "" }) {
    const isBottom = position === "bottom";

    return (
        <div
            className={`absolute left-0 right-0 ${isBottom ? "bottom-0" : "top-0"} ${className}`}
            style={{
                height,
                background: isBottom
                    ? "linear-gradient(to bottom, transparent, #0a0a0a)"
                    : "linear-gradient(to top, transparent, #0a0a0a)",
                pointerEvents: "none",
                zIndex: 10
            }}
        />
    );
}
