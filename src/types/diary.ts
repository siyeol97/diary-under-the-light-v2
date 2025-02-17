interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  stt_text: string | null;
  user_id: string | null;
  voice_depress_result: VoiceResult | null;
}

interface VoiceResult {
  depression?: string;
  sigmoid_value?: number;
  emotion?: string;
  emotion_prob?: EmotionProb;
}

interface EmotionProb {
  [key: string]: number;
}

export type { Diary, VoiceResult, EmotionProb };
