import { useState, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

export default function Card3DGlare({ children, className = "", glareOpacity = 0.15 }) {
    const [transform, setTransform] = useState("");
    const [glareStyle, setGlareStyle] = useState({});
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const rotateY = ((x - 50) / 50) * 3;
        const rotateX = ((y - 50) / 50) * -2;

        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        setGlareStyle({
            background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 70%)`,
            opacity: 1
        });
    }, [glareOpacity]);

    const handleMouseLeave = useCallback(() => {
        setTransform("");
        setGlareStyle({ opacity: 0 });
        setIsHovered(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    return (
        <div
            ref={ref}
            className={cn("relative overflow-hidden", className)}
            style={{
                transform: isHovered ? transform : "perspective(800px) rotateX(0deg) rotateY(0deg)",
                transition: isHovered ? "transform 0.2s ease-out" : "transform 0.4s ease-out"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {children}
            <div
                className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
                style={glareStyle}
            />
        </div>
    );
}
