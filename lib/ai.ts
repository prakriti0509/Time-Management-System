import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || process.env.SHIVAAY_BASE_URL;
export const aiEnabled = !!apiKey && !apiKey.includes("REPLACE");
export const openai = aiEnabled
  ? new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) })
  : (null as unknown as OpenAI);
