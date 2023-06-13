import { Brainfuck , InputOutput, Memory } from "./Brainfuck.js";

const $code = document.getElementById("code");
const $input = document.getElementById("input");
const $output = document.getElementById("output");

const $start = document.getElementById("start");
const $halt = document.getElementById("halt");
const $reset = document.getElementById("reset");
const $interval = document.getElementById("interval");

export const io = new InputOutput($input, $output);

/**
 * 
 * @param {Brainfuck} brainfuck 
 * @param {Memory} memory
 * @param {InputOutput} io 
 */
export function makeEvents(brainfuck, memory, io) {
    $start.addEventListener("click", e => {
        brainfuck.code.source($code.value);
        brainfuck.reset();
        brainfuck.run();
    });
    $halt.addEventListener("click", e => {
        brainfuck.stop();
    });
    $reset.addEventListener("click", e => {
        memory.reset();
        io.reset();
    });
    $interval.addEventListener("change", e => {
        brainfuck.setDelay($interval.value);
    });
}
