// Original code: https://www.npmjs.com/package/brainfuck-js

export default function Memory() {
    this._pointer = 0;
    this._data = {};

    /////////////////////////////////////////////

    this.reset = function () {
        this._pointer = 0;
    }
    
    this.clear = function () {
        this._pointer = 0;
        this._data = {};
    }
}
