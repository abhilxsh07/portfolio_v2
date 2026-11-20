import { copy } from "../data/copy";

export default function Copy({ k }) {
    const [page, key] = k.split(".");
    const text = copy[page][key];
    if (text !== null) return text;
    if (!import.meta.env.DEV) return null;
    return <span className="inline-block border border-dashed border-red-400 px-2 py-1 font-mono text-xs text-red-300">copy: {k}</span>;
}
