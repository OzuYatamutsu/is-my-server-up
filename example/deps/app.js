window.WebSocket = window.WebSocket || window.MozWebSocket;
var conn = new WebSocket("ws://127.0.0.1:1337");
conn.onmessage = function (event) {
    console.log(event.data); // DEBUG
}

function injectHtml(endpoint, reliability, status) {
    document.getElementById("endpoints").innerHTML +=
        generateHtml(endpoint, reliability, status);
}

function generateHtml(endpoint, reliability, status) {
    return '<tr class="endpoint' + status ? "Up" : "Down" 
        + '"><td class="host">' + endpoint 
        + '</td><td class="reliability">' + reliability 
        + '</td><td class="status">' + status ? "Up" : "Down"
        + '</td></tr>'
}