/// <reference path="MonitoredSocket.ts" />
import MonitoredSocket = require("./MonitoredSocket");
import http = require("http");
import fs = require("fs");
var config = require("./config");

var listenIp: string = config["serv"].ip;
var listenPort: number = config["serv"].port;

var responseData: string = fs.readFileSync("index.html", "utf-8");
var monitoredSocks: Array<MonitoredSocket>;

function init(): void {
    for (var service in config["services"]) {
        monitoredSocks.push(
            new MonitoredSocket(service.endpoint, service.port)
        );
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