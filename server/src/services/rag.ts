import { ChatOpenAI } from "@langchain/openai";
import { search } from "./vectorStore"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

function toText(content: unknown) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => (typeof part === "string" ? part : part.text ?? ""))
            .join("")
    };
    return String(content ?? "");
};

export async function askQuestion(repo: string, question: string, topK = 5) {
    const docs = await search(repo, question, topK);

    if (!docs.length) {
        return {
            answer: "No indexed content was found in this repo index it first then try agian.",
            sources: []
        };
    };

    const context = docs
        .map((doc) => `Files: ${doc.metadata.path}\n${doc.pageContent}`)
        .join("\n\n")

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini"
    });

    const response = await llm.invoke([
        new SystemMessage(`
        You are a repository code expert and your task is to answer the questions of human promts based on the provided context.
        
        Rules:
        1. Always response on the basic of rpostory context.
        2. If the response / answer is not in the context then say " I don't know based on indexed repositry.
        3.Don't make any file, code, functions and api. 

        `),

        new HumanMessage(`
           Context: 
           ${context}

           Questions: 
           ${question}
        `)
    ])

    return {
        answer: toText(response.content),
        sources: [...new Set(docs.map((doc) => doc.metadata.path).filter(Boolean))]
    }
}