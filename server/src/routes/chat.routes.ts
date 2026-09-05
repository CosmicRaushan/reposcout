import { Router } from "express";
import { inngest } from "../inngest";
import { parseRepo } from "../services/github";


const router = Router();

export async function startChatJobs(repo: string, question: string) {
    const { repoKey } = parseRepo(repo);
    
    await inngest.send({
        name: "chat/question.requested",
        data: { repo: repoKey, question },
    });

    return "check Your inngest"
}

router.post("/", async (req, res, next) => {
   try {
     const { repo, question } = req.body ?? {};
 
     if (!repo || !question) {
         return res.status(400).json({error: "repo and question are required"})
       };
       
       const result = await startChatJobs(repo, question);

       return res.status(200).json({ message: result });
   } catch (error) {
       return next(error)
   }
})


export default router;