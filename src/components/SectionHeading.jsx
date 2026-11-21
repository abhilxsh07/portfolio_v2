export default function SectionHeading({ title, note, as: Heading = "h2", headingClass = "font-serif text-paper" }) {
    const size = Heading === "h1" ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl";
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <Heading className={`${size} font-normal tracking-tight ${headingClass}`}>{title}</Heading>
            {note && <span className="text-sm text-neutral-400">{note}</span>}
        </div>
    );
}
