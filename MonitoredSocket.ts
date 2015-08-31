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

    connect(successCallback : void, failCallback : void): void {
        this.socket.connect(
            this.port,
            this.endpoint,
            this.onConnectSuccess.bind(this, successCallback)
        );

        this.socket.on("error", this.onConnectFailure.bind(this, failCallback));
    }

    onConnectSuccess(callback : {(): void}) {
        this.isUp = true;

        // We're good! Close the socket
        this.socket.end();

        callback();
    }

    onConnectFailure(callback: {(): void }) {
        this.isUp = false;

        // Cleanup
        this.socket.destroy();

        callback();
    }

    toString(): string {
        return "Monitoring " + this.endpoint
            + " on port " + this.port;
    }
}

export = MonitoredSocket;