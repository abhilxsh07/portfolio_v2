import Copy from "./Copy";
import SectionHeading from "./SectionHeading";

export default function PageShell({ title, intro, children }) {
    return (
        <section className="relative z-10 px-6 pb-20 pt-28 md:px-16">
            <div className="mx-auto max-w-3xl">
                <SectionHeading as="h1" title={title} headingClass="font-mono" />
                {intro && (
                    <div className="mb-10 max-w-2xl border-l-2 border-green-400/60 pl-5">
                        <p className="text-sm leading-relaxed text-neutral-300 md:text-base"><Copy k={intro} /></p>
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
