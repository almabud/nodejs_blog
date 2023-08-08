import { BaseEntity } from "../entity/deserializable";
import { BaseRepo } from "../repositories/base_repo";

export interface BaseService{
    repo: BaseRepo<BaseEntity>

    execute(...args: any[]): Promise<any>;
}