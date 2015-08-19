/// <reference path="MonitoredSocket.ts" />
import MonitoredSocket = require("./MonitoredSocket");
import http = require('http')

http.createServer(function (request, response) {
    response.write("HIYA");
    response.end();
}).listen(1337, '127.0.0.1');

var testSocket = new MonitoredSocket("google.com", 80);