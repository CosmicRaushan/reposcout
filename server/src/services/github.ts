import { Octokit } from "@octokit/rest";

const SKIP_DIRS = [
    "node_modules",
    ".git",
    "dist",
    "build",
    "out",
    "coverage",
    ".next",
    "vendor",
    "target",
    "__pycache__",
    ".gradle",
];

const SKIP_EXTENSIONS = new Set([
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "ico",
    "webp",
    "bmp",

    "woff",
    "woff2",
    "ttf",
    "eot",
    "otf",

    "mp3",
    "mp4",
    "mov",
    "wav",
    "webm",

    "exe",
    "dll",
    "so",
    "dylib",
    "bin",
    "wasm",

    "class",
    "jar",
    "war",
    "ear",

    "zip",
    "tar",
    "gz",
    "tgz",
    "7z",
    "rar",

    "pdf",
    "lock",
    "map",
]);

const SKIP_FILES = new Set([
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Cargo.lock",
    "composer.lock",
    "go.sum",
]);

function shouldSkipFile(path: string, size?: number) {
    const parts = path.split("/");
    const fileName = parts[parts.length - 1] ?? "";

    if (parts.some((part) => SKIP_DIRS.includes(part))) {
        return true;
    }

    if (SKIP_FILES.has(fileName)) {
        return true;
    }

    if (typeof size === "number" && size > 200_000) {
        return true;
    }

    const ext = fileName.includes(".")
        ? fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase()
        : "";

    if (SKIP_EXTENSIONS.has(ext)) {
        return true;
    }

    if (fileName.endsWith(".min.js")) {
        return true;
    }

    return false;
}

export function parseRepo(input: string) {
    try {
        const url = new URL(input);

        if (url.hostname !== "github.com") {
            throw new Error("Invalid GitHub URL");
        }

        const [owner, repo] = url.pathname
            .replace(/\/$/, "")
            .split("/")
            .filter(Boolean);

        if (!owner || !repo) {
            throw new Error("Invalid GitHub repository URL");
        }

        return {
            owner,
            repo,
            repoKey: `${owner}/${repo}`,
        };
    } catch {
        throw new Error("Invalid GitHub repository URL");
    }
}

export async function fetchRepoFiles(
    token: string,
    owner: string,
    repo: string
) {
    const octokit = new Octokit({
        auth: token,
    });

    const { data: repoInfo } = await octokit.rest.repos
        .get({
            owner,
            repo,
        })
        .catch((err) => {
            if (err.status === 404) {
                throw new Error(
                    `GitHub could not find ${owner}/${repo}. Ensure your token has access to this repository.`
                );
            }

            throw err;
        });

    const { data: tree } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: repoInfo.default_branch,
        recursive: "true",
    });

    const files: Array<{
        path: string;
        content: string;
    }> = [];

    for (const item of tree.tree) {
        if (item.type !== "blob") continue;
        if (!item.path) continue;

        if (shouldSkipFile(item.path, item.size)) {
            continue;
        }

        try {
            const { data: blob } = await octokit.rest.git.getBlob({
                owner,
                repo,
                file_sha: item.sha!,
            });

            const content = Buffer.from(
                blob.content,
                "base64"
            ).toString("utf8");

            files.push({
                path: item.path,
                content,
            });

            if (files.length >= 200) {
                break;
            }
        } catch (error) {
            console.warn(`Failed to fetch ${item.path}`, error);
            continue;
        }
    }

    return files;
}