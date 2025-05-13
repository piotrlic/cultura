import type { APIRoute } from "astro"
import { createSupabaseServerClient } from "../../../lib/auth"

export const prerender = false

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies)

  const { error } = await supabase.auth.signOut()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return redirect("/login")
}
