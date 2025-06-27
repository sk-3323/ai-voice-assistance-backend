import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { llm } from "./llm";
import { PromptTemplate } from "@langchain/core/prompts";
const conversations = new Map();
export const getConversationChain = (callSid: any) => {
  if (!conversations.has(callSid)) {
    const memory = new BufferMemory();

    const chain = new ConversationChain({
      llm: llm,
      memory,
      verbose: false,
    });

    conversations.set(callSid, chain);
  }
  return conversations.get(callSid);
};
