export default function MarkdownBody({ html, as: Tag = "div" }) {
    return (
        <Tag
            className="space-y-4 break-words leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-green-400 [&_h2]:font-mono [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
