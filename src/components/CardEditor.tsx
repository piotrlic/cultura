import { useState, useEffect } from "react";
import type { CardData, CardDTO, CreateCardCommand, UpdateCardCommand } from "../types";
import { useCard } from "./hooks/useCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CardEditorProps {
  isNewCard: boolean;
}

const CardEditor = ({ isNewCard }: CardEditorProps) => {
  const { card, isLoading, error, fetchCard } = useCard();

  const [formData, setFormData] = useState<CardData>({
    movies: "",
    series: "",
    music: "",
    books: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (card && !isNewCard) {
      setFormData(card.card_data);
    }
  }, [card, isNewCard]);

  const handleInputChange = (field: keyof CardData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      if (isNewCard) {
        // Create new card
        const createCommand: CreateCardCommand = {
          card_data: formData,
        };

        const response = await fetch("/api/cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createCommand),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      } else if (card) {
        // Update existing card
        const updateCommand: UpdateCardCommand = {
          card_data: formData,
        };

        const response = await fetch(`/api/cards/${card.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateCommand),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      }

      // Redirect to card view on success
      window.location.href = "/card";
    } catch (err) {
      console.error("Error saving card:", err);
      setSaveError("Failed to save card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle loading state
  if (isLoading && !isNewCard) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle error state
  if (error && !isNewCard) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
        <p>
          {error === "401"
            ? "Sesja wygasła. Proszę zalogować się ponownie."
            : "Wystąpił błąd podczas ładowania wizytówki. Spróbuj ponownie później."}
        </p>
        {error === "401" && (
          <div className="mt-4">
            <a href="/login" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Zaloguj się
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isNewCard ? "Stwórz nową wizytówkę" : "Edytuj wizytówkę"}</CardTitle>
          <CardDescription>Podziel się swoimi kulturalnymi zainteresowaniami z innymi.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="movies" className="font-medium">
              Filmy
            </Label>
            <Textarea
              id="movies"
              placeholder="Twoje ulubione filmy..."
              value={formData.movies}
              onChange={handleInputChange("movies")}
              rows={3}
              required
              aria-describedby="movies-desc"
            />
            <p id="movies-desc" className="text-sm text-muted-foreground">
              Opisz swoje ulubione filmy, reżyserów lub gatunki.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="series" className="font-medium">
              Seriale
            </Label>
            <Textarea
              id="series"
              placeholder="Twoje ulubione seriale..."
              value={formData.series}
              onChange={handleInputChange("series")}
              rows={3}
              required
              aria-describedby="series-desc"
            />
            <p id="series-desc" className="text-sm text-muted-foreground">
              Podziel się serialami, które warto obejrzeć.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="music" className="font-medium">
              Muzyka
            </Label>
            <Textarea
              id="music"
              placeholder="Twoja ulubiona muzyka..."
              value={formData.music}
              onChange={handleInputChange("music")}
              rows={3}
              required
              aria-describedby="music-desc"
            />
            <p id="music-desc" className="text-sm text-muted-foreground">
              Opisz swoje muzyczne inspiracje.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="books" className="font-medium">
              Książki
            </Label>
            <Textarea
              id="books"
              placeholder="Twoje ulubione książki..."
              value={formData.books}
              onChange={handleInputChange("books")}
              rows={3}
              required
              aria-describedby="books-desc"
            />
            <p id="books-desc" className="text-sm text-muted-foreground">
              Podziel się swoimi literackimi fascynacjami.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {saveError && <div className="text-destructive text-sm mb-4 w-full">{saveError}</div>}
          <Button type="button" variant="outline" onClick={() => (window.location.href = "/card")} disabled={isSaving}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Zapisywanie...
              </>
            ) : (
              "Zapisz wizytówkę"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CardEditor;
