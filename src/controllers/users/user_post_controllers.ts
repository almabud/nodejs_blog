import { SuccessResponse } from "../../entity/response";
import { GetPostService } from "../../services/get_post_service";
import { BaseController } from "../base_controller";
import { PermissionProcessor } from "../decorators";


export class UserPostController extends BaseController{
    @PermissionProcessor(['Authenticated'])
    async get_posts(){
        let service = new GetPostService(this.request?.config.REPO_MAP['PostRepo']);
        let data = await service.execute();

        return new SuccessResponse().deserialize({"data": data})
    }
}