import { lazy, Suspense, useEffect, useRef, useState } from "react";

const DoodleCanvas = lazy(() => import("./DoodleCanvas"));

export default function DoodleBox() {
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
        <div ref={box} className="mt-14 min-h-[240px] md:min-h-[320px]">
            {near && <Suspense fallback={null}><DoodleCanvas /></Suspense>}
        </div>
    );
}
