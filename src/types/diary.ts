interface Diary {
  created_at: string;
  id: number;
  recording_url: string | null;
  user_id: string | null;
}

export type { Diary };
