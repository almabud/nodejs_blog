import jwt from 'jsonwebtoken'; 

import { BaseRequest } from "../../entity/request";
import { AuthenticationFailed, UnknownError } from '../../errors/errors';
import { BaseRequestProcessor } from "./base_request_processor";
import { AnonymousUser } from '../../entity/user';
import { AuthenticateService } from '../../services/authenticate_service';


export class Authenticate implements BaseRequestProcessor {
    token_service: AuthenticateService

    constructor(service: AuthenticateService){
        this.token_service = service;
    }

    async process(request: BaseRequest): Promise<BaseRequest> {
        if (request.headers && request.headers.authorization) {
            const authHeader = request.headers.authorization;
            const token = authHeader.split(' ')[1];
            try {
                request.user = await this.token_service.execute(token, request.config.SECRETE); // Assign the user object to the request
            } catch (err) {
                if(err instanceof AuthenticationFailed){
                    throw new AuthenticationFailed('Invalid Token.');
                }
                request.user = new AnonymousUser();
            }
        } else {
            // User is unquthenticated so initiate AnonymouseUser.
            request.user = new AnonymousUser();
        }

        return request;
    }
}
