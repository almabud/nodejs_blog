import express from "express";

import { UserController } from "../../../controllers/user_controllers";


export const userRouter = express.Router();

userRouter
.get('/', async (request, response) => {
    return response.send(await new UserController(request).get_users())
})
.post('/', async(request, response) => {
    let finalRes = await new UserController(request).register_user();
    return response.status(finalRes['status_code']).send(finalRes)
})
