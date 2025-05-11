import type { APIRoute } from "astro";
import { createServerClient } from "@supabase/ssr";
import { cookieOptions } from "../../../middleware";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    cookies: {
      get(key) {
        return cookies.get(key)?.value;
      },
      set(key, value, options) {
        cookies.set(key, value, { ...cookieOptions, ...options });
      },
      remove(key, options) {
        cookies.delete(key, { ...cookieOptions, ...options });
      },
    },
  });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return redirect("/login");
};
