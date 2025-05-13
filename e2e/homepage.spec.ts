import { test, expect } from "@playwright/test"
import { HomePage } from "./pages/HomePage"

if (!process.env.E2E_USERNAME || !process.env.E2E_PASSWORD) {
  throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set")
}

// Test credentials from environment variables
const TEST_CREDENTIALS = {
  email: process.env.E2E_USERNAME,
  password: process.env.E2E_PASSWORD,
} as const

test.describe("Homepage and Authentication", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
  })

  test("should display the homepage header with logo", async () => {
    await homePage.goto()

    // Check header visibility
    expect(await homePage.isHeaderVisible()).toBe(true)
  })

  test("should display login page with Cultura logo", async () => {
    await homePage.gotoLogin()

    // Check logo visibility on login page
    expect(await homePage.isLogoVisible()).toBe(true)

    // Take a screenshot of login page
    await homePage.screenshot("login-page")
  })

  test("should login successfully and redirect to card page", async ({ page }) => {
    await homePage.gotoLogin()
    await homePage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password)

    // Verify that we're on the card page
    expect(page.url()).toContain("/card")

    // Take a screenshot of logged-in state
    await homePage.screenshot("after-login-card-page")
  })
})
