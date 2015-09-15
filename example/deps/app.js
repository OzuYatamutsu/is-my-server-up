window.WebSocket = window.WebSocket || window.MozWebSocket;
var endpoints = [];
var conn = new WebSocket("ws://127.0.0.1:1337");
conn.onmessage = function (event) {
    console.log(event.data); // DEBUG
    var payload = JSON.parse(event.data);
    if (endpoints.indexOf(payload.socket) === -1) {
        endpoints.push(payload.socket);
        injectHtml(payload.socket, getReliability(payload.socket), payload.status);
    }
}

function injectHtml(endpoint, reliability, status) {
    document.getElementById("endpoints").innerHTML +=
        generateHtml(endpoint, reliability, status);
}

function generateHtml(endpoint, reliability, status) {
    return '<tr class="endpoint' + statusToString(status)
        + '"><td class="host">' + endpoint 
        + '</td><td class="reliability-5m">' + reliability["5m"]
        + '</td><td class="reliability-1h">' + reliability["1h"]
        + '</td><td class="reliability-1d">' + reliability["1d"]
        + '</td><td class="status">' + statusToString(status)
        + '</td></tr>'
}

function statusToString(status) {
    return status ? "Up" : "Down";
}

function getReliability(endpoint) {
    return { "5m": "N/A", "1h": "N/A", "1d": "N/A" }; // DEBUG
}