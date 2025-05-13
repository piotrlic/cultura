import type { APIRoute } from "astro"
import { createSupabaseServerClient } from "../../../lib/auth"

export const prerender = false

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createSupabaseServerClient(cookies)

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("[Session] Error fetching session:", error)
      return new Response(
        JSON.stringify({
          error: "Błąd podczas sprawdzania sesji",
        }),
        { status: 500 }
      )
    }

    if (!session) {
      return new Response(
        JSON.stringify({
          authenticated: false,
          user: null,
        }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: session.user,
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error("[Session] Unexpected error:", err)
    return new Response(
      JSON.stringify({
        error: "Wystąpił nieoczekiwany błąd",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500 }
    )
  }
}
