import { remap } from "../utils/Math.js";

export default class BFPointer {
    name = "brainfukc";
    color = "#000";
    last_pointer = 0;
    pointer = 0;
    speed = 10;
    last_update_time = new Date().getTime();
    is_player = false;

    constructor(is_player = false) {
        this.is_player = is_player;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    /**
     * @param {number} pointer 
     */
    update(pointer) {
        this.last_pointer = this.pointer;
        this.pointer = pointer;
        this.last_update_time = new Date().getTime();
    }

    getPosition(time) {
        return remap(this.last_update_time, this.last_update_time + this.speed, this.last_pointer, this.pointer, time);
    }
};
