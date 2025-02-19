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
    history: [
      {
        role: 'user',
        parts: [
          {
            text: '당신은 사용자의 일기를 분석하는 감정 전문가 입니다. 제공받은 감정 리스트를 참고해서 사용자의 일기를 문장 단위로 분석합니다.\n감정 리스트 : [‘감정조절이상\', \'불면\', \'분노\', \'불안\', \'초조\', \'슬픔\', \'외로움\', \'우울\', \'의욕상실\', \'무기력\', \'자살\', \'자존감저하\', \'절망\', \'죄책감\', \'집중력저하\', \'피로\', \'식욕저하\', \'식욕증가\', \'일상’] 각 문장에 대한 감정의 확률(01)을 계산하고, 각 문장에 대한 우울감의 정도(01)를 계산합니다. 각 감정의 확률의 합은 1입니다. 그리고 사용자의 일기에 대한 당신의 조언을 한국어로 최대 150자를 넘지 않게 제공합니다.\n최종적으로 당신의 응답(json 객체)은 다음과 같습니다. 다른 설명은 제공하지 않고 오직 json 객체만을 응답합니다. 응답 텍스트는 줄 바꿈 등 다른 텍스트를 포함하지 않습니다. 아래 유저의 일기와 당신의 응답을 예시로 보여드리겠습니다.\n예시 userInput : "요즘 나의 인간관계가 복잡하다 친한 친구와의 관계가 어색해지고 가족들과의 대화도 어색해진다 내가 무슨 말을 해도 상대방이 이해하지 못하는 것 같아서 답답하다 나는 왜 이렇게 다른 사람과의 대화가 어려운 걸까 내가 잘못한 걸까요즘 스트레스가 많이 쌓여서 힘들다 일과 공부 때문에 시간이 부족하고 여러 가지 일들이 겹쳐져서 정말 지친다 어쩌면 좋을까 휴식을 취하면서 스트레스를 풀 수 있는 방법을 찾아봐야겠다 혹시 좋은 조언이 있을까"\n예시 응답 : { "emotion": { "감정조절이상": 0.1, "분노": 0.1, "불안": 0.2, "초조": 0, "슬픔": 0, "외로움": 0, "우울": 0.25, "의욕상실": 0, "무기력": 0.15, "자살": 0, "자존감저하": 0, "절망": 0, "죄책감": 0.2, "집중력저하": 0, "피로": 0, "식욕저하": 0, "식욕증가": 0, "일상": 0 }, "depression_value": 0.7625, advice: “일기를 분석하고 적절한 조언이나 위로를 입력합니다.” }\n',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: "The user wants me to act as an emotion expert analyzing user's diary entries sentence by sentence.\nI need to use the provided emotion list and calculate the probability (0-1, sum to 1 for each sentence) for each emotion in each sentence.\nI also need to calculate the depression level (0-1) for each sentence.\nFinally, I should provide advice in Korean (max 150 characters).\nThe response should be a JSON object.\n\nEmotion list: ['감정조절이상', '불면', '분노', '불안', '초조', '슬픔', '외로움', '우울', '의욕상실', '무기력', '자살', '자존감저하', '절망', '죄책감', '집중력저하', '피로', '식욕저하', '식욕증가', '일상']\n\nExample input and output are provided.\n\nLet's break down the example input:\n\"요즘 나의 인간관계가 복잡하다 친한 친구와의 관계가 어색해지고 가족들과의 대화도 어색해진다 내가 무슨 말을 해도 상대방이 이해하지 못하는 것 같아서 답답하다 나는 왜 이렇게 다른 사람과의 대화가 어려운 걸까 내가 잘못한 걸까요즘 스트레스가 많이 쌓여서 힘들다 일과 공부 때문에 시간이 부족하고 여러 가지 일들이 겹쳐져서 정말 지친다 어쩌면 좋을까 휴식을 취하면서 스트레스를 풀 수 있는 방법을 찾아봐야겠다 혹시 좋은 조언이 있을까\"\n\nSentences are:\n1. 요즘 나의 인간관계가 복잡하다\n2. 친한 친구와의 관계가 어색해지고 가족들과의 대화도 어색해진다\n3. 내가 무슨 말을 해도 상대방이 이해하지 못하는 것 같아서 답답하다\n4. 나는 왜 이렇게 다른 사람과의 대화가 어려운 걸까\n5. 내가 잘못한 걸까\n6. 요즘 스트레스가 많이 쌓여서 힘들다\n7. 일과 공부 때문에 시간이 부족하고 여러 가지 일들이 겹쳐져서 정말 지친다\n8. 어쩌면 좋을까\n9. 휴식을 취하면서 스트레스를 풀 수 있는 방법을 찾아봐야겠다\n10. 혹시 좋은 조언이 있을까\n\nExample output:\n{ \"emotion\": { \"감정조절이상\": 0.1, \"분노\": 0.1, \"불안\": 0.2, \"초조\": 0, \"슬픔\": 0, \"외로움\": 0, \"우울\": 0.25, \"의욕상실\": 0, \"무기력\": 0.15, \"자살\": 0, \"자존감저하\": 0, \"절망\": 0, \"죄책감\": 0.2, \"집중력저하\": 0, \"피로\": 0, \"식욕저하\": 0, \"식욕증가\": 0, \"일상\": 0 }, \"depression_value\": 0.7625, advice: “일기를 분석하고 적절한 조언이나 위로를 입력합니다.” }\n\nLet's analyze the example output.\nIt seems the example output is for the *entire* diary, not sentence by sentence.\nThe probabilities and depression value are for the whole diary.\nThe advice is generic. I need to provide more specific advice based on the diary content.\n\nLet's assume the user input is a single sentence. I need to provide probabilities for each emotion, depression value, and advice for that sentence.\nIf the input is multiple sentences, I need to do the same for the entire diary.\n\nLet's consider the example again as a whole diary.\n- 복잡하다, 어색해지고, 답답하다, 어렵다, 잘못한 걸까, 힘들다, 지친다, 어쩌면 좋을까\nThese words indicate negative emotions.\n- 스트레스, 인간관계, 대화 어려움, 시간 부족, 일, 공부\nThese are the sources of stress and negative emotions.\n- 휴식을 취하면서 스트레스를 풀 수 있는 방법을 찾아봐야겠다, 좋은 조언 있을까\nThese show the user's willingness to improve and seek help.\n\nProbabilities estimation (rough estimation based on keywords):\n- 감정조절이상: 0.1 (복잡하다, 답답하다)\n- 분노: 0.1 (답답하다, 힘들다)\n- 불안: 0.2 (어색해지고, 어려울까, 잘못한 걸까, 어쩌면 좋을까)\n- 초조: 0 (not really 초조)\n- 슬픔: 0 (not really 슬픔)\n- 외로움: 0 (not explicitly 외로움)\n- 우울: 0.25 (힘들다, 지친다, 어쩌면 좋을까, 전반적인 negative tone)\n- 의욕상실: 0 (willing to find solution)\n- 무기력: 0.15 (지친다, 힘들다, but still trying to find solution)\n- 자살: 0 (no suicidal thoughts)\n- 자존감저하: 0 (maybe a bit, but not explicit)\n- 절망: 0 (not 절망)\n- 죄책감: 0.2 (잘못한 걸까, 인간관계 어려움)\n- 집중력저하: 0 (not mentioned)\n- 피로: 0 (지친다 -> could be 피로, but let's keep it as 우울 and 무기력 for now)\n- 식욕저하: 0 (not mentioned)\n- 식욕증가: 0 (not mentioned)\n- 일상: 0 (not 일상, rather problems)\n\nSum of probabilities: 0.1 + 0.1 + 0.2 + 0 + 0 + 0 + 0.25 + 0 + 0.15 + 0 + 0 + 0 + 0.2 + 0 + 0 + 0 + 0 + 0 + 0 = 1.0\n\nDepression Value: 0.7625 (High, considering 우울, 무기력, 죄책감, 불안, 감정조절이상, 분노) - This seems reasonable given the diary content.\n\nAdvice: “일기를 분석하고 적절한 조언이나 위로를 입력합니다.” -  Too generic. Need to be more specific.\nLet's try: \"인간관계와 스트레스로 힘드시군요. 잠시 휴식을 취하며 자신을 돌보는 시간을 가져보세요. 친구나 가족에게 솔직한 마음을 털어놓는 것도 도움이 될 수 있습니다.\" (This is within 150 characters and more specific)\n\n\nNow I need to process the new input and generate the JSON output.\nLet's assume the input diary is given.\nI will read the diary, analyze emotions, calculate probabilities, depression value, and generate advice.",
          },
          {
            text: '```json\n{ "emotion": { "감정조절이상": 0.15, "분노": 0.1, "불안": 0.2, "초조": 0, "슬픔": 0, "외로움": 0.05, "우울": 0.2, "의욕상실": 0.05, "무기력": 0.1, "자살": 0, "자존감저하": 0, "절망": 0, "죄책감": 0.15, "집중력저하": 0, "피로": 0, "식욕저하": 0, "식욕증가": 0, "일상": 0 }, "depression_value": 0.75, "advice": "인간관계와 스트레스로 인해 힘든 시간을 보내고 계시는군요. 잠시 모든 것을 내려놓고 휴식을 취하는 건 어떨까요? 긍정적인 변화를 위한 첫걸음이 될 수 있을 거예요." }\n```',
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(sttText);

  return result.response.text();
};
export default getGeminiResponse;
