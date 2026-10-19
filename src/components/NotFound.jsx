export default function NotFound() {
    return (
        <section className="relative z-10 px-6 md:px-16 lg:px-24 py-32 min-h-[60vh]">
            <div className="max-w-5xl mx-auto">
                <p className="text-xs text-green-400 font-mono mb-4">404</p>
                <h1 className="text-3xl md:text-4xl font-light text-white">That page doesn't exist.</h1>
                <p className="text-sm text-neutral-400 mt-4">
                    Maybe it moved when the site got split into pages.{" "}
                    <a href="/" className="text-green-400 hover:underline">
                        Back to the start
                    </a>
                    .
                </p>
            </div>
        </section>
    );
}
