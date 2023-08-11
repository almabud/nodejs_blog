export interface BaseRepo<T>{
    model: T | any

    filter(filters?: Object): Promise<T[]>;
    get(filters: {[key: string]: any}): Promise<T>;
    get_by_id(id: string): Promise<T>;
    create(data: T): Promise<T>;
}
