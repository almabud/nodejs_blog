import jwt from 'jsonwebtoken'; 

import { BaseRequest } from "../../entity/request";
import { AuthenticationFailed } from "../../errors/errors";
import { BaseRequestProcessor } from "./base_request_processor";
import { AnonymousUser } from '../../entity/user';


export class Authenticate implements BaseRequestProcessor {
    async process(request: BaseRequest): Promise<BaseRequest> {
        if (request.headers && request.headers.authorization) {
            const authHeader = request.headers.authorization;
            const token = authHeader.split(' ')[1];

            try {
                const decodedToken = jwt.verify(token, request.config.SECRETE) as any;
                request.user = decodedToken; // Assign the user object to the request
            } catch (err) {
                request.user = new AnonymousUser();
            }
        } else {
            // User is unquthenticated so initiate AnonymouseUser.
            request.user = new AnonymousUser();
        }

        return request;
    }
}
