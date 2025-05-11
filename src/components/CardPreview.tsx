import type { CardDTO } from "../types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CardPreviewProps {
  card: CardDTO
}

const CardPreview = ({ card }: CardPreviewProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const { movies, series, music, books } = card.generated_card_data

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Moje kulturalne zainteresowania</CardTitle>
        <CardDescription>Ostatnia aktualizacja: {formatDate(card.modified_at)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <section aria-labelledby="movies-heading">
          <h3 id="movies-heading" className="font-medium text-lg mb-2">
            Filmy
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{movies}</p>
        </section>

        <section aria-labelledby="series-heading">
          <h3 id="series-heading" className="font-medium text-lg mb-2">
            Seriale
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{series}</p>
        </section>

        <section aria-labelledby="music-heading">
          <h3 id="music-heading" className="font-medium text-lg mb-2">
            Muzyka
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{music}</p>
        </section>

        <section aria-labelledby="books-heading">
          <h3 id="books-heading" className="font-medium text-lg mb-2">
            Książki
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{books}</p>
        </section>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Link do udostępnienia:</p>
          <code className="bg-muted p-1 rounded text-xs">
            {`${window.location.origin}/shared/${card.sharing_token}`}
          </code>
        </div>
        <button
          className="text-primary hover:underline text-sm"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/shared/${card.sharing_token}`)
            alert("Link do udostępnienia skopiowany do schowka!")
          }}
          aria-label="Kopiuj link do udostępnienia"
        >
          Kopiuj link
        </button>
      </CardFooter>
    </Card>
  )
}

export default CardPreview
