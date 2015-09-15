import sqlite = require("sqlite3");
import fs = require("fs");

class Sqlite {
    private dbName: string = "server-up-rel.db"; // DEBUG
    private db: sqlite.Database;

    // Prepared statements
    private checkIfExists: sqlite.Statement;
    private updateStatus: sqlite.Statement;
    private get5mPercent: sqlite.Statement;
    private get1hPercent: sqlite.Statement;
    private get1dPercent: sqlite.Statement;
    private update5mPercent: sqlite.Statement;
    private update1hPercent: sqlite.Statement;
    private update1dPercent: sqlite.Statement;

    constructor (sockets: string[]): void {
        if (fs.existsSync(this.dbName)) {
            // Create and init database
            this.db = new sqlite.Database(dbName);
            this.db.run("CREATE TABLE Sockets (socket TEXT PRIMARY KEY, t_5m REAL, t_1h REAL, t_1d REAL, UNIQUE(socket))");
            this.db.run("CREATE TABLE Status (socket TEXT, datetime INTEGER, status INTEGER, UNIQUE(datetime))");
        }

        else
            // Just open it
            this.db = new sqlite.Database(dbName);

        for (var socket in sockets) {
            this.db.run("INSERT OR IGNORE INTO Sockets(socket, t_5m REAL, t_1h REAL, t_1d REAL) VALUES ((?), 1, 1, 1)", socket);
        }

        prepareStatements();
    }

    update(socket: string, status: boolean): void {
        // Unix time, in seconds
        var currentTime = Math.floor(Date.now() / 1000);

        this.updateStatus.run(socket, currentTime, status);
        this.update5mPercent.run(get5mPercent.run(socket, currentTime), socket);
        this.update1hPercent.run(get1hPercent.run(socket, currentTime), socket);
        this.update1dPercent.run(get1dPercent.run(socket, currentTime), socket);
    }

    prepareStatements(): void{
        this.updateStatus = db.prepare("INSERT OR IGNORE INTO Status (socket, datetime, status) VALUES (?, ?, ?)");
        this.get5mPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 300)");
        this.get1hPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 3600)");
        this.get1dPercent = db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 86400)");
        this.update5mPercent = db.prepare("UPDATE Sockets SET t_5m = (?) WHERE socket = (?)");
        this.update1hPercent = db.prepare("UPDATE Sockets SET t_1h = (?) WHERE socket = (?)");
        this.update1dPercent = db.prepare("UPDATE Sockets SET t_1d = (?) WHERE socket = (?)");
    }
}

export = Sqlite;