import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMail, IconExternalLink, IconTerminal2, IconArrowRight } from "@tabler/icons-react";
import TextGenerateEffect from "./ui/TextGenerateEffect";
import avatarImg from "../assets/newme.webp";
import { profile } from "../data/portfolio";
import { terminalShortcut } from "../lib/platform";
import useReducedMotion from "../hooks/useReducedMotion";

// Load the card styles after the hero to keep its blend modes contained.
const ProfileCard = lazy(() => import("./ProfileCard"));

export default function Hero({ onOpenTerminal }) {
    const [showContent, setShowContent] = useState(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative z-10 min-h-screen flex items-center px-6 md:px-16 lg:px-24 pt-28 pb-16">
            <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
                <div className="flex-1 max-w-xl">
                    <div
                        className="transition-all duration-500 ease-out"
                        style={{
                            opacity: showContent ? 1 : 0,
                            transform: showContent || reducedMotion ? 'translateY(0)' : 'translateY(12px)',
                        }}
                    >
                        <div className="mb-8">
                            <span className="font-mono text-sm text-neutral-400">
                                {profile.location} · UTC+5:30
                            </span>
                        </div>
                        <div className="mb-3">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight font-mono inline-flex items-center gap-3">
                                {showContent ? (
                                    reducedMotion ? profile.name : <TextGenerateEffect text={profile.name} staggerDelay={0.08} wordDuration={0.4} />
                                ) : (
                                    <span className="opacity-0">Abhilash Kar</span>
                                )}
                            </h1>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg md:text-xl font-light text-neutral-400 font-mono">
                                {profile.role}
                            </p>
                        </div>
                        <div className="mb-8 max-w-lg space-y-4">
                            <p className="text-xl md:text-2xl text-neutral-100 leading-relaxed">{profile.intro}</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">{profile.context}</p>
                            <p className="text-sm text-neutral-300 leading-relaxed">{profile.proof}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            <a href="/work#sable" className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-400 text-neutral-950 hover:bg-green-300 transition-colors text-sm font-medium">
                                View sable <IconArrowRight className="w-4 h-4" aria-hidden="true" />
                            </a>
                            <a
                                href="/contact"
                                className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                            >
                                <IconMail className="w-4 h-4" />
                                Contact
                            </a>

                            <a
                                href={profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                                aria-label="View resume (opens in new tab)"
                            >
                                <IconExternalLink className="w-4 h-4" />
                                Résumé
                            </a>
                            <button
                                onClick={onOpenTerminal}
                                className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                                style={{ border: '1px solid #404040', background: 'rgba(23,23,23,0.6)' }}
                                aria-label="Open interactive terminal"
                            >
                                <IconTerminal2 className="w-4 h-4" />
                                Terminal
                                <span className="hidden md:inline text-neutral-400 text-xs ml-1">{terminalShortcut()}</span>
                            </button>
                        </div>
                    </div>
                </div>
                {showContent && (
                    <motion.div
                        className="flex-shrink-0 lg:hidden flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <div className="relative">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-neutral-800 shadow-2xl shadow-black/50">
                                <img
                                    src={avatarImg}
                                    alt="Abhilash Kar"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/10 to-transparent -z-10 blur-xl scale-125" />
                        </div>
                    </motion.div>
                )}
                <AnimatePresence>
                    {showContent && (
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
                                        avatarUrl={avatarImg}
                                        name=""
                                        title=""
                                        showUserInfo={false}
                                        radius={18}
                                        holo={0.45}
                                        glare={0.35}
                                        tiltStrength={8}
                                        enableTilt={!reducedMotion}
                                        enableMobileTilt={false}
                                        intro={!reducedMotion}
                                    />
                                </Suspense>
                                <p className="mt-4 text-center font-mono text-xs text-neutral-400">@{profile.handle}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
