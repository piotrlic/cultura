/**
 * OpenRouter Service
 *
 * Service for communicating with OpenRouter API to extend functionality of LLM-based chats.
 * This service allows:
 * 1. Combining system and user messages to define conversation context
 * 2. Sending requests to API with well-defined response format using JSON schema
 * 3. Configuring model including name and parameters
 */

import type {
  ResponseFormat,
  ModelParams,
  ConfigOptions,
  RequestBody,
  OpenRouterResponse,
} from "../schemas/openrouter.schema"

export class OpenRouterService {
  // Public fields
  public config: {
    systemMessage: string
    responseFormat: ResponseFormat | null
    modelName: string
    modelParams: ModelParams
  }

  // Private fields
  private _apiKey: string
  private _endpoint: string
  private _lastUserMessage: string

  /**
   * Initializes a new instance of the OpenRouterService
   *
   * @param systemMessage - Default system message (e.g., "You are a helpful assistant.")
   * @param userMessage - Initial user message
   * @param responseFormat - Object configuring the response format
   * @param modelName - Name of the model (e.g., "gpt-3.5-turbo")
   * @param modelParams - Object with model parameters
   * @param apiKey - API key for authentication
   * @param endpoint - API endpoint URL
   */
  constructor(
    systemMessage = "You are a expert about culture and entertainment. Your job is to collect a user’s favorite cultural items (movies, TV series, music tracks/albums, books) and return them in a strict JSON format suitable for rendering on a single-template visual card.  You may ask follow-up questions if the user hasn’t given enough detail.",
    userMessage = "",
    responseFormat: ResponseFormat | null = null,
    modelName = "",
    modelParams: ModelParams = { temperature: 0.7, max_tokens: 150 },
    apiKey = import.meta.env.OPENROUTER_API_KEY as string,
    endpoint = (import.meta.env.OPENROUTER_ENDPOINT as string) || "https://openrouter.ai/api/v1/chat/completions"
  ) {
    this.config = {
      systemMessage,
      responseFormat,
      modelName,
      modelParams,
    }
    this._apiKey = apiKey
    this._endpoint = endpoint
    this._lastUserMessage = userMessage

    // Validate API key
    if (!this._apiKey) {
      this._logError(new Error("API key is not provided. Set OPENROUTER_API_KEY environment variable."))
    }
  }

  /**
   * Sends a message to the OpenRouter API and returns the model's response
   *
   * @param input - User message to send to the API
   * @returns Promise with the API response
   */
  public async sendMessage(input: string): Promise<OpenRouterResponse> {
    try {
      if (!input.trim()) {
        throw new Error("Input message cannot be empty")
      }

      this._lastUserMessage = input
      const requestBody = this._prepareRequestBody(input)

      console.log("requestBody", requestBody)
      const response = await fetch(this._endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this._apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://cultura.app",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return this._handleResponse(data)
    } catch (error) {
      this._logError(error as Error)
      throw error
    }
  }

  /**
   * Updates the current configuration of the service
   *
   * @param options - Configuration options to update
   */
  public configure(options: ConfigOptions): void {
    if (options.systemMessage) {
      this.config.systemMessage = options.systemMessage
    }

    if (options.responseFormat) {
      this.config.responseFormat = options.responseFormat
    }

    if (options.modelName) {
      this.config.modelName = options.modelName
    }

    if (options.modelParams) {
      this.config.modelParams = { ...this.config.modelParams, ...options.modelParams }
    }

    if (options.apiKey) {
      this._apiKey = options.apiKey
    }

    if (options.endpoint) {
      this._endpoint = options.endpoint
    }
  }

  /**
   * Prepares the request body for the API request by combining system message,
   * user message, and other configuration
   *
   * @param input - User message to include in the request
   * @returns Request body object for the API
   */
  private _prepareRequestBody(input: string): RequestBody {
    const messages = [
      { role: "system" as const, content: this.config.systemMessage },
      { role: "user" as const, content: input },
    ]

    const requestBody: RequestBody = {
      messages,
      model: this.config.modelName,
      ...this.config.modelParams,
    }

    if (this.config.responseFormat) {
      requestBody.response_format = this.config.responseFormat
    }

    return requestBody
  }

  /**
   * Parses and validates the API response
   *
   * @param response - Raw response from the API
   * @returns Validated response object
   */
  private _handleResponse(response: unknown): OpenRouterResponse {
    // Validate that the response has the expected structure
    if (
      !response ||
      typeof response !== "object" ||
      !("choices" in response) ||
      !Array.isArray((response as OpenRouterResponse).choices) ||
      (response as OpenRouterResponse).choices.length === 0
    ) {
      throw new Error("Invalid response format from API")
    }

    // Validate each choice has the required structure
    for (const choice of (response as OpenRouterResponse).choices) {
      if (!choice.message || typeof choice.message !== "object" || !("role" in choice.message)) {
        throw new Error("Invalid response format from API: malformed choices")
      }
    }

    return response as OpenRouterResponse
  }

  /**
   * Logs error information for debugging purposes
   *
   * @param error - Error object to log
   */
  private _logError(error: Error): void {
    console.error(`[OpenRouterService] Error: ${error.message}`)

    // In a production environment, this could be extended to use
    // a proper logging service or error tracking system
  }
}
