import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { navigation } from "../data/pages";

const routes = navigation(import.meta.env.DEV);

export default function Navbar({ path }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const desktop = window.matchMedia("(min-width: 768px)");
        const closeOutside = (event) => {
            if (!navRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            setMenuOpen(false);
            menuButtonRef.current?.focus();
        };
        const closeOnDesktop = (event) => {
            if (event.matches) setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("focusin", closeOutside);
        document.addEventListener("keydown", closeOnEscape);
        desktop.addEventListener("change", closeOnDesktop);
        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("focusin", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
            desktop.removeEventListener("change", closeOnDesktop);
        };
    }, [menuOpen]);

    const links = routes.map(({ label, href, path: routePath }) => {
        const current = path === routePath || path === href ? "page" : path.startsWith(routePath + "/") ? "location" : undefined;
        return {
            label,
            href,
            current,
            className: `inline-flex min-h-11 items-center font-mono text-sm transition-colors ${current ? "text-paper underline decoration-pencil/60 underline-offset-8" : "text-neutral-400 hover:text-paper"}`
        };
    });

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60"
            aria-label="Main navigation"
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
                <a
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    aria-current={path === "/" ? "page" : undefined}
                    className="flex min-h-11 items-center gap-2 transition-opacity hover:opacity-80"
                >
                    <img src="/favicon.svg" alt="" className="w-6 h-6 rounded" />
                    <span className="font-mono text-sm text-paper">abhilashkar.dev</span>
                </a>

                <div className="hidden md:flex items-center gap-5 lg:gap-8">
                    {links.map((route) => (
                        <a
                            key={route.href}
                            href={route.href}
                            aria-current={route.current}
                            className={route.className}
                        >
                            {route.label}
                        </a>
                    ))}
                </div>
                <button
                    ref={menuButtonRef}
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="md:hidden min-w-11 min-h-11 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                >
                    {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
                </button>
            </div>
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
                            {links.map((route) => (
                                <a
                                    key={route.href}
                                    href={route.href}
                                    aria-current={route.current}
                                    onClick={() => setMenuOpen(false)}
                                    className={route.className}
                                >
                                    {route.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
