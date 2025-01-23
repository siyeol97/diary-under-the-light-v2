/**
 * 브라우저에서 실행되는 클라이언트 컴포넌트에서 supabase에 접근할 수 있도록 하는 함수
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
