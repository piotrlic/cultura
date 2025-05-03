import { useState, useEffect } from "react";
import type { CardDTO } from "../../types";

interface UseCardReturn {
  card: CardDTO | null;
  isLoading: boolean;
  error: string | null;
  fetchCard: () => Promise<void>;
}

export function useCard(): UseCardReturn {
  const [card, setCard] = useState<CardDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cards");

      if (response.status === 401) {
        setError("401");
        return;
      }

      if (response.status === 404) {
        // No card found, but this isn't an error
        setCard(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(`${response.status}`);
        return;
      }

      const data: CardDTO = await response.json();

      // Validate that all required fields are present
      if (
        !data ||
        !data.card_data ||
        !data.card_data.movies ||
        !data.card_data.series ||
        !data.card_data.music ||
        !data.card_data.books
      ) {
        setError("Invalid card data received");
        return;
      }

      setCard(data);
    } catch (err) {
      setError("Failed to fetch card data");
      console.error("Error fetching card:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return { card, isLoading, error, fetchCard };
}
