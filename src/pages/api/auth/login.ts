import type { APIRoute } from "astro"
import { z } from "zod"
import { createSupabaseServerClient } from "../../../lib/auth"

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format e-mail"),
  password: z.string().min(8, "Hasło musi mieć min. 8 znaków"),
})

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  console.log("[Login] Processing login request")

  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    console.log("[Login] Form validation passed")

    const supabase = createSupabaseServerClient(cookies)

    console.log("[Login] Attempting Supabase authentication")
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[Login] Supabase auth error:", {
        message: error.message,
        status: error.status,
        name: error.name,
      })

      return new Response(
        JSON.stringify({
          error:
            error.message === "Invalid login credentials"
              ? "Nieprawidłowy email lub hasło"
              : `Błąd logowania: ${error.message}`,
        }),
        { status: 401 }
      )
    }

    console.log("[Login] Authentication successful, checking session")
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("[Login] Session error:", sessionError)
      return new Response(
        JSON.stringify({
          error: "Nie udało się utworzyć sesji",
        }),
        { status: 500 }
      )
    }

    if (!session) {
      console.error("[Login] No session created after successful auth")
      return new Response(
        JSON.stringify({
          error: "Nie udało się utworzyć sesji",
        }),
        { status: 500 }
      )
    }

    console.log("[Login] Session created successfully")
    return new Response(
      JSON.stringify({
        user: data.user,
        message: "Zalogowano pomyślnie",
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error("[Login] Error:", err)

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane logowania",
          details: err.errors,
        }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas logowania",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500 }
    )
  }
}
