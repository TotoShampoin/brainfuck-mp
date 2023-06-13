import { getElement } from "../utils/HTML.js";

export default class InputOutput {
    /** @type {HTMLInputElement|HTMLTextAreaElement} */ input_html;
    /** @type {HTMLInputElement|HTMLTextAreaElement} */ output_html;
    
    _pointer = 0;
    
    constructor(input_html, output_html) {
        this.input_html = getElement(input_html);
        this.output_html = getElement(output_html);
    }

    getInput() {
        if(this._pointer < this.input_html.value.length) {
            const char = this.input_html.value[this._pointer];
            const code = char.charCodeAt(0);
            this._pointer++;
            return code;
        } else {
            return 0;
        }
    }
    setOutput(code) {
        const char = String.fromCharCode(code);
        this.output_html.value += char;
    }
    reset() {
        this._pointer = 0;
        this.output_html.value = "";
    }
};
