import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format e-mail."),
  password: z.string().min(8, "Hasło musi mieć min. 8 znaków."),
})

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const validateForm = () => {
    try {
      loginSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setServerError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.error || "Wystąpił błąd podczas logowania")
        return
      }

      toast.success("Zalogowano pomyślnie")
      window.location.href = "/card"
    } catch (err) {
      setServerError("Wystąpił błąd podczas logowania")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle>
            <a href="/" className="text-6xl font-semibold group">
              <span className="transition-colors">C</span>
              <span className="group-hover:text-primary transition-colors">ultura</span>
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{serverError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p className="text-sm text-destructive" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p className="text-sm text-destructive" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="text-sm text-right">
            <a href="/reset-password" className="text-primary hover:text-primary/90 hover:underline">
              Zapomniałeś hasła?
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Logowanie...
              </>
            ) : (
              "Zaloguj się"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Nie masz jeszcze konta?{" "}
            <a href="/register" className="text-primary hover:text-primary/90 hover:underline">
              Zarejestruj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
