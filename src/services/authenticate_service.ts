import { User } from '../entity/user';
import { AuthenticationFailed } from '../errors/errors';
import { TokenRepo } from '../repositories/token_repo';
import { UserRepo } from '../repositories/user_repo';
import { BaseService } from './base_service';


export class AuthenticateService implements BaseService{
    repo: UserRepo;
    token_repo: TokenRepo;

    constructor(repo: UserRepo, token_repo: TokenRepo){
        this.repo = repo;
        this.token_repo = token_repo;
    }

    async execute(token: string, secrete: string): Promise<User> {
            let extracted_token = await this.token_repo.validate(token, secrete);
            if(Object.keys(extracted_token).length > 0){
                return await this.repo.get_by_id(extracted_token['id']);
            }else{
                throw new AuthenticationFailed('Invalid token provided.');
            }
    }
}