import { BaseRequest } from "../../entity/request";


export interface BasePermissionProcessor{
    has_permission(request: BaseRequest): Promise<boolean>;
}   
