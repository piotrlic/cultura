import { z } from "zod"

const sessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      role: z.string().optional(),
    })
    .nullable(),
})

export type SessionResponse = z.infer<typeof sessionResponseSchema>

export async function checkAuthStatus(): Promise<SessionResponse> {
  try {
    const response = await fetch("/api/auth/session")
    if (!response.ok && response.status !== 302) {
      throw new Error("Failed to fetch session")
    }

    const data = await response.json()
    return sessionResponseSchema.parse(data)
  } catch (error) {
    console.error("[Auth] Error checking auth status:", error)
    return {
      authenticated: false,
      user: null,
    }
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const { authenticated } = await checkAuthStatus()
  return authenticated
}

export async function getCurrentUser() {
  const { user } = await checkAuthStatus()
  return user
}
