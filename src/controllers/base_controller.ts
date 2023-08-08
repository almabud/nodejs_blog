import { DecorateAll } from "decorate-all"
import { BaseRequest } from "../entity/request"
import { BaseResponse } from "../entity/response"
import { RequestProcessor } from "./decorators"


@RequestProcessor
export class BaseController {
    request?: BaseRequest
    private _response?: BaseResponse
}
