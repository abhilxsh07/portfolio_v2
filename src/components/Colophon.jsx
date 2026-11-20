import Copy from "./Copy";
import MarkdownBody from "./MarkdownBody";
import PageShell from "./PageShell";
import colophon from "../generated/colophon.json";

export default function Colophon() {
    return (
        <PageShell title="Colophon">
            {colophon.html === null ? <Copy k="colophon.body" /> : <MarkdownBody html={colophon.html} />}
        </PageShell>
    );
}
