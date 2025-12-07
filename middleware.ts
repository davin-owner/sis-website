/**
 * MIDDLEWARE - The "Bouncer" of Your App
 *
 * WHAT IS MIDDLEWARE?
 * Middleware runs BEFORE every page loads. It's like a bouncer at a club
 * who checks IDs before letting people in.
 *
 * THE FLOW:
 * 1. User visits ANY page on your site
 * 2. THIS code runs first (before the page)
 * 3. We check: Are they logged in?
 * 4. Based on that, we either:
 *    - Let them continue to the page they want
 *    - Redirect them somewhere else
 *
 * YOUR SPECIFIC LOGIC:
 * - Logged in user visits / → Redirect to /dashboard
 * - Not logged in visits /dashboard → Redirect to /
 * - Not logged in visits / → Show landing page (no redirect)
 * - Logged in visits /dashboard → Show dashboard (no redirect)
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for server-side auth checking
  // This is similar to lib/supabase.js but works in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check if user is authenticated
  // This queries Supabase to see if there's a valid session
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // If auth check fails, treat as not authenticated
    console.error('Auth check failed in middleware:', error);
  }

  // Get the current path they're trying to visit
  const path = request.nextUrl.pathname;

  // ============================================
  // REDIRECT LOGIC - The "Bouncer" Decision Tree
  // ============================================

  // RULE 1: Logged in user visits "/" (landing page)
  // → Redirect them to /dashboard (they don't need the waitlist)
  if (user && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // RULE 2: NOT logged in user visits /dashboard or other protected routes
  // → Redirect them to "/" (landing page - they need to sign up first)
  if (!user && (path.startsWith("/dashboard") || path.startsWith("/content") || path.startsWith("/settings"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // RULE 3: Auth routes (/auth/login, /auth/sign-up)
  // → Let everyone access these, no redirects
  if (path.startsWith("/auth")) {
    return response;
  }

  // If none of the above rules match, just let the request through
  return response;
}

/**
 * CONFIG - Which Routes Should Middleware Run On?
 *
 * The "matcher" tells Next.js which routes this middleware should check.
 * We want it to run on most routes, but SKIP some for performance:
 *
 * SKIP:
 * - /_next/* (Next.js internal files)
 * - /api/* (API routes don't need this check)
 * - Static files (images, fonts, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
