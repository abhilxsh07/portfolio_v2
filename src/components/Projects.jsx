import { motion } from "framer-motion";
import { IconCode, IconExternalLink } from "@tabler/icons-react";

import myUltronImg from "../assets/myUltron.webp";
import collabUltronImg from "../assets/CollabUltron.webp";
import portfolioImg from "../assets/Portfolio.webp";
import pyMySQLImg from "../assets/PyMySQL.webp";
import cImg from "../assets/C.webp";
import reflexImg from "../assets/reflex.webp";

const projects = [
    {
        title: "Hackathon Web Application",
        subtitle: "Ultron 9.0",
        tech: ["TypeScript", "React", "Tailwind", "Node", "PHP", "MySQL", "PDO", "OGL", "Vite"],
        description: "Full-stack hackathon platform for event management, team registration, and project submissions.",
        link: "https://github.com/abhilxsh07/futurixUltron9.0",
        image: myUltronImg,
        featured: true
    },
    {
        title: "Hackathon Web App (Collaborated)",
        subtitle: "Event Snapshot",
        tech: ["Next.js", "React", "TypeScript", "Tailwind", "PostCSS", "JS", "Radix", "Vite"],
        description: "Collaborative hackathon application built with a team, focused on accessibility and community engagement.",
        link: "https://github.com/Sharveswar007/ultron-futurix",
        image: collabUltronImg,
        featured: false
    },
    {
        title: "Portfolio Website (legacy)",
        tech: ["JSX", "CSS", "React", "WebGL", "Vite", "JS"],
        description: "Personal portfolio site with WebGL effects, terminal interface, and custom animations.",
        link: "https://github.com/abhilxsh07/webPortfolio-legacy",
        image: portfolioImg,
        featured: false
    },
    {
        title: "Student DB Manager",
        tech: ["Python", "MySQL"],
        description: "Database management tool for student records with CRUD operations and query interface.",
        link: "https://github.com/abhilxsh07/funny/blob/main/Python/studDatabase.py",
        image: pyMySQLImg,
        featured: false
    },
    {
        title: "Reflex Arc Demonstration",
        tech: ["BioTech"],
        description: "Interactive demonstration of the biological reflex arc mechanism for educational purposes.",
        link: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py",
        image: reflexImg,
        featured: false
    },

];

function ProjectCard({ project, index }) {
    const hasLink = !!project.link;
    const Wrapper = hasLink ? "a" : "div";
    const wrapperProps = hasLink
        ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
        >
            <Wrapper
                {...wrapperProps}
                className="group block bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-300 h-full"
            >
                {/* Preview Area */}
                <div className="h-40 bg-neutral-800/40 border-b border-neutral-800 flex items-center justify-center group-hover:bg-neutral-800/60 transition-colors relative overflow-hidden">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                    ) : (
                        <IconCode className="w-8 h-8 text-neutral-700" />
                    )}

                    {/* External link indicator */}
                    {hasLink && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconExternalLink className="w-4 h-4 text-neutral-500" />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-white font-mono">{project.title}</h3>

                    {/* Subtitle */}
                    {project.subtitle && (
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{project.subtitle}</p>
                    )}

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tech.map((t) => (
                            <span
                                key={t}
                                className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </Wrapper>
        </motion.div>
    );
}

export default function Projects() {
    return (
        <section id="projects" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
            <div className="max-w-6xl mx-auto">
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
                        <h2 className="text-2xl font-light text-white">Projects</h2>
                    </div>
                    <span className="text-sm text-neutral-500 font-mono">// things i've built</span>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
