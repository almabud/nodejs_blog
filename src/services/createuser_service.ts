import { User } from "../entity/user";
import { ValidationError } from "../errors/errors";
import { UserRepo } from "../repositories/user_repo";
import { BaseService } from "./base_service";
import { validateEmail } from "./validators/validators";


export class CreateUserService implements BaseService {
    repo: UserRepo

    constructor(repo: UserRepo) {
        this.repo = repo
    }


    private validate_required(user: { [key: string]: any }) {
        let errors: { [key: string]: string[] } = {}
        for (const field of ['name', 'email', 'password', 'confirm_password']) {
            if (
                !(
                    user.hasOwnProperty(field) &&
                    typeof user[field] === 'string' &&
                    user[field] !== null &&
                    user[field] !== undefined &&
                    user[field] !== ''
                )) {
                errors[field] = ['This field is required']
            }
        }
        if (Object.keys(errors).length > 0) {
            throw new ValidationError('', errors);
        }
    }

    private async validate(data: { [key: string]: any }) {
        this.validate_required(data);
        if (data['password'] != data['confirm_password']) {
            throw new ValidationError('', { 'password': [`confirm_password doesn't match.`] });
        }
        // validate email.
        if (!validateEmail(data['email'])) {
            throw new ValidationError('', { 'email': ['Provide a valid email.'] })
        }
        // Duplicate email validation.
        try {
            await this.repo.get({ 'email': data['email'] });
            throw new ValidationError('', { 'email': [`A account with this email (${data['email']}) already exists.`] })
        } catch (error) {
            if(error instanceof ValidationError){
                throw error;
            }
        }

        return data;
    }

    async execute(data: any): Promise<User> {
        let validated_data = await this.validate(data);
        let user_data = new User().deserialize(validated_data);
        // Set password.
        await user_data.set_password();

        return this.repo.create(user_data);
    }
}
