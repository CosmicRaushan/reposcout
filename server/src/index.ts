import express from "express";
import "dotenv/config"
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { errorHandler } from "./middleware/errror-handler.middleware";

const app = express();
const PORT = process.env.PORT;

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.get("/health", (req, res) => {
    res.send("Every thing woks perfictly")
});

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log("Server is running on port 3000");
})