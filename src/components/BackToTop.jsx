import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowUp } from "@tabler/icons-react";
import useReducedMotion from "../hooks/useReducedMotion";

// Where the button sits (bottom-4/right-4, md:bottom-6/right-6, 44px square).
function buttonRect() {
    const inset = window.innerWidth >= 768 ? 24 : 16;
    return { right: window.innerWidth - inset, bottom: window.innerHeight - inset, left: window.innerWidth - inset - 44, top: window.innerHeight - inset - 44 };
}

export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    const reducedMotion = useReducedMotion();
    const buttonRef = useRef(null);

    useEffect(() => {
        // Hide while the focused thing is underneath it, otherwise tabbing to a
        // right-aligned link on a phone puts the focus ring behind the button.
        const coversFocus = () => {
            const el = document.activeElement;
            if (!el || el === document.body || el === buttonRef.current) return false;
            const r = el.getBoundingClientRect();
            const b = buttonRect();
            return r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
        };
        const update = () => setVisible(window.scrollY > 500 && !coversFocus());
        window.addEventListener("scroll", update, { passive: true });
        document.addEventListener("focusin", update);
        return () => {
            window.removeEventListener("scroll", update);
            document.removeEventListener("focusin", update);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
        // The button disappears at the top, so give keyboard users somewhere sensible to land.
        document.getElementById("main-content")?.focus({ preventScroll: true });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    ref={buttonRef}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-11 h-11 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer shadow-lg shadow-black/40"
                    aria-label="Scroll to top"
                >
                    <IconArrowUp className="w-4 h-4" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
