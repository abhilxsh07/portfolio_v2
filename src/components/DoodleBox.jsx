import { lazy, Suspense, useEffect, useRef, useState } from "react";

const DoodleCanvas = lazy(() => import("./DoodleCanvas"));

export default function DoodleBox({ showSlots }) {
    const box = useRef(null);
    const [near, setNear] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            setNear(true);
        }, { rootMargin: "200px" });
        observer.observe(box.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={box} aria-labelledby="doodle-box-title" className="mt-9">
            <h2 id="doodle-box-title" className="mb-3 font-serif text-2xl italic text-paper">Doodle box</h2>
            <div className="min-h-[240px] md:min-h-[320px]">
                {near && <Suspense fallback={null}><DoodleCanvas showSlots={showSlots} /></Suspense>}
            </div>
        </section>
    );
}
