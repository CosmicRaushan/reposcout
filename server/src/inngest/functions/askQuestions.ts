import { inngest } from "../client";
import { askQuestion } from "../../services/rag";

export const askQuestions = inngest.createFunction(
    { id: "ask-questions", triggers: [{ event: "chat/question.requested" }] },
    async ({ event, step }) => {
        const { repo, question } = event.data;

        try {
            const result = await step.run("review-and answer", async () => {
                return askQuestion(repo, question)
            })

            return {
                repo,
                question,
                status: "Completed",
                answer: result.answer,
                sources: result.sources
            }
        } catch (error) {
            throw error;
        }
    }
)