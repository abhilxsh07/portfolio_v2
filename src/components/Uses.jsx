import { legacyUses, usesIntro } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Uses() {
    return (
        <section id="uses" className="relative z-10 px-6 md:px-16 lg:px-24 py-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeading as="h1" title="Uses" />
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl -mt-4 mb-12">
                    {usesIntro}
                </p>
                <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                    {legacyUses.map(({ heading, items }) => (
                        <section key={heading} className="grid gap-3 py-6 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6">
                            <h2 className="font-serif text-xl italic text-paper">{heading}</h2>
                            <ul className="space-y-3 max-w-2xl">
                                {items.map((item) => (
                                    <li key={item} className="text-sm text-neutral-300 leading-relaxed">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </section>
    );
}
