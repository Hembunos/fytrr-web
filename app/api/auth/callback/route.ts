import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServer();
    // Exchange the code for a real session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure we only redirect to internal paths
      const isInternal = next.startsWith("/");
      const finalDestination = isInternal ? next : "/dashboard";

      return NextResponse.redirect(`${origin}${finalDestination}`);
    }
  }

  // Handle failure case
  return NextResponse.redirect(`${origin}/login?error=Link invalid or expired`);
}
