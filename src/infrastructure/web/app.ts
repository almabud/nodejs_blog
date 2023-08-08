import express from "express";
import { Request, Response } from "express";
import { UserController } from "../../controllers/user_controllers";
import { MongoDb } from "../db/mongo_db";

const app = express();

new MongoDb('mongodb://root:root@127.0.0.1:27017/?authMechanism=DEFAULT').connect();

app.get('/', async (request: Request, response: Response) => {
    return response.send(await new UserController(request).get_users())
});


app.listen(4000, ()=>{
    console.log("Application listening at http://localhost:4000");
})