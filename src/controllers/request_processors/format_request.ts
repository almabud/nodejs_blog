import { BaseRequestProcessor } from './base_request_processor';
import { BaseRequest } from '../../entity/request'


/**
 * This request processor should be run at the begenning of all request processors.
 */
export class FormatRequest implements BaseRequestProcessor {
    async process(request: { [key: string]: any } | BaseRequest): Promise<BaseRequest> {
        return new BaseRequest().deserialize({'data': request['body'], ...request})
    }
}