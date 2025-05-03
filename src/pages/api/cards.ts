import type { APIRoute } from "astro";
import { createCardCommandSchema, updateCardCommandSchema } from "../../lib/schemas/card.schema";
import { CardService } from "@/lib/services/card.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const mockUser = {
      id: "4bb0b624-3295-4a1b-8255-1d76855004e8",
      email: "mock@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const user = mockUser;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const result = createCardCommandSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: result.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create card using service
    const cardService = new CardService(locals.supabase);
    const card = await cardService.createCard(user.id, result.data);

    return new Response(JSON.stringify(card), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating card:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // Check authentication
    const mockUser = {
      id: "4bb0b624-3295-4a1b-8255-1d76855004e8",
      email: "mock@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const user = mockUser;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized - Please log in to access this resource" }), {
        status: 401,
      });
    }

    const userId = user.id;
    const cardService = new CardService(locals.supabase);
    const card = await cardService.getCardByUserId(userId);

    if (!card) {
      return new Response(JSON.stringify({ error: "Card not found for the authenticated user" }), { status: 404 });
    }

    return new Response(JSON.stringify(card), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error retrieving card:", error);
    return new Response(JSON.stringify({ error: "Internal server error occurred while retrieving the card" }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const mockUser = {
      id: "4bb0b624-3295-4a1b-8255-1d76855004e8",
      email: "mock@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const user = mockUser;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const result = updateCardCommandSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: result.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update card using service
    const cardService = new CardService(locals.supabase);

    try {
      const card = await cardService.updateCard(user.id, result.data);

      return new Response(JSON.stringify(card), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      if (error.message === "Card not found for this user") {
        return new Response(JSON.stringify({ error: "Card not found for this user" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error; // rethrow for the outer catch block
    }
  } catch (error) {
    console.error("Error updating card:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
