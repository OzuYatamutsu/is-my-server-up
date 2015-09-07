/// <reference path="MonitoredSocket.ts" />
import MonitoredSocket = require("./MonitoredSocket");
import ws = require("websocket");
import http = require("http");
import fs = require("fs");
var config = require("./config");

var listenIp: string = config.serv.ip;
var listenPort: number = config.serv.port;
var httpServer = http.createServer().listen(listenPort, listenIp);
var wsServer = new ws.server({
    httpServer: httpServer
});

var monitoredSocks: Array<MonitoredSocket> = [];

function init(): void {
    var services = config.services;

    for (var index in services) {
        monitoredSocks.push(
            new MonitoredSocket(
                services[index].endpoint,
                services[index].port
            )
        );

        console.log("Monitoring: " + services[index].endpoint + ":" + services[index].port);
    }
}

function processResponse(): string {
    var output: string = "";
    monitoredSocks.forEach(function (sock) {
        sock.connect(sockUp, sockDown);
    });

    return output;
}

function sockUp(sock: MonitoredSocket): void {
    console.log(sock.toString() + " is up!");
    wsServer.emit(sock.serialize());
}

function sockDown(sock: MonitoredSocket): void {
    console.log(sock.toString() + " is down!");
    wsServer.emit(sock.serialize());
}

wsServer.on('request', function (req) {
    // Not implemented
});

init();

console.log("Now listening on " + listenIp + ":" + listenPort);