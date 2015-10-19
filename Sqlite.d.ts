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
    private getAll;
    constructor(sockets: string[]);
    update(socket: string, status: boolean): void;
    prepareStatements(): void;
    getReliability(socket: string, callback: {
        (stats: Object, conn?: any): void;
    }, conn?: any): void;
    serialize(socket: string, t_5m: number, t_1h: number, t_1d: number): Object;
}
export = Sqlite;
