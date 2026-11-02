import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkPreviews from "./components/WorkPreviews";
import Now from "./components/Now";
import HomeLinks from "./components/HomeLinks";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import EarlierWork from "./components/EarlierWork";
import Experience from "./components/Experience";
import Building from "./components/Building";
import Uses from "./components/Uses";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import StarsBackground from "./components/ui/StarsBackground";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { MotionConfig } from "motion/react";
import { pages, useLocation, navigate, isPage, scrollToHash } from "./lib/router";

// Neither of these is needed until someone opens them. Once loaded they stay mounted,
// so the terminal keeps its history and Doom keeps its window between opens.
const Terminal = lazy(() => import("./components/Terminal"));
const DoomPopup = lazy(() => import("./components/DoomPopup"));

function Page({ path, onOpenTerminal }) {
    switch (path) {
        case "/":
            return (
                <>
                    <Hero onOpenTerminal={onOpenTerminal} />
                    <WorkPreviews />
                    <Now />
                    <HomeLinks />
                </>
            );
        case "/work":
            return (
                <div className="pt-10">
                    <Projects />
                    <Building />
                    <EarlierWork />
                </div>
            );
        case "/stack":
            return (
                <div className="pt-10">
                    <Skills />
                </div>
            );
        case "/experience":
            return (
                <div className="pt-10">
                    <Experience />
                </div>
            );
        case "/uses":
            return (
                <div className="pt-10">
                    <Uses />
                </div>
            );
        case "/contact":
            return (
                <div className="pt-10">
                    <Contact />
                </div>
            );
        default:
            return <NotFound />;
    }
}

export default function App() {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [doomOpen, setDoomOpen] = useState(false);
    const [terminalLoaded, setTerminalLoaded] = useState(false);
    const [doomLoaded, setDoomLoaded] = useState(false);
    if (terminalOpen && !terminalLoaded) setTerminalLoaded(true);
    if (doomOpen && !doomLoaded) setDoomLoaded(true);
    const { path, hash } = useLocation();
    const mainRef = useRef(null);
    const lastPath = useRef(path);

    const openTerminal = useCallback(() => setTerminalOpen(true), []);
    const closeTerminal = useCallback(() => setTerminalOpen(false), []);
    const openDoom = useCallback(() => setDoomOpen(true), []);
    const closeDoom = useCallback(() => setDoomOpen(false), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setTerminalOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // On a fresh load with a #hash, the first scroll happens before the web fonts swap in,
    // and the swap pushes the target down. Aim again once they're loaded, unless the
    // visitor has already scrolled somewhere else.
    useEffect(() => {
        const { hash: initialHash } = window.location;
        if (!initialHash || !document.fonts) return;
        let moved = false;
        const onWheel = () => (moved = true);
        window.addEventListener("wheel", onWheel, { passive: true, once: true });
        window.addEventListener("touchmove", onWheel, { passive: true, once: true });
        document.fonts.ready.then(() => {
            if (!moved && window.location.hash === initialHash) scrollToHash(initialHash, "instant");
        });
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchmove", onWheel);
        };
    }, []);

    // Keep page-to-page links inside the app instead of reloading everything.
    useEffect(() => {
        const handleClick = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target.closest?.("a[href]");
            if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
            const url = new URL(link.href);
            if (!isPage(url)) return;
            event.preventDefault();
            navigate(url.href);
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        document.title = pages[path] ?? "Not found · Abhilash Kar";
        document
            .querySelector('link[rel="canonical"]')
            ?.setAttribute("href", `https://abhilashkar.dev${path === "/" ? "/" : path}`);

        const changedPage = lastPath.current !== path;
        lastPath.current = path;
        if (hash) {
            scrollToHash(hash, changedPage ? "instant" : "auto");
        } else if (changedPage) {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
        // Move screen readers to the new page, not the link that was clicked.
        if (changedPage) mainRef.current?.focus({ preventScroll: true });
    }, [path, hash]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-neutral-950 text-white">
                <StarsBackground starCount={120} />
                <Navbar path={path} />

                <main id="main-content" ref={mainRef} tabIndex={-1} className="outline-none">
                    <Page path={path} onOpenTerminal={openTerminal} />
                </main>

                <Footer />

                <BackToTop />

                {terminalLoaded && (
                    <Suspense fallback={null}>
                        <Terminal isOpen={terminalOpen} onClose={closeTerminal} onOpenDoom={openDoom} isDoomOpen={doomOpen} />
                    </Suspense>
                )}

                {doomLoaded && (
                    <Suspense fallback={null}>
                        <DoomPopup isOpen={doomOpen} onClose={closeDoom} />
                    </Suspense>
                )}

                <Analytics />
                <SpeedInsights />
            </div>
        </MotionConfig>
    );
}
