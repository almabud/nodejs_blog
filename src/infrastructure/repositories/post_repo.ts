import { Document } from "mongoose";
import { Post } from "../../entity/post";
import { NotFoundError } from "../../errors/errors";
import { PostRepo } from "../../repositories/post_repo";
import { MongoBaseRepo } from "./mongoose/base_repo";
import { User } from "../../entity/user";


export class MongoPostRepo extends MongoBaseRepo<Post> implements PostRepo {
    async filter(filters?: Object | undefined): Promise<Post[]> {
        try {
            const data = await this.model.find().populate('author');
            const res = <Array<Post>>await this.format_data(data);

            return res;
        } catch (error) {
            throw new NotFoundError();
        }
    }

    async to_object(data: Document<any, any, any>): Promise<Post> {
        let object_data = {
            ...data.toObject(),
            "id": data._id.toString()
        };

        if (Object.keys(data?.author).length > 0) {
            object_data.author = new User().deserialize(
                { "id": data.author._id.toString(), ...data.toObject().author }
            );
        }
        return this.entity.deserialize(object_data);
    }
}

