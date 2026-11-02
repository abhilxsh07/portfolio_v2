import { useEffect, useRef } from "react";

// Twinkles when `animated`, otherwise it's drawn once and left alone. The stars are kept
// in a ref so flipping between the two doesn't reshuffle the sky.
export default function StarsBackground({ starCount = 120, animated = true }) {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationId;

        function createStars() {
            starsRef.current = Array.from({ length: starCount }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2
            }));
        }

        function resize() {
            const changed = canvas.width !== window.innerWidth || canvas.height !== window.innerHeight;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (changed || starsRef.current.length !== starCount) createStars();
        }

        function paint(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            starsRef.current.forEach((star) => {
                const twinkle = animated ? Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7 : 0.85;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
                ctx.fill();
            });
        }

        function loop(time) {
            paint(time);
            animationId = requestAnimationFrame(loop);
        }

        resize();
        if (animated) animationId = requestAnimationFrame(loop);
        else paint(0);

        const onResize = () => {
            resize();
            if (!animated) paint(0);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", onResize);
        };
    }, [starCount, animated]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ width: "100vw", height: "100vh" }}
        />
    );
}
