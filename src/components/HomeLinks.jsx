import { IconArrowRight } from "@tabler/icons-react";
import { experience, builtWith } from "../data/portfolio";

const stack = [...new Set(builtWith.flatMap(({ skills }) => skills))].slice(0, 6);

const links = [
    { href: "/uses#stack", title: "Stack", text: `${stack.join(", ")}, and where I've used them.` },
    { href: "/work#experience", title: "Experience", text: experience.map((entry) => entry.company).join(" · ") }
];

export default function HomeLinks() {
    return (
        <nav aria-label="Around the site" className="relative z-10 px-6 pb-16 md:px-16 lg:px-24">
            <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-4 sm:grid-cols-2">
                {links.map(({ href, title, text }) => (
                    <a key={href} href={href} className="group block border-t border-neutral-800 py-4">
                        <span className="flex items-center gap-3 font-serif text-xl text-paper">
                            {title} <IconArrowRight size={16} aria-hidden="true" className="text-neutral-400 group-hover:text-green-400" />
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-neutral-400">{text}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
