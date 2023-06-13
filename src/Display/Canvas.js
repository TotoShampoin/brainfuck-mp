import { getElement } from "../utils/HTML.js";

export default class Canvas {
    /** @type {HTMLCanvasElement} */ canvas;
    /** @type {CanvasRenderingContext2D} */ ctx;
    /** @type {number} */ aspect;

    constructor(canvas, width, height) {
        this.canvas = getElement(canvas);
        this.ctx = this.canvas.getContext("2d");
        this.setSize(width, height);
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.aspect = width / height;
        // const min = Math.min(width, height);
        this.ctx.translate(width/2, height/2);
        this.ctx.scale(height, height);
    }
    clear(color = undefined) {
        if(color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(-this.aspect, -1, this.aspect*2, 2);
        } else {
            this.ctx.clearRect(-this.aspect, -1, this.aspect*2, 2);
        }
    }
    save() { this.ctx.save(); }
    restore() { this.ctx.restore(); }
    polygon({
        points,
        thickness = 0,
        filled = true,
        color_stroke = `#FFF`,
        color_fill = `#000`
    }) {
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = thickness;
        this.ctx.strokeStyle = color_stroke;
        this.ctx.fillStyle = color_fill;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for(let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        if(thickness > 0) {
            this.ctx.stroke();
        }
        if(filled) {
            this.ctx.fill();
        }
    }
    text(text, x, y, font = "16px Arial", color = "#000", [align_horizontal, align_vertical] = ["center", "middle"]) {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align_horizontal;
        this.ctx.textBaseline = align_vertical;
        this.ctx.fillText(text, x, y);
    }
};
