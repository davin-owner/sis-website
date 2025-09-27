/**
 * AUTHENTICATION MIDDLEWARE - Route Protection & Session Management
 *
 * This middleware runs on every request and handles authentication protection
 * for the Simple Ink Studios management platform.
 *
 * How it works:
 * 1. Intercepts all requests before they reach pages
 * 2. Checks Supabase authentication status
 * 3. Redirects unauthenticated users to login
 * 4. Allows authenticated users to access protected routes
 *
 * Protected Routes:
 * - / (dashboard)
 * - /content/* (all studio features)
 * - /settings
 *
 * Public Routes:
 * - /auth/* (login, signup, password reset)
 * - Static assets (images, CSS, JS)
 *
 * Configuration:
 * - Matcher pattern excludes static files and Next.js internals
 * - Uses Supabase SSR for server-side authentication
 */
import { updateSession } from "./lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
