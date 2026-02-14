import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import DoomPopup from "./components/DoomPopup";
import StarsBackground from "./components/ui/StarsBackground";
import ShootingStars from "./components/ui/ShootingStars";

export default function App() {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [doomOpen, setDoomOpen] = useState(false);

    const openTerminal = useCallback(() => setTerminalOpen(true), []);
    const closeTerminal = useCallback(() => setTerminalOpen(false), []);
    const openDoom = useCallback(() => setDoomOpen(true), []);
    const closeDoom = useCallback(() => setDoomOpen(false), []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <StarsBackground starCount={120} />
            <ShootingStars interval={5000} />
            <Navbar />

            <Hero onOpenTerminal={openTerminal} />

            <Skills />

            <Projects />

            <Experience />

            <Contact />

            <Footer />

            <Terminal
                isOpen={terminalOpen}
                onClose={closeTerminal}
                onOpenDoom={openDoom}
                isDoomOpen={doomOpen}
            />

            <DoomPopup isOpen={doomOpen} onClose={closeDoom} />
        </div>
    );
}
