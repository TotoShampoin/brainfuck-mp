export class Vector {
    /** @type {number} */ x;
    /** @type {number} */ y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /** @param {Vector} other */
    "+"(other) {
        return new Vector(
            this.x + other.x,
            this.y + other.y,
        )
    }
    /** @param {Vector} other */
    "-"(other) {
        return new Vector(
            this.x - other.x,
            this.y - other.y,
        )
    }
    "*"(scalar) {
        return new Vector(
            this.x * scalar,
            this.y * scalar,
        )
    }
};

export function lerp(a, b, t) {
    return a + t * (b - a);
}
export function invlerp(a, b, v) {
    return (v - a) / (b - a);
}
export function clamp(a, b, t) {
    return (a < b) ? (t < a ? a : t > b ? b : t) : a;
}

export function remap(o0, o1, n0, n1, v) {
    const cv = clamp(o0, o1, v);
    const t = invlerp(o0, o1, cv);
    return lerp(n0, n1, t);
}
