import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export const ChromaGrid = ({
                               items,
                               className = '',
                               radius = 300,
                               columns = 3,
                               rows = 2,
                               gap = 32,
                               damping = 0.45,
                               fadeOut = 0.6,
                               ease = 'power3.out'
                           }) => {
    const rootRef = useRef(null);
    const fadeRef = useRef(null);
    const setX = useRef(null);
    const setY = useRef(null);
    const pos = useRef({ x: 0, y: 0 });


    const data = items?.length ? items : demo;

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px');
        setY.current = gsap.quickSetter(el, '--y', 'px');
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        let raf = 0;

        const syncHeights = () => {
            const cards = Array.from(el.querySelectorAll('.chroma-card'));
            if (!cards.length) return;

            cards.forEach(c => {
                c.style.height = 'auto';
            });

            const maxH = Math.max(...cards.map(c => c.offsetHeight));
            el.style.setProperty('--card-h', `${maxH}px`);
        };

        const run = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(syncHeights);
        };

        const imgs = Array.from(el.querySelectorAll('img'));
        const waitForImgs = Promise.all(
            imgs.map(img => (img.complete ? Promise.resolve() : new Promise(res => img.addEventListener('load', res, { once: true }))))
        );

        waitForImgs.then(run);
        window.addEventListener('resize', run);

        return () => {
            window.removeEventListener('resize', run);
            cancelAnimationFrame(raf);
        };
    }, [data.length, columns, rows, gap]);

    const moveTo = (x, y) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true
        });
    };

    const handleMove = e => {
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 1,
            duration: fadeOut,
            overwrite: true
        });
    };

    const handleCardClick = url => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCardMove = e => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={rootRef}
            className={`chroma-grid ${className}`}
            style={{
                '--r': `${radius}px`,
                '--cols': columns,
                '--rows': rows,
                '--gap': typeof gap === 'number' ? `${gap}px` : gap
            }}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
        >
            {data.map((c, i) => (
                <article
                    key={i}
                    className="chroma-card"
                    onMouseMove={handleCardMove}
                    onClick={() => handleCardClick(c.url)}
                    style={{
                        '--card-border': c.borderColor || 'transparent',
                        '--card-gradient': c.gradient,
                        cursor: c.url ? 'pointer' : 'default'
                    }}
                >
                    <div className="chroma-img-wrapper">
                        <img src={c.image} alt={c.title} loading="lazy" />
                    </div>
                    <footer className="chroma-info">
                        <h3 className="name">{c.title}</h3>
                        {c.handle && <span className="handle">{c.handle}</span>}
                        <p className="role">{c.subtitle}</p>
                        {c.location && <span className="location">{c.location}</span>}
                    </footer>
                </article>
            ))}
            <div className="chroma-overlay" />
            <div ref={fadeRef} className="chroma-fade" />
        </div>
    );
};

export default ChromaGrid;
