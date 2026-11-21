import Copy from "./Copy";

export default function NotFound() {
    return (
        <section className="relative z-10 px-6 md:px-16 lg:px-24 py-32 min-h-[60vh]">
            <div className="max-w-5xl mx-auto">
                {import.meta.env.NOT_FOUND_DRAWING_READY && (
                    <img src="/drawings/not-found.svg" alt="" className="mb-6 max-w-60" />
                )}
                <p className="mb-4 font-mono text-xs text-pencil">404</p>
                <h1 className="font-serif text-4xl text-paper md:text-5xl"><Copy k="notFound.title" /></h1>
                <p className="mt-4 text-sm text-neutral-400"><Copy k="notFound.body" /></p>
                <a href="/" className="mt-2 inline-flex min-h-11 items-center text-sm text-green-400 hover:underline">
                    Back to the start
                </a>
            </div>
        </section>
    );
}
