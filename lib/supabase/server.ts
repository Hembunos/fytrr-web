import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // This will now fail silently in Layouts instead of crashing the app
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The Next.js middleware will handle actual cookie refreshing
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // This will now fail silently in Layouts instead of crashing the app
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The Next.js middleware will handle actual cookie removal
          }
        },
      },
    }
  );
}
