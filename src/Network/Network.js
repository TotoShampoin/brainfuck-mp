import EventManager from "../utils/EventManager.js";

/** @typedef {"ready"|"error"|"data"|"connect"|"disconnect"} EventName */

export default class Network {
    peer = new Peer();
    events = new EventManager();
    connections = [];
    id = "";
    ready = new Promise((res, rej) => {
        this.peer.on("open", () => res(true));
        this.peer.on("error", () => rej());
    });

    constructor() {
        this.events.set("ready", "error", "data", "connect", "disconnect");
        this.peer.on("open", id => {
            this.id = id;
            this.events.emit("ready", {id});
        });
        this.peer.on("error", error => {
            this.events.emit("error", {error});
            console.error(error);
        })
        this.peer.on("connection", conn => {
            this.addConnection(conn);
        });
    }

    /**
     * @param {EventName} event_name
     * @param {(any) => void} callback
     * @returns {void}
     */
    on(event_name, callback) {
        this.events.on(event_name, callback);
    }

    /**
     * @param {EventName} event_name
     * @returns {void}
     */
    off(event_name) {
        this.events.off(event_name);
    }

    connect(id) {
        if(this.hasConnection() || this.isConnectedTo(id) || this.isThis(id)) return;
        const conn = this.peer.connect(id);
        this.addConnection(conn);
    }
    disconnect(id) {
        const conn = this.isConnectedTo(id);
        if(!conn) return;
        conn.close();
    }
    addConnection(conn) {
        this.connected = true;
        this.connections.push(conn);
        conn.on("data", ({type, id, data, conns}) => {
            switch(type) {
                case "data": {
                    this.events.emit("data", {
                        from: conn.peer,
                        data
                    });
                } break;
                case "sync": {
                    conns.forEach(cid => this.connect(cid));
                } break;
            }
        });
        conn.on("close", () => {
            this.connections = this.connections.filter(c => c !== conn);
            this.events.emit("disconnect", {id: conn.peer});
        });
        conn.on("open", () => {
            this.events.emit("connect", {id: conn.peer});
            conn.send({
                type: "sync",
                conns: this.connections.map(c => c.peer)
            });
        });
        conn.on("error", console.error);
    }

    broadcast(data) {
        this.connections.forEach(c => {
            c.send(data);
        })
    }
    sendData(data) {
        this.broadcast({
            type: "data",
            data
        });
    }
    sendDataTo(id, data) {
        this.isConnectedTo(id)?.send({
            type: "data",
            data
        });
    }

    isThis(id) {
        return this.id === id;
    }
    isConnectedTo(id) {
        return this.connections.find(c => c.peer === id);
    }
    hasConnection() {
        return this.connections.length > 0;
    }
};
window.Network = Network;
