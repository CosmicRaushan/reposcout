import express from "express";
import "dotenv/config"

const app = express();
const PORT = process.env.PORT;


app.get("/health", (req, res) => {
    res.send("Every thing woks perfictly")
});

app.listen(PORT, ()=>{
    console.log("Server is running on port 3000");
})