import express from "express";
import { Request, Response } from "express";
import { UserController } from "../../controllers/user_controllers";

const app = express();

app.get('/', async (request: Request, response: Response) => {
    debugger;
    return response.send(await new UserController(request).get_users())
});


app.listen(4000, ()=>{
    console.log("Application listening at http://localhost:4000");
})