
import { User } from "../entity/user";
import { UserRepo } from "../repositories/user_repo";
import { BaseService } from "./base_service";


export class GetUserService implements BaseService{
    repo: UserRepo

    constructor(repo: UserRepo){
        this.repo = repo
    }

    async execute(): Promise<User[]> {
        return this.repo.filter();
    }
}