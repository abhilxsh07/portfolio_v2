import { useState, useCallback } from "react";
import TypewriterEffect from "./TypewriterEffect";

const lines = [
    { text: "LOADING_MODULES...", color: "text-red-500", dot: "bg-red-500" },
    { text: "INITIALIZING_PROTOCOLS...", color: "text-yellow-500", dot: "bg-yellow-500" },
    { text: "ALL_SYSTEMS_OPERATIONAL", color: "text-green-500", dot: "bg-green-500" }
];

export default function AnimatedStatusLines({ onAllComplete }) {
    const [activeLine, setActiveLine] = useState(0);
    const [completedLines, setCompletedLines] = useState([]);

    const handleLineComplete = useCallback((index) => {
        setCompletedLines((prev) => [...prev, index]);

        if (index < lines.length - 1) {
            setTimeout(() => {
                setActiveLine(index + 1);
            }, 500);
        } else {
            setTimeout(() => {
                onAllComplete?.();
            }, 300);
        }
    }, [onAllComplete]);

    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, i) => {
                const isCompleted = completedLines.includes(i);
                const isActive = i === activeLine;
                const isVisible = i <= activeLine;

                if (!isVisible) return null;

                return (
                    <div key={i} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${line.dot} shrink-0`} />
                        {isActive && !isCompleted ? (
                            <TypewriterEffect
                                text={line.text}
                                speed={35}
                                onComplete={() => handleLineComplete(i)}
                                className={`font-mono text-sm ${line.color}`}
                                cursorClassName={line.color}
                            />
                        ) : (
                            <span className={`font-mono text-sm ${line.color}`}>
                                {line.text}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
