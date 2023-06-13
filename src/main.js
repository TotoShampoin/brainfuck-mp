import OnlineBrainfuck from "./OnlineBrainfuck.js";
import OnlineMemory from "./OnlineMemory.js";

import InputOutput from "./io.js";

const memory = new OnlineMemory();
const brainfuck = new OnlineBrainfuck(memory, 100);
const io = new InputOutput("input", "output");
const $code = document.getElementById("code");

memory.on("action", e => {
    console.log(e);
})

brainfuck.onInput(() => {
    const input = io.getInput();
    return input;
})
brainfuck.onOutput(output => {
    io.setOutput(output);
})

document.getElementById("start").addEventListener("click", e => {
    brainfuck.code.source($code.value);
    brainfuck.resetCode();
    brainfuck.run();
})
document.getElementById("halt").addEventListener("click", e => {
    brainfuck.stop();
})
document.getElementById("reset").addEventListener("click", e => {
    brainfuck.resetMemory();
    io.reset();
})

