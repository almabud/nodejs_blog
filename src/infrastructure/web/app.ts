import fs from "fs";
import express from "express";
import { Request, Response } from "express";
import { MongoDb } from "../db/mongo_db";
import swaggerUi from "swagger-ui-express"
import morgan from "morgan";

import { UserController } from "../../controllers/user_controllers";
import { userRouter } from "./routes/users";

const app = express();

new MongoDb('mongodb://root:root@127.0.0.1:27017/?authMechanism=DEFAULT').connect();

app.use(express.json());
// For log the request
app.use(morgan("tiny"));

// swagger docs
const swaggerFile: any = (__dirname + "/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app.use('/swagger/', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use('/users', userRouter);

app.post('/login', async (request, response)=> {
    let finalRes = await new UserController(request).login();

    return response.status(finalRes['status_code']).send(finalRes)
})



app.listen(4000, ()=>{
    console.log("Application listening at http://localhost:4000");
});