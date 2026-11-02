// Short version of a walkthrough: a few stages in a row, then the side paths.
// Under 700px it stacks into a plain list so nothing needs zooming or panning.
export default function FlowSteps({ label, steps, branchesLabel, branches = [], accent = "text-green-400" }) {
    return (
        <figure>
            <figcaption className="font-mono text-xs text-neutral-400 mb-3">{label}</figcaption>
            <ol
                className="grid gap-6 min-[700px]:gap-5 min-[700px]:grid-cols-[repeat(var(--steps),minmax(0,1fr))]"
                style={{ "--steps": steps.length }}
            >
                {steps.map((step, index) => (
                    <li key={step.title} className="relative rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
                        <span className={`font-mono text-xs ${accent}`}>{String(index + 1).padStart(2, "0")}</span>
                        <p className="text-white text-base min-[700px]:text-sm mt-1">{step.title}</p>
                        <p className="text-[15px] min-[700px]:text-[13px] text-neutral-400 leading-relaxed mt-2">{step.text}</p>
                        {index < steps.length - 1 && (
                            <span
                                aria-hidden="true"
                                className="absolute left-6 -bottom-[22px] rotate-90 min-[700px]:rotate-0 min-[700px]:left-auto min-[700px]:bottom-auto min-[700px]:-right-[17px] min-[700px]:top-1/2 min-[700px]:-translate-y-1/2 text-neutral-400"
                            >
                                →
                            </span>
                        )}
                    </li>
                ))}
            </ol>
            {branches.length > 0 && (
                <>
                    <p className="font-mono text-xs text-neutral-400 mt-6 mb-3">{branchesLabel}</p>
                    <ul className="grid gap-3 min-[700px]:grid-cols-3">
                        {branches.map((branch) => (
                            <li key={branch.title} className="rounded-lg border border-dashed border-neutral-700 p-4">
                                <p className="text-white text-base min-[700px]:text-sm">{branch.title}</p>
                                <p className="text-[15px] min-[700px]:text-[13px] text-neutral-400 leading-relaxed mt-2">{branch.text}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </figure>
    );
}
