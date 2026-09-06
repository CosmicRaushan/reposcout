import { inngest } from "../client";
import { askQuestion } from "../../services/rag";
import { updateChatQuestion } from "../../services/chat.services";

export const askQuestions = inngest.createFunction(
    { id: "ask-questions", triggers: [{ event: "chat/question.requested" }] },
    async ({ event, step }) => {
        const { repo, question, questionId } = event.data;

        try {
            await step.run("mark-processing", async () => {
                return updateChatQuestion(questionId, {
                    status: "PROCESSING",
                });
            });

            const result = await step.run("review-and answer", async () => {
                return askQuestion(repo, question)
            });

            await step.run("mark-completed", async () => {
                return updateChatQuestion(questionId, {
                    status: "COMPLETED",
                    answer: result.answer,
                    sources: result.sources,
                });
            });

            return {
                questionId,
                repo,
                question,
                status: "Completed",
                answer: result.answer,
                sources: result.sources
            }
        } catch (error) {
            await step.run("mark-failed", async () => {
                return updateChatQuestion(questionId, {
                    status: "FAILED",
                });
            });

            throw error;
        }
    }
)