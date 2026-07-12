/**
 * Reusable CORS headers for Supabase Edge Functions invoked from the browser.
 * Keep this in sync with headers sent by @supabase/supabase-js.
 */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, accept, accept-profile, content-profile, prefer, x-supabase-api-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

/** JSON response that always includes CORS headers. */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

/** Handle CORS preflight (OPTIONS). */
export function handleCorsPreflightRequest(): Response {
  return new Response('ok', {
    status: 200,
    headers: corsHeaders,
  })
}
