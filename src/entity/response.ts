import { BaseEntity, Deserializable } from "./deserializable";
import { BaseHeaders } from "./request";


export class BaseResponse extends BaseEntity{
    data?: BaseEntity
    errors: {[key: string]: string[]} = {}
    message?: string
    status_code: number = 200
    status: 'Success' | 'Error' = 'Success'
    headers?: BaseHeaders
}


export class SuccessResponse extends BaseResponse{
    FIELDS = ['data', 'status', 'status_code'];
}


export class ErrorResponse extends BaseResponse{
    FIELDS = ['status', 'status_code', 'headers', 'message']

    json(){
        if(Object.keys(this.errors).length > 0){
            this.FIELDS.push('errors');
        }
        
        return super.json();
    }
}
