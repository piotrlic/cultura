import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Hasło musi mieć min. 8 znaków.")
      .regex(/[a-zA-Z]/, "Hasło musi zawierać co najmniej jedną literę.")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie pasują.",
    path: ["confirmPassword"],
  });

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Form submission will be implemented later
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Ustaw nowe hasło</CardTitle>
          <CardDescription>Wprowadź i potwierdź swoje nowe hasło.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nowe hasło</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              disabled={loading}
              aria-describedby="new-password-error"
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive" id="new-password-error">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
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
                Zapisywanie...
              </>
            ) : (
              "Zapisz nowe hasło"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            <a href="/login" className="text-primary hover:text-primary/90 hover:underline">
              Wróć do logowania
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
