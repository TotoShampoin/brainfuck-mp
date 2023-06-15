import Brainfuck from "./Brainfuck/Brainfuck.js";
import Memory from "./Brainfuck/Memory.js";
import Network from "./Network/Network.js";
import BFPointer from "./Game/BFPointer.js";

export const network = new Network();

/** @typedef {import('./Brainfuck/Brainfuck.js').BFOpCode} BFOpCode */

/**
 * @typedef {Object} ConnectionData
 * @property {"operation"|"goto"|"speed"|"syncmem"|"sync"|"profile"} action
 * @property {BFOpCode} opcode
 * @property {number} value
 * @property {number} pointer
 * @property {number} speed
 * @property {Object<number, number>} memory
 * @property {string} username
 * @property {string} color
 */

/**
 * @param {Brainfuck} brainfuck
 * @param {Memory} memory 
 * @param {BFPointer[]} pointers 
 */
export function makeConnectionEvents(brainfuck, memory, pointers) {
    /**
     * @param {BFPointer} bf 
     * @param {ConnectionData} data 
     */
    function parseData(bf, data) {
        console.log(bf, data);
        switch(data.action) {
        case "operation": {
            bf.setOpCode(data.opcode);
            switch(data.opcode) {
            case "+": case "-": case ",": {
                bf.setMemory(data.value, memory.getMemory(bf.pointer));
                memory.setMemory(bf.pointer, bf.memory);
            } break;
            case "<": case ">": {
                bf.setPointer(data.value);
            } break;
            }
        } break;
        case "goto": {
            bf.setOpCode("~");
            bf.setPointer(data.value);
        } break;
        case "speed": {
            bf.setSpeed(data.value);
        } break;
        case "syncmem": {
            for(let i in data.memory) {
                memory.setMemory(i, data.memory[i]);
            }
            network.sendData({
                action: "sync",
                pointer: memory._pointer,
                speed: brainfuck._delay,
            });
        } case "sync": {
            bf.setPointer(data.pointer);
            bf.setSpeed(data.speed);
        } break;
        case "profile": {
            bf.name = data.username;
            bf.color = data.color;
        } break;
        default: {
            console.log(bf.peer_id, data);
        } break;
        }
        console.log(bf.last_update_time + bf.speed - new Date().getTime());
    }

    function synchronize() {
        network.sendData({
            action: "syncmem",
            pointer: memory._pointer,
            speed: brainfuck._delay,
            memory: memory._data,
        });
    }
    
    network.on("connect", ({id}) => {
        pointers.push(new BFPointer(id));
        synchronize();
    });
    network.on("disconnect", ({id}) => {
        const bf_i = pointers.findIndex(p => p.peer_id === id);
        if(bf_i < 0) return;
        pointers.splice(bf_i, 1);
    });
    network.on("data", ({from, data}) => {
        const bf = pointers.find(p => p.peer_id === from);
        parseData(bf, data);
    });

    brainfuck.on("operation", e => {
        let value = 0;
        switch(e.opcode) {
        case "+": case "-": case ",": {
            value = e.value;
        } break;
        case "<": case ">": {
            value = e.pointer;
        } break;
        }
        network.sendData({
            action: "operation",
            opcode: e.opcode,
            value: value,
        })
    });
    brainfuck.on("delay-change", speed => {
        network.sendData({
            action: "speed",
            value: speed
        })
    });
    brainfuck.on("stop", () => {
        network.sendData({
            action: "operation",
            opcode: ""
        });
    });
    memory.on("goto", ({pointer}) => {
        network.sendData({
            action: "goto",
            value: pointer
        });
    })
};
