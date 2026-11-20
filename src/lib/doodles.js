import Matter from "matter-js";

const { Bodies, Body, Composite, Engine, Events, Runner, Sleeping } = Matter;
const storageKey = "blog-doodles:v1";
const maxDoodles = 40;
const pause = 700;
const thickness = 2.5;

function readDoodles() {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        return Array.isArray(stored) ? stored.slice(-maxDoodles).filter((item) => Array.isArray(item?.strokes)) : [];
    } catch {
        return [];
    }
}

function writeDoodles(entries) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {
        // Drawing still works when storage is blocked.
    }
}

function simplify(points) {
    if (points.length < 3) return points;
    const [x, y] = points[0];
    const last = points.at(-1);
    const dx = last[0] - x;
    const dy = last[1] - y;
    const length = dx * dx + dy * dy;
    let index = 0;
    let distance = 1.5 ** 2;
    for (let i = 1; i < points.length - 1; i++) {
        const [px, py] = points[i];
        const t = length ? Math.max(0, Math.min(1, ((px - x) * dx + (py - y) * dy) / length)) : 0;
        const error = (px - x - t * dx) ** 2 + (py - y - t * dy) ** 2;
        if (error > distance) {
            index = i;
            distance = error;
        }
    }
    return index ? [...simplify(points.slice(0, index)).slice(0, -1), ...simplify(points.slice(index))] : [points[0], last];
}

function makeBody(strokes, width) {
    const parts = [];
    for (const stroke of strokes) {
        const [first, ...points] = simplify(stroke);
        if (!points.length) {
            parts.push(Bodies.circle(first[0], first[1], (first[2] ?? width) / 2));
            continue;
        }
        let previous = first;
        for (const point of points) {
            const [x, y, weight = width] = point;
            const [px, py, previousWeight = width] = previous;
            const thickness = (weight + previousWeight) / 2;
            parts.push(Bodies.rectangle(
                (x + px) / 2,
                (y + py) / 2,
                Math.hypot(x - px, y - py) + thickness,
                thickness,
                { angle: Math.atan2(y - py, x - px) }
            ));
            previous = point;
        }
    }
    return Body.create({ parts, friction: .65, restitution: .1, sleepThreshold: 35 });
}

export function startDoodles(canvas, setCount, reduced) {
    const context = canvas.getContext("2d");
    const engine = Engine.create({ enableSleeping: true });
    const runner = Runner.create();
    const floor = new Image();
    const controller = new AbortController();
    const saved = new Map(readDoodles().map((entry) => [entry.id, entry]));
    const doodles = [];
    const fades = [];
    let walls = [];
    let box = { width: 0, height: 0, scale: 1 };
    let group = null;
    let stroke = null;
    let timer;
    let fadeFrame;
    let running = false;
    let stepping = false;

    function drawStrokes(strokes, ink, width) {
        context.strokeStyle = ink;
        context.fillStyle = ink;
        context.lineCap = "round";
        for (const points of strokes) {
            const [[x, y, weight = width]] = points;
            if (points.length === 1) {
                context.beginPath();
                context.arc(x, y, weight / 2, 0, Math.PI * 2);
                context.fill();
                continue;
            }
            for (let index = 1; index < points.length; index++) {
                const [px, py, before = width] = points[index - 1];
                const [nx, ny, after = width] = points[index];
                context.lineWidth = (before + after) / 2;
                context.beginPath();
                context.moveTo(px, py);
                context.lineTo(nx, ny);
                context.stroke();
            }
        }
    }

    function draw() {
        const { width, height, scale } = box;
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.clearRect(0, 0, width, height);
        if (floor.complete && floor.naturalWidth) context.drawImage(floor, 0, height - 36, width, 36);
        const now = performance.now();
        for (const item of [...doodles, ...fades]) {
            const { body, ink, width, strokes, fadedAt } = item;
            context.save();
            if (fadedAt !== undefined) context.globalAlpha = Math.max(0, 1 - (now - fadedAt) / 250);
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            drawStrokes(strokes, ink, width);
            context.restore();
        }
        if (group) drawStrokes(group.strokes, group.ink, thickness);
    }

    function clamp(item) {
        const { body } = item;
        const { min, max } = body.bounds;
        const w = max.x - min.x;
        const h = max.y - min.y;
        const scale = Math.min(1, (box.width - 2) / w, (box.height - 12) / h);
        if (scale < 1) {
            Body.scale(body, scale, scale);
            item.strokes = item.strokes.map((stroke) => stroke.map(([x, y, width = item.width]) => [x * scale, y * scale, width * scale]));
            item.width *= scale;
        }
        const bounds = body.bounds;
        Body.translate(body, {
            x: Math.max(1 - bounds.min.x, Math.min(0, box.width - 1 - bounds.max.x)),
            y: Math.max(1 - bounds.min.y, Math.min(0, box.height - 10 - bounds.max.y))
        });
    }

    function resize() {
        const { width, height } = canvas.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;
        if (!width || !height || (width === box.width && height === box.height && scale === box.scale)) return;
        const previous = box;
        box = { width, height, scale };
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        Composite.remove(engine.world, walls);
        walls = [
            Bodies.rectangle(width / 2, height + 10, width + 80, 40, { isStatic: true }),
            Bodies.rectangle(-20, height / 2, 40, height * 2, { isStatic: true }),
            Bodies.rectangle(width + 20, height / 2, 40, height * 2, { isStatic: true })
        ];
        Composite.add(engine.world, walls);
        for (const item of doodles) {
            const { body } = item;
            Body.setPosition(body, { x: body.position.x * width / previous.width, y: body.position.y + height - previous.height });
            clamp(item);
        }
        draw();
    }

    function restore(entry, first = false) {
        const body = makeBody(entry.strokes, entry.width);
        Body.setAngle(body, entry.angle);
        const y = entry.y ?? box.height - 10 - (body.bounds.max.y - body.position.y);
        Body.setPosition(body, { x: entry.x * box.width, y });
        const item = { ...entry, body, first };
        clamp(item);
        Sleeping.set(body, true);
        Composite.add(engine.world, body);
        if (first) doodles.unshift(item);
        else doodles.push(item);
    }

    function animateFade() {
        draw();
        while (fades.length && performance.now() - fades[0].fadedAt >= 250) fades.shift();
        fadeFrame = fades.length ? requestAnimationFrame(animateFade) : undefined;
    }

    function persist() {
        writeDoodles([...saved.values()].sort((a, b) => a.createdAt - b.createdAt));
    }

    function settle() {
        let changed = false;
        for (const item of doodles) {
            if (item.first || !item.body.isSleeping) continue;
            clamp(item);
            const { id, ink, width, strokes, body, createdAt } = item;
            const x = body.position.x / box.width;
            const y = body.position.y;
            const angle = body.angle;
            const previous = saved.get(id);
            if (previous?.x === x && previous.y === y && previous.angle === angle && previous.width === width) continue;
            saved.set(id, { id, ink, width, strokes, x, y, angle, createdAt });
            changed = true;
        }
        while (saved.size > maxDoodles) {
            const oldest = [...saved.values()].reduce((a, b) => a.createdAt <= b.createdAt ? a : b);
            saved.delete(oldest.id);
            const item = doodles.splice(doodles.findIndex(({ id }) => id === oldest.id), 1)[0];
            Composite.remove(engine.world, item.body);
            if (!reduced()) {
                fades.push({ ...item, fadedAt: performance.now() });
                if (!fadeFrame) fadeFrame = requestAnimationFrame(animateFade);
            }
            setCount(doodles.length);
        }
        if (changed) persist();
        if (running && doodles.every(({ body }) => body.isSleeping)) {
            Runner.stop(runner);
            running = false;
        }
        draw();
    }

    function afterUpdate() {
        if (!stepping) settle();
    }

    function drop() {
        if (!group) return;
        const { ink, strokes } = group;
        group = null;
        const body = makeBody(strokes, thickness);
        const relative = strokes.map((stroke) => stroke.map(([x, y, width]) => [x - body.position.x, y - body.position.y, width]));
        const item = { id: crypto.randomUUID(), ink, strokes: relative, width: thickness, body, first: false, createdAt: Date.now() };
        clamp(item);
        doodles.push(item);
        Composite.add(engine.world, body);
        setCount(doodles.length);
        if (reduced()) {
            stepping = true;
            for (let i = 0; i < 200; i++) Engine.update(engine, 1000 / 60);
            for (const { body } of doodles) Sleeping.set(body, true);
            stepping = false;
            settle();
        } else if (!running) {
            running = true;
            Runner.run(runner, engine);
        }
        draw();
    }

    function point(event) {
        const rect = canvas.getBoundingClientRect();
        const width = event.pointerType === "pen" || event.pointerType === "touch" ? Math.max(.9, event.pressure * 5) : thickness;
        return [
            Math.max(0, Math.min(box.width, event.clientX - rect.left)),
            Math.max(0, Math.min(box.height - 10, event.clientY - rect.top)),
            width
        ];
    }

    floor.onload = draw;
    floor.src = "/drawings/floor.svg";
    resize();
    for (const entry of saved.values()) restore(entry);
    setCount(doodles.length);
    draw();
    fetch("/drawings/first-doodle.json", { signal: controller.signal })
        .then((response) => response.ok ? response.json() : null)
        .then((entry) => {
            if (!entry || controller.signal.aborted) return;
            restore(entry, true);
            setCount(doodles.length);
            draw();
        }, () => {});

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    Events.on(engine, "afterUpdate", afterUpdate);
    return {
        begin(event, ink) {
            if (stroke) return;
            clearTimeout(timer);
            group ??= { ink, strokes: [] };
            const points = [point(event)];
            group.strokes.push(points);
            stroke = { id: event.pointerId, points };
            canvas.setPointerCapture(event.pointerId);
            draw();
        },
        move(event) {
            if (stroke?.id !== event.pointerId) return;
            const next = point(event);
            const last = stroke.points.at(-1);
            if (next[0] === last[0] && next[1] === last[1]) return;
            stroke.points.push(next);
            draw();
        },
        end(event) {
            if (stroke?.id !== event.pointerId) return;
            stroke = null;
            if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
            timer = setTimeout(drop, pause);
        },
        undo() {
            if (group) {
                clearTimeout(timer);
                group = null;
                stroke = null;
            } else if (doodles.some(({ first }) => !first)) {
                const item = doodles.pop();
                Composite.remove(engine.world, item.body);
                saved.delete(item.id);
                persist();
                setCount(doodles.length);
            }
            draw();
        },
        clear() {
            clearTimeout(timer);
            group = null;
            stroke = null;
            for (let index = doodles.length - 1; index >= 0; index--) {
                if (doodles[index].first) continue;
                Composite.remove(engine.world, doodles[index].body);
                doodles.splice(index, 1);
            }
            fades.length = 0;
            saved.clear();
            persist();
            setCount(doodles.length);
            draw();
        },
        save() {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "doodles.png";
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });
        },
        destroy() {
            controller.abort();
            floor.onload = null;
            clearTimeout(timer);
            cancelAnimationFrame(fadeFrame);
            observer.disconnect();
            Events.off(engine, "afterUpdate", afterUpdate);
            Runner.stop(runner);
            Engine.clear(engine);
        }
    };
}
