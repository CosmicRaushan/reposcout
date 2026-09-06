import type { Prisma } from "../generated/client";
import prisma from "../lib/db";

export const chatQuestionSelect = {
    id: true,
    repositoryId: true,
    userId: true,
    question: true,
    status: true,
    answer: true,
    sources: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type ChatQuestionRecord = Prisma.ChatQuestionGetPayload<{
    select: typeof chatQuestionSelect;
}>;

export async function createChatQuestion(data: {
    repositoryId: string;
    userId: string;
    question: string;
}) {
    return prisma.chatQuestion.create({
        data,
        select: chatQuestionSelect,
    });
}

export async function getChatQuestionById(id: string, userId: string) {
    return prisma.chatQuestion.findFirst({
        where: { id, userId },
        select: chatQuestionSelect,
    });
}

export async function getChatQuestionsByRepository(
    repositoryId: string,
    userId: string,
) {
    return prisma.chatQuestion.findMany({
        where: { repositoryId, userId },
        orderBy: { createdAt: "desc" },
        select: chatQuestionSelect,
    });
}

export async function updateChatQuestion(
    id: string,
    data: {
        status?: ChatQuestionRecord["status"];
        answer?: string;
        sources?: Prisma.InputJsonValue;
    },
) {
    return prisma.chatQuestion.update({
        where: { id },
        data,
        select: chatQuestionSelect,
    });
}
