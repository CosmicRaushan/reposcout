import { inngest } from "../client";
import { fetchRepoFiles } from "../../services/github";
import { chunkFiles } from "../../services/chunkers";
import { saveChunks } from "../../services/vectorStore";

export const indexRepo = inngest.createFunction(
    { id: "repo-index", triggers: [{ event: "repo/index.requested" }] },
    async ({ event, step }) => {
        const { githubToken, owner, repo } = event.data;
        const repoName = repo.replace(/\.git$/, "");
        const repoKey = `${owner}/${repoName}`

        const files = await step.run("fetch-github-files", async () => {
            return fetchRepoFiles(githubToken, owner, repoName);
        });

        const documents = await step.run("chunk-files", async () => {
            return chunkFiles(files, repoKey);
        });
        
        const saveResult = await step.run("save-chunks-to-pinecone", async () => {
            return saveChunks(repoKey, documents);
        });

        return {
            repo: repoKey,
            fileCount: files.length,
            chunkCount: documents.length,
            saved: saveResult.saved
        }
    }
)