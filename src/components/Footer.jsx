import { IconTerminal2 } from "@tabler/icons-react";
import { profile } from "../data/portfolio";
import { livePages } from "../data/pages";
import { terminalShortcut } from "../lib/platform";

const links = livePages().filter(({ path }) => ["/log", "/colophon"].includes(path));

export default function Footer({ onOpenTerminal }) {
    return (
        <footer className="relative z-10 border-t border-neutral-800 px-6 py-4 md:px-16 lg:px-24">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1">
                <p className="font-serif text-sm text-pencil">&copy; {new Date().getFullYear()} {profile.name}</p>
                {links.length > 0 && (
                    <nav aria-label="Footer" className="flex flex-wrap gap-x-4">
                        {links.map(({ path, heading }) => (
                            <a key={path} href={path} className="inline-flex min-h-11 items-center font-mono text-xs text-neutral-400 hover:text-white">
                                {heading}
                            </a>
                        ))}
                    </nav>
                )}
                <button type="button" onClick={onOpenTerminal} aria-keyshortcuts="Control+K Meta+K" className="flex min-h-11 cursor-pointer items-center gap-2 font-mono text-xs text-neutral-400 hover:text-green-400">
                    <IconTerminal2 size={16} aria-hidden="true" /> terminal <kbd className="hidden sm:inline">{terminalShortcut()}</kbd>
                </button>
            </div>
        </footer>
    );
}
