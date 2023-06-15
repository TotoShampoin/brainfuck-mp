import { Brainfuck , InputOutput, Memory } from "./Brainfuck/index.js";
import Canvas from "./Display/Canvas.js";
import Display from "./Display/Display.js";
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
const $username = document.getElementById("username");
const $color = document.getElementById("color");
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
 * @param {[name: string, color: string]} user_data
 * @param {Display} display
 */
export function makeUIEvents(brainfuck, memory, io, network, user_data, display) {
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
    $connect.addEventListener("submit", e => {
        e.preventDefault();
        network.connect($id.value);
    });
    $username.addEventListener("input", e => {
        user_data[0] = $username.value;
    });
    $color.addEventListener("input", e => {
        user_data[1] = $color.value;
    });
    [$username, $color].forEach(el => el.addEventListener("change", e => {
        (async function() {
            await network.ready;
            network.sendData({
                action: "profile",
                username: user_data[0],
                color: user_data[1],
            });
        })().catch(err => {});
    }));

    $username.value = user_data[0];
    $color.value = user_data[1];
    (async function() {
        await network.ready;
        $your_id.value = network.id;
    })().catch(err => {});

    window.addEventListener("resize", e => {
        canvas.setSize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener("wheel", e => {
        display.zoom += e.deltaY / 180;
        if(display.zoom == 0) display.zoom += e.deltaY / 180;
        if(Math.abs(display.zoom) == 1) display.zoom += e.deltaY / 180;
        console.log(display.zoom);
    })
}

