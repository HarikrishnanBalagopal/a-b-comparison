export class Graph {
    constructor() {
        this.edges = {};
        this.vertices = {};
    }
    getVertex(id) {
        return this.vertices[id];
    }
    addVertex(id, label = "") {
        const v = this.getVertex(id);
        if (v) return v;
        const new_v = { id, label };
        this.vertices[id] = new_v;
        return new_v;
    }
    getEdgeKey(id1, id2) {
        return `${id1}-${id2}`;
    }
    getEdge(id1, id2) {
        return this.edges[this.getEdgeKey(id1, id2)];
    }
    addEdge(id1, id2, label = "") {
        const e = this.getEdge(id1, id2);
        if (e) return e;
        this.addVertex(id1);
        this.addVertex(id2);
        const new_e = { id1, id2, label };
        this.edges[this.getEdgeKey(id1, id2)] = new_e;
        return new_e;
    }
    labelToDot(label) {
        return label ? `[label="${label}"]` : "";
    }
    toDot() {
        let dot = "";
        const vs = Object.values(this.vertices)
            .map((v) => `    ${v.id}${this.labelToDot(v.label)}`)
            .join("\n");
        const es = Object.values(this.edges)
            .map((e) => `    ${e.id1} -> ${e.id2}${this.labelToDot(e.label)}`)
            .join("\n");
        return `strict digraph {
${vs}
${es}
}`;
    }
}
