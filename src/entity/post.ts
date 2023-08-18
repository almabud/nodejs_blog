import { BaseEntity } from "./deserializable";


export class Post extends BaseEntity{
    id?: string;
    title?: string;
    content?: string;
}
