/// <reference path="node.d.ts" />
var net = require("net");

enum TransportProtocol {
    TCP,
    UDP,
}

/**
 * Represents a given host and port. Handles checking whether a host 
 * is up or not, as well as if it is accessible on the given port.
 */
class MonitoredSocket {
    constructor(
        public endpoint: string,
        public port: number,
        public type: TransportProtocol
    ) { }

    /**
     * Returns whether the host is up or not.
     */
    isUp(): boolean {
        return false; // TODO
    }

    /**
     * Returns whether the host can be accessed on its port.
     */
    isAccessible(): boolean {
        return false; // TODO
    }

    toString(): string {
        return "Monitoring " + this.endpoint
            + " on " + TransportProtocol[this.type]
            + " port " + this.port;
    }
}