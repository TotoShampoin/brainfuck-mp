// Code derived from https://www.npmjs.com/package/brainfuck-js

export default function Memory(_startPointer = 0) {
    this._pointer = 0;
    this._data = {};
    this._startPointer = _startPointer;

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
    }

    this.previous = function () {
        this._pointer -= 1;
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
    }

    this.get = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        return this._data[this._pointer];
    }

    this.set = function (_value) {
        this._data[this._pointer] = (_value % 256 + 256) % 256;
    }
    
    this.increase = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] + 1) % 256 + 256) % 256;
    }
    
    this.decrease = function () {
        if (typeof this._data[this._pointer] === 'undefined') {
            this._data[this._pointer] = 0;
        }
        this._data[this._pointer] = ((this._data[this._pointer] - 1) % 256 + 256) % 256;
    }
};

Memory.prototype = Object.create(Memory);
Memory.prototype.constructor = Memory;
