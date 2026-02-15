import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";

const COMMANDS = [
    { name: "help", desc: "- Show all available commands" },
    { name: "about", desc: "- Learn about me" },
    { name: "skills", desc: "- View my tech stack" },
    { name: "experience", desc: "- See my work history" },
    { name: "projects", desc: "- See my work" },
    { name: "contact", desc: "- Get in touch" },
    { name: "doom", desc: "- Guys will run Doom on anything huh?" },
    { name: "coffee", desc: "- Brew some coffee" },
    { name: "ls", desc: "- List files" },
    { name: "ping", desc: "- Check connection" },
    { name: "clear", desc: "- Clear terminal" },
    { name: "exit", desc: "- Close terminal" }
];

function getOutput(cmd) {
    switch (cmd) {
        case "help":
            return COMMANDS.map((c) => ({
                text: `  ${c.name.padEnd(14)} ${c.desc}`,
                color: "text-neutral-300"
            }));
        case "about":
            return [
                { text: "Abhilash Kar — Software Engineer", color: "text-green-400" },
                { text: "Engineering systems built for scale.", color: "text-neutral-400" },
                { text: "B.Tech in CSE from SRMIST.", color: "text-neutral-400" }
            ];
        case "skills":
            return [
                { text: "", color: "" },
                {
                    text: "Proficient:",
                    color: "text-green-400",
                    html: true,
                    content: <span className="text-green-400 font-bold">Proficient:</span>
                },
                {
                    text: "  Java 90  |  Python 85  |  JavaScript 85  |  TypeScript 80",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span className="text-neutral-300">
                            {"  "}Java 90{"  |  "}Python 85{"  |  "}JavaScript 85{"  |  "}TypeScript 80
                        </span>
                    )
                },
                {
                    text: "  React 85  |  Spring Boot 80  |  Node.js 80  |  Kafka 75",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span className="text-neutral-300">
                            {"  "}React 85{"  |  "}Spring Boot 80{"  |  "}Node.js 80{"  |  "}Kafka 75
                        </span>
                    )
                },
                {
                    text: "  PostgreSQL 80  |  MySQL 80  |  MongoDB 75  |  Docker 75",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span className="text-neutral-300">
                            {"  "}PostgreSQL 80{"  |  "}MySQL 80{"  |  "}MongoDB 75{"  |  "}Docker 75
                        </span>
                    )
                },
                {
                    text: "  Git 90  |  HTML/CSS 85  |  Tailwind CSS 85",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span className="text-neutral-300">
                            {"  "}Git 90{"  |  "}HTML/CSS 85{"  |  "}Tailwind CSS 85
                        </span>
                    )
                },
                { text: "", color: "" },
                {
                    text: "Familiar:",
                    color: "text-green-400",
                    html: true,
                    content: <span className="text-green-400 font-bold">Familiar:</span>
                },
                {
                    text: "  { Go, C/C++, SQL, PHP, Next.js, WebGL/OGL, GSAP, Netty, Spark, ... }",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span>
                            {"  "}<span className="text-neutral-500">{"{"}</span>
                            <span className="text-neutral-300"> Go, C/C++, SQL, PHP, Next.js, WebGL/OGL, GSAP, Netty, Spark,</span>
                        </span>
                    )
                },
                {
                    text: "    Express, Django/Flask, gRPC, Redis, Elasticsearch, Kubernetes, ...",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span>
                            {"    "}<span className="text-neutral-300">Express, Django/Flask, gRPC, Redis, Elasticsearch, Kubernetes,</span>
                        </span>
                    )
                },
                {
                    text: "    AWS, CI/CD, Terraform, REST, Microservices, System Design, ... }",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span>
                            {"    "}<span className="text-neutral-300">AWS, CI/CD, Terraform, REST, Microservices, System Design,</span>
                        </span>
                    )
                },
                {
                    text: "    LangChain, Streamlit, NumPy/Pandas, Vite, MATLAB }",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span>
                            {"    "}<span className="text-neutral-300">LangChain, Streamlit, NumPy/Pandas, Vite, MATLAB </span>
                            <span className="text-neutral-500">{"}"}</span>
                        </span>
                    )
                }
            ];
        case "experience":
            return [
                { text: "Technical Staff @Futurix", color: "text-white" },
                { text: "  Aug 2025 - Present | ACTIVE", color: "text-green-500" },
                { text: "", color: "" },
                { text: "B.Tech in CSE from SRMIST.", color: "text-white" },
                { text: "  Aug 2025 - Aug 2029", color: "text-neutral-400" }
            ];
        case "projects":
            return [
                {
                    text: "> projects/",
                    color: "text-white",
                    html: true,
                    content: (
                        <span>
                            <span className="text-neutral-500">&gt; </span>
                            <span className="text-white">projects/</span>
                        </span>
                    )
                },
                { text: "", color: "" },
                { text: "  Hackathon Web Application", color: "text-neutral-200" },
                { text: "  TypeScript, React, Tailwind, Node, PHP, MySQL", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  Hackathon Web App (Collaborated)", color: "text-neutral-200" },
                { text: "  Next.js, React, TypeScript, Tailwind, PostCSS", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  Portfolio Website (legacy)", color: "text-neutral-200" },
                { text: "  JSX, CSS, React, WebGL, Vite", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  Student DB Manager", color: "text-neutral-200" },
                { text: "  Python, MySQL", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  Reflex Arc Demonstration", color: "text-neutral-200" },
                { text: "  BioTech", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  C/C++ (Learning)", color: "text-neutral-200" },
                { text: "  Compile-Time Programming, Structs, Classes, Polymorphism", color: "text-neutral-500" },
                { text: "", color: "" },
                { text: "  Total: 6 projects", color: "text-green-400" }
            ];
        case "contact":
            return [
                { text: "Email:    abh6l9sh@protonmail.com", color: "text-neutral-300" },
                { text: "GitHub:   github.com/abhilxsh07", color: "text-neutral-300" },
                { text: "LinkedIn: linkedin.com/in/abhilxsh", color: "text-neutral-300" }
            ];
        case "ls":
            return [
                {
                    text: "projects/  skills.json  config/  docker-compose.yml  README.md",
                    color: "text-neutral-400",
                    html: true,
                    content: (
                        <span>
                            <span className="text-neutral-200">projects/</span>{"  "}
                            <span className="text-neutral-400">skills.json</span>{"  "}
                            <span className="text-neutral-200">config/</span>{"  "}
                            <span className="text-neutral-400">docker-compose.yml</span>{"  "}

                            <span className="text-neutral-400">README.md</span>
                        </span>
                    )
                }
            ];
        case "ping":
            return [
                {
                    text: "PING 8.8.8.8: 12ms | Connection: STABLE",
                    color: "text-neutral-300",
                    html: true,
                    content: (
                        <span>
                            <span className="text-neutral-300">PING 8.8.8.8: 12ms | Connection: </span>
                            <span className="text-green-500">STABLE</span>
                        </span>
                    )
                }
            ];
        default:
            return [
                { text: `Command not found: ${cmd}. Type "help" for available commands.`, color: "text-neutral-400" }
            ];
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
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const mountedRef = useRef(true);

    const cleanup = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        // Start first step after 300ms
        timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) setCurrentStep(0);
        }, 300);
        return () => {
            mountedRef.current = false;
            cleanup();
        };
    }, [cleanup]);

    // Drive progress bar for current step
    useEffect(() => {
        if (currentStep < 0 || currentStep >= COFFEE_STEPS.length) return;
        if (completedSteps.includes(currentStep)) return;

        setPercent(0);
        const tickMs = 70;

        intervalRef.current = setInterval(() => {
            if (!mountedRef.current) return;
            setPercent((prev) => {
                if (prev >= 100) return 100;
                const remaining = 100 - prev;
                const step = Math.min(
                    Math.floor(Math.random() * 6) + 2,
                    remaining
                );
                return prev + step;
            });
        }, tickMs);

        return () => {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        };
    }, [currentStep, completedSteps]);

    // When percent hits 100, mark complete and advance
    useEffect(() => {
        if (percent < 100) return;
        if (currentStep < 0 || currentStep >= COFFEE_STEPS.length) return;
        if (completedSteps.includes(currentStep)) return;

        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

        setCompletedSteps((prev) => [...prev, currentStep]);

        const nextStep = currentStep + 1;
        if (nextStep < COFFEE_STEPS.length) {
            timeoutRef.current = setTimeout(() => {
                if (mountedRef.current) {
                    setCurrentStep(nextStep);
                }
            }, 200);
        } else {
            // All steps done — show summary after 400ms
            timeoutRef.current = setTimeout(() => {
                if (mountedRef.current) {
                    setShowSummary(true);
                    // Reveal summary lines one by one
                    setTimeout(() => mountedRef.current && setSummaryLines(1), 150);
                    setTimeout(() => mountedRef.current && setSummaryLines(2), 300);
                    setTimeout(() => mountedRef.current && setSummaryLines(3), 450);
                    setTimeout(() => { if (mountedRef.current) onDone?.(); }, 600);
                }
            }, 400);
        }
    }, [percent, currentStep, completedSteps, onDone]);

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
        const handleEsc = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ block: "nearest" });
        }
    }, [paletteIndex]);

    useEffect(() => {
        if (input.startsWith("/")) {
            const query = input.slice(1).toLowerCase();
            const filtered = COMMANDS.filter((c) => c.name.includes(query));
            setFilteredCommands(filtered);
            setShowPalette(true);
            setPaletteIndex(0);
        } else {
            setShowPalette(false);
        }
    }, [input]);

    // Clean up brewing state when terminal closes
    useEffect(() => {
        if (!isOpen) setIsBrewing(false);
    }, [isOpen]);

    const executeCommand = useCallback((cmd) => {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        if (trimmed === "clear") {
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
                    setInput(cmdHistory[newIdx]);
                }
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (cmdIndex > 0) {
                    const newIdx = cmdIndex - 1;
                    setCmdIndex(newIdx);
                    setInput(cmdHistory[newIdx]);
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
                                                {line.html ? line.content : line.text}
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
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder='type command or press /'
                                className="flex-1 bg-transparent text-white font-mono text-sm placeholder-neutral-600 outline-none"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
