import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { profile } from "../data/portfolio";
import { getPortfolioOutput } from "../lib/terminalContent";

const COMMANDS = [
    { name: "about", desc: "- Learn about me" },
    { name: "cat resume.txt", desc: "- View resume summary" },
    { name: "coffee", desc: "- Brew some coffee" },
    { name: "contact", desc: "- Get in touch" },
    { name: "doom", desc: "- Guys will run Doom on anything huh?" },
    { name: "experience", desc: "- See my work history" },
    { name: "help", desc: "- Show all available commands" },
    { name: "ls", desc: "- List files" },
    { name: "neofetch", desc: "- System info" },
    { name: "ping", desc: "- Check connection" },
    { name: "projects", desc: "- See my work" },
    { name: "skills", desc: "- View my tech stack" },
    { name: "whoami", desc: "- Who are you?" },
    { name: "cls", desc: "- Clear terminal" },
    { name: "exit", desc: "- Close terminal" }
];

function getOutput(cmd) {
    const portfolioOutput = getPortfolioOutput(cmd);
    if (portfolioOutput) return portfolioOutput;
    switch (cmd) {
        case "help":
            return COMMANDS.map((command) => ({ text: `  ${command.name.padEnd(14)} ${command.desc}`, color: "text-neutral-300" }));
        case "ls":
            return [{ text: "projects/  skills.json  experience.txt  resume.txt", color: "text-neutral-300" }];
        case "ping":
            return [{ text: "PONG — you're connected to my portfolio.", color: "text-green-400" }];
        case "neofetch":
            return [
                { text: `${profile.name} / ${profile.role}`, color: "text-green-400" },
                { text: `Location: ${profile.location}`, color: "text-neutral-300" },
                { text: "Stack: Next.js · TypeScript · Supabase · Python · C++", color: "text-neutral-300" },
                { text: "Focus: building products end to end", color: "text-neutral-300" },
                { text: "Terminal: abhilashkar.dev", color: "text-neutral-400" },
            ];
        case "whoami":
            return [{ text: profile.handle, color: "text-green-400" }];
        default:
            return [{ text: `Command not found: ${cmd}. Type "help" for available commands.`, color: "text-neutral-400" }];
    }
}

/* ── Coffee animation constants ── */
const COFFEE_STEPS = [
    { label: "Grinding beans...", duration: 1500 },
    { label: "Heating water to 96°C...", duration: 1200 },
    { label: "Extracting espresso shot...", duration: 1800 }
];
const BAR_WIDTH = 22;

function CoffeeProgressBar({ percent, isComplete }) {
    if (isComplete) {
        return (
            <span className="text-green-400">
                [{"█".repeat(BAR_WIDTH)}] 100%  ✓
            </span>
        );
    }
    const filled = Math.round((percent / 100) * BAR_WIDTH);
    const empty = BAR_WIDTH - filled;
    return (
        <span className="text-neutral-400">
            [{"=".repeat(filled)}{" ".repeat(empty)}] {percent}%
        </span>
    );
}

function CoffeeAnimation({ onDone }) {
    const [currentStep, setCurrentStep] = useState(-1); // -1 = header only
    const [percent, setPercent] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [codeQuality] = useState(() => Math.floor(Math.random() * 71) + 30); // 30-100
    const [summaryLines, setSummaryLines] = useState(0);
    useEffect(() => {
        const timers = new Set();
        let interval;
        const later = (callback, delay) => {
            const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
            timers.add(timer);
        };
        const runStep = (index) => {
            setCurrentStep(index);
            setPercent(0);
            const started = performance.now();
            interval = setInterval(() => {
                const progress = Math.min(100, Math.round((performance.now() - started) / COFFEE_STEPS[index].duration * 100));
                setPercent(progress);
                if (progress < 100) return;
                clearInterval(interval);
                setCompletedSteps((previous) => [...previous, index]);
                if (index + 1 < COFFEE_STEPS.length) {
                    later(() => runStep(index + 1), 200);
                } else {
                    later(() => {
                        setShowSummary(true);
                        [1, 2, 3].forEach((line) => later(() => setSummaryLines(line), line * 150));
                        later(() => onDone?.(), 600);
                    }, 400);
                }
            }, 70);
        };
        later(() => runStep(0), 300);
        return () => {
            clearInterval(interval);
            timers.forEach(clearTimeout);
        };
    }, [onDone]);

    return (
        <div className="space-y-1">
            {/* Header */}
            <div>
                <span className="text-neutral-500">&gt; </span>
                <span className="text-white">Brewing coffee...</span>
            </div>

            {/* Steps */}
            {COFFEE_STEPS.map((step, i) => {
                const isActive = currentStep === i && !completedSteps.includes(i);
                const isDone = completedSteps.includes(i);
                const isVisible = i <= currentStep;

                if (!isVisible) return null;

                return (
                    <div key={i} className="mt-2">
                        <div>
                            <span className={isDone ? "text-green-400" : "text-neutral-500"}>
                                {"  "}[{i + 1}/{COFFEE_STEPS.length}]{" "}
                            </span>
                            <span className={isDone ? "text-green-400" : "text-neutral-300"}>
                                {step.label}
                            </span>
                        </div>
                        <div>
                            {"  "}
                            <CoffeeProgressBar
                                percent={isActive ? percent : isDone ? 100 : 0}
                                isComplete={isDone}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Summary */}
            {showSummary && (
                <div className="mt-2 space-y-0.5">
                    {summaryLines >= 1 && (
                        <div>
                            <span className="text-neutral-500">&gt; </span>
                            <span className="text-white">Initializing coffee.service...</span>
                        </div>
                    )}
                    {summaryLines >= 2 && (
                        <div>
                            <span className="text-green-400">  [OK] </span>
                            <span className="text-neutral-400">Caffeine levels: </span>
                            <span className="text-green-400">OPTIMAL</span>
                        </div>
                    )}
                    {summaryLines >= 3 && (
                        <div>
                            <span className="text-green-400">  [OK] </span>
                            <span className="text-neutral-400">Code quality: </span>
                            <span className="text-green-400">+{codeQuality}%</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Terminal({ isOpen, onClose, onOpenDoom, isDoomOpen }) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { type: "system", lines: [{ text: 'Terminal ready. Type "/" to see commands or "help" for list.', color: "text-neutral-500" }] }
    ]);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [cmdIndex, setCmdIndex] = useState(-1);
    const [showPalette, setShowPalette] = useState(false);
    const [paletteIndex, setPaletteIndex] = useState(0);
    const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
    const [isBrewing, setIsBrewing] = useState(false);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const paletteScrollRef = useRef(null);
    const selectedItemRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Return focus to whatever opened the terminal when it closes
    const previousFocus = useRef(null);
    useEffect(() => {
        if (isOpen) {
            previousFocus.current = document.activeElement;
        } else if (previousFocus.current) {
            previousFocus.current.focus?.();
            previousFocus.current = null;
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isBrewing]);

    // Auto-scroll during coffee animation via MutationObserver
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !isBrewing) return;
        const observer = new MutationObserver(() => {
            el.scrollTop = el.scrollHeight;
        });
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        return () => observer.disconnect();
    }, [isBrewing]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
            // Trap focus inside terminal when open
            if (e.key === "Tab" && isOpen) {
                const terminal = document.querySelector('[role="dialog"][aria-label="Interactive terminal"]');
                if (!terminal) return;
                const focusable = terminal.querySelectorAll('a[href], input, button, [tabindex]:not([tabindex="-1"])');
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ block: "nearest" });
        }
    }, [paletteIndex]);

    const updateInput = useCallback((value) => {
        setInput(value);
        setFilteredCommands(COMMANDS.filter((command) => command.name.includes(value.slice(1).toLowerCase())));
        setShowPalette(value.startsWith("/"));
        setPaletteIndex(0);
    }, []);

    // Reset state when the externally controlled window closes.
    const [wasOpen, setWasOpen] = useState(isOpen);
    if (wasOpen !== isOpen) {
        setWasOpen(isOpen);
        if (!isOpen) {
            setIsBrewing(false);
            setHistory((previous) => previous.map((entry) => entry.type === "coffee" ? { type: "output", lines: [{ text: "Coffee service stopped when the terminal closed.", color: "text-neutral-400" }] } : entry));
        }
    }

    const executeCommand = useCallback((cmd) => {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        if (trimmed === "cls") {
            setHistory([]);
            setIsBrewing(false);
            setInput("");
            return;
        }

        if (trimmed === "exit" || trimmed === "close") {
            onClose();
            setInput("");
            return;
        }

        if (trimmed === "doom") {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                const mobileOutput = [
                    { text: "> Loading doom.wad...", color: "text-neutral-500" },
                    { text: "  [ERR] DOOM is not available on mobile devices yet.", color: "text-red-400" },
                    { text: "  [--] Try again on a desktop or laptop.", color: "text-neutral-500" }
                ];
                setHistory((prev) => [
                    ...prev,
                    { type: "command", cmd: trimmed },
                    { type: "output", lines: mobileOutput }
                ]);
            } else {
                const doomOutput = [
                    { text: "> Loading doom.wad...", color: "text-neutral-500" },
                    { text: "  [OK] Renderer initialized", color: "text-green-500" },
                    { text: "  [OK] Audio subsystem ready", color: "text-green-500" },
                    { text: "  [OK] DOOM is running", color: "text-green-500" }
                ];
                setHistory((prev) => [
                    ...prev,
                    { type: "command", cmd: trimmed },
                    { type: "output", lines: doomOutput }
                ]);
                if (!isDoomOpen) onOpenDoom?.();
            }
            setCmdHistory((prev) => [trimmed, ...prev]);
            setCmdIndex(-1);
            setInput("");
            setShowPalette(false);
            return;
        }

        if (trimmed === "coffee") {
            if (isBrewing) {
                setHistory((prev) => [
                    ...prev,
                    { type: "command", cmd: trimmed },
                    { type: "output", lines: [{ text: "> Coffee is already brewing...", color: "text-neutral-500" }] }
                ]);
            } else {
                setIsBrewing(true);
                setHistory((prev) => [
                    ...prev,
                    { type: "command", cmd: trimmed },
                    { type: "coffee" }
                ]);
            }
            setCmdHistory((prev) => [trimmed, ...prev]);
            setCmdIndex(-1);
            setInput("");
            setShowPalette(false);
            return;
        }

        const output = getOutput(trimmed);
        setHistory((prev) => [
            ...prev,
            { type: "command", cmd: trimmed },
            { type: "output", lines: output }
        ]);
        setCmdHistory((prev) => [trimmed, ...prev]);
        setCmdIndex(-1);
        setInput("");
        setShowPalette(false);
    }, [onClose, onOpenDoom, isDoomOpen, isBrewing]);

    const handleCoffeeDone = useCallback(() => {
        setIsBrewing(false);
        setHistory((previous) => previous.map((entry) => entry.type === "coffee" ? { type: "output", lines: [{ text: "Coffee ready. Caffeine levels: OPTIMAL", color: "text-green-400" }] } : entry));
    }, []);

    const handleKeyDown = (e) => {
        if (showPalette) {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setPaletteIndex((prev) => Math.max(0, prev - 1));
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setPaletteIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1));
                return;
            }
            if (e.key === "Enter") {
                e.preventDefault();
                const selected = filteredCommands[paletteIndex];
                if (selected) {
                    executeCommand(selected.name);
                }
                return;
            }
            if (e.key === "Escape") {
                setShowPalette(false);
                return;
            }
        } else {
            if (e.key === "Enter") {
                executeCommand(input);
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (cmdHistory.length > 0) {
                    const newIdx = Math.min(cmdIndex + 1, cmdHistory.length - 1);
                    setCmdIndex(newIdx);
                    updateInput(cmdHistory[newIdx]);
                }
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (cmdIndex > 0) {
                    const newIdx = cmdIndex - 1;
                    setCmdIndex(newIdx);
                    updateInput(cmdHistory[newIdx]);
                } else {
                    setCmdIndex(-1);
                    setInput("");
                }
                return;
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 right-6 w-[min(500px,calc(100vw-3rem))] max-h-[400px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/50 z-50 flex flex-col"
                    role="dialog"
                    aria-label="Interactive terminal"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-white font-medium">
                                <span className="text-neutral-500">&gt;_</span> terminal
                            </span>
                            <span className="text-xs text-neutral-500">Press Esc to close</span>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close terminal"
                            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 bg-neutral-950 font-mono text-sm space-y-2 min-h-0"
                    >
                        {history.map((entry, i) => {
                            if (entry.type === "command") {
                                return (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-green-500">→</span>
                                        <span className="text-white">{entry.cmd}</span>
                                    </div>
                                );
                            }
                            if (entry.type === "coffee") {
                                return (
                                    <div key={i}>
                                        <CoffeeAnimation onDone={handleCoffeeDone} />
                                    </div>
                                );
                            }
                            if (entry.type === "output" || entry.type === "system") {
                                return (
                                    <div key={i} className="space-y-0.5">
                                        {entry.lines.map((line, j) => (
                                            <div key={j} className={line.color}>
                                                {line.href ? <a href={line.href} target={line.href.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer" onClick={line.href.startsWith("#") ? onClose : undefined} className="underline underline-offset-4 hover:text-white">{line.text}</a> : line.html ? line.content : line.text}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Input + Command Palette wrapper */}
                    <div className="relative shrink-0">
                        {/* Command Palette — absolutely positioned, grows upward */}
                        <AnimatePresence>
                            {showPalette && filteredCommands.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    ref={paletteScrollRef}
                                    className="absolute bottom-full left-0 right-0 border-t border-neutral-800 bg-neutral-900 rounded-t-lg max-h-[240px] overflow-y-auto z-20"
                                >
                                    <div className="px-3 py-1.5 flex justify-between sticky top-0 bg-neutral-900 z-10">
                                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">Commands</span>
                                        <span className="text-[10px] text-neutral-600">↑↓ navigate · Enter select</span>
                                    </div>
                                    {filteredCommands.map((cmd, i) => (
                                        <button
                                            key={cmd.name}
                                            ref={i === paletteIndex ? selectedItemRef : undefined}
                                            onClick={() => executeCommand(cmd.name)}
                                            className={`w-full px-3 py-2 flex justify-between text-sm cursor-pointer ${
                                                i === paletteIndex
                                                    ? "bg-neutral-800 text-green-400"
                                                    : "text-white hover:bg-neutral-800/50"
                                            }`}
                                        >
                                            <span className="font-medium font-mono">{cmd.name}</span>
                                            <span className="text-neutral-500 font-mono">{cmd.desc}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-800 bg-neutral-950">
                            <span className="text-green-500 font-mono">→</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => updateInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder='type command or press /'
                                className="flex-1 bg-transparent text-white font-mono text-sm placeholder-neutral-600 outline-none"
                                aria-label="Terminal command input"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
