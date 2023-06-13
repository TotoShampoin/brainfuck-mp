import Canvas from "./Canvas.js";
import { Vector, invlerp, remap } from "../utils/Math.js";

import { Memory } from "../Brainfuck.js";
import BFPointer from "../Game/BFPointer.js";

export default class Display {
    /** @type {Canvas} */ canvas;
    /** @type {Vector} */ position;
    /** @type {number} */ zoom = 1;
    /** @type {boolean} */ follow = false;

    /**
     * @param {Canvas} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.position = new Vector(0, 0);
    }

    setFollow(follow) {
        this.follow = follow ? follow : false;
    }

    drawCase(pointer, value) {
        this.canvas.save();
        this.canvas.ctx.translate(pointer, 0);
        this.canvas.ctx.scale(.475, .475);
        this.canvas.polygon({
            points: [[-1, -1], [ 1, -1], [ 1,  1], [-1,  1]],
            filled: true,
            thickness: .2,
            color_fill: "#FFF",
            color_stroke: "#000",
        });
        this.canvas.ctx.scale(1/16, 1/16);
        this.canvas.text(value, 0, 0, "15px Arial", "#000");
        this.canvas.text(`${pointer}`, -16, -18, "6px Arial", "#000", ["left", "bottom"]);
        this.canvas.restore();
    }
    drawBF(bf, time) {
        const position = bf.getPosition(time);
        this.canvas.save();
        this.canvas.ctx.translate(position, 0);
        this.canvas.ctx.scale(1/2, 1/2);
        this.canvas.polygon({
            points: [[0, 1.1], [ .35, 2.1], [-.35,  2.1]],
            filled: true,
            thickness: 0,
            color_fill: "#F00",
        });
        this.canvas.circle({
            x: 0, y: 2.16, r: .35,
            filled: true,
            thickness: 0,
            color_fill: "#F00",
        });
        this.canvas.ctx.scale(1/16, 1/16);
        this.canvas.text(bf.op_code, 0, 34.5, "6px Arial", "#FFF");
        this.canvas.restore();
    }

    /**
     * 
     * @param {Memory} memory 
     * @param {BFPointer[]} brainfucks 
     * @param {BFPointer} me 
     */
    display(memory, brainfucks, me) {
        const time = new Date().getTime();

        if(this.follow) {
            this.position.x = me.getPosition(time);
            this.position.y = 0;
        }

        this.canvas.clear();

        this.canvas.save();
        this.canvas.ctx.scale(this.zoom / 20, this.zoom / 20);
        this.canvas.ctx.translate(-this.position.x, -this.position.y);

        const limit = Math.ceil(this.canvas.aspect * 10 / this.zoom);

        for(let i = -limit; i <= limit; i++) {
            let pointer = memory._pointer + i;
            let data = memory._data[pointer] ?? 0;
            this.drawCase(pointer, data);
        }
        
        [...brainfucks, me].forEach(bf => {
            this.drawBF(bf, time);
        });

        this.canvas.restore();
    }
};
