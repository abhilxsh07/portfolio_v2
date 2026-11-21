import { useState, useCallback, useEffect, useLayoutEffect, useRef, lazy, Suspense } from "react";
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
import { useLocation, navigate, isPage, resolve, scrollToHash } from "./lib/router";
import { markdownPath, notFoundPage, SITE_URL } from "./data/pages";

// Neither of these is needed until someone opens them. Once loaded they stay mounted,
// so the terminal keeps its history and Doom keeps its window between opens.
const Terminal = lazy(() => import("./components/Terminal"));
const DoomPopup = lazy(() => import("./components/DoomPopup"));

// The newer pages only load when someone visits them.
const UsesV2 = lazy(() => import("./components/UsesV2"));
const Brain = lazy(() => import("./components/Brain"));
const BrainNote = lazy(() => import("./components/BrainNote"));
const Blog = lazy(() => import("./components/Blog"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const SiteLog = lazy(() => import("./components/SiteLog"));
const Colophon = lazy(() => import("./components/Colophon"));

function PagePosition({ path, hash, mainRef }) {
    const lastPath = useRef(null);

    useLayoutEffect(() => {
        const arriving = lastPath.current !== path;
        const changedPage = lastPath.current !== null && arriving;
        lastPath.current = path;
        if (changedPage) mainRef.current?.focus({ preventScroll: true });
        if (hash) scrollToHash(hash, arriving ? "instant" : "auto");
        else if (changedPage) window.scrollTo({ top: 0, behavior: "instant" });
    }, [path, hash, mainRef]);

    // On a fresh load the font swap can push the section below its original position.
    useEffect(() => {
        const initialUrl = window.location.href;
        const initialHash = window.location.hash;
        if (!initialHash) return;
        let moved = false;
        const onScroll = () => (moved = true);
        window.addEventListener("wheel", onScroll, { passive: true, once: true });
        window.addEventListener("touchmove", onScroll, { passive: true, once: true });
        document.fonts.ready.then(() => {
            if (!moved && window.location.href === initialUrl) scrollToHash(initialHash, "instant");
        });
        return () => {
            moved = true;
            window.removeEventListener("wheel", onScroll);
            window.removeEventListener("touchmove", onScroll);
        };
    }, []);

    return null;
}

function Page({ page, search, onOpenTerminal }) {
    const showSlots = import.meta.env.DEV && new URLSearchParams(search).has("slots");
    switch (page?.id ?? page?.path) {
        case "/":
            return (
                <>
                    <Hero onOpenTerminal={onOpenTerminal} />
                    <Now />
                    <WorkPreviews />
                    <HomeLinks />
                </>
            );
        case "/work":
            return (
                <div className="pt-10">
                    <Projects />
                    <Building />
                    <EarlierWork />
                    <Experience />
                </div>
            );
        case "/uses":
            return (
                <div className="pt-10">
                    <Uses />
                    <Skills />
                </div>
            );
        case "uses-v2":
            return <UsesV2 showSlots={showSlots} />;
        case "brain":
            return <Brain title={page.heading} search={search} showSlots={showSlots} />;
        case "blog":
            return <Blog showSlots={showSlots} />;
        case "colophon":
            return <Colophon showSlots={showSlots} />;
        case "log":
            return <SiteLog showSlots={showSlots} />;
        case "blog-post":
            return <BlogPost post={page.entry} />;
        case "brain-note":
            return <BrainNote key={page.entry.slug} note={page.entry} showSlots={showSlots} />;
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
    const { path, search, hash } = useLocation();
    const page = resolve(path);
    const mainRef = useRef(null);

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

    // Keep page-to-page links inside the app instead of reloading everything.
    useEffect(() => {
        const handleClick = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target.closest?.("a[href]");
            if (!link || link.getAttribute("target") === "_blank" || link.hasAttribute("download")) return;
            const url = new URL(link.getAttribute("href"), window.location.href);
            if (!isPage(url)) return;
            event.preventDefault();
            navigate(url.href);
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        const meta = page ?? notFoundPage;
        const { title, description, socialDescription = description } = meta;
        document.title = title;
        document.querySelector('meta[name="description"]').content = description;
        document.querySelector('meta[property="og:type"]').content = meta.entry ? "article" : "website";
        document.querySelector('meta[property="og:title"]').content = title;
        document.querySelector('meta[property="og:description"]').content = socialDescription;
        document.querySelector('meta[name="twitter:title"]').content = title;
        document.querySelector('meta[name="twitter:description"]').content = socialDescription;

        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const markdown = document.querySelector('link[rel="alternate"][type="text/markdown"]');
        if (meta.path) {
            const link = canonical ?? document.createElement("link");
            const url = ogUrl ?? document.createElement("meta");
            link.rel = "canonical";
            link.href = SITE_URL + meta.path;
            url.setAttribute("property", "og:url");
            url.content = link.href;
            if (!canonical) document.head.append(link);
            if (!ogUrl) document.head.append(url);
            if (!import.meta.env.DEV) {
                const alternate = markdown ?? document.createElement("link");
                alternate.rel = "alternate";
                alternate.type = "text/markdown";
                alternate.href = SITE_URL + markdownPath(meta.path);
                if (!markdown) document.head.append(alternate);
            }
        } else {
            canonical?.remove();
            ogUrl?.remove();
            markdown?.remove();
        }
    }, [page]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-neutral-950 text-white">
                {path === "/" && <StarsBackground starCount={48} />}
                <Navbar path={path} />

                <main id="main-content" ref={mainRef} tabIndex={-1} className="outline-none">
                    <Suspense fallback={null}>
                        <Page page={page} search={search} onOpenTerminal={openTerminal} />
                        <PagePosition path={path} hash={hash} mainRef={mainRef} />
                    </Suspense>
                </main>

                <Footer onOpenTerminal={openTerminal} />

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
