import { lazy, Suspense } from "react";
import { IconMail, IconExternalLink, IconTerminal2, IconArrowRight } from "@tabler/icons-react";
import TextGenerateEffect from "./ui/TextGenerateEffect";
import avatarImg from "../assets/newme.webp";
import { profile } from "../data/portfolio";
import { terminalShortcut } from "../lib/platform";
import useReducedMotion from "../hooks/useReducedMotion";

const ProfileCard = lazy(() => import("./ProfileCard"));

export default function Hero({ onOpenTerminal }) {
    const reducedMotion = useReducedMotion();

    return (
        <section className="home-hero relative z-10 px-6 pb-12 pt-28 md:px-16 md:pb-16 md:pt-32 lg:px-24 lg:pt-36">
            <div className="mx-auto grid max-w-5xl items-center gap-7 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
                <div>
                    <p className="mb-4 font-mono text-xs text-neutral-400 sm:mb-5">
                        <span className="text-pencil">{profile.location}</span> <span aria-hidden="true">·</span> UTC+5:30
                    </p>
                    <h1 className="font-serif text-[clamp(3.25rem,7vw,6rem)] leading-[.96] tracking-tight text-paper">
                        {reducedMotion ? profile.name : <TextGenerateEffect text={profile.name} />}
                    </h1>
                    <div className="mt-6 max-w-md space-y-3">
                        <p className="text-xl leading-snug text-neutral-100 sm:text-2xl">{profile.intro}</p>
                        <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">{profile.context}</p>
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-1">
                        <a href="/work#sable" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-green-400 px-4 text-sm font-medium text-neutral-950 transition-colors hover:bg-green-300">
                            View sable <IconArrowRight size={16} aria-hidden="true" />
                        </a>
                        <a href="/contact" className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-300 hover:text-white">
                            <IconMail size={16} aria-hidden="true" /> Contact
                        </a>
                        <a
                            href={profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View résumé (opens in new tab)"
                            className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-300 hover:text-white"
                        >
                            <IconExternalLink size={16} aria-hidden="true" /> Résumé
                        </a>
                        <button
                            type="button"
                            onClick={onOpenTerminal}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-xs text-neutral-400 hover:text-green-400"
                            aria-keyshortcuts="Control+K Meta+K"
                        >
                            <IconTerminal2 size={16} aria-hidden="true" />
                            terminal
                            <kbd className="hidden text-neutral-400 lg:inline">{terminalShortcut()}</kbd>
                        </button>
                    </div>
                </div>
                <figure className="order-first w-24 sm:order-none sm:w-full">
                    <img src={avatarImg} alt="" className="aspect-square w-full rounded-lg border border-pencil/35 object-cover sm:aspect-[4/5] lg:hidden" />
                    <div className="hero-card-wrapper hidden lg:block">
                        <Suspense fallback={<img src={avatarImg} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />}>
                            <ProfileCard
                                avatarUrl={avatarImg}
                                showUserInfo={false}
                                radius={12}
                                holo={0.25}
                                glare={0.2}
                                tiltStrength={5}
                                enableTilt={!reducedMotion}
                                enableMobileTilt={false}
                                intro={false}
                            />
                        </Suspense>
                    </div>
                    <figcaption className="mt-2 hidden text-right font-serif text-sm italic text-pencil sm:block">@{profile.handle}</figcaption>
                </figure>
            </div>
        </section>
    );
}
