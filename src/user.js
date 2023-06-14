import BFPointer from "./Game/BFPointer.js";
import { Brainfuck , Memory } from "./Brainfuck/index.js";
import { input_output, makeEvents } from "./ui.js";

export const memory = new Memory(0);
export const brainfuck = new Brainfuck(memory, input_output);

export const user = new BFPointer(true);

brainfuck.on("operation", e => {
    user.setOpCode(e.opcode);
});
brainfuck.on("delay-change", delay => {
    user.setSpeed(parseInt(delay));
});
memory.on("set", ({value, last_value}) => {
    user.setMemory(value, last_value);
});
memory.on("move", ({pointer}) => {
    user.setPointer(pointer);
});
memory.on("clear", () => {
    user.setPointer(memory._startPointer);
    user.op_code = "";
});

brainfuck.setDelay(100);
makeEvents(brainfuck, memory, input_output);
