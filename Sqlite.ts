import sqlite = require("sqlite3");
import fs = require("fs");

var dbName: string = "server-up-rel.db";
var db: sqlite.Database;

// Prepared statements
var checkIfExists: sqlite.Statement;
var updateStatus: sqlite.Statement;
var get5mPercent: sqlite.Statement;
var get1hPercent: sqlite.Statement;
var get1dPercent: sqlite.Statement;
var update5mPercent: sqlite.Statement;
var update1hPercent: sqlite.Statement;
var update1dPercent: sqlite.Statement;

function init(sockets: string[]): void {
    if (fs.existsSync(dbName)) {
        // Create and init database
        db = new sqlite.Database(dbName);
        db.run("CREATE TABLE Sockets (socket TEXT PRIMARY KEY, t_5m REAL, t_1h REAL, t_1d REAL, UNIQUE(socket))");
        db.run("CREATE TABLE Status (socket TEXT, datetime INTEGER, status INTEGER, UNIQUE(datetime))");
    }
        
    else
        // Just open it
        db = new sqlite.Database(dbName);

    for (var socket in sockets) {
        db.run("INSERT OR IGNORE INTO Sockets(socket, t_5m REAL, t_1h REAL, t_1d REAL) VALUES ((?), 1, 1, 1)", socket);
    }

    prepareStatements();
}

function update(socket: string, status: boolean): void {
    // Unix time, in seconds
    var currentTime = Math.floor(Date.now() / 1000);

    updateStatus.run(socket, currentTime, status);
    update5mPercent.run(get5mPercent.run(socket, currentTime), socket);
    update1hPercent.run(get1hPercent.run(socket, currentTime), socket);
    update1dPercent.run(get1dPercent.run(socket, currentTime), socket);
}

function prepareStatements() {
    updateStatus = db.prepare("INSERT INTO Status (socket, datetime, status) VALUES (?, ?, ?)");
    get5mPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 300)");
    get1hPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 3600)");
    get1dPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 86400)");
    update5mPercent = db.prepare("UPDATE Sockets SET t_5m = (?) WHERE socket = (?)");
    update1hPercent = db.prepare("UPDATE Sockets SET t_1h = (?) WHERE socket = (?)");
    update1dPercent = db.prepare("UPDATE Sockets SET t_1d = (?) WHERE socket = (?)");
}