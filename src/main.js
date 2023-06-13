import { Brainfuck , Memory , InputOutput } from "./Brainfuck.js";
import Display from "./Display/Display.js";
import BFPointer from "./Game/BFPointer.js";
import { makeEvents, io, canvas } from "./ui.js";

const memory = new Memory(0);
const brainfuck = new Brainfuck(memory, io);

const me = new BFPointer(true);

// brainfuck.on("operation", e => {
//     me.update(memory._pointer);
// })
brainfuck.on("delay-change", delay => {
    me.setSpeed(parseInt(delay));
})
memory.on("move", pointer => {
    me.update(pointer);
});

brainfuck.setDelay(100);
makeEvents(brainfuck, memory, io);

const display = new Display(canvas);

display.follow = true;

function loop() {
    display.display(memory, [], me);
    requestAnimationFrame(loop);
}
loop();

window.memory = memory;
window.canvas = canvas;
window.display = display;
