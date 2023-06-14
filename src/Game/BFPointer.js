import { remap } from "../utils/Math.js";

export default class BFPointer {
    name = "brainfukc";
    color = "#000";
    last_update_time = new Date().getTime();
    last_pointer = 0;
    last_memory = 0;
    memory = 0;
    pointer = 0;
    speed = 10;
    is_player = false;
    op_code = "";

    constructor(is_player = false) {
        this.is_player = is_player;
    }

    setSpeed(speed) {
        this.speed = speed;
    }
    setPointer(pointer) {
        this.last_pointer = this.pointer;
        this.pointer = pointer;
        this.last_update_time = new Date().getTime();
    }
    setMemory(memory, last_memory = this.memory) {
        this.last_memory = last_memory;
        this.memory = memory;
        this.last_update_time = new Date().getTime();
    }
    setOpCode(op_code) {
        this.op_code = op_code;
    }

    getPosition(time) {
        switch(this.op_code) {
            case ">": case "<":
                return remap(this.last_update_time, this.last_update_time + this.speed, this.last_pointer, this.pointer, time);
            default:
                return this.pointer;
        }
    }
    getWritetime(time) {
        switch(this.op_code) {
            case "+": case "-": case ",":
                return remap(this.last_update_time, this.last_update_time + this.speed, 0, 1, time);
            default:
                return 1;
        }
    }
    getReadtime(time) {
        switch(this.op_code) {
            case ".":
                return remap(this.last_update_time, this.last_update_time + this.speed, 0, 1, time);
            default:
                return 1;
        }
    }
};
