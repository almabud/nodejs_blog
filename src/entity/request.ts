import { Deserializable } from "./deserializable";
import { User } from "./user";


export interface BaseHeaders{
    authorization?: string;
}

export class BaseRequest extends Deserializable{
    data:{[key: string]: any} = {};
    method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH' = 'GET';
    query_params: Object = {};
    path_params: Object = {};
    headers: BaseHeaders = {};
    user?: User;
    config: any;

    FIELDS: string[] = [
        'data', 
        'method', 
        'query_params', 
        'path_params', 
        'header', 
        'created_at', 
        'updated_at'
    ];
}

