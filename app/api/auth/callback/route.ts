import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Debugging ke liye full URL log karein (Vercel logs mein dikhega)
  console.log("Auth Callback Triggered. Origin:", origin);

  if (code) {
    const supabase = await createSupabaseServer();

    // Exchange code for session
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log("✅ Auth Success: Session established for", data.user?.email);

      const isInternal = next.startsWith("/");
      const finalDestination = isInternal ? next : "/dashboard";

      return NextResponse.redirect(`${origin}${finalDestination}`);
    }

    // 🚩 Agar error aata hai, toh log karein
    console.error("❌ Supabase Auth Error:", error.message);

    // Check if user is already logged in (kabhi kabhi link double click ho jata hai)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("Found existing session, redirecting to dashboard...");
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Failed case: Redirect to login with error
  console.error("Auth process failed or no code provided.");
  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}