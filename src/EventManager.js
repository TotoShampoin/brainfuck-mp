export default class EventManager {
    /** @type {{[k: string]: Function[]}} */ events = {};

    /** @param  {...string} event_names */
    set(...event_names) {
        for(let event of event_names) {
            if(!(event in this.events)) this.events[event] = [];
        }
    }

    /** @param  {string} event_name @param {Function} callback */
    on(event_name, callback) {
        this.set(event_name);
        this.events[event_name].push(callback);
    }
    /** @param  {string} event_name */
    off(event_name) {
        this.events[event_name].filter(() => false);
    }

    /** @param {string} event_name @param {any} event */
    emit(event_name, event) {
        if(!(event_name in this.events)) return;
        this.events[event_name].forEach(callback => callback(event));
    }
};
