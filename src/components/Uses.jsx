import { uses } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Uses() {
    return (
        <section id="uses" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading as="h1" title="Uses" />
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl -mt-4 mb-12">
                    The hardware and tools I actually use day to day.
                </p>
                <div className="space-y-12">
                    {uses.map(({ heading, items }) => (
                        <div key={heading} className="grid md:grid-cols-[170px_1fr] gap-3 md:gap-6">
                            <h2 className="font-mono text-sm text-green-400">{heading}</h2>
                            <ul className="space-y-3 max-w-2xl">
                                {items.map((item) => (
                                    <li key={item} className="text-sm text-neutral-300 leading-relaxed">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
