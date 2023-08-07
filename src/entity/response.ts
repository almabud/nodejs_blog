import { Deserializable } from "./deserializable";


export class Response extends Deserializable{
    data?: Object
    status_code: number = 200
    status: 'Success' | 'Error' = 'Success'
    header?: Object

    json(): Object {
        return {
            "status": this.status,
            "data": this.data
        }
    }

}