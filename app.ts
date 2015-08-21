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
    for (var sock in monitoredSocks) {
        sock.connect();
        output += sock.isUp;
    }

    return output;
}

init();

http.createServer(function (request, response) {
    response.write(processResponse());
    response.end();
}).listen(listenPort, listenIp);

console.log("Now listening on " + listenIp + ":" + listenPort);