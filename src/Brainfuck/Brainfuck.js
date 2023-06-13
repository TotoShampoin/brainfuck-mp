// Code derived from https://www.npmjs.com/package/brainfuck-js

import Code from "./Code.js";
import Memory from "./Memory.js";
import InputOutput from "./InputOutput.js";
import EventManager from './EventManager.js';

/** @typedef {"operation"|"delay-change"} EventName */
/** @typedef {">"|"<"|"+"|"-"|"."|","|"["|"]"} BFOpCode */
/** 
 * @typedef {Object} OperationEvent
 * @property {BFOpCode} opcode
 * @property {number} pointer
 * @property {number} value
 */

/**
 * @param {Memory} memory
 * @param {InputOutput} input_output
 */
export default function Brainfuck(memory, input_output) {
    this.memory = memory ?? new Memory();
    this.io = input_output;
    this.code = new Code();
    this.events = new EventManager();
    this._stop = false;
    this._isRunning = false;
    this._delay = 0;

    /////////////////////////////////////////////

    this.events.set("operation", "delay-change");

    const action = (opcode) => ({
        opcode,
        pointer: this.memory._pointer,
        value: this.memory.get(),
        char: String.fromCharCode(this.memory.get())
    });

    /**
     * @param {EventName} event_name
     * @param {(event: OperationEvent) => void} callback {@link EventfulMemoryName}
     * @returns {void}
     */
    this.on = function (event_name, callback) {
        this.events.on(event_name, callback);
    }
    
    /**
     * @param {EventName} event_name
     * @returns {void}
     */
    this.off = function (event_name) {
        this.events.off(event_name);
    }

    /////////////////////////////////////////////

    this.setDelay = function(_delay) {
        this._delay = _delay;
        this.events.emit("delay-change", _delay);
    }

    this._onOutput = function (_o) {
        if(!this.io) {
            console.log(String.fromCharCode(_o));
        }
        this.io?.setOutput(_o)
    };
    this._onInput = function (_i) {
        return this.io?.getInput(_i) ?? 0;
    };
    
    this.onOutput = function (_func) {
        this._onOutput = _func;
        return this;
    }
    this.onInput = function (_func) {
        this._onInput = _func;
        return this;
    }

    this.stop = function () {
        this._stop = true;
    }

    this.isRunning = function () {
        return this._isRunning;
    }

    this.reset = function () {
        this.code.reset();
        this._stop = false;
        return this;
    };

    this.step = function (_callback) {
        var cmd = this.code.get();

        if (typeof cmd === 'undefined') {
            this._run(_callback, false);
            return false;
        } else {
            if (cmd === '>') {
                this.memory.next();
            } else if (cmd === '<') {
                this.memory.previous();
            } else if (cmd === '+') {
                this.memory.increase();
            } else if (cmd === '-') {
                this.memory.decrease();
            } else if (cmd === '.') {
                this._runAsync(this._onOutput, this.memory.get());
            } else if (cmd === ',') {
                this.memory.set(this._run(this._onInput));
            } else if (cmd === '[' && this.memory.get() === 0) {
                this.code.jumpMatching();
            } else if (cmd === ']') {
                this.code.jumpMatching();
                this.code.previous();
            }
            
            this.events.emit("operation", action(cmd));

            this.code.next();
            this._run(_callback, true);
            return true;
        }
    }

    this.run = function (_callback) {
        
        this._isRunning = true;

        if (this._stop) {
            this._isRunning = false;
            this._run(_callback);
        } else {
            this._stop = this._stop || !this.step();
            this._runAsync(this.run, _callback);                
        } 
    }

    this._runAsync = function (/*_func, _arg1, _arg2...*/) {
        var that = this,
            args = Array.prototype.slice.call(arguments),
            func = args.shift();
        
        setTimeout(function () {
            func.apply(that, args);
        }, this._delay);
    }

    this._run = function (/*_func, _arg1, _arg2...*/) {
        var args = args = Array.prototype.slice.call(arguments),
            func = args.shift();
        if (typeof func === 'function') {
            return func.apply(this, args);
        }
    }
};
