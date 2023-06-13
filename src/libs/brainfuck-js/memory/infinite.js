// Original code: https://www.npmjs.com/package/brainfuck-js

import Memory from '../memory.js';

export default function Infinite() {
    Memory.call(this);

    /////////////////////////////////////////////

    this.next = function () {
        this._pointer += 1;
        return this;
    }

    this.previous = function () {
        this._pointer -= 1;
        return this;
    }

    this.get = function () {
        if (typeof this._data[this._pointer] !== 'undefined') {
            return this._data[this._pointer];
        } else {
            return 0;
        }
    }

    this.set = function (_value) {
        this._data[this._pointer] = _value;
        return this;
    }
    
    this.increase = function () {
        if (typeof this._data[this._pointer] !== 'undefined') {
            this._data[this._pointer] += 1;
        } else {
            this._data[this._pointer] = 1;
        }
        return this;
    }
    
    this.decrease = function () {
        if (typeof this._data[this._pointer] !== 'undefined') {
            this._data[this._pointer] -= 1;
        } else {
            this._data[this._pointer] = -1;
        }
        return this;
    }
};

Infinite.prototype = Object.create(Memory);
Infinite.prototype.constructor = Infinite;
