import {
    profile,
    projects,
    builtWith,
    alsoUse,
    learning,
    experience,
    getProject,
    contactLinks
} from "../data/portfolio.js";

const line = (text, color = "text-neutral-300", href = null) => ({ text, color, href });

export function getPortfolioOutput(command) {
    switch (command) {
        case "about":
            return [
                line(`${profile.name} — ${profile.role}`, "text-green-400"),
                line(profile.intro),
                line(profile.context),
                line(profile.proof)
            ];
        case "skills":
            return [
                line("Built with", "text-green-400"),
                ...builtWith.map(({ projectId, skills }) =>
                    line(
                        `  ${skills.join(" · ")} → ${getProject(projectId).title}`,
                        "text-neutral-300",
                        `#${projectId}`
                    )
                ),
                line("Also use", "text-green-400"),
                line(alsoUse.join(" · ")),
                line("Learning", "text-green-400"),
                line(learning.join(" · "))
            ];
        case "projects":
            return [
                ...projects.flatMap((project) => [
                    line(`${project.title} / ${project.status}`, "text-green-400", `#${project.id}`),
                    line(`  ${project.role}`),
                    line(`  ${project.tech.join(" · ")}`, "text-neutral-400"),
                    ...(project.liveUrl ? [line("  Live app ↗", "text-green-400", project.liveUrl)] : []),
                    ...(project.repoUrl ? [line("  Source ↗", "text-neutral-300", project.repoUrl)] : [])
                ]),
                line(
                    `Total: ${projects.length} projects (including earlier work and on-hold projects)`,
                    "text-green-400"
                )
            ];
        case "experience":
            return experience.flatMap((entry) => [
                line(`${entry.title} / ${entry.company}`, "text-green-400"),
                line(entry.date || entry.status),
                line(entry.description, "text-neutral-400")
            ]);
        case "contact":
            return contactLinks.map((link) => line(link.label, "text-neutral-300", link.href));
        case "cat resume.txt":
            return [
                line(`${profile.name} — ${profile.role}`, "text-green-400"),
                line(profile.location),
                line(profile.intro),
                ...experience.map((entry) => line(`${entry.title} / ${entry.company} / ${entry.date || entry.status}`)),
                line("Full résumé ↗", "text-green-400", profile.resume)
            ];
        default:
            return null;
    }
}
