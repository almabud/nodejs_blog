import { Post } from '../entity/post';
import { PostRepo } from '../repositories/post_repo';
import { BaseService } from './base_service';


export class GetPostService implements BaseService{
    repo: PostRepo;
    
    constructor(repo: PostRepo){
        this.repo = repo;
    }

    async execute(): Promise<Post[]> {
        return await this.repo.filter()
    }
}