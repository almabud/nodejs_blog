import { BaseRequest } from '../../entity/request';
import { BasePermissionProcessor } from './base_permission_processor';


export class Authenticated implements BasePermissionProcessor{
    async has_permission(request: BaseRequest){
        if(request.user){
            return request.user.authenticated;
        }

        return false;
    }
}
