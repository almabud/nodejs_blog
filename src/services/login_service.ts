import { Token } from '../entity/token';
import { User } from '../entity/user';
import { ValidationError } from '../errors/errors';
import { TokenRepo } from '../repositories/token_repo';
import { UserRepo } from '../repositories/user_repo';
import { BaseService } from './base_service';
import { validateEmail } from './validators/validators';


export class LoginService implements BaseService{
    repo: UserRepo;
    token_repo: TokenRepo;
    
    constructor(repo: UserRepo, token_repo: TokenRepo){
        this.repo = repo;
        this.token_repo = token_repo;
    }

    async execute(data: {'email': string, 'password': string}, secrete: string): Promise<Token>{
        if(!validateEmail(data.email)){
            throw new ValidationError('', {'email': ['Provide a valid email.']})
        }
        try{
            let user = await this.repo.get({'email': data.email});
            // Check password.
            if(!await user.check_password(data.password)){
                throw new ValidationError();
            }

            return await this.token_repo.create({'id': user.id!}, secrete);
        }catch{
            throw new ValidationError('Incorrect email & password');
        }
    }
}
