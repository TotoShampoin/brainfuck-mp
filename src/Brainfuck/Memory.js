// Code derived from https://www.npmjs.com/package/brainfuck-js

import EventManager from './EventManager.js';

/** @typedef {"get"|"set"|"move"} EventName */

export default function Memory(_startPointer = 0) {
    this._pointer = 0;
    this._data = {};
    this._startPointer = _startPointer;

    this.events = new EventManager();

    /////////////////////////////////////////////

    this.events.set("get", "set", "reset", "move");

    /**
     * @param {EventName} event_name
     * @param {(any) => void} callback {@link EventfulMemoryName}
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

    this.goto = function(_pointer) {
        this._pointer = _pointer;
        this.events.emit("move", _pointer);
    }
    this.startAt = function(_startPointer) {
        this._startPointer = _startPointer;
        this._pointer = _startPointer;
    }
    this.reset = function () {
        this._pointer = _startPointer;
        this._data = {};
        this.events.emit("reset");
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
        this.events.emit("move", this._pointer);
    }

    this.previous = function () {
        this._pointer -= 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this.events.emit("move", this._pointer);
    }

    this.get = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this.events.emit("get", this._pointer, this._data[this._pointer]);
        return this._data[this._pointer];
    }

    this.set = function (_value) {
        this._data[this._pointer] = (_value % 256 + 256) % 256;
        this.events.emit("set", this._pointer, this._data[this._pointer]);
    }
    
    this.increase = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] + 1) % 256 + 256) % 256;
        this.events.emit("set", this._pointer, this._data[this._pointer]);
    }
    
    this.decrease = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] - 1) % 256 + 256) % 256;
        this.events.emit("set", this._pointer, this._data[this._pointer]);
    }
};

Memory.prototype = Object.create(Memory);
Memory.prototype.constructor = Memory;
