import { LogoutButton } from "./auth/LogoutButton"
import { useState, useEffect } from "react"
import { isAuthenticated } from "../lib/auth/index"

export function Header() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Check authentication status when component mounts
    isAuthenticated().then((authenticated: boolean) => {
      setIsAuthed(authenticated)
    })
  }, [])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-semibold">
          Cultura
        </a>
        <nav className="flex items-center gap-4">
          {isAuthed && (
            <>
              <a href="/card" className="text-sm hover:text-primary">
                Moja wizytówka
              </a>
              <LogoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
