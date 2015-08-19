/// <reference path="node.d.ts" />
var net = require("net");
var TransportProtocol;
(function (TransportProtocol) {
    TransportProtocol[TransportProtocol["TCP"] = 0] = "TCP";
    TransportProtocol[TransportProtocol["UDP"] = 1] = "UDP";
})(TransportProtocol || (TransportProtocol = {}));
/**
 * Represents a given host and port. Handles checking whether a host
 * is up or not, as well as if it is accessible on the given port.
 */
var MonitoredSocket = (function () {
    function MonitoredSocket(endpoint, port, type) {
        this.endpoint = endpoint;
        this.port = port;
        this.type = type;
    }
    /**
     * Returns whether the host is up or not.
     */
    MonitoredSocket.prototype.isUp = function () {
        return false; // TODO
    };
    /**
     * Returns whether the host can be accessed on its port.
     */
    MonitoredSocket.prototype.isAccessible = function () {
        return false; // TODO
    };
    MonitoredSocket.prototype.toString = function () {
        return "Monitoring " + this.endpoint
            + " on " + TransportProtocol[this.type]
            + " port " + this.port;
    };
    return MonitoredSocket;
})();
//# sourceMappingURL=socket-check.js.map