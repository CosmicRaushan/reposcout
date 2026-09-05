import { inngest } from "./client";
import { askQuestions } from "./functions/askQuestions";
import { helloWorld } from "./functions/helloworld.functions";
import { indexRepo } from "./functions/indexRepo";

export { inngest }

export const functions = [helloWorld, indexRepo, askQuestions]