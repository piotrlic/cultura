import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

// Mock the LogoutButton component
vi.mock("./auth/LogoutButton", () => ({
  LogoutButton: () => <button data-testid="logout-button">Wyloguj</button>,
}));

describe("Header", () => {
  it("renders the header with logo and navigation", () => {
    render(<Header />);

    // Check if logo is rendered
    const logo = screen.getByText("Cultura");
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe("A");
    expect(logo).toHaveAttribute("href", "/");

    // Check if card link is rendered
    const cardLink = screen.getByText("Moja wizytówka");
    expect(cardLink).toBeInTheDocument();
    expect(cardLink).toHaveAttribute("href", "/card");

    // Check if logout button is rendered
    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();
  });
});
