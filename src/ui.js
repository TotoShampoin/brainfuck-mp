import { Brainfuck , InputOutput, Memory } from "./Brainfuck/index.js";
import Canvas from "./Display/Canvas.js";
import Network from "./Network/Network.js";

const $code = document.getElementById("code");
const $input = document.getElementById("input");
const $output = document.getElementById("output");

const $start = document.getElementById("start");
const $halt = document.getElementById("halt");
const $interval = document.getElementById("interval");
const $destination = document.getElementById("destination");
const $goto = document.getElementById("goto");

const $your_id = document.getElementById("your-id");
const $id = document.getElementById("id");
const $connect = document.getElementById("connect");

const $canvas = document.getElementById("canvas");

export const input_output = new InputOutput($input, $output);
export const canvas = new Canvas($canvas, window.innerWidth, window.innerHeight);

/**
 * 
 * @param {Brainfuck} brainfuck 
 * @param {Memory} memory
 * @param {InputOutput} io 
 * @param {Network} network
 */
export function makeUIEvents(brainfuck, memory, io, network) {
    $start.addEventListener("click", e => {
        brainfuck.code.source($code.value);
        brainfuck.reset();
        io.reset();
        brainfuck.run();
    });
    $halt.addEventListener("click", e => {
        brainfuck.stop();
    });
    $interval.addEventListener("change", e => {
        brainfuck.setDelay($interval.value);
    });
    $goto.addEventListener("click", e => {
        memory.goto(parseInt($destination.value))
    });
    $connect.addEventListener("click", e => {
        network.connect($id.value);
    });

    (async function() {
        await network.ready;
        $your_id.value = network.id;
    })();

    window.addEventListener("resize", e => {
        canvas.setSize(window.innerWidth, window.innerHeight);
    });
}

