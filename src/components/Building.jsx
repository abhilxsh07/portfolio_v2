import { motion } from "framer-motion";
import { IconHammer, IconBrandGithub } from "@tabler/icons-react";

const currentProjects = [

    {
        title: "clipstash",
        description: "A CLI snippet manager for saving, tagging, and retrieving code snippets from the terminal. Built as a stepping-stone project to learn intermediate Python patterns.",
        tech: ["Python", "CLI", "Dataclasses", "Decorators"],
        status: "active",
        statusLabel: "IN PROGRESS",
        statusColor: "border-green-500/40 text-green-400 bg-green-500/10",
        dotColor: "bg-green-500",
        link: null,
        note: null
    },
    {
        title: "memscope",
        description: "A Python memory profiling tool for visualizing object-level memory usage, allocations, and reference graphs.",
        tech: ["Python", "OOP", "Memory Profiling"],
        status: "paused",
        statusLabel: "ON HOLD",
        statusColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
        dotColor: "bg-amber-500",
        link: null,
        note: "working on clipstash first"
    },
    {
        title: "mini-docker",
        description: "A minimal container runtime in C++ to understand Linux namespaces, cgroups, and filesystem isolation from scratch.",
        tech: ["C++", "Linux", "Namespaces", "cgroups"],
        status: "planned",
        statusLabel: "PLANNED",
        statusColor: "border-neutral-500/40 text-neutral-400 bg-neutral-500/10",
        dotColor: "bg-neutral-500",
        link: null,
        note: null
    }
];

export default function Building() {
    return (
        <section id="building" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
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
                        <IconHammer className="w-6 h-6 text-neutral-400" />
                        <h2 className="text-2xl font-light text-white">Currently Building</h2>
                    </div>
                    <span className="text-sm text-neutral-500 font-mono">// what i&apos;m working on</span>
                </motion.div>

                {/* Cards */}
                <div className="space-y-4">
                    {currentProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all duration-300"
                        >
                            {/* Title row */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${project.dotColor} ${project.status === "active" ? "ring-4 ring-green-500/20" : ""}`} />
                                    <span className="text-base font-medium text-white font-mono">{project.title}</span>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border shrink-0 self-start ${project.statusColor}`}>
                                    {project.statusLabel}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-neutral-300 font-mono leading-relaxed ml-5.5 mb-3">
                                {project.description}
                            </p>

                            {/* Note if exists */}
                            {project.note && (
                                <p className="text-xs text-neutral-500 font-mono italic ml-5.5 mb-3">
                                    ↳ {project.note}
                                </p>
                            )}

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-1.5 ml-5.5">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* GitHub link if exists */}
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-3 ml-5.5 text-xs text-neutral-500 hover:text-white transition-colors font-mono"
                                >
                                    <IconBrandGithub className="w-3.5 h-3.5" />
                                    View on GitHub
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
