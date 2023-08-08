import { BaseRequest } from '../../entity/request';


export interface BaseRequestProcessor{
    process(request: Request | BaseRequest | Object): Promise<BaseRequest>;
}
