import { BaseEntity } from "./deserializable";

export class Token extends BaseEntity{
    access_token?: string
    refresh_token?: string

    FIELDS: string[] = ['access_token', 'refresh_token'];
}
