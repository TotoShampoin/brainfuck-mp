// Code derived from https://www.npmjs.com/package/brainfuck-js

import Memory from './libs/brainfuck-js/memory.js';
import EventManager from './EventManager.js';

/** @typedef {"action"|"next"|"previous"|"get"|"set"|"increase"|"decrease"} EventfulMemoryName */
/** 
 * @typedef {Object} EventfulMemoryEvent
 * @property {EventfulMemoryName} type
 * @property {number} pointer
 * @property {number} value
 */

export default function OnlineMemory(_startPointer = 0) {
    Memory.call(this);

    this._startPointer = _startPointer;

    this.events = new EventManager();
    this.events.set("action", "next", "previous", "get", "set", "increase", "decrease");
    this.events.on("action", e => this.events.emit(e.type, e));

    const action = (type) => ({
        type,
        pointer: this._pointer,
        value: this._data[this._pointer]
    });

    /////////////////////////////////////////////

    /**
     * @param {EventfulMemoryName} event_name
     * @param {(event: EventfulMemoryEvent) => void} callback {@link EventfulMemoryName}
     * @returns {void}
     */
    this.on = function (event_name, callback) {
        this.events.on(event_name, callback);
    }
    
    /**
     * @param {EventfulMemoryName} event_name
     * @returns {void}
     */
    this.off = function (event_name) {
        this.events.off(event_name);
    }

    /////////////////////////////////////////////

    this.startAt = function(_startPointer) {
        this._startPointer = _startPointer;
    }
    this.reset = function () {
        this._pointer = 0;
        this._data = {};
    }
    this.clear = function () {
        this._pointer = 0;
        this._data = {};
    }

    /////////////////////////////////////////////

    this.next = function () {
        this._pointer += 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this.events.emit("action", action("next"));
    }

    this.previous = function () {
        this._pointer -= 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this.events.emit("action", action("previous"));
    }

    this.get = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this.events.emit("action", action("get"));
        return this._data[this._pointer];
    }

    this.set = function (_value) {
        this._data[this._pointer] = (_value % 256 + 256) % 256;
        this.events.emit("action", action("set"));
    }
    
    this.increase = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] + 1) % 256 + 256) % 256;
        this.events.emit("action", action("increase"));
    }
    
    this.decrease = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] - 1) % 256 + 256) % 256;
        this.events.emit("action", action("decrease"));
    }
};

OnlineMemory.prototype = Object.create(Memory);
OnlineMemory.prototype.constructor = OnlineMemory;
