import { motion } from "framer-motion";

const skillCategories = [
    {
        category: "Languages",
        skills: [ "Python", "C/C++", "JavaScript", "TypeScript", "SQL", "Java", "PHP"]
    },
    {
        category: "Frontend",
        skills: ["React", "Next.js", "HTML/CSS", "Tailwind CSS", "WebGL/OGL", "GSAP"]
    },
    {
        category: "Backend",
        skills: [ "Node.js", "Express", "Django/Flask", "gRPC","Spark"]
    },
    {
        category: "Databases",
        skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"]
    },
    {
        category: "DevOps",
        skills: ["Docker", "Kubernetes", "AWS", "Git", "GitHub"]
    },
    {
        category: "Other",
        skills: ["REST", "Microservices", "System Design", "LangChain", "NumPy/Pandas", "Vite", "MATLAB"]
    }
];

export default function Skills() {
    return (
        <section id="skills" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
            <div className="max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-xs text-neutral-500 uppercase tracking-widest font-medium font-mono block mb-10"
                >
                    // tech stack
                </motion.span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((cat, catIdx) => (
                        <motion.div
                            key={cat.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: catIdx * 0.08 }}
                            className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors"
                        >
                            <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium font-mono block mb-3">
                                {cat.category}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
