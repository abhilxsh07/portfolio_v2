export default function SectionHeading({ title, note, as: Heading = "h2" }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <Heading className="text-2xl md:text-3xl font-light text-white">{title}</Heading>
            {note && <span className="text-sm text-neutral-400">{note}</span>}
        </div>
    );
}
