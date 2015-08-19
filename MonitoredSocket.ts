var net = require("net");

/**
 * Represents a given host and port. Handles checking whether a host 
 * is up or not, as well as if it is accessible on the given port.
 */
class MonitoredSocket {
    /**
     * Returns whether the host can be accessed on its port.
     */
    public isUp: boolean;
    private socket: any;

    constructor(
        public endpoint: string,
        public port: number
        ) { }

    connect(): void {
        this.socket = net.socket();
        this.socket.connect(
            this.port,
            this.endpoint,
            this.onConnectSuccess
        );

        this.socket.on("error", this.onConnectFailure);
    }

    onConnectSuccess(): void {
        this.isUp = true;
        console.log("CONNECTED"); // DEBUG

        // We're good! Close the socket
        this.socket.end();
    }

    onConnectFailure(): void {
        this.isUp = false;
        console.log("NOT CONNECTED"); // DEBUG

        // Cleanup
        this.socket.destroy();
    }

    toString(): string {
        return "Monitoring " + this.endpoint
            + " on port " + this.port;
    }
}

export = MonitoredSocket;