import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
// import { ChatOpenAI } from "@langchain/openai";
config();
export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
});
