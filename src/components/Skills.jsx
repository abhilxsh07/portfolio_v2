import { motion } from "framer-motion";
import { IconCode } from "@tabler/icons-react";

const proficient = [
    { name: "Java", level: 90 },
    { name: "Git", level: 90 },
    { name: "Python", level: 85 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 85 },
    { name: "HTML/CSS", level: 85 },
    { name: "Tailwind CSS", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "Spring Boot", level: 80 },
    { name: "Node.js", level: 80 },
    { name: "PostgreSQL", level: 80 },
    { name: "MySQL", level: 80 },
    { name: "Kafka", level: 75 },
    { name: "MongoDB", level: 75 },
    { name: "Docker", level: 75 },
];

const familiar = [
    "Go", "C/C++", "SQL", "PHP", "Next.js", "WebGL/OGL", "GSAP",
    "Netty", "Spark", "Express", "Django/Flask", "gRPC",
    "Redis", "Elasticsearch", "Kubernetes", "AWS", "CI/CD", "Terraform",
    "REST", "Microservices", "System Design", "LangChain",
    "Streamlit", "NumPy/Pandas", "Vite", "MATLAB"
];

export default function Skills() {
    // Split proficient into two columns for desktop
    const mid = Math.ceil(proficient.length / 2);
    const leftCol = proficient.slice(0, mid);
    const rightCol = proficient.slice(mid);

    return (
        <section id="skills" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
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
                        <IconCode className="w-6 h-6 text-neutral-400" />
                        <h2 className="text-2xl font-light text-white">Skills</h2>
                    </div>
                    <span className="text-sm text-neutral-500 font-mono">// what i work with</span>
                </motion.div>

                {/* PROFICIENT */}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-xs text-neutral-500 uppercase tracking-widest font-medium block mb-4"
                >
                    Proficient
                </motion.span>

                {/* Desktop: two columns */}
                <div className="hidden md:grid md:grid-cols-2 gap-x-8 gap-y-2 mb-12">
                    {[leftCol, rightCol].map((col, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-2">
                            {col.map((skill, index) => {
                                const globalIndex = colIdx === 0 ? index : index + mid;
                                return (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.3 + globalIndex * 0.04 }}
                                        className="flex items-center gap-4"
                                    >
                                        <span className="text-sm text-neutral-300 w-28 shrink-0 text-right font-medium">
                                            {skill.name}
                                        </span>
                                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-neutral-600 rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 + globalIndex * 0.04 }}
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-500 w-8 tabular-nums">
                                            {skill.level}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Mobile: single column */}
                <div className="md:hidden flex flex-col gap-2 mb-12">
                    {proficient.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 + index * 0.04 }}
                            className="flex items-center gap-4"
                        >
                            <span className="text-sm text-neutral-300 w-28 shrink-0 text-right font-medium">
                                {skill.name}
                            </span>
                            <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-neutral-600 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 + index * 0.04 }}
                                />
                            </div>
                            <span className="text-xs text-neutral-500 w-8 tabular-nums">
                                {skill.level}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* FAMILIAR */}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + proficient.length * 0.04 }}
                    className="text-xs text-neutral-500 uppercase tracking-widest font-medium block mb-4"
                >
                    Familiar
                </motion.span>

                <div className="flex flex-wrap gap-2">
                    {familiar.map((tech, index) => (
                        <motion.span
                            key={tech}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 + proficient.length * 0.04 + index * 0.03 }}
                            className="px-3 py-1 text-xs font-medium text-neutral-400 bg-neutral-900/60 border border-neutral-800 rounded-full"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
