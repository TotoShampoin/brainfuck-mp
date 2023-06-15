import Display from "./Display/Display.js";
import { canvas, input_output, makeUIEvents } from "./ui.js";
import { brainfuck, memory, user } from "./user.js";
import "./connections.js";
import { makeConnectionEvents, network } from "./connections.js";
import BFPointer from "./Game/BFPointer.js";

// import { other } from "./test.js";

/** @type {BFPointer[]} */ const others = [];

const display = new Display(canvas);
display.follow = true;

makeUIEvents(brainfuck, memory, input_output, network, user.user_data, display);
makeConnectionEvents(brainfuck, memory, others, user.user_data);

function loop() {
    display.display(memory, others, user);
    requestAnimationFrame(loop);
}
loop();

window.user = user;
