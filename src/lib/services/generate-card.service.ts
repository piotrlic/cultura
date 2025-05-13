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
      "You are a cultural content expert that enhances and structures information about movies, series, music, and books. For each category, extract and enhance information including titles, years, genres and descriptions. ALWAYS respond with valid JSON in the exact format described in the user prompt. Do not include any explanation or formatting outside of the JSON.",
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
        You are a "Cultura Card Generator." Your job is to analyze the user's cultural items (movies, TV series, music, books) and return them in a structured JSON format.
        
        Parse the user's input for each category and return up to 3 items per category with the following information:
        1. Title
        2. Year of release/publication
        3. One or two genres
        4. A 1-2 sentence personal note explaining why it's interesting
        5. Image URL - must be a real, valid URL starting with https:// (use null if not available)
        6. Info URL - must be a real, valid URL starting with https:// (use null if not available)
        
        Here is the user's content:
        MOVIES: ${cardData.movies}
        SERIES: ${cardData.series}
        MUSIC: ${cardData.music}
        BOOKS: ${cardData.books}
        
        Return your response as a JSON object with the following EXACT structure:
        {
          "movies": [
            {
              "title": "Movie Title",
              "year": 2023,
              "genres": ["Genre1", "Genre2"],
              "note": "Personal note about this item",
              "infoUrl": "https://example.com/info"
            }
            // up to 3 items maximum
          ],
          "series": [
            {
              "title": "Series Title",
              "year": 2023,
              "genres": ["Genre1", "Genre2"],
              "note": "Personal note about this item",
              "infoUrl": "https://example.com/info"
            }
            // up to 3 items maximum
          ],
          "music": [
            {
              "title": "Music Title",
              "year": 2023,
              "genres": ["Genre1", "Genre2"],
              "note": "Personal note about this item",
              "infoUrl": "https://example.com/info"
            }
            // up to 3 items maximum
          ],
          "books": [
            {
              "title": "Book Title",
              "year": 2023,
              "genres": ["Genre1", "Genre2"],
              "note": "Personal note about this item",
              "infoUrl": "https://example.com/info"
            }
            // up to 3 items maximum
          ]
        }

        IMPORTANT:
        - For imageUrl and infoUrl, provide ONLY real, valid URLs starting with https:// 
        - If you cannot provide a real URL, set the value to null (not a string "null", but the JSON null value)
        - For movies and series, use IMDb URLs when possible (e.g., https://www.imdb.com/...)
        - For music, use google images 
        - For books, use google images (e.g., https://www.goodreads.com/book/show/1234567890)
        - Do not use placeholder text like {url to poster} or template strings
        - Ensure your response is ONLY valid JSON with no additional text or comments
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
              Array.isArray(parsedContent.movies) &&
              Array.isArray(parsedContent.series) &&
              Array.isArray(parsedContent.music) &&
              Array.isArray(parsedContent.books)
            ) {
              // Convert the structured data to string format expected by CardData
              return {
                movies: JSON.stringify(parsedContent.movies) || cardData.movies,
                series: JSON.stringify(parsedContent.series) || cardData.series,
                music: JSON.stringify(parsedContent.music) || cardData.music,
                books: JSON.stringify(parsedContent.books) || cardData.books,
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
