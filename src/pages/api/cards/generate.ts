import type { APIRoute } from "astro";
import { cardDataSchema } from "../../../lib/schemas/cardDataSchema";
import { ZodError } from "zod";
import { GenerateCardService, GenerateCardError } from "../../../lib/services/generateCardService";
import { createLogger } from "../../../lib/utils/logger";

export const prerender = false;

const logger = createLogger("api:cards:generate");
const generateCardService = new GenerateCardService();

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    // Check authentication
    const mockUser = {
      id: "4bb0b624-3295-4a1b-8255-1d76855004e8",
      email: "mock@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const user = mockUser;

    if (!user) {
      logger.warn("Unauthorized access attempt");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = cardDataSchema.parse(body);

    logger.debug("Generating card data", { userId: user.id });

    // Generate enhanced card data using the service
    const enhancedCardData = await generateCardService.generateCardData(validatedData.card_data);

    logger.info("Successfully generated card data", { userId: user.id });

    return new Response(JSON.stringify({ card_data: enhancedCardData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Validation error", { errors: error.errors });
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: error.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof GenerateCardError) {
      logger.error("Card generation error", { code: error.code, message: error.message });
      return new Response(
        JSON.stringify({
          error: "Failed to generate card data",
          code: error.code,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    logger.error("Unexpected error", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
