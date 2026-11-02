import { useEffect, useRef } from "react";

// A still field of stars, drawn once and redrawn on resize. It used to twinkle,
// but nothing moving behind the text reads better.
export default function StarsBackground({ starCount = 120 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        function draw() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < starCount; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${(Math.random() * 0.6 + 0.2) * 0.85})`;
                ctx.fill();
            }
        }

        // Phones fire resize while the address bar slides in and out; only redraw on width changes.
        let lastWidth = window.innerWidth;
        const onResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            draw();
        };

        draw();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [starCount]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ width: "100vw", height: "100vh" }}
        />
    );
}
