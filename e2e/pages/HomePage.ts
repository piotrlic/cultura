import { BasePage } from "./BasePage"

export class HomePage extends BasePage {
  // Selectors
  readonly headerSelector = "header"
  readonly logoSelector = ".text-6xl.font-semibold"
  readonly emailInputSelector = 'input[type="email"]'
  readonly passwordInputSelector = 'input[type="password"]'
  readonly submitLoginSelector = 'button[type="submit"]'
  readonly logoutButtonSelector = 'button:has-text("Wyloguj")'

  /**
   * Navigate to login page
   */
  async gotoLogin() {
    await super.goto("/login")
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await super.goto("/")
  }

  /**
   * Check if header is visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return this.isVisible(this.headerSelector)
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return this.isVisible(this.logoSelector)
  }

  /**
   * Login with provided credentials
   */
  async login(email: string, password: string) {
    await this.page.fill(this.emailInputSelector, email)
    await this.page.fill(this.passwordInputSelector, password)
    await this.page.click(this.submitLoginSelector)
    // Wait for navigation after successful login
    await this.page.waitForURL("/card")
  }

  /**
   * Check if logout button is visible (indicates user is logged in)
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return this.isVisible(this.logoutButtonSelector)
  }
}
