import { Json } from '../../database.types';

interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  stt_text: string | null;
  user_id: string | null;
  voice_depress_result: Json | null;
}

export type { Diary };
