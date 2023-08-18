import { Post } from '../entity/post';
import { DefaultRepo } from './base_repo';


export interface  PostRepo extends DefaultRepo<Post>{}