import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';

import { Token } from '../../../entity/token';
import { User } from '../../../entity/user';
import { TokenRepo, TokenSign } from '../../../repositories/token_repo';
import { AuthenticationFailed } from '../../../errors/errors';


export class JwtTokenRepo implements TokenRepo {
    model = Model<User>;
    entity = new Token();

    REFRESHTOKEN_EXPIRY = '7d';
    ACCESSTOKEN_EXPIRY = '30m';

    constructor(model: Model<User>){
        this.model = model;
    }

    async create(data:{'id': string}, secrete: string): Promise<Token> {
        return this.format_data({
            'access_token': await this.generate_access_token(data, secrete), 
            'refresh_token': await this.generate_refresh_token(data, secrete)
        });

    }

    async validate(token: string, secrete: string): Promise<TokenSign | any> {
        try{
            return await jwt.verify(token, secrete);
        }catch(error){
            if(error instanceof Error){
                throw new AuthenticationFailed(error.message)
            }else{
                throw error;
            }
        }
    }

    async generate_access_token(data: { 'id': string }, secrete: string): Promise<string> {
        const token = jwt.sign({ 'id': data.id }, secrete, { expiresIn: this.ACCESSTOKEN_EXPIRY }); // Refresh token expires in 7 days

        return token;
    }

    async generate_refresh_token(data: { 'id': string }, secrete: string): Promise<string> {
        const token = jwt.sign({ 'id': data.id }, secrete, { expiresIn: this.REFRESHTOKEN_EXPIRY }); // Refresh token expires in 7 days

        return token;

    }

    format_data(data: {'access_token': string, 'refresh_token': string}): Token {
        let res: Token = this.entity.deserialize(data)
        
        return res;
    }

}