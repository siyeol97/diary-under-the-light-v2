import { createClient } from '@/utils/supabase/createServerClient';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const date = request.nextUrl.searchParams.get('date');

  if (!userId || !date) {
    return Response.error();
  }

  const supabase = await createClient();
  const { data: diaryDetail, error } = await supabase
    .from('test_diary')
    .select()
    .eq('user_id', userId)
    .gte('created_at', `${date}T00:00:00.000Z`)
    .lte('created_at', `${date}T23:59:59.999Z`);

  if (error) {
    console.error(error);
    return Response.error();
  }

  console.log(diaryDetail);

  return Response.json(diaryDetail);
}
