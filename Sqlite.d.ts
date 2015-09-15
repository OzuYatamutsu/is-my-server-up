declare class Sqlite {
    private dbName;
    private db;
    private checkIfExists;
    private updateStatus;
    private get5mPercent;
    private get1hPercent;
    private get1dPercent;
    private update5mPercent;
    private update1hPercent;
    private update1dPercent;
    constructor(sockets: string[]);
    update(socket: string, status: boolean): void;
    prepareStatements(): void;
}
export = Sqlite;
