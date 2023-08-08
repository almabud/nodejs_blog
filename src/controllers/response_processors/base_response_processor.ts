import { BaseRequest } from "../../entity/request";
import { BaseResponse } from "../../entity/response";


export interface BaseResponseProcessor{
    process(request: BaseRequest, response: BaseResponse & {}): Promise<BaseResponse | {}>;
}