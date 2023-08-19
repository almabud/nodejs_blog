import { Post } from "../entity/post";
import { ValidationError } from "../errors/errors";
import { PostService } from "./post_service";


export class CreatePostService extends PostService{
    private validate_required(post: { [key: string]: any }) {
        let errors: { [key: string]: string[] } = {}
        for (const field of ['title', 'content', 'author']) {
            if (
                !(
                    post.hasOwnProperty(field) &&
                    typeof post[field] === 'string' &&
                    post[field] !== null &&
                    post[field] !== undefined &&
                    post[field] !== ''
                )) {
                errors[field] = ['This field is required']
            }
        }
        if (Object.keys(errors).length > 0) {
            throw new ValidationError('', errors);
        }
    }

    private async validate(validated_data: { [key: string]: any }){
        this.validate_required(validated_data);

        return validated_data
    }

    async execute(data: { [key: string]: any }): Promise<Post|Post[]|any> {
        let validated_data = await this.validate(data);
        let post_data = new Post().deserialize(validated_data);
        
        return await this.repo.create(post_data);
    }
}