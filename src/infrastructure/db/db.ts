export interface Db{
    _db_url: string;

    connect(): Promise<void>;
    set db_url(db_url: string);
    get db_url(): string;
}