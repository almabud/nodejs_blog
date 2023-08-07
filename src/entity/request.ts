import { Deserializable } from "./deserializable";

export class Request extends Deserializable{
    data = {};
    method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH' = 'GET'
    query_params: Object = {}
    path_params: Object = {}
    header: Object = {}
}

