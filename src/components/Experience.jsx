import { motion } from "framer-motion";
import { IconBuilding } from "@tabler/icons-react";
import { cn } from "../lib/utils";

const entries = [
    {
        title: "Technical Staff",
        company: "Futurix",
        date: "Aug 2025 - Present",
        badge: { text: "ACTIVE", style: "border-green-500/40 text-green-400 bg-green-500/10" },
        description: "Contributing as technical staff at the college's technical club, working on projects and initiatives that push technical boundaries.",
        comment: "// Building with the builders",
        dotColor: "bg-green-500",
        dotGlow: true,
        active: true,
        type: "club"
    },
    {
        title: "B.Tech in Computer Science & Engineering",
        company: "SRMIST",
        date: "Aug 2025 - Aug 2029",
        badge: { text: "IN PROGRESS", style: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
        description: "Pursuing core CS fundamentals — DSA, OOPS, OS, CN, DBMS, and Software Engineering — through coursework, projects, and competitive programming.",
        comment: "// Core CS fundamentals",
        dotColor: "bg-amber-500",
        dotGlow: false,
        active: false,
        type: "education"
    }
];

export default function Experience() {
    return (
        <section id="experience" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-12"
                >
                    <div className="flex items-center gap-3">
                        <IconBuilding className="w-6 h-6 text-neutral-400" />
                        <h2 className="text-2xl font-light text-white">Experience + Education</h2>
                    </div>
                    <span className="text-sm text-neutral-500 font-mono">// career trajectory</span>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-neutral-800" />

                    <div className="space-y-8">
                        {entries.map((entry, index) => (
                            <motion.div
                                key={entry.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="relative flex gap-6"
                            >
                                {/* Timeline dot */}
                                <div className="relative z-10 shrink-0 mt-5">
                                    <div
                                        className={cn(
                                            "w-3.5 h-3.5 rounded-full",
                                            entry.dotColor,
                                            entry.dotGlow && "ring-4 ring-green-500/20"
                                        )}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className={cn(
                                        "flex-1 bg-neutral-900/60 border border-neutral-800 rounded-xl p-5",
                                        "hover:border-neutral-700 hover:bg-neutral-900/80 transition-all duration-300",
                                        "border-l-2 border-l-transparent",
                                        entry.active && "hover:border-l-green-500/50"
                                    )}
                                >
                                    {/* Title + Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                                        <span className="text-base font-medium text-white font-mono">{entry.title}</span>
                                        <span className={cn(
                                            "px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border shrink-0 self-start",
                                            entry.badge.style
                                        )}>
                                            {entry.badge.text}
                                        </span>
                                    </div>

                                    {/* Company */}
                                    <p className="text-sm text-green-500 font-mono mb-0.5">{entry.company}</p>

                                    {/* Date */}
                                    <p className="text-xs text-neutral-500 font-mono mb-3">{entry.date}</p>

                                    {/* Description */}
                                    <p className="text-sm text-neutral-300 font-mono leading-relaxed">{entry.description}</p>

                                    {/* Divider + Comment */}
                                    <div className="border-t border-neutral-800 my-3" />
                                    <span className="text-xs text-neutral-500 font-mono">
                                        {"\u2022"} {entry.comment}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
