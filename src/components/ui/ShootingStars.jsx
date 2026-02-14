import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ShootingStar({ id, onComplete }) {
    const startX = Math.random() * 80 + 10;
    const startY = Math.random() * 40;
    const angle = Math.random() * 30 + 15;
    const length = Math.random() * 150 + 100;
    const duration = Math.random() * 0.8 + 0.6;

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
                setStars((prev) => [...prev, { id: Date.now() }]);
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
                    <ShootingStar key={star.id} id={star.id} onComplete={removeStar} />
                ))}
            </AnimatePresence>
        </div>
    );
}
