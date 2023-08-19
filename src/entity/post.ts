import { BaseEntity } from "./deserializable";
import { User } from "./user";


export class Post extends BaseEntity{
    id?: string;
    title?: string;
    content?: string;
    author?: User

    FIELDS: string[] = ['id', 'title', 'content', 'author', 'created_at', 'updated_at']
}
