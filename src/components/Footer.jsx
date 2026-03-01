export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-neutral-800/40 py-8 text-center">
            <p className="text-xs text-neutral-600">
                &copy; 2026 Abhilash Kar &bull; Shipped with React, Tailwind, and questionable hours
            </p>
            <p className="text-xs text-neutral-700 mt-1 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-500 text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-500 text-[10px]">K</kbd> to open terminal
            </p>
            <p className="text-xs text-green-500 font-mono mt-1">
                System: OPERATIONAL
            </p>
        </footer>
    );
}
