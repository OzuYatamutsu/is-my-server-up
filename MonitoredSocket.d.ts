/**
 * Represents a given host and port. Handles checking whether a host
 * is up or not, as well as if it is accessible on the given port.
 */
declare class MonitoredSocket {
    endpoint: string;
    port: number;
    /**
     * Returns whether the host can be accessed on its port.
     */
    isUp: boolean;
    private socket;
    constructor(endpoint: string, port: number);
    connect(successCallback: {
        (sock: MonitoredSocket, conn?: any): void;
    }, failCallback: {
        (sock: MonitoredSocket, conn?: any): void;
    }, conn?: any): void;
    onConnectSuccess(callback: {
        (sock: MonitoredSocket, conn?: any): void;
    }, conn?: any): void;
    onConnectFailure(callback: {
        (sock: MonitoredSocket, conn?: any): void;
    }, conn?: any): void;
    toString(): string;
    serialize(): string;
}
export = MonitoredSocket;
