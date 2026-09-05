import { createHash } from "node:crypto";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone"

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

const UPSERT_BATCH_SIZE = 100;
const DEFAULT_TOP_K = 5;

function repoToNameSpace(repo: string) {
    return repo.replaceAll("/", "-")
}

function getIndex(namespace: string) {
    const indexName = process.env.PINECONE_INDEX || "reposcout";
    return pc.index({ name: indexName }).namespace(namespace)
};

function normalizeDocuments(
    documents: Array<{ pageContent?: unknown; metadata?: Record<string, unknown> }>
) {
    return documents.map((doc) => ({
        pageContent: typeof doc.pageContent === "string" ? doc.pageContent : "",
        metadata: doc.metadata ?? {},
    }))
        .filter((doc) => doc.pageContent.trim().length > 0);
};

function buildRecordId(
    repo: string,
    metadata: Record<string, unknown>,
    content: string
) {
    return createHash("sha256")
        .update(`${repo}: ${metadata.path ?? ""}:${content}`)
        .digest("hex")
};

export async function saveChunks(
    repo: string,
    documents: Array<{ pageContent?: unknown; metadata?: Record<string, unknown> }>
) {
    // Debugging log to check the number of documents received
    console.log("INDEXING REPO:", repo);
    const chunks = normalizeDocuments(documents);
    if (!chunks.length) {
        return { saved: false, chunkCount: 0 }
    };

    // Debugging log to check the number of normalized chunks
    console.log("INDEXING NAMESPACE:", repoToNameSpace(repo));

    const nameSpace = repoToNameSpace(repo);
    const indexes = getIndex(nameSpace);
    const texts = chunks.map((doc) => doc.pageContent);
    const vectors = await embeddings.embedDocuments(texts);
    // Debugging log to check the number of vectors generated
    console.log("VECTOR COUNT:", vectors.length);
    console.log("VECTOR DIMENSION:", vectors[0]?.length);

    const record = chunks.map((doc, i) => {
        const values = vectors[i];
        if (!values) {
            throw new Error(`Missing embedding for document at index ${i}`);
        }

        return {
            id: buildRecordId(repo, doc.metadata, doc.pageContent),
            values,
            metadata: {
                text: doc.pageContent,
                path: String(doc.metadata.path ?? ""),
                repo: String(doc.metadata.repo ?? repo)
            }
        };
    });

    for (let i = 0; i < record.length; i += UPSERT_BATCH_SIZE) {
        await indexes.upsert({
            records: record.slice(i, i + UPSERT_BATCH_SIZE)
        });
    };
    return { saved: true, chunkCount: chunks.length }
};

function toSearchDocuments(match: {
    metadata?: {
        text?: string;
        path?: string;
        repo?: string;
    };
    score?: number;
}) {
    const metadata = match.metadata ?? {};
    return {
        pageContent: metadata.text ?? "",
        metadata: {
            path: metadata.path,
            repo: metadata.repo
        },
        score: match.score
    };
};

export async function search(repo: string, question: string, topK = DEFAULT_TOP_K) {
    const namespace = repoToNameSpace(repo);

    // Debugging logs to trace the search process
    console.log("Searching namespace:", namespace);
    console.log("Question:", question);


    const index = getIndex(namespace);   
    const vector = await embeddings.embedQuery(question);

    // Debugging log to check if the index is accessible
    console.log("Query vector dimension:", vector.length);

    const response = await index.query({
        vector,
        topK,
        includeMetadata: true
    });

    // Debugging log to check the number of matches returned
    console.log("RAW MATCHES:", response.matches?.length ?? 0);
    return (response.matches ?? [])
        .map(toSearchDocuments)
        .filter((doc) => doc.pageContent.trim().length > 0)
}