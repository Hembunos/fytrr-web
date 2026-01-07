// // middleware.ts
// import { createServerClient, type CookieOptions } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function updateSession(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({ name, value, ...options });
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           });
//           response.cookies.set({ name, value, ...options });
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({ name, value: "", ...options });
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           });
//           response.cookies.set({ name, value: "", ...options });
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   const url = request.nextUrl.clone();

//   // 1. PUBLIC API ROUTES: Allow these to pass through without redirects
//   // This is critical for your Razorpay Webhook
//   if (url.pathname.startsWith("/api/razorpay/webhook")) {
//     return response;
//   }

//   // 2. PROTECTED ROUTES
//   const isDashboard = url.pathname.startsWith("/dashboard");
//   const isAdmin = url.pathname.startsWith("/admin");

//   if (!user && (isDashboard || isAdmin)) {
//     url.pathname = "/login";
//     url.searchParams.set("redirectTo", request.nextUrl.pathname);
//     return NextResponse.redirect(url);
//   }

//   // 3. AUTH REDIRECT
//   if (user && (url.pathname === "/login" || url.pathname === "/signup")) {
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }

//   return response;
// }

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };


import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  // 1. WEBHOOKS & AUTH CALLBACKS (Must be Public)
  const isWebhook = url.pathname.startsWith("/api/razorpay/webhook");
  const isAuthCallback = url.pathname.startsWith("/api/auth/callback");

  if (isWebhook || isAuthCallback) {
    return response;
  }

  // 2. PROTECTED ROUTES (Requires Login)
  // Dashboard, Admin, aur Registration Form bina login ke nahi dikhenge
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isAdmin = url.pathname.startsWith("/admin");
  const isRegisterForm = url.pathname.startsWith("/register");

  if (!user && (isDashboard || isAdmin || isRegisterForm)) {
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 3. AUTH REDIRECT (Logged-in users shouldn't see Login/Signup)
  // Note: /update-password ko allow kiya hai taaki logged-in user password reset kar sake
  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup";

  if (user && isAuthPage) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Saare routes cover honge except static files aur images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};