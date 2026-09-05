import { Router } from "express";
import { parseRepo } from "../services/github";
import { inngest } from "../inngest";

const router = Router();

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

        const { owner, repo: repoName, repoKey } = parseRepo(repo);

        await inngest.send({
            name: "repo/index.requested",
            data: {
                githubToken,
                owner,
                repo: repoName,
                repoKey,
            },
        });

        return res.status(202).json({
            message: "Repository indexing started",
        });
    } catch (error) {
        return next(error);
    }
});

export default router;