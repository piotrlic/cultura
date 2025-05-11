import { LogoutButton } from "./auth/LogoutButton"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-semibold">
          Cultura
        </a>
        <nav className="flex items-center gap-4">
          <a href="/card" className="text-sm hover:text-primary">
            Moja wizytówka
          </a>
          <LogoutButton />
        </nav>
      </div>
    </header>
  )
}
