import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Header } from "./Header"

// Mock the LogoutButton component
vi.mock("./auth/LogoutButton", () => ({
  LogoutButton: () => <button data-testid="logout-button">Wyloguj</button>,
}))

describe("Header", () => {
  it("renders the header with logo and navigation", () => {
    render(<Header />)

    // Check if logo is rendered
    const logo = screen.getByText("Cultura")
    expect(logo).toBeInTheDocument()
    expect(logo.tagName).toBe("A")
    expect(logo).toHaveAttribute("href", "/")
  })

  it("does not render logout button by default", () => {
    // Check if logout button is not rendered
    const logoutButton = screen.queryByTestId("logout-button")
    expect(logoutButton).not.toBeInTheDocument()
  })
})
