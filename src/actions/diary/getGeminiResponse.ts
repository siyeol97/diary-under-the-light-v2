'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const getGeminiResponse = async (sttText: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-thinking-exp-01-21',
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: 'text/plain',
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(
    `${process.env.GEMINI_PROMPT_TEXT} 유저 일기: ${sttText}`,
  );

  return result.response.text();
};
export default getGeminiResponse;
