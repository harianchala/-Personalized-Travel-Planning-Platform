// app/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC keys for client-side operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
