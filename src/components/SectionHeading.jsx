export default function SectionHeading({ title, note }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-light text-white">{title}</h2>
            <span className="text-xs text-neutral-400 font-mono">// {note}</span>
        </div>
    );
}
