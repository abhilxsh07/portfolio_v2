import { useState, useEffect } from "react";

export default function TypewriterEffect({
    text,
    speed = 40,
    onComplete,
    className = "",
    cursorClassName = "text-white"
}) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayed(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                setDone(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <span className={className}>
            {displayed}
            {!done && <span className={`animate-blink ${cursorClassName}`}>|</span>}
        </span>
    );
}
