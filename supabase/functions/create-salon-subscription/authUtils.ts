
import { corsHeaders } from "./corsConfig.ts";

export function validateAuthHeader(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid authorization header");
    return false;
  }
  return true;
}

export function handleUnauthorized(headers?: Record<string, string>) {
  return new Response(
    JSON.stringify({ 
      error: "Missing or invalid authorization header",
      headers: headers || {}
    }),
    {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}
