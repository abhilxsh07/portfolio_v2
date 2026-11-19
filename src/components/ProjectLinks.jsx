import { IconArrowUpRight, IconBrandGithub, IconDownload } from "@tabler/icons-react";

export default function ProjectLinks({ project }) {
    return (
        <div className="flex flex-wrap gap-x-5 text-xs font-mono">
            {project.liveUrl && (
                <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} live app`}
                    className="min-h-11 inline-flex items-center gap-1.5 text-green-400 hover:underline"
                >
                    Live app <IconArrowUpRight size={15} aria-hidden="true" />
                </a>
            )}
            {project.downloadUrl && (
                <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${project.title}`}
                    className="min-h-11 inline-flex items-center gap-1.5 text-green-400 hover:underline"
                >
                    Download <IconDownload size={15} aria-hidden="true" />
                </a>
            )}
            {project.repoUrl && (
                <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code`}
                    className="min-h-11 inline-flex items-center gap-1.5 text-neutral-300 hover:text-white hover:underline"
                >
                    Source <IconBrandGithub size={15} aria-hidden="true" />
                </a>
            )}
        </div>
    );
}
