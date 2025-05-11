import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  // Selectors
  readonly headerSelector = "header";
  readonly logoSelector = 'header a:has-text("Cultura")';
  readonly cardLinkSelector = 'header a:has-text("Moja wizytówka")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await super.goto("/");
  }

  /**
   * Navigate to card page
   */
  async navigateToCardPage() {
    await this.page.click(this.cardLinkSelector);
    await super.waitForNavigation();
  }

  /**
   * Check if header is visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return this.isVisible(this.headerSelector);
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return this.isVisible(this.logoSelector);
  }
}
