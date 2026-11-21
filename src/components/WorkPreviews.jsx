import { IconArrowRight } from "@tabler/icons-react";
import { getProject } from "../data/portfolio";
import sableReader from "../assets/sable/reader-night-default.webp";

const sable = getProject("sable");
const cursus = getProject("cursus");

export default function WorkPreviews() {
    return (
        <section aria-labelledby="work-preview-heading" className="relative z-10 px-6 pb-14 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-5 border-t border-pencil/25 pt-4">
                    <h2 id="work-preview-heading" className="font-serif text-3xl text-paper">Selected work</h2>
                    <a href="/work" className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-300 hover:text-green-400">
                        All projects <IconArrowRight size={15} aria-hidden="true" />
                    </a>
                </div>
                <article className="grid items-center gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8">
                    <img
                        src={sableReader}
                        width={1600}
                        height={860}
                        loading="lazy"
                        alt="sable showing a document with the default dark night filter"
                        className="w-full rounded-lg border border-neutral-700"
                    />
                    <div>
                        <p className="font-mono text-xs text-pencil">{sable.status}</p>
                        <h3 className="mt-2 font-serif text-4xl text-paper">{sable.title}</h3>
                        <p className="mt-2 text-base text-neutral-200">{sable.subtitle}</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-400">C++/WinRT, WinUI 3 and PDFium</p>
                        <a href="/work#sable" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-green-400 hover:underline">
                            Inside sable <IconArrowRight size={15} aria-hidden="true" />
                        </a>
                    </div>
                </article>
                <article className="mt-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-y border-neutral-800 py-4">
                    <div className="max-w-xl">
                        <h3 className="inline font-serif text-2xl text-paper">{cursus.title}</h3>
                        <span className="ml-3 font-mono text-xs text-neutral-400">{cursus.status}</span>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-300">{cursus.subtitle}</p>
                    </div>
                    <a href="/work#cursus" className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-300 hover:text-green-400">
                        Read the Cursus case study <IconArrowRight size={15} aria-hidden="true" />
                    </a>
                </article>
            </div>
        </section>
    );
}
