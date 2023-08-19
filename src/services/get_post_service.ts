import { Post } from '../entity/post';
import { PostRepo } from '../repositories/post_repo';
import { PostService } from './post_service';


export class GetPostService implements PostService{
    repo: PostRepo;
    
    constructor(repo: PostRepo){
        this.repo = repo;
    }

    async execute(): Promise<Post[]> {
        return await this.repo.filter()
    }
}