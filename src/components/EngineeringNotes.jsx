const packages = [
    ["nanoid", "3.3.15", "3.3.20"],
    ["postcss", "8.5.16", "8.5.31"],
    ["source-map-js", "1.2.1", "1.2.2"]
];

export default function EngineeringNotes() {
    return (
        <details id="portfolio-audit" className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <summary className="cursor-pointer px-6 py-5 text-sm text-neutral-200 font-mono hover:text-white">
                Portfolio engineering notes{" "}
                <span className="block sm:inline text-xs text-neutral-400 sm:ml-3 mt-2 sm:mt-0">
                    Dependency audit · 3 → 0 · 19 Oct 2026
                </span>
            </summary>
            <div className="px-6 pb-7 space-y-6">
                <div className="grid md:grid-cols-2 gap-7">
                    <div>
                        <h3 className="text-base text-white mb-3">Dependency cleanup</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            Removed ten unused packages and switched animation imports to motion/react.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm text-white mb-3">What the audit found</h4>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            A production dependency audit found three affected packages. Updating nanoid, PostCSS, and
                            source-map-js cleared those advisories.
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <caption className="sr-only">
                            Dependency versions before and after the 19 October 2026 audit fixes
                        </caption>
                        <thead className="text-neutral-400">
                            <tr>
                                <th scope="col" className="py-3 pr-4 font-normal">
                                    Package
                                </th>
                                <th scope="col" className="py-3 pr-4 font-normal">
                                    Before
                                </th>
                                <th scope="col" className="py-3 font-normal">
                                    After
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(([name, before, after]) => (
                                <tr key={name} className="border-t border-neutral-800">
                                    <th scope="row" className="py-3 pr-4 text-neutral-200 font-normal">
                                        {name}
                                    </th>
                                    <td className="py-3 pr-4 text-neutral-400">{before}</td>
                                    <td className="py-3 text-green-400">{after}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4 className="text-sm text-white mb-3">Beyond the dependency count</h4>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        The maintenance pass also fixes a leaked resize listener, sends the form's honeypot field,
                        narrows the game's iframe permissions, restores keyboard focus, and respects reduced motion. The
                        audit covers dependencies, not the whole application.
                    </p>
                </div>
                <div className="flex flex-wrap gap-5 text-xs font-mono">
                    <a
                        href="/engineering/dependency-audit-2026-10-19.json"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                    >
                        Audit evidence (JSON) ↗
                    </a>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                    Scope: npm production dependency advisories, checked on 19 October 2026. Results can change as
                    advisories are published.
                </p>
            </div>
        </details>
    );
}
