import { defineMiddleware } from "astro:middleware"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Database } from "../db/database.types"

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/session",
  "/api/auth/logout",
]

// Add a function to check if a path is public
const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some((publicPath) => pathname === publicPath) || pathname.startsWith("/.well-known")
}

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 dni
  path: "/",
}

export const onRequest = defineMiddleware(async ({ cookies, request, redirect, locals }, next) => {
  const url = new URL(request.url)

  // Skip auth check for public paths
  if (isPublicPath(url.pathname)) {
    return next()
  }

  const supabase = createServerClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    cookies: {
      get: (key: string) => {
        const cookie = cookies.get(key)?.value
        return cookie
      },
      set: (key: string, value: string, options: CookieOptions) => {
        cookies.set(key, value, {
          ...cookieOptions,
          ...options,
          path: "/",
        })
      },
      remove: (key: string, options: CookieOptions) => {
        cookies.delete(key, {
          ...cookieOptions,
          ...options,
          path: "/",
        })
      },
    },
  })

  // Check and refresh session for protected routes
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    return redirect("/login")
  }

  if (!session) {
    return redirect("/login")
  }

  // Check if session needs refresh
  if (session.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000)
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)

    if (expiresAt < fiveMinutesFromNow) {
      const {
        data: { session: newSession },
        error: refreshError,
      } = await supabase.auth.refreshSession()

      if (refreshError || !newSession) {
        return redirect("/login")
      }
    }
  }

  // Add supabase client to locals context
  locals.supabase = supabase
  const response = await next()
  return response
})
