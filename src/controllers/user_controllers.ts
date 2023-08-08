import { SuccessResponse } from "../entity/response";
import { User } from "../entity/user";
import { GetUserService } from "../services/user_service";
import { BaseController } from "./base_controller";
import { PermissionProcessor, RequestProcessor } from "./decorators";

// @RequestProcessor
export class UserController extends BaseController{
    @PermissionProcessor(['AllowAny'])
    async get_users(){
        let service = new GetUserService(this.request?.config.REPO_MAP['UserRepo']);
        let data = await service.execute()
        return new SuccessResponse().deserialize({"data": data})
    }
}