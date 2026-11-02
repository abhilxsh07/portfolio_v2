// What I did and one concrete result, so nobody has to open the case study to find out.
export default function Contribution({ project, className = "" }) {
    return (
        <dl className={`space-y-2 text-sm leading-relaxed ${className}`}>
            <div className="grid sm:grid-cols-[5rem_minmax(0,1fr)] gap-0.5 sm:gap-3">
                <dt className="font-mono text-xs text-neutral-400 pt-0.5">my part</dt>
                <dd className="text-neutral-200">{project.role}</dd>
            </div>
            {project.proof && (
                <div className="grid sm:grid-cols-[5rem_minmax(0,1fr)] gap-0.5 sm:gap-3">
                    <dt className="font-mono text-xs text-neutral-400 pt-0.5">outcome</dt>
                    <dd className="text-neutral-300">{project.proof}</dd>
                </div>
            )}
        </dl>
    );
}
