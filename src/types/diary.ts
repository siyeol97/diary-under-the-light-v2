interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  stt_text: string | null;
  user_id: string | null;
  voice_result: VoiceResult | null;
  text_result: TextResult | null;
}

interface TextResult {
  emotion: {
    감정조절이상: number;
    분노: number;
    불안: number;
    초조: number;
    슬픔: number;
    외로움: number;
    우울: number;
    의욕상실: number;
    무기력: number;
    자살: number;
    자존감저하: number;
    절망: number;
    죄책감: number;
    집중력저하: number;
    피로: number;
    식욕저하: number;
    식욕증가: number;
    일상: number;
  };
  depression_value: number;
  advice: string;
}

interface VoiceResult {
  depression?: string;
  sigmoid_value?: number;
  emotion?: string;
  emotion_prob?: VoiceEmotionProb;
}

interface VoiceEmotionProb {
  [key: string]: number;
}

interface TextEmotionProb {
  [key: string]: number;
}

export type { Diary, VoiceResult, VoiceEmotionProb, TextEmotionProb };
