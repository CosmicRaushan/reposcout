import type { Request, Response, NextFunction } from "express";

import {
    createRepository,
    getRepositoryById,
    getRepositoryByUserId,
    deleteRepository,
    updateRepositoryStatus,
} from "../services/repository.services";

export async function createRepositoryController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { name, githubUrl, owner, repoName } = req.body;

        const repository = await createRepository({
            name,
            owner,
            repoName,
            githubUrl,
            userId: req.session!.user.id,
        });

        return res.status(201).json({
            success: true,
            repository,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getRepositoriesController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const repositories = await getRepositoryByUserId(
            req.session!.user.id
        );

        return res.json({
            success: true,
            repositories,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getRepositoryController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const repositoryId = req.params.id;

        if (typeof repositoryId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid repository ID",
            });
        }

        const repository = await getRepositoryById(
            repositoryId,
            req.session!.user.id,
        );

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found",
            });
        }

        return res.json({
            success: true,
            repository,
        });
    } catch (error) {
        return next(error);
    }
}
export async function getRepositoryStatusController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const repositoryId = req.params.id;

        if (typeof repositoryId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid repository ID",
            });
        }

        const repository = await getRepositoryById(
            repositoryId,
            req.session!.user.id,
        );

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found",
            });
        }

        return res.json({
            success: true,
            status: repository.status,
        });
    } catch (error) {
        return next(error);
    }
}

export async function removeRepositoryController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const repositoryId = req.params.id;

        if (typeof repositoryId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid repository ID",
            });
        }

        const repository = await getRepositoryById(
            repositoryId,
            req.session!.user.id,
        );

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found",
            });
        }

        await deleteRepository(repositoryId, req.session!.user.id);

        return res.json({
            success: true,
            message: "Repository deleted successfully",
        });
    } catch (error) {
        return next(error);
    }
}