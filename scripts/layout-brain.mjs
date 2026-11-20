import { UndirectedGraph } from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

const regions = {
    code: { x: 244, y: 221, rx: 171, ry: 159 },
    make: { x: 516, y: 221, rx: 171, ry: 159 },
    work: { x: 380, y: 445, rx: 274, ry: 51 },
    life: { x: 380, y: 335, rx: 49, ry: 42 }
};

function insideRegion(x, y, region) {
    const dx = x - region.x;
    const dy = y - region.y;
    if (region === regions.work) {
        return [region.x + Math.max(-region.rx, Math.min(region.rx, dx)), region.y + Math.max(-region.ry, Math.min(region.ry, dy))];
    }
    if ((dx / region.rx) ** 2 + (dy / region.ry) ** 2 <= 1) return [x, y];

    // Find the point on the ellipse with the shortest distance to the node.
    const a = region.rx ** 2;
    const b = region.ry ** 2;
    let low = 0;
    let high = Math.hypot(region.rx * dx, region.ry * dy);
    for (let iteration = 0; iteration < 32; iteration++) {
        const t = (low + high) / 2;
        const distance = (region.rx * dx / (a + t)) ** 2 + (region.ry * dy / (b + t)) ** 2;
        if (distance > 1) low = t;
        else high = t;
    }
    return [region.x + a * dx / (a + high), region.y + b * dy / (b + high)];
}

function placeLabels(nodes) {
    const boxes = nodes.map(({ x, y, size }) => [x - size - 2, y - size - 2, x + size + 2, y + size + 2]);
    const labels = nodes.filter(({ title }) => title).sort((a, b) => b.degree - a.degree);
    for (const node of labels) {
        const { x, y, size, title } = node;
        const width = title.length * 7.3;
        const gap = size + 5;
        const choices = [
            [gap, 4], [-gap - width, 4], [-width / 2, -gap], [-width / 2, gap + 9],
            [gap, -gap], [-gap - width, -gap], [gap, gap + 9], [-gap - width, gap + 9]
        ];
        let best = Infinity;
        for (const [dx, dy] of choices) {
            const box = [x + dx - 2, y + dy - 10, x + dx + width + 2, y + dy + 3];
            const [left, top, right, bottom] = box;
            let overlap = left < 0 || right > 760 || top < 0 || bottom > 520 ? 10000 : 0;
            for (const [a, b, c, d] of boxes) {
                overlap += Math.max(0, Math.min(right, c) - Math.max(left, a)) * Math.max(0, Math.min(bottom, d) - Math.max(top, b));
            }
            if (overlap < best) {
                best = overlap;
                node.label = { x: dx, y: dy };
                node.labelBox = box;
            }
            if (!overlap) break;
        }
        boxes.push(node.labelBox);
        delete node.labelBox;
    }
}

export function layoutBrain(notes, posts, development) {
    const regionsBySlug = new Map(notes.map(({ slug, region }) => [slug, region]));
    const entries = [
        ...notes.map((note) => ({ ...note, id: "note:" + note.slug, kind: "note" })),
        ...posts.map((post) => ({
            ...post, id: "post:" + post.slug, kind: "post",
            region: post.links.map((slug) => regionsBySlug.get(slug)).find(Boolean) ?? "work"
        }))
    ].sort((a, b) => a.slug.localeCompare(b.slug) || a.kind.localeCompare(b.kind));

    const graph = new UndirectedGraph({ allowSelfLoops: false });
    const seeds = new Map();
    const edges = [];
    const degree = new Map(entries.map(({ id }) => [id, 0]));
    for (const [region, { x, y, rx, ry }] of Object.entries(regions)) {
        const anchor = "region:" + region;
        graph.addNode(anchor, { x, y, fixed: true, size: 2 });
        const group = entries.filter((entry) => entry.region === region);
        group.forEach(({ id }, index) => {
            const angle = index * Math.PI * (3 - Math.sqrt(5));
            const radius = .78 * Math.sqrt((index + .5) / group.length);
            const seed = { x: x + rx * radius * Math.cos(angle), y: y + ry * radius * Math.sin(angle) };
            seeds.set(id, seed);
            graph.addNode(id, { ...seed, size: 4 });
            graph.addUndirectedEdge(anchor, id, { weight: .6 });
        });
    }

    for (const { id, links } of entries) {
        for (const slug of links) {
            const target = "note:" + slug;
            if (!degree.has(target) || target === id || graph.hasEdge(id, target)) continue;
            graph.addUndirectedEdge(id, target, { weight: .55 });
            edges.push([id, target]);
            degree.set(id, degree.get(id) + 1);
            degree.set(target, degree.get(target) + 1);
        }
    }

    const positions = forceAtlas2(graph, {
        iterations: 110,
        getEdgeWeight: "weight",
        settings: { gravity: .01, scalingRatio: 22, slowDown: 10 }
    });
    const nodes = entries.map(({ id, slug, title, kind, draft, region }) => {
        const { x, y } = positions[id];
        const seed = seeds.get(id);
        const [left, top] = insideRegion(seed.x * .72 + x * .28, seed.y * .72 + y * .28, regions[region]);
        const links = degree.get(id);
        return {
            id, slug, kind, region, draft, title: !development && draft ? null : title,
            x: Math.round(left * 10) / 10, y: Math.round(top * 10) / 10,
            degree: links, size: 4 + Math.min(4, links * .85)
        };
    });
    placeLabels(nodes);
    return { nodes, edges };
}
