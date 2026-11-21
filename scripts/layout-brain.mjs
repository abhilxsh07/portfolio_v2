import { UndirectedGraph } from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { brainScene } from "../src/data/brain.js";

const regions = {
    code: { x: 275, y: 239, rx: 226, ry: 187 },
    make: { x: 823, y: 228, rx: 205, ry: 169 },
    work: { x: 543, y: 492, rx: 389, ry: 88 },
    life: { x: 554, y: 320, rx: 76, ry: 62 }
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

function spreadNodes(nodes) {
    const gap = 60;
    for (let pass = 0; pass < 32; pass++) {
        let moved = false;
        for (let i = 0; i < nodes.length; i++) {
            const first = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const second = nodes[j];
                const dx = second.x - first.x;
                const dy = second.y - first.y;
                const distance = Math.hypot(dx, dy);
                if (distance >= gap - .1) continue;
                const shift = (gap - distance) / 2;
                const x = distance ? dx * shift / distance : shift;
                const y = distance ? dy * shift / distance : 0;
                [first.x, first.y] = insideRegion(first.x - x, first.y - y, regions[first.region]);
                [second.x, second.y] = insideRegion(second.x + x, second.y + y, regions[second.region]);
                moved = true;
            }
        }
        if (!moved) break;
    }
}

function placeLabels(nodes) {
    const { width, height, labelSize } = brainScene;
    const boxes = nodes.map(({ x, y, size }) => [x - size - 2, y - size - 2, x + size + 2, y + size + 2]);
    const labels = nodes.filter(({ title }) => title).sort((a, b) => b.degree - a.degree);
    for (const node of labels) {
        const { x, y, size, title } = node;
        const textWidth = title.length * labelSize * .62;
        const gap = size + 10;
        const choices = [
            [gap, 5, "start"], [-gap, 5, "end"], [0, -gap, "middle"], [0, gap + labelSize, "middle"],
            [gap, -gap, "start"], [-gap, -gap, "end"], [gap, gap + labelSize, "start"], [-gap, gap + labelSize, "end"]
        ];
        let best = Infinity;
        for (const [dx, dy, anchor] of choices) {
            const start = x + dx - (anchor === "end" ? textWidth : anchor === "middle" ? textWidth / 2 : 0);
            const box = [start - 4, y + dy - labelSize, start + textWidth + 4, y + dy + 5];
            const [left, top, right, bottom] = box;
            let overlap = left < 12 || right > width - 12 || top < 12 || bottom > height - 12 ? 10000 : 0;
            for (const [a, b, c, d] of boxes) {
                overlap += Math.max(0, Math.min(right, c) - Math.max(left, a)) * Math.max(0, Math.min(bottom, d) - Math.max(top, b));
            }
            if (overlap < best) {
                best = overlap;
                node.label = { x: dx, y: dy, anchor };
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
            const radius = .88 * Math.sqrt((index + .5) / group.length);
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
        const [left, top] = insideRegion(seed.x * .8 + x * .2, seed.y * .8 + y * .2, regions[region]);
        const links = degree.get(id);
        return {
            id, slug, kind, region, draft, title: !development && draft ? null : title,
            x: left, y: top,
            degree: links, size: 4 + Math.min(4, links * .85)
        };
    });
    spreadNodes(nodes);
    for (const node of nodes) {
        node.x = Math.round(node.x * 10) / 10;
        node.y = Math.round(node.y * 10) / 10;
    }
    placeLabels(nodes);
    return { nodes, edges };
}
