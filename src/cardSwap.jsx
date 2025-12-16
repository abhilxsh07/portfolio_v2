import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useEffect,
    useMemo,
    useRef
} from 'react';
import gsap from 'gsap';
import './cardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
    <div
        ref={ref}
        {...rest}
        className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
});

const placeNow = (el, slot, skew) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });

const CardSwap = ({
                      width = 500,
                      height = 400,
                      cardDistance = 60,
                      verticalDistance = 70,
                      delay = 5000,
                      pauseOnHover = false,
                      onCardClick,
                      skewAmount = 6,
                      easing = 'elastic',
                      children
                  }) => {
    const config =
        easing === 'elastic'
            ? {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 2,
                durMove: 2,
                durReturn: 2
            }
            : {
                ease: 'power1.inOut',
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8
            };

    // NEW: use a smaller, height-based drop distance instead of 500px
    const dropDistance = Math.min(height * 0.45, 220);

    const childArr = useMemo(() => Children.toArray(children), [children]);

    const refs = useMemo(
        () => childArr.map(() => React.createRef()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [childArr.length]
    );

    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef(null);
    const timeoutRef = useRef(null);
    const container = useRef(null);
    const hoverPaused = useRef(false);

    useEffect(() => {
        const total = refs.length;
        if (!total) return;

        refs.forEach((r, i) => {
            if (r.current) {
                placeNow(
                    r.current,
                    makeSlot(i, cardDistance, verticalDistance, total),
                    skewAmount
                );
            }
        });

        const clearTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        const scheduleNext = () => {
            clearTimer();
            timeoutRef.current = window.setTimeout(runSwap, delay);
        };

        const runSwap = () => {
            if (order.current.length < 2) {
                scheduleNext();
                return;
            }

            const [front, ...rest] = order.current;
            const elFront = refs[front].current;
            if (!elFront) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    order.current = [...rest, front];
                    if (!hoverPaused.current) {
                        scheduleNext();
                    }
                }
            });

            tlRef.current = tl;

            const backSlot = makeSlot(
                total - 1,
                cardDistance,
                verticalDistance,
                total
            );

            // 1) Drop front card down by the smaller dropDistance
            tl.to(elFront, {
                y: `+=${dropDistance}`,
                duration: config.durDrop,
                ease: config.ease
            });

            // 2) Move the remaining cards into position
            rest.forEach((idx, i) => {
                const el = refs[idx].current;
                if (!el) return;
                const slot = makeSlot(
                    i,
                    cardDistance,
                    verticalDistance,
                    total
                );

                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        zIndex: slot.zIndex,
                        duration: config.durMove,
                        ease: config.ease
                    },
                    '<'
                );
            });

            // 3) Put front card at the back slot and bring it up from just below
            tl.set(elFront, {
                x: backSlot.x,
                y: backSlot.y + dropDistance,
                z: backSlot.z,
                zIndex: backSlot.zIndex
            });

            tl.to(elFront, {
                y: backSlot.y,
                duration: config.durReturn,
                ease: config.ease
            });
        };

        scheduleNext();

        let node;
        const handleEnter = () => {
            if (!pauseOnHover) return;
            hoverPaused.current = true;
            tlRef.current?.pause();
            clearTimer();
        };

        const handleLeave = () => {
            if (!pauseOnHover) return;
            hoverPaused.current = false;
            tlRef.current?.play();
            scheduleNext();
        };

        if (pauseOnHover && container.current) {
            node = container.current;
            node.addEventListener('mouseenter', handleEnter);
            node.addEventListener('mouseleave', handleLeave);
        }

        return () => {
            if (node) {
                node.removeEventListener('mouseenter', handleEnter);
                node.removeEventListener('mouseleave', handleLeave);
            }
            clearTimer();
            tlRef.current?.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, dropDistance]);

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: e => {
                    child.props.onClick?.(e);
                    onCardClick?.(i);
                }
            })
            : child
    );

    return (
        <div
            ref={container}
            className="card-swap-container"
            style={{ width, height }}
        >
            {rendered}
        </div>
    );
};

export default CardSwap;
