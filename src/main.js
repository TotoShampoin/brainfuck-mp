import { Brainfuck , Memory , InputOutput } from "./Brainfuck.js";
import { makeEvents, io } from "./HTML.js";

const memory = new Memory(0);

const brainfuck = new Brainfuck(memory, io);

brainfuck.setDelay(100);

brainfuck.on("operation", e => {
    console.log(e);
})

makeEvents(brainfuck, memory, io);
