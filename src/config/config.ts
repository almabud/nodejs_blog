import { Authenticated } from "../controllers/permission_processors/authenticated";
import { BasePermissionProcessor } from "../controllers/permission_processors/base_permission_processor";
import { Authenticate } from "../controllers/request_processors/authenticate";
import { BaseRequestProcessor } from "../controllers/request_processors/base_request_processor";
import { FormatRequest } from "../controllers/request_processors/format_request";
import { BaseResponseProcessor } from "../controllers/response_processors/base_response_processor";
import { DeliverResponse } from "../controllers/response_processors/deliver";


export class Config{
    SECRETE: string = 'ec307071-721e-43bf-9f04-13a3824944fe';

    REQUEST_PROCESSORS: BaseRequestProcessor[] = [
        new FormatRequest(),
        new Authenticate()
    ];
    RESPONSE_PROCESSORS: BaseResponseProcessor[] = [
        new DeliverResponse()
    ];
    PERMISSION_PROCESSORS: Record<string, BasePermissionProcessor> = {
        Authenticated: new Authenticated()
    };
}
