import { defineMiddleware } from "astro:middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "../db/database.types";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
];

// Add a function to check if a path is public
const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some((publicPath) => pathname === publicPath) || pathname.startsWith("/.well-known");
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 dni
  path: "/",
};

export const onRequest = defineMiddleware(async ({ cookies, request, redirect, locals }, next) => {
  const url = new URL(request.url);
  console.log("[Middleware] Processing request for:", url.pathname);

  // Skip auth check for public paths
  if (isPublicPath(url.pathname)) {
    console.log("[Middleware] Public path detected, skipping auth check");
    return next();
  }

  const supabase = createServerClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    cookies: {
      get: (key: string) => {
        const cookie = cookies.get(key)?.value;
        console.log("[Middleware] Getting cookie:", key, cookie ? "exists" : "not found");
        return cookie;
      },
      set: (key: string, value: string, options: CookieOptions) => {
        console.log("[Middleware] Setting cookie:", key);
        cookies.set(key, value, {
          ...cookieOptions,
          ...options,
          path: "/",
        });
      },
      remove: (key: string, options: CookieOptions) => {
        console.log("[Middleware] Removing cookie:", key);
        cookies.delete(key, {
          ...cookieOptions,
          ...options,
          path: "/",
        });
      },
    },
  });

  // Check and refresh session for protected routes
  console.log("[Middleware] Protected route, checking session");
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("[Middleware] Session error:", sessionError);
    return redirect("/login");
  }

  if (!session) {
    console.log("[Middleware] No session found, redirecting to login");
    return redirect("/login");
  }

  console.log("[Middleware] Session found, checking expiration");
  // Check if session needs refresh
  if (session.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    if (expiresAt < fiveMinutesFromNow) {
      console.log("[Middleware] Session near expiration, attempting refresh");
      const {
        data: { session: newSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError || !newSession) {
        console.error("[Middleware] Session refresh error:", refreshError);
        return redirect("/login");
      }
      console.log("[Middleware] Session refreshed successfully");
    }
  }

  console.log("[Middleware] Auth check passed, proceeding with request");
  // Add supabase client to locals context
  locals.supabase = supabase;
  const response = await next();
  return response;
});
