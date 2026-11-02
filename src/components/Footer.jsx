import { profile } from "../data/portfolio";
import { terminalShortcut } from "../lib/platform";

export default function Footer({ motion }) {
    return (
        <footer className="relative z-10 border-t border-neutral-800/40 py-8 text-center">
            <nav aria-label="Footer" className="mb-2">
                <a href="/uses" className="inline-flex items-center min-h-11 px-2 font-mono text-xs text-neutral-400 hover:text-white">
                    Uses
                </a>
                {motion && (
                    <button
                        type="button"
                        role="switch"
                        aria-checked={motion.on}
                        onClick={motion.toggle}
                        className="inline-flex items-center min-h-11 px-2 font-mono text-xs text-neutral-400 hover:text-white cursor-pointer"
                    >
                        Background motion<span aria-hidden="true" className="ml-1.5 text-neutral-500">{motion.on ? "on" : "off"}</span>
                    </button>
                )}
            </nav>
            <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} {profile.name} &bull; Built with React and Tailwind
            </p>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">{terminalShortcut()}</kbd> to open terminal
            </p>
        </footer>
    );
}
