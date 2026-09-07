import { inngest } from "../client";
import { fetchRepoFiles } from "../../services/github";
import { chunkFiles } from "../../services/chunkers";
import { saveChunks } from "../../services/vectorStore";
import { updateRepositoryStatus } from "../../services/repository.services";

export const indexRepo = inngest.createFunction(
    {
        id: "repo-index",
        triggers: [{ event: "repo/index.requested" }],
    },
    async ({ event, step }) => {
        const {
            githubToken,
            owner,
            repo,
            repositoryId,
        } = event.data;

        try {
            await step.run("mark-processing", async () => {
                return updateRepositoryStatus(repositoryId, {
                    status: "PROCESSING",
                });
            });

            const repoName = repo.replace(/\.git$/, "");
            const repoKey = `${owner}/${repoName}`;

            const indexingResult = await step.run(
                "fetch-chunk-and-save-repository",
                async () => {
                    const files = await fetchRepoFiles(
                        githubToken,
                        owner,
                        repoName,
                    );
                    const documents = await chunkFiles(files, repoKey);
                    const saveResult = await saveChunks(repoKey, documents);

                    return {
                        fileCount: files.length,
                        chunkCount: documents.length,
                        saved: saveResult.saved,
                    };
                },
            );

            await step.run("mark-completed", async () => {
                return updateRepositoryStatus(repositoryId, {
                    status: "COMPLETED",
                });
            });

            return {
                repo: repoKey,
                ...indexingResult,
            };
        } catch (error) {
            await step.run("mark-failed", async () => {
                return updateRepositoryStatus(repositoryId, {
                    status: "FAILED",
                });
            });

            throw error;
        }
    }
);