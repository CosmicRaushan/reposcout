import { Router } from "express";
import { parseRepo } from "../services/github";
import { inngest } from "../inngest";
import { requireAuth } from "../middleware/require-auth.middleware";
import { createRepository } from "../services/repository.services";

const router = Router();

router.use(requireAuth);

router.post("/", async (req, res, next) => {
    try {
        const { repo } = req.body ?? {};

        if (!repo) {
            return res.status(400).json({
                error: "repo is required",
            });
        }

        const githubToken =
            req.body.githubToken || process.env.GITHUB_TOKEN;

        if (!githubToken) {
            return res.status(400).json({
                error: "GitHub token is required",
            });
        }

        const {
            owner,
            repo: repoName,
            repoKey,
        } = parseRepo(repo);

        const repository = await createRepository({
            name: repoName,
            githubUrl: repo,
            owner,
            repoName,
            userId: req.session!.user.id,
        });

        await inngest.send({
            name: "repo/index.requested",
            data: {
                repositoryId: repository.id,
                githubToken,
                owner,
                repo: repoName,
                repoKey,
            },
        });

        return res.status(202).json({
            success: true,
            repositoryId: repository.id,
            status: repository.status,
            message: "Repository indexing started",
        });
    } catch (error) {
        return next(error);
    }
});

export default router;