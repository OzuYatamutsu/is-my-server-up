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
    private getAll: sqlite.Statement;

    constructor(sockets: string[]) {
        if (!fs.existsSync(this.dbName)) {
            // Create and init database
            this.db = new sqlite.Database(this.dbName);
            this.db
                .exec("CREATE TABLE Sockets (socket TEXT PRIMARY KEY, t_5m REAL, t_1h REAL, t_1d REAL, UNIQUE(socket))")
                .exec("CREATE TABLE Status (socket TEXT, datetime INTEGER, status INTEGER, UNIQUE(datetime))");
            console.log("Initialized database");
        }

        else {
            // Just open it
            this.db = new sqlite.Database(this.dbName);
            console.log("Loaded database");
        }

        this.prepareStatements();
        for (var i = 0; i < sockets.length; i++) {
            this.db.run("INSERT OR IGNORE INTO Sockets(socket, t_5m, t_1h, t_1d) VALUES ((?), 1, 1, 1)", sockets[i]);
        }

        console.log("Database ready!");
    }

    update(socket: string, status: boolean): void {
        // Unix time, in seconds
        var currentTime = Math.floor(Date.now() / 1000);

        this.updateStatus.run(socket, currentTime, status);

        this.get5mPercent.get((err, row) => {
            this.update5mPercent.run(row, socket);
        }, socket, currentTime);

        this.get1hPercent.get((err, row) => {
            this.update1hPercent.run(row, socket);
        }, socket, currentTime);

        this.get1dPercent.get((err, row) => {
            this.update1dPercent.run(row, socket);
        }, socket, currentTime);
    }

    prepareStatements(): void {
        this.updateStatus = this.db.prepare("INSERT OR IGNORE INTO Status (socket, datetime, status) VALUES (?, ?, ?)");
        this.get5mPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 300)");
        this.get1hPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 3600)");
        this.get1dPercent = this.db.prepare("SELECT AVG(status) as avg FROM (SELECT status FROM Status WHERE socket = (?) AND datetime >= (?) - 86400)");
        this.update5mPercent = this.db.prepare("UPDATE Sockets SET t_5m = (?) WHERE socket = (?)");
        this.update1hPercent = this.db.prepare("UPDATE Sockets SET t_1h = (?) WHERE socket = (?)");
        this.update1dPercent = this.db.prepare("UPDATE Sockets SET t_1d = (?) WHERE socket = (?)");
        this.getAll = this.db.prepare("SELECT t_5m, t_1h, t_1d FROM Sockets WHERE socket = (?)");
    }

    getReliability(socket: string, callback: { (stats: Object, conn?: any): void }, conn?: any): void {
        var t_5m, t_1h, t_1d: number;
        var result: Object;
        this.getAll.get((err, row) => {
            t_5m = row["t_5m"];
            t_1h = row["t_1h"];
            t_1d = row["t_1d"];
            result = this.serialize(t_5m, t_1h, t_1d);
            callback(result, conn);
        });
    }

    serialize(t_5m: number, t_1h: number, t_1d: number): Object {
        return {
            "t_5m": t_5m,
            "t_1h": t_1h,
            "t_1d": t_1d
        };
    }
}

export = Sqlite;