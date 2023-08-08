import { BaseRequest } from "../../entity/request";
import { BasePermissionProcessor } from "./base_permission_processor";


export class AllowAny implements BasePermissionProcessor{
    async has_permission(request: BaseRequest): Promise<boolean> {
        return true;
    }
}
