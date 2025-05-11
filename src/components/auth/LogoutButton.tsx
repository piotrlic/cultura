import { Button } from "../ui/button"
import { useState } from "react"
import { toast } from "sonner"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to logout")
      }

      toast.success("Wylogowano pomyślnie")
      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      toast.error("Wystąpił błąd podczas wylogowywania")
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Wylogowywanie..." : "Wyloguj"}
    </Button>
  )
}
