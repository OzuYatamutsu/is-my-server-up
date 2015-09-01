/// <reference path="MonitoredSocket.ts" />
import MonitoredSocket = require("./MonitoredSocket");
import http = require("http");
import fs = require("fs");
var config = require("./config");

var listenIp: string = config.serv.ip;
var listenPort: number = config.serv.port;

var responseData: string = fs.readFileSync("index.html", "utf-8");
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

    console.log("DEBUG_TEST " + monitoredSocks[0].isUp);
    return output;
}

function sockUp(sock: MonitoredSocket): void {
    console.log(sock.toString() + " is up!");
    // TODO
}

function sockDown(sock: MonitoredSocket): void {
    console.log(sock.toString() + " is down!");
    // TODO
}

init();

http.createServer(function (request, response) {
    response.write(processResponse());
    response.end();
}).listen(listenPort, listenIp);

console.log("Now listening on " + listenIp + ":" + listenPort);