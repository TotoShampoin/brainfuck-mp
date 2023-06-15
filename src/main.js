import Display from "./Display/Display.js";
import { canvas, input_output, makeUIEvents } from "./ui.js";
import { brainfuck, memory, user } from "./user.js";
import "./connections.js";
import { makeConnectionEvents, network } from "./connections.js";
import BFPointer from "./Game/BFPointer.js";

// import { other } from "./test.js";

/** @type {BFPointer[]} */ const others = [];

makeUIEvents(brainfuck, memory, input_output, network);
makeConnectionEvents(brainfuck, memory, others);

const display = new Display(canvas);
display.follow = true;

function loop() {
    display.display(memory, others, user);
    requestAnimationFrame(loop);
}
loop();

window.user = user;
