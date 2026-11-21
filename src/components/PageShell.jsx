import Copy from "./Copy";
import SectionHeading from "./SectionHeading";

export default function PageShell({ title, intro, beforeTitle, headingColor = "text-paper", children }) {
    return (
        <section className="relative z-10 px-6 pb-20 pt-28 md:px-16">
            <div className="mx-auto max-w-3xl">
                {beforeTitle}
                <SectionHeading as="h1" title={title} headingClass={`font-mono ${headingColor}`} />
                {intro && (
                    <div className="mb-8 max-w-2xl border-l-2 border-pencil/50 pl-4">
                        <p className="text-sm leading-relaxed text-neutral-300 md:text-base"><Copy k={intro} /></p>
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
