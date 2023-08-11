import { SuccessResponse } from "../entity/response";
import { User } from "../entity/user";
import { CreateUserService } from "../services/createuser_service";
import { GetUserService } from "../services/user_service";
import { BaseController } from "./base_controller";
import { PermissionProcessor, RequestProcessor } from "./decorators";

// @RequestProcessor
export class UserController extends BaseController{
    @PermissionProcessor(['Authenticated'])
    async get_users(){
        let service = new GetUserService(this.request?.config.REPO_MAP['UserRepo']);
        let data = await service.execute()
        return new SuccessResponse().deserialize({"data": data})
    }

    @PermissionProcessor(['AllowAny'])
    async register_user(){
        let service = new CreateUserService(this.request?.config.REPO_MAP["UserRepo"]);
        let data = await service.execute(this.request?.data);
        return data;
    }
}
