import { Post } from "../../entity/post";
import { PostRepo } from "../../repositories/post_repo";
import { MongoBaseRepo } from "./mongoose/base_repo";


export class MongoPostRepo extends MongoBaseRepo<Post> implements PostRepo{
    
}