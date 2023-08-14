import { User } from "../entity/user";
import { DefaultRepo } from "./base_repo";

export interface UserRepo extends DefaultRepo<User>{}