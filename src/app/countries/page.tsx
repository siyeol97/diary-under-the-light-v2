import { createClient } from '@/utils/supabase/createServerClient';

export default async function Countries() {
  const supabase = await createClient();
  const { data: countries } = await supabase.from('countries').select();
  const { data: users } = await supabase.from('users').select();

  return (
    <main>
      <pre>{JSON.stringify(countries, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}
