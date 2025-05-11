import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"

const registerSchema = z
  .object({
    email: z.string().email("Nieprawidłowy format e-mail."),
    password: z
      .string()
      .min(8, "Hasło musi mieć min. 8 znaków.")
      .regex(/[a-zA-Z]/, "Hasło musi zawierać co najmniej jedną literę.")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie pasują.",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    try {
      registerSchema.parse(formData)
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
    // Form submission will be implemented later
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Zarejestruj się</CardTitle>
          <CardDescription>Stwórz konto aby móc zarządzać swoją wizytówką kulturalną.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={loading}
              aria-describedby="confirm-password-error"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive" id="confirm-password-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Rejestracja...
              </>
            ) : (
              "Zarejestruj się"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Masz już konto?{" "}
            <a href="/login" className="text-primary hover:text-primary/90 hover:underline">
              Zaloguj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
