import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should display the header with logo", async () => {
    // Check header visibility
    expect(await homePage.isHeaderVisible()).toBe(true);

    // Check logo visibility
    expect(await homePage.isLogoVisible()).toBe(true);

    // Check page title
    expect(await homePage.getTitle()).toContain("Cultura");
  });

  test("should take a screenshot of the homepage", async () => {
    await homePage.screenshot("homepage");
  });
});
