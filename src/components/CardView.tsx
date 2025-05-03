import { useState, useEffect } from "react";
import type { CardDTO } from "../types";
import { useCard } from "./hooks/useCard";
import CardPreview from "./CardPreview";
import ActionButtons from "./ActionButtons";

const CardView = () => {
  const { card, isLoading, error, fetchCard } = useCard();

  // Handle different states
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Moja Wizytówka</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Moja Wizytówka</h1>
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p>
            {error === "401"
              ? "Sesja wygasła. Proszę zalogować się ponownie."
              : "Wystąpił błąd podczas ładowania wizytówki. Spróbuj ponownie później."}
          </p>
        </div>
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Moja Wizytówka</h1>

      {card ? (
        <>
          <CardPreview card={card} />
          <div className="mt-6">
            <ActionButtons
              hasCard={true}
              onEdit={() => (window.location.href = "/card/edit")}
              onDelete={async () => {
                const confirmed = window.confirm("Czy na pewno chcesz usunąć swoją wizytówkę?");
                if (confirmed) {
                  try {
                    const response = await fetch(`/api/cards/${card.id}`, {
                      method: "DELETE",
                    });

                    if (response.ok) {
                      // Refresh the page or fetch card again
                      fetchCard();
                    } else {
                      alert("Nie udało się usunąć wizytówki. Spróbuj ponownie później.");
                    }
                  } catch (error) {
                    alert("Wystąpił błąd podczas usuwania wizytówki.");
                  }
                }
              }}
            />
          </div>
        </>
      ) : (
        <div>
          <p className="mb-6">
            Nie masz jeszcze wizytówki. Stwórz ją teraz, aby podzielić się swoimi kulturalnymi zainteresowaniami!
          </p>
          <ActionButtons hasCard={false} onCreate={() => (window.location.href = "/card/create")} />
        </div>
      )}
    </div>
  );
};

export default CardView;
