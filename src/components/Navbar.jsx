import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { navigation as routes } from "../data/portfolio";
import useReducedMotion from "../hooks/useReducedMotion";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const sections = routes.map((route) => document.getElementById(route.href.slice(1))).filter(Boolean);
        let frame = null;
        const update = () => {
            frame = null;
            const current = sections.filter((section) => section.getBoundingClientRect().top <= 160).at(-1);
            setActiveSection(current?.id || "");
        };
        const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
        schedule();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <a
                    href="#"
                    onClick={scrollToTop}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <img src="/favicon.svg" alt="AK" className="w-6 h-6 rounded" />
                    <span className="font-mono text-sm text-neutral-300">abhilashkar.dev</span>
                </a>

                <div className="flex items-center gap-5 lg:gap-8">
                    {routes.map((route) => (
                        <a
                            key={route.label}
                            href={route.href}
                            aria-current={activeSection === route.href.slice(1) ? "location" : undefined}
                            className={`font-mono text-sm transition-colors hidden md:inline ${
                                activeSection === route.href.slice(1)
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            {route.label}
                        </a>
                    ))}
                </div>

                {/* Hamburger button — mobile only */}
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="md:hidden text-neutral-400 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                >
                    {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        id="mobile-navigation"
                        className="md:hidden bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/60 overflow-hidden"
                    >
                        <div className="flex flex-col px-6 py-4 gap-4">
                            {routes.map((route) => (
                                <a
                                    key={route.label}
                                    href={route.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`font-mono text-sm transition-colors ${
                                        activeSection === route.href.slice(1)
                                            ? "text-white"
                                            : "text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {route.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
