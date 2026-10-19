import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function ShootingStar({ id, startX, startY, angle, length, duration, onComplete }) {
    const endX = startX + Math.cos((angle * Math.PI) / 180) * length * 0.3;
    const endY = startY + Math.sin((angle * Math.PI) / 180) * length * 0.3;

    return (
        <motion.div
            initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 1, scale: 1 }}
            animate={{ x: `${endX}vw`, y: `${endY}vh`, opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
            onAnimationComplete={() => onComplete(id)}
            className="fixed z-0 pointer-events-none"
        >
            <div
                className="h-[1px] bg-white/60"
                style={{
                    width: `${length}px`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "left center",
                    background: "linear-gradient(to right, rgba(255,255,255,0.6), transparent)"
                }}
            />
        </motion.div>
    );
}

export default function ShootingStars({ interval = 4000 }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.4) {
                const star = {
                    id: Date.now(),
                    startX: Math.random() * 80 + 10,
                    startY: Math.random() * 40,
                    angle: Math.random() * 30 + 15,
                    length: Math.random() * 150 + 100,
                    duration: Math.random() * 0.8 + 0.6,
                };
                setStars((prev) => [...prev, star]);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    const removeStar = (id) => {
        setStars((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {stars.map((star) => (
                    <ShootingStar key={star.id} {...star} onComplete={removeStar} />
                ))}
            </AnimatePresence>
        </div>
    );
}
