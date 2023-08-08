import { BaseRequest } from '../../entity/request'
import { BaseResponse } from '../../entity/response'
import {BaseResponseProcessor} from './base_response_processor'


/**
 * This reponse should responsible for creating plain object.
 * This class should be processed after compliting the all response processors.
 */
export class DeliverResponse implements BaseResponseProcessor{
    /**
     * 
     * @param {BaseRequest} request     - A BaseRequest object
     * @param {BaseResponse} response   - A BaseResponse object
     * @returns plain object {}         - A plain object
     */
    async process(request: BaseRequest, response: BaseResponse & {}): Promise<BaseResponse | {}> {
        return response.json();
    }

}