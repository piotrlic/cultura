import type { CardDTO } from "../types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CardPreviewProps {
  card: CardDTO
}

interface MediaItem {
  title: string
  year: number
  genres: string[]
  note: string
  imageUrl: string | null
  infoUrl: string | null
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

  // Parse JSON strings into objects
  const parseMediaItems = (jsonString: string): MediaItem[] => {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return []
    }
  }

  // Extract IMDb ID from IMDb URL
  const extractImdbId = (url: string | null): string | null => {
    if (!url) return null
    const match = url.match(/\/title\/(tt\d+)/) || url.match(/\/name\/(nm\d+)/)
    return match ? match[1] : null
  }

  // Get IMDb thumbnail URL
  const getImdbThumbnailUrl = (imdbId: string | null): string | null => {
    if (!imdbId) return null
    return `https://img.omdbapi.com/?i=${imdbId}&apikey=trilogy&h=240`
  }

  const { movies, series, music, books } = card.generated_card_data

  const parsedMovies = parseMediaItems(movies)
  const parsedSeries = parseMediaItems(series)
  const parsedMusic = parseMediaItems(music)
  const parsedBooks = parseMediaItems(books)

  const renderMediaItem = (item: MediaItem, mediaType: "movie" | "series" | "music" | "book") => {
    // For movies and series, try to get IMDb thumbnail
    let imageSource = item.imageUrl

    if ((mediaType === "movie" || mediaType === "series") && item.infoUrl) {
      const imdbId = extractImdbId(item.infoUrl)
      const imdbThumbnail = getImdbThumbnailUrl(imdbId)
      if (imdbThumbnail) {
        imageSource = imdbThumbnail
      }
    }

    return (
      <div
        className="p-4 border rounded-md mb-2 bg-card hover:bg-muted/50 transition-colors"
        key={`${item.title}-${item.year}`}
      >
        <div className="flex gap-4">
          {imageSource && (
            <div className="flex-shrink-0">
              <img src={imageSource} alt={item.title} className="w-24 h-32 object-cover rounded-md shadow-sm" />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">
                {item.title}
                {item.infoUrl && (
                  <a
                    href={item.infoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary inline-block hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="inline-block"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
              </h4>
              <span className="text-sm text-muted-foreground">{item.year}</span>
            </div>
            <div className="flex flex-wrap gap-1 my-1">
              {item.genres.map((genre, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Moje kulturalne zainteresowania</CardTitle>
        <CardDescription>Ostatnia aktualizacja: {formatDate(card.modified_at)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <section aria-labelledby="movies-heading">
          <h3 id="movies-heading" className="font-medium text-lg mb-3">
            Filmy
          </h3>
          {parsedMovies.length > 0 ? (
            parsedMovies.map((item) => renderMediaItem(item, "movie"))
          ) : (
            <p className="text-muted-foreground italic">Brak danych o filmach</p>
          )}
        </section>

        <section aria-labelledby="series-heading">
          <h3 id="series-heading" className="font-medium text-lg mb-3">
            Seriale
          </h3>
          {parsedSeries.length > 0 ? (
            parsedSeries.map((item) => renderMediaItem(item, "series"))
          ) : (
            <p className="text-muted-foreground italic">Brak danych o serialach</p>
          )}
        </section>

        <section aria-labelledby="music-heading">
          <h3 id="music-heading" className="font-medium text-lg mb-3">
            Muzyka
          </h3>
          {parsedMusic.length > 0 ? (
            parsedMusic.map((item) => renderMediaItem(item, "music"))
          ) : (
            <p className="text-muted-foreground italic">Brak danych o muzyce</p>
          )}
        </section>

        <section aria-labelledby="books-heading">
          <h3 id="books-heading" className="font-medium text-lg mb-3">
            Książki
          </h3>
          {parsedBooks.length > 0 ? (
            parsedBooks.map((item) => renderMediaItem(item, "book"))
          ) : (
            <p className="text-muted-foreground italic">Brak danych o książkach</p>
          )}
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
