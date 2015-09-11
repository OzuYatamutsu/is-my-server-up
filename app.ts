/// <reference path="MonitoredSocket.ts" />
/// <reference path="Sqlite.ts" />
import MonitoredSocket = require("./MonitoredSocket");
import Sqlite = require("./Sqlite");
var config = require("./config");

// NPM packages
import ws = require("websocket");
import http = require("http");
import fs = require("fs");

var listenIp: string = config.serv.ip;
var listenPort: number = config.serv.port;
var trackReliability: boolean = config.serv.trackReliability;
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

function processResponse(conn: ws.connection): void {
    monitoredSocks.forEach(function (sock) {
        sock.connect(sockUp, sockDown, conn);
    });
}

function sockUp(sock: MonitoredSocket, conn: ws.connection): void {
    console.log(sock.toString() + " is up!");
    conn.send(sock.serialize());
}

function sockDown(sock: MonitoredSocket, conn: ws.connection): void {
    console.log(sock.toString() + " is down!");
    conn.send(sock.serialize());
}

wsServer.on('request', function (req) {
    var connection = req.accept(null, req.origin);
    if (connection != null)
        processResponse(connection);
});

init();

console.log("Now listening on " + listenIp + ":" + listenPort);