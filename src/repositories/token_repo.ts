import { BaseEntity } from "../entity/deserializable";
import { Token } from "../entity/token";
import { User } from "../entity/user";
import { BaseRepo } from "./base_repo";


export type TokenSign = {'id': string}

export interface TokenRepo  extends BaseRepo<Token>{
    model: any
    entity: Token;

    REFRESHTOKEN_EXPIRY: string;
    ACCESSTOKEN_EXPIRY: string;

    create(data:{'id': string}, secrete: string): Promise<Token>;
    validate(token: string, secrete: string): Promise<TokenSign | any>;
    generate_access_token(data: TokenSign, secrete: string): Promise<string>;
    generate_refresh_token(data: TokenSign, secrete: string): Promise<string>;
}
