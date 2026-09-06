import type { NextFunction, Request, Response } from "express";
import { inngest } from "../inngest";
import { parseRepo } from "../services/github";
import {
    createChatQuestion,
    getChatQuestionsByRepository,
    getChatQuestionById,
} from "../services/chat.services";
import { getRepositoryByUserAndKey } from "../services/repository.services";

export async function createChatQuestionController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { repo, question } = req.body ?? {};

        if (!repo || !question) {
            return res.status(400).json({
                error: "repo and question are required",
            });
        }

        const { owner, repo: repoName, repoKey } = parseRepo(repo);
        const userId = req.session!.user.id;
        const repository = await getRepositoryByUserAndKey(
            userId,
            owner,
            repoName,
        );

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (repository.status !== "COMPLETED") {
            return res.status(409).json({
                error: "Repository indexing is not completed",
                status: repository.status,
            });
        }

        const chatQuestion = await createChatQuestion({
            repositoryId: repository.id,
            userId,
            question,
        });

        await inngest.send({
            name: "chat/question.requested",
            data: {
                questionId: chatQuestion.id,
                repo: repoKey,
                question,
            },
        });

        return res.status(202).json({
            success: true,
            question: chatQuestion,
            message: "Question processing started",
        });
    } catch (error) {
        return next(error);
    }
}

export async function getChatQuestionController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const questionId = req.params.id;

        if (typeof questionId !== "string") {
            return res.status(400).json({ error: "Invalid question ID" });
        }

        const question = await getChatQuestionById(
            questionId,
            req.session!.user.id,
        );

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        return res.json({ success: true, question });
    } catch (error) {
        return next(error);
    }
}

export async function getChatHistoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const repositoryId = req.query.repositoryId;

        if (typeof repositoryId !== "string" || !repositoryId) {
            return res.status(400).json({
                error: "repositoryId query parameter is required",
            });
        }

        const questions = await getChatQuestionsByRepository(
            repositoryId,
            req.session!.user.id,
        );

        return res.json({ success: true, questions });
    } catch (error) {
        return next(error);
    }
}
