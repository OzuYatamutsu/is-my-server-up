/// <reference path="MonitoredSocket.ts" />
import MonitoredSocket = require("./MonitoredSocket");

var testSocket = new MonitoredSocket("google.com", 80);

window.onload = () => {
    var el = document.getElementById('content');
    testSocket.connect();
    el.textContent = "Hello, world!";
};