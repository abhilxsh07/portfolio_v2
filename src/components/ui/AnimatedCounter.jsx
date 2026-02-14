import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({ value, duration = 1000, className = "" }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimated.current) return;
        hasAnimated.current = true;

        const steps = 30;
        const stepDuration = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current++;
            const progress = current / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));

            if (current >= steps) {
                clearInterval(timer);
                setDisplay(value);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [inView, value, duration]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
}
