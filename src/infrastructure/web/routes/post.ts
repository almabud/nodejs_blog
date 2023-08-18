import express from "express";

import { UserController } from "../../../controllers/user_controllers";
import { UserPostController } from "../../../controllers/users/user_post_controllers";


export const postRouter = express.Router();

postRouter
.get('/', async (request, response) => {
    return response.send(await new UserPostController(request).get_posts())
})
// .post('/', async(request, response) => {
//     let finalRes = await new UserController(request).register_user();
//     return response.status(finalRes['status_code']).send(finalRes)
// })
