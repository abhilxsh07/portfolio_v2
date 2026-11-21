import Copy from "./Copy";
import MarkdownBody from "./MarkdownBody";
import PageShell from "./PageShell";
import colophon from "../generated/colophon.json";

export default function Colophon({ showSlots }) {
    return (
        <PageShell title="Colophon">
            {colophon.html !== null ? <MarkdownBody html={colophon.html} /> : showSlots ? <Copy k="colophon.body" /> : (
                <dl className="border-t border-pencil/25 pt-4">
                    <dt className="font-serif text-xl italic text-paper">Built with</dt>
                    <dd className="mt-2 text-sm text-neutral-300">React, Vite, Tailwind CSS and Motion</dd>
                </dl>
            )}
        </PageShell>
    );
}
