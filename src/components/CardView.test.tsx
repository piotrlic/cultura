// src/components/CardView.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import CardView from "./CardView"
import { useCard } from "./hooks/useCard"
import type { CardDTO } from "../types"

// Mock dependencies
vi.mock("./hooks/useCard")
vi.mock("./CardPreview", () => ({
  default: ({ card }: { card: CardDTO }) => (
    <div data-testid="card-preview">
      <span>Card Preview: {card.id}</span>
    </div>
  ),
}))
vi.mock("./ActionButtons", () => ({
  default: ({
    hasCard,
    onEdit,
    onDelete,
    onCreate,
  }: {
    hasCard: boolean
    onEdit?: () => void
    onDelete?: () => void
    onCreate?: () => void
  }) => (
    <div data-testid="action-buttons">
      {hasCard ? (
        <>
          <button data-testid="edit-button" onClick={onEdit}>
            Edit
          </button>
          <button data-testid="delete-button" onClick={onDelete}>
            Delete
          </button>
        </>
      ) : (
        <button data-testid="create-button" onClick={onCreate}>
          Create
        </button>
      )}
    </div>
  ),
}))

describe("CardView", () => {
  const mockFetchCard = vi.fn()

  const mockCard: CardDTO = {
    id: "test-id",
    user_id: "user-123",
    card_data: {
      movies: "Test movies",
      series: "Test series",
      music: "Test music",
      books: "Test books",
    },
    generated_card_data: {
      movies: "Generated movies",
      series: "Generated series",
      music: "Generated music",
      books: "Generated books",
    },
    sharing_token: "share-token-123",
    created_at: "2023-01-01T12:00:00Z",
    modified_at: "2023-01-02T12:00:00Z",
  }

  beforeEach(() => {
    vi.resetAllMocks()
    global.window = Object.create(window)
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    })
    global.confirm = vi.fn()
    global.fetch = vi.fn()
  })

  it("renders loading state correctly", () => {
    vi.mocked(useCard).mockReturnValue({
      card: null,
      isLoading: true,
      error: null,
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    expect(screen.getByText("Moja Wizytówka")).toBeInTheDocument()
    expect(screen.getByTestId("loading-spinner")).toHaveClass("animate-spin")
  })

  it("renders error state correctly for general errors", () => {
    vi.mocked(useCard).mockReturnValue({
      card: null,
      isLoading: false,
      error: "500",
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    expect(screen.getByText("Moja Wizytówka")).toBeInTheDocument()
    expect(screen.getByText("Wystąpił błąd podczas ładowania wizytówki. Spróbuj ponownie później.")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /zaloguj/i })).not.toBeInTheDocument()
  })

  it("renders 401 error state with login link", () => {
    vi.mocked(useCard).mockReturnValue({
      card: null,
      isLoading: false,
      error: "401",
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    expect(screen.getByText("Sesja wygasła. Proszę zalogować się ponownie.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /zaloguj/i })).toHaveAttribute("href", "/login")
  })

  it("renders card preview when card exists", () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    expect(screen.getByTestId("card-preview")).toBeInTheDocument()
    expect(screen.getByTestId("action-buttons")).toBeInTheDocument()
    expect(screen.getByTestId("edit-button")).toBeInTheDocument()
    expect(screen.getByTestId("delete-button")).toBeInTheDocument()
  })

  it("renders no-card state with create button", () => {
    vi.mocked(useCard).mockReturnValue({
      card: null,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    expect(
      screen.getByText(
        "Nie masz jeszcze wizytówki. Stwórz ją teraz, aby podzielić się swoimi kulturalnymi zainteresowaniami!"
      )
    ).toBeInTheDocument()
    expect(screen.getByTestId("create-button")).toBeInTheDocument()
  })

  it("redirects to edit page when edit button is clicked", () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    fireEvent.click(screen.getByTestId("edit-button"))
    expect(window.location.href).toBe("/card/edit")
  })

  it("redirects to create page when create button is clicked", () => {
    vi.mocked(useCard).mockReturnValue({
      card: null,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })

    render(<CardView />)

    fireEvent.click(screen.getByTestId("create-button"))
    expect(window.location.href).toBe("/card/create")
  })

  it("handles card deletion with confirmation", async () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })
    vi.mocked(global.confirm).mockReturnValue(true)
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
    } as Response)

    render(<CardView />)

    fireEvent.click(screen.getByTestId("delete-button"))

    expect(global.confirm).toHaveBeenCalledWith("Czy na pewno chcesz usunąć swoją wizytówkę?")
    expect(global.fetch).toHaveBeenCalledWith(`/api/cards/${mockCard.id}`, {
      method: "DELETE",
    })

    await waitFor(() => {
      expect(mockFetchCard).toHaveBeenCalled()
    })
  })

  it("handles card deletion cancellation", async () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })
    vi.mocked(global.confirm).mockReturnValue(false)

    render(<CardView />)

    fireEvent.click(screen.getByTestId("delete-button"))

    expect(global.confirm).toHaveBeenCalledWith("Czy na pewno chcesz usunąć swoją wizytówkę?")
    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockFetchCard).not.toHaveBeenCalled()
  })

  it("handles card deletion error", async () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })
    vi.mocked(global.confirm).mockReturnValue(true)
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)
    global.alert = vi.fn()

    render(<CardView />)

    fireEvent.click(screen.getByTestId("delete-button"))

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Nie udało się usunąć wizytówki. Spróbuj ponownie później.")
    })
  })

  it("handles network error during deletion", async () => {
    vi.mocked(useCard).mockReturnValue({
      card: mockCard,
      isLoading: false,
      error: null,
      fetchCard: mockFetchCard,
    })
    vi.mocked(global.confirm).mockReturnValue(true)
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))
    global.alert = vi.fn()

    render(<CardView />)

    fireEvent.click(screen.getByTestId("delete-button"))

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Wystąpił błąd podczas usuwania wizytówki.")
    })
  })
})
