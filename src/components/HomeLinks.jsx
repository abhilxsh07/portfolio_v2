import { experience, builtWith } from "../data/portfolio";

const stack = [...new Set(builtWith.flatMap(({ skills }) => skills))].slice(0, 6);

const cards = [
    {
        href: "/work",
        title: "Work",
        text: "sable, Cursus, and a few smaller projects."
    },
    { href: "/stack", title: "Stack", text: `${stack.join(", ")}, and where I've used them.` },
    { href: "/experience", title: "Experience", text: experience.map((entry) => entry.company).join(" · ") }
];

export default function HomeLinks() {
    return (
        <section aria-label="Around the site" className="relative z-10 px-6 md:px-16 lg:px-24 pb-24">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <a
                        key={card.href}
                        href={card.href}
                        className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 hover:border-neutral-600 transition-colors"
                    >
                        <span className="flex items-baseline justify-between gap-3">
                            <span className="text-lg text-white font-mono">{card.title}</span>
                            <span
                                aria-hidden="true"
                                className="text-neutral-500 group-hover:text-green-400 transition-colors"
                            >
                                →
                            </span>
                        </span>
                        <span className="block text-sm text-neutral-400 leading-relaxed mt-3">{card.text}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
