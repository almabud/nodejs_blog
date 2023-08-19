import { Post } from '../entity/post';
import { PostRepo } from '../repositories/post_repo';
import { BaseService } from './base_service';


export class PostService implements BaseService {
    repo: PostRepo;

    constructor(repo: PostRepo) {
        this.repo = repo;
    }

    async execute(data: { [key: string]: any }): Promise<Post[] | Post | any> {}
}