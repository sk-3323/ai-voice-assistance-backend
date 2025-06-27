import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import {
  buyProduct,
  getAllOrderTool,
  getAllProductsTool,
  getCartTool,
  getOrderTool,
} from "../tools/tools";
import { llm } from "./llm";
import {
  AIMessage,
  BaseMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";

export const AiAgent = async () => {
  const tools = [
    getOrderTool,
    getCartTool,
    getAllOrderTool,
    getAllProductsTool,
    buyProduct,
  ];
  const toolByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
  const llmWithTools = llm.bindTools(tools);
  async function llmCall(state: typeof MessagesAnnotation.State) {
    const result: BaseMessage = await llmWithTools.invoke([
      new SystemMessage({
        content:
          "You are a helpful assistant tasked with performing Shopping Database Operation. Always filter and reason based on the tool results. Don't return everything — extract only what user asks for.",
      }),
      ...state.messages,
    ]);
    return { messages: [...state.messages, result] };
  }
  async function toolNode(state: typeof MessagesAnnotation.State) {
    const result: ToolMessage[] = [];
    const lastMessage = state.messages.at(-1);
    if (lastMessage.tool_calls.length) {
      for (const toolCall of lastMessage?.tool_calls) {
        const tool = toolByName[toolCall.name];
        const observation = await tool.invoke(toolCall.args);
        result.push(
          new ToolMessage({ content: observation, tool_call_id: toolCall.id })
        );
      }
    }
    return { messages: result };
  }
  async function shouldContinue(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages?.at(-1);
    if (lastMessage?.tool_calls?.length) {
      return "Action";
    }
    return "__end__";
  }
  const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode("llmcall", llmCall)
    .addNode("tools", toolNode)
    .addEdge("__start__", "llmcall")
    .addConditionalEdges("llmcall", shouldContinue, {
      Action: "tools",
      __end__: "__end__",
    })
    .addEdge("tools", "llmcall")
    .compile();

  return { agentBuilder };
};
