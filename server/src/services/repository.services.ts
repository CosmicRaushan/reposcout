import type { Prisma } from "../generated/client";
import prisma from "../lib/db";


export const repositorySelect = {
    id: true,
    name: true,
    githubUrl: true,
    owner: true,
    repoName: true,
    status: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type createRepositoryData = {
    name: string,
    githubUrl: string,
    owner: string,
    repoName: string,
    status?: RepositoryRecord["status"],
    userId: string,
}

export type RepositoryRecord = Prisma.RepositoryGetPayload<{
    select: typeof repositorySelect;
}>


export async function createRepository(data: createRepositoryData) {

    const existingRepository = await prisma.repository.findFirst({
        where: {
            userId: data.userId,
            owner: data.owner,
            repoName: data.repoName
        }
    });

    if (existingRepository) {
        throw new Error(`This is already exist`)
    }

    return await prisma.repository.create({
        data: {
            name: data.name,
            owner: data.owner,
            repoName: data.repoName,
            githubUrl: data.githubUrl,
            user: {
                connect: { id: data.userId }
            },
            ...(data.status !== undefined ? { status: data.status } : {}),
        },
        select: repositorySelect
    })
}

export async function getRepositoryById(repoId: string, userId: string) {
    return await prisma.repository.findUnique({
        where: {
            id: repoId,
            userId,
        },
        select: repositorySelect
    })
};

export async function getRepositoryByUserId(userId: string) {
    return await prisma.repository.findMany({
        where: {
            userId: userId
        },
        select: repositorySelect
    })
};

export async function updateRepositoryStatus(
    repoId: string,
    data: {
        status?: RepositoryRecord["status"]
    }
) {
    return await prisma.repository.update({
        where: {
            id: repoId
        },
        data,
        select: repositorySelect
    })
};

export async function deleteRepository(repoId: string, userId: string) {
    return await prisma.repository.delete({
        where: {
            id: repoId,
            userId,
        }
    })
};

export async function getRepositoryByUserAndKey(
    userId: string,
    owner: string,
    repoName: string,
) {
    return prisma.repository.findFirst({
        where: { userId, owner, repoName },
        select: repositorySelect,
    });
}