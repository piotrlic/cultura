import { createServerClient } from "@supabase/ssr"
import type { AstroCookies } from "astro"
import { cookieOptions } from "../middleware"

export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    cookies: {
      get: (key) => cookies.get(key)?.value,
      set: (key, value, options) => {
        cookies.set(key, value, {
          ...cookieOptions,
          ...options,
          path: "/",
          domain: "",
        })
      },
      remove: (key, options) => {
        cookies.delete(key, {
          ...cookieOptions,
          ...options,
          path: "/",
          domain: "",
        })
      },
    },
  })
}
