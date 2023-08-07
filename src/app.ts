import express from "express";
import { Request, Response } from "express";

const app = express();

app.get('/', (request: Request, response: Response) => {
    debugger;
    return response.send("Hello world")
});


app.listen(3000, ()=>{
    console.log("Application listening at http://localhost:3000");
})