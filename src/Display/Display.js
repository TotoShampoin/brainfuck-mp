import Canvas from "./Canvas.js";
import { Vector, invlerp, remap } from "../utils/Math.js";

import { Memory } from "../Brainfuck/index.js";
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

    drawCase(pointer, value, options = {
        write_time: 1,
        last_value: value
    }) {
        const {write_time, last_value} = options;
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
        this.canvas.text(value, 0, 0 - (1-write_time)*16, "15px Arial", `rgba(0, 0, 0, ${write_time})`);
        this.canvas.text(last_value, 0, write_time*16, "15px Arial", `rgba(0, 0, 0, ${1-write_time})`);
        this.canvas.text(`${pointer}`, -16, -18, "6px Arial", "#000", ["left", "bottom"]);
        this.canvas.restore();
    }
    drawBF(bf, time, nb = 0) {
        const position = bf.getPosition(time);
        this.canvas.save();
        this.canvas.ctx.translate(position, 0);
        this.canvas.ctx.scale(1/2, 1/2);
        if(!nb) {
            this.canvas.polygon({
                points: [[0, -1.1], [ .35, -2.1], [-.35, -2.1]],
                filled: true,
                thickness: 0,
                color_fill: bf.user_data[1],
            });
        }
        this.canvas.polygon({
            points: [[-1.5, -2.1 - nb*.85], [ 1.5, -2.1 - nb*.85], [ 1.5, -2.1 - nb*.85 - .75], [-1.5, -2.1 - nb*.85 - .75]],
            filled: true,
            thickness: .2,
            color_fill: "#FFF",
            color_stroke: bf.user_data[1],
        })
        // this.canvas.circle({
        //     x: 0, y: 2.16, r: .35,
        //     filled: true,
        //     thickness: 0,
        //     color_fill: "#F00",
        // });
        this.canvas.ctx.scale(1/16, 1/16);
        this.canvas.text(bf.user_data[0], 0, -36 - nb * 13.6, "8px Arial", "#000", ["center", "bottom"]);
        this.canvas.restore();
    }

    /**
     * 
     * @param {Memory} memory 
     * @param {BFPointer[]} brainfucks 
     * @param {BFPointer} me 
     */
    display(memory, brainfucks, me) {
        const all_bf = [me, ...brainfucks];
        const time = new Date().getTime();
        const zoom = (this.zoom > 0) ? this.zoom : (this.zoom < 0) ? -1/this.zoom : 1;

        if(this.follow) {
            this.position.x = me.getPosition(time);
            this.position.y = -0.5;
        }

        this.canvas.clear();

        this.canvas.save();
        this.canvas.ctx.scale(zoom / 20, zoom / 20);
        this.canvas.ctx.translate(-this.position.x, -this.position.y);

        const limit = Math.ceil(this.canvas.aspect * 10 / zoom);

        for(let i = -limit; i <= limit; i++) {
            let pointer = memory._pointer + i;
            let data = memory._data[pointer] ?? 0;
            const bf_reading = all_bf.find(bf => bf.pointer === pointer);
            if(bf_reading) {
                this.drawCase(pointer, data, {
                    write_time: bf_reading.getWritetime(time),
                    last_value: bf_reading.last_memory
                });
            } else {
                this.drawCase(pointer, data);
            }
        }
        
        let places = {};
        all_bf.forEach(bf => {
            const nb = places[bf.pointer] ?? 0;
            this.drawBF(bf, time, nb);
            places[bf.pointer] = nb + 1;
        });

        this.canvas.restore();
    }
};
