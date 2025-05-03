import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { CreateCardCommand, CardData } from "@/types";

export function CreateCardForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CardData>({
    movies: "",
    series: "",
    music: "",
    books: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_data: formData,
        } as CreateCardCommand),
      });

      if (!response.ok) {
        throw new Error("Failed to create card");
      }

      toast.success("Your cultural card has been created.");

      // TODO: Redirect to the card view page
    } catch (error) {
      toast.error("Failed to create your card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/cards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_data: formData,
        } as CreateCardCommand),
      });

      if (!response.ok) {
        throw new Error("Failed to generate card");
      }

      const data = await response.json();
      setFormData(data.card_data);

      toast.success("Your card has been generated with AI suggestions.");
    } catch (error) {
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="movies">Favorite Movies</Label>
            <Textarea
              id="movies"
              placeholder="Enter your favorite movies..."
              value={formData.movies}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, movies: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="series">Favorite Series</Label>
            <Textarea
              id="series"
              placeholder="Enter your favorite TV series..."
              value={formData.series}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, series: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="music">Favorite Music</Label>
            <Textarea
              id="music"
              placeholder="Enter your favorite music..."
              value={formData.music}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, music: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="books">Favorite Books</Label>
            <Textarea
              id="books"
              placeholder="Enter your favorite books..."
              value={formData.books}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, books: e.target.value })
              }
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate with AI"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Card"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
