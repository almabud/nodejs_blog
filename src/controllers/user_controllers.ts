import { User } from "../entity/user";
import { BaseController } from "./base_controller";
import { PermissionProcessor, RequestProcessor } from "./decorators";

// @RequestProcessor
export class UserController extends BaseController{
    @PermissionProcessor(['Authenticated'])
    async get_users(){
        return new User().deserialize({
            "id": "1234567",
            "name": "Almabud",
            "email": "t@test.com"
        })
    }
}