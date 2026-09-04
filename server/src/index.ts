import express from "express";
import "dotenv/config"
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { errorHandler } from "./middleware/errror-handler.middleware";
import cors from "cors"
import { functions, inngest } from "./inngest";
import { serve } from "inngest/express";


const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);

app.get("/health", (req, res) => {
    res.send("Every thing woks perfictly")
});

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log("Server is running on port 3000");
})