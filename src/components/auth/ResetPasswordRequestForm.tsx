import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordRequestSchema = z.object({
  email: z.string().email("Nieprawidłowy format e-mail."),
});

export function ResetPasswordRequestForm() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      resetPasswordRequestSchema.parse(formData);
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
    setEmailSent(true);
    setLoading(false);
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sprawdź swoją skrzynkę</CardTitle>
          <CardDescription>
            Wysłaliśmy instrukcje resetowania hasła na adres {formData.email}. Sprawdź swoją skrzynkę i postępuj zgodnie
            z instrukcjami.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/login")}>
            Wróć do logowania
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Resetuj hasło</CardTitle>
          <CardDescription>Podaj swój adres email, a wyślemy Ci instrukcje resetowania hasła.</CardDescription>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Wysyłanie...
              </>
            ) : (
              "Wyślij instrukcje"
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
