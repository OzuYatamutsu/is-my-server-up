﻿import sqlite = require("sqlite3");
import fs = require("fs");
import q = require("q");

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

    constructor(sockets: string[]) {
        q.fcall(() => {
            if (!fs.existsSync(this.dbName)) {
                // Create and init database
                this.db = new sqlite.Database(this.dbName);
                q.fcall(() => {
                    this.db.run("CREATE TABLE Sockets (socket TEXT PRIMARY KEY, t_5m REAL, t_1h REAL, t_1d REAL, UNIQUE(socket))");
                    this.db.run("CREATE TABLE Status (socket TEXT, datetime INTEGER, status INTEGER, UNIQUE(datetime))"); // Race condition?
                }).then(() => {
                    console.log("Initialized database");
                });
            }

            else {
                // Just open it
                this.db = new sqlite.Database(this.dbName);
                console.log("Loaded database");
            }
        }).then(() => {
            this.prepareStatements();
            for (var socket in sockets) {
                this.db.run("INSERT OR IGNORE INTO Sockets(socket, t_5m, t_1h, t_1d) VALUES ((?), 1, 1, 1)", socket);
            }
        }).then(() => {
            console.log("Database ready!");
        });
    }

    update(socket: string, status: boolean): void {
        // Unix time, in seconds
        var currentTime = Math.floor(Date.now() / 1000);

        this.updateStatus.run(socket, currentTime, status);
        this.update5mPercent.run(this.get5mPercent.run(socket, currentTime), socket);
        this.update1hPercent.run(this.get1hPercent.run(socket, currentTime), socket);
        this.update1dPercent.run(this.get1dPercent.run(socket, currentTime), socket);
    }

    prepareStatements(): void{
        this.updateStatus = this.db.prepare("INSERT OR IGNORE INTO Status (socket, datetime, status) VALUES (?, ?, ?)");
        this.get5mPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 300)");
        this.get1hPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 3600)");
        this.get1dPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 86400)");
        this.update5mPercent = this.db.prepare("UPDATE Sockets SET t_5m = (?) WHERE socket = (?)");
        this.update1hPercent = this.db.prepare("UPDATE Sockets SET t_1h = (?) WHERE socket = (?)");
        this.update1dPercent = this.db.prepare("UPDATE Sockets SET t_1d = (?) WHERE socket = (?)");
    }
}

export = Sqlite;