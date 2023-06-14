// Code derived from https://www.npmjs.com/package/brainfuck-js

import EventManager from './EventManager.js';

/** @typedef {"get"|"set"|"move"} EventName */

export default function Memory(_startPointer = 0) {
    this._pointer = 0;
    this._data = {};
    this._startPointer = _startPointer;

    this.events = new EventManager();

    /////////////////////////////////////////////

    this.events.set("get", "set", "clear", "move");

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

    const emit = (type, last) => {
        this.events.emit(type, {
            pointer: this._pointer,
            value: this._data[this._pointer],
            last_value: last ?? this._data[this._pointer],
        });
    }

    /////////////////////////////////////////////

    this.goto = function(_pointer) {
        this._pointer = _pointer;
        emit("move");
    }
    this.startAt = function(_startPointer) {
        this._startPointer = _startPointer;
        this._pointer = _startPointer;
    }
    this.clear = function () {
        this._pointer = _startPointer;
        this._data = {};
        this.events.emit("clear");
    }
    this.getMemory = function(pointer) {
        if (typeof this._data[pointer] === 'undefined') {
            this._data[pointer] = 0;
        }
        return this._data[pointer];
    }
    this.setMemory = function(pointer, value) {
        if (typeof this._data[pointer] === 'undefined') {
            this._data[pointer] = 0;
        }
        this._data[pointer] = value;
    }

    /////////////////////////////////////////////

    this.next = function () {
        this._pointer += 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        emit("move");
    }

    this.previous = function () {
        this._pointer -= 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        emit("move");
    }

    this.get = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        emit("get");
        return this._data[this._pointer];
    }

    this.set = function (_value) {
        const last = this._data[this._pointer];
        this._data[this._pointer] = (_value % 256 + 256) % 256;
        emit("set", last);
    }
    
    this.increase = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        const last = this._data[this._pointer];
        this._data[this._pointer] = ((this._data[this._pointer] + 1) % 256 + 256) % 256;
        emit("set", last);
    }
    
    this.decrease = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        const last = this._data[this._pointer];
        this._data[this._pointer] = ((this._data[this._pointer] - 1) % 256 + 256) % 256;
        emit("set", last);
    }
};

Memory.prototype = Object.create(Memory);
Memory.prototype.constructor = Memory;
