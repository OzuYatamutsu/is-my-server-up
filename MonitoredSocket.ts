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

    connect(successCallback: { (sock: MonitoredSocket, conn?: any): void },
        failCallback: { (sock: MonitoredSocket, conn?: any): void }, conn?: any): void {
        this.socket.connect(
            this.port,
            this.endpoint,
            this.onConnectSuccess.bind(this, successCallback, conn)
        );

        this.socket.on("error", this.onConnectFailure.bind(this, failCallback, conn));
    }

    onConnectSuccess(callback: { (sock: MonitoredSocket, conn?: any): void }, conn?: any) {
        this.isUp = true;

        // We're good! Close the socket
        this.socket.end();

        callback(this, conn);
    }

    onConnectFailure(callback: { (sock: MonitoredSocket, conn?: any): void }, conn?: any) {
        this.isUp = false;

        // Cleanup
        this.socket.destroy();

        callback(this, conn);
    }

    toString(): string {
        return this.endpoint + ":" + this.port;
    }

    serialize(): string {
        return JSON.stringify({
            "socket": this.endpoint + ":" + this.port,
            "status": this.isUp
        });
    }
}

export = MonitoredSocket;