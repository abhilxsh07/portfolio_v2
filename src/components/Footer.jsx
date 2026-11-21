import { profile } from "../data/portfolio";
import { livePages } from "../data/pages";
import { terminalShortcut } from "../lib/platform";

const links = livePages().filter(({ path }) => ["/log", "/colophon"].includes(path));

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-neutral-800/40 py-8 text-center">
            {links.length > 0 && (
                <nav aria-label="Footer" className="mb-2">
                    {links.map(({ path, heading }) => (
                        <a key={path} href={path} className="inline-flex items-center min-h-11 px-2 font-mono text-xs text-neutral-400 hover:text-white">
                            {heading}
                        </a>
                    ))}
                </nav>
            )}
            <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} {profile.name} &bull; Built with React and Tailwind
            </p>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">{terminalShortcut()}</kbd> to open terminal
            </p>
        </footer>
    );
}
