import { Authenticated } from "../controllers/permission_processors/authenticated";
import { BasePermissionProcessor } from "../controllers/permission_processors/base_permission_processor";
import { Authenticate } from "../controllers/request_processors/authenticate";
import { BaseRequestProcessor } from "../controllers/request_processors/base_request_processor";
import { FormatRequest } from "../controllers/request_processors/format_request";
import { BaseResponseProcessor } from "../controllers/response_processors/base_response_processor";
import { DeliverResponse } from "../controllers/response_processors/deliver";
import { BaseEntity } from "../entity/deserializable";
import { User } from "../entity/user";
import { MongoDb } from "../infrastructure/db/mongo_db";
import UserModel from "../infrastructure/repositories/mongoose/models/user";
import { MongoUserRepo } from '../infrastructure/repositories/mongoose/user_repo';
import { BaseRepo, DefaultRepo } from "../repositories/base_repo";
import { AllowAny } from '../controllers/permission_processors/allowany';
import { AuthenticateService } from "../services/authenticate_service";
import { JwtTokenRepo } from "../infrastructure/repositories/mongoose/token_repo";


export class Config {
    SECRETE: string = 'ec307071-721e-43bf-9f04-13a3824944fe';

    REPO_MAP: Record<string, BaseRepo<BaseEntity>> = {
        UserRepo: new MongoUserRepo(UserModel, new User()),
        TokenRepo: new JwtTokenRepo(UserModel)
    };
    REQUEST_PROCESSORS: BaseRequestProcessor[] = [
        new FormatRequest(),
        new Authenticate(new AuthenticateService(
            <MongoUserRepo>this.REPO_MAP['UserRepo'],
            <JwtTokenRepo>this.REPO_MAP['TokenRepo']
        ))
    ];
    RESPONSE_PROCESSORS: BaseResponseProcessor[] = [
        new DeliverResponse()
    ];
    PERMISSION_PROCESSORS: Record<string, BasePermissionProcessor> = {
        Authenticated: new Authenticated(),
        AllowAny: new AllowAny()
    };
}
