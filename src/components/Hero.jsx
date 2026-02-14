import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconExternalLink, IconTerminal2, IconBrandGithub, IconBrandLinkedin} from "@tabler/icons-react";
import AnimatedStatusLines from "./ui/AnimatedStatusLines";
import TextGenerateEffect from "./ui/TextGenerateEffect";

// Lazy-load ProfileCard so its CSS (with mix-blend-mode, filters, etc.)
// is NOT injected into the page until the card actually renders.
const ProfileCard = lazy(() => import("./ProfileCard"));

export default function Hero({ onOpenTerminal }) {
    const [statusDone, setStatusDone] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const handleStatusComplete = useCallback(() => {
        setStatusDone(true);
    }, []);

    // Use a CSS class-based fade instead of per-element Framer Motion animations
    // to avoid creating multiple GPU compositing layers that cause green color bleed
    useEffect(() => {
        if (statusDone) {
            // Small delay so the browser has time to settle compositing layers
            const timer = setTimeout(() => setShowContent(true), 50);
            return () => clearTimeout(timer);
        }
    }, [statusDone]);

    return (
        <section className="relative z-10 min-h-screen flex items-center px-6 md:px-16 lg:px-24 pt-20">
            <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
                {/* Left side — all existing hero content */}
                <div className="flex-1 max-w-xl">
                    {/* Status Lines */}
                    <div className="mb-6">
                        <AnimatedStatusLines onAllComplete={handleStatusComplete} />
                    </div>

                    {/* Everything below fades in as a single unit via CSS transition */}
                    <div
                        className="transition-all duration-500 ease-out"
                        style={{
                            opacity: showContent ? 1 : 0,
                            transform: showContent ? 'translateY(0)' : 'translateY(12px)',
                        }}
                    >
                        {/* Location line */}
                        <div className="mb-8">
                            <span className="font-mono text-sm text-neutral-500">
                                └─ STATIONED_AT: ◎ Chennai, India | UTC+5:30
                            </span>
                        </div>

                        {/* Name */}
                        <div className="mb-3">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight font-mono inline-flex items-center gap-3">
                                {statusDone ? (
                                    <TextGenerateEffect text="Abhilash Kar" staggerDelay={0.08} wordDuration={0.4} />
                                ) : (
                                    <span className="opacity-0">Abhilash Kar</span>
                                )}
                            </h1>
                        </div>

                        {/* Role */}
                        <div className="mb-4">
                            <p className="text-lg md:text-xl font-light text-neutral-400 font-mono">
                                Full Stack Developer
                            </p>
                        </div>

                        {/* Bio */}
                        <div className="mb-8 max-w-md">
                            <p className="text-sm text-neutral-500 font-mono leading-relaxed">
                                I write systems that scale and code that doesn't apologize. <br/>
                                Fueled by strong opinions and stronger coffee.
                            </p>
                        </div>

                        {/* CTA Buttons — using inline border/bg colors to avoid oklch color-mix green shift */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <a
                                href="mailto:abh6l9sh@protonmail.com"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                            >
                                <IconMail className="w-4 h-4" />
                                Contact
                            </a>
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                            >
                                <IconExternalLink className="w-4 h-4" />
                                Resume
                            </a>
                            <button
                                onClick={onOpenTerminal}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                            >
                                <IconTerminal2 className="w-4 h-4" />
                                Launch Terminal
                            </button>
                        </div>

                        {/* Social Icons — using inline border/bg colors to avoid oklch color-mix green shift */}
                        <div className="flex gap-3">
                            {[
                                { icon: IconBrandGithub, href: "https://github.com/abhilxsh07" },
                                { icon: IconBrandLinkedin, href: "https://www.linkedin.com/in/abhilxsh/" },
                                { icon: IconMail, href: "mailto:abhb6l9sh@protonmail.com"}
                            ].map(({ icon: Icon, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                                    style={{ border: '1px solid #262626', background: 'rgba(23,23,23,0.5)' }}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side — ProfileCard (only mounts after status lines finish) */}
                <AnimatePresence>
                    {statusDone && (
                        <motion.div
                            className="flex-shrink-0 hidden lg:block"
                            style={{ isolation: 'isolate' }}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <div className="hero-card-wrapper">
                                <Suspense fallback={null}>
                                    <ProfileCard
                                        name="Abhilash Kar"
                                        title=""
                                        handle="abhilxsh07"
                                        status="Software Engineer"
                                        contactText="Contact"
                                        showUserInfo={true}
                                        enableTilt={true}
                                        enableMobileTilt={false}
                                        onContactClick={() => {
                                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    />
                                </Suspense>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
