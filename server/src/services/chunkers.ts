import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export async function chunkFiles(
    files: Array<{ content: string; path: string }>,
    repo: string
) {
    const splitters = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 150
    });

    const document = [];
    
    for (const file of files) {
        const chunks = await splitters.createDocuments(
            [file.content],
            [{ path: file.path, repo }]
        );
        document.push(...chunks)
    }

    return document;
}