import type { CardData } from "../../types"
import { OpenRouterService } from "./openrouter.service"
import { createLogger } from "../utils/logger"

export class GenerateCardError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = "GenerateCardError"
  }
}

/**
 * Service responsible for generating enhanced card data using AI model via OpenRouter
 */
export class GenerateCardService {
  private openRouterService: OpenRouterService
  private logger = createLogger("GenerateCardService")

  constructor() {
    // Configure OpenRouter service with appropriate system message and response format
    this.openRouterService = new OpenRouterService(
      'You are a cultural content expert that enhances descriptions of movies, series, music, and books. For each category, provide a brief analysis, relevant context, and links if available. Keep responses concise and informative. ALWAYS respond with valid JSON in the exact format: {"movies": "enhanced movie description", "series": "enhanced series description", "music": "enhanced music description", "books": "enhanced book description"}. Do not include any explanation or formatting outside of the JSON.',
      "",
      null,
      "openai/gpt-4o-mini",
      { temperature: 0.7, max_tokens: 1000 }
    )
  }

  /**
   * Generates enhanced card data based on user input
   * @param cardData User provided card data
   * @returns Enhanced card data with AI-generated descriptions
   * @throws GenerateCardError if generation fails
   */
  public async generateCardData(cardData: CardData): Promise<CardData> {
    try {
      this.logger.debug("Enhancing all card content with a single OpenRouter call")

      // Skip processing if all content is empty
      if (this.isAllContentEmpty(cardData)) {
        return cardData
      }

      // Create a prompt with all categories
      const prompt = `
        Enhance the following cultural interests. For each category, provide an enhanced description:
        MOVIES: ${cardData.movies}
        SERIES: ${cardData.series}
        MUSIC: ${cardData.music}
        BOOKS: ${cardData.books}
        Return your response as a JSON object with the enhanced content for each category.
      `

      console.log("prompt", prompt)
      const response = await this.openRouterService.sendMessage(prompt)
      console.log("response", response)
      this.logger.debug("Received OpenRouter response for all categories")

      // Extract enhanced descriptions from the response
      if (response.choices && response.choices.length > 0) {
        const responseContent = response.choices[0].message.content

        if (responseContent) {
          try {
            console.log("responseContent", responseContent)
            this.logger.debug("Attempting to parse response content as JSON")

            // Try to parse as JSON, handling potential leading/trailing characters
            let jsonContent = responseContent

            // Find the first { and last } to extract the JSON part
            const firstBrace = jsonContent.indexOf("{")
            const lastBrace = jsonContent.lastIndexOf("}")

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)
              this.logger.debug("Extracted JSON content")
            }

            const parsedContent = JSON.parse(jsonContent)
            console.log("parsedContent", parsedContent)

            // Verify the returned object has all required fields
            if (
              typeof parsedContent.movies === "string" &&
              typeof parsedContent.series === "string" &&
              typeof parsedContent.music === "string" &&
              typeof parsedContent.books === "string"
            ) {
              return {
                movies: parsedContent.movies || cardData.movies,
                series: parsedContent.series || cardData.series,
                music: parsedContent.music || cardData.music,
                books: parsedContent.books || cardData.books,
              }
            } else {
              this.logger.error("Parsed content is missing required fields or has wrong types")
              // Return original data if fields are missing
              return cardData
            }
          } catch (e) {
            this.logger.error("Failed to parse OpenRouter JSON response", e)
            // If parsing fails, return original content
            return cardData
          }
        }
      }

      // Fallback if response doesn't have expected format
      return cardData
    } catch (error) {
      this.logger.error("Failed to generate card data", error)
      if (error instanceof Error) {
        if (error.message.includes("API key is not provided")) {
          throw new GenerateCardError("OpenRouter API key not configured", "API_KEY_MISSING")
        } else if (error.message.includes("API request failed")) {
          throw new GenerateCardError("OpenRouter API request failed", "API_REQUEST_FAILED")
        }
      }
      throw new GenerateCardError("Failed to generate card data", "GENERATION_FAILED")
    }
  }

  /**
   * Checks if all content fields in the card data are empty
   */
  private isAllContentEmpty(cardData: CardData): boolean {
    return !cardData.movies.trim() && !cardData.series.trim() && !cardData.music.trim() && !cardData.books.trim()
  }
}
