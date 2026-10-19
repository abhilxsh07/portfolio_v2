import { profile } from "../data/portfolio";
import { terminalShortcut } from "../lib/platform";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-neutral-800/40 py-8 text-center">
            <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} {profile.name} &bull; Built with React and Tailwind
            </p>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px]">{terminalShortcut()}</kbd> to open terminal
            </p>
        </footer>
    );
}
