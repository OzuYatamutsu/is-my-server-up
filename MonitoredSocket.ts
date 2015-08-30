import net = require("net");

/**
 * Represents a given host and port. Handles checking whether a host 
 * is up or not, as well as if it is accessible on the given port.
 */
class MonitoredSocket {
    /**
     * Returns whether the host can be accessed on its port.
     */
    public isUp: boolean;
    private socket: net.Socket;

    constructor(
        public endpoint: string,
        public port: number
    ) {
        this.socket = new net.Socket();
    }

    connect(): void {
        this.socket.connect(
            this.port,
            this.endpoint,
            this.onConnectSuccess.bind(this)
        );

        this.socket.on("error", this.onConnectFailure.bind(this));
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