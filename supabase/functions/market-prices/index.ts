import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { at: number; prices: any[] }>();

async function fetchWithTimeout(url: string, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { state, district } = await req.json();
    const queryState = (state || "punjab").toLowerCase();

    // Validate inputs
    if (state && (typeof state !== "string" || state.length > 100)) {
      return new Response(JSON.stringify({ error: "Invalid state parameter" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cacheKey = `${queryState}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.at < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ prices: cached.prices, source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let prices: any[] = [];
    let source: "live" | "unavailable" = "unavailable";

    try {
      const today = new Date().toISOString().split('T')[0];
      const url = `https://vegetablemarketprice.com/api/dataapi/market/${encodeURIComponent(queryState)}/daywisedata?date=${today}`;
      const res = await fetchWithTimeout(url, 8000);
      
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          prices = data.data.slice(0, 20).map((r: any) => {
            const basePrice = parseInt(r.price) || 0;
            // The API provides per kg price. Convert to quintal (100kg)
            const pricePerQuintal = basePrice * 100;
            
            return {
              crop: r.vegetablename,
              market: `${state || "Punjab"}, ${district || "Local Market"}`,
              minPrice: Math.round(pricePerQuintal * 0.9), // Synthesize min price
              maxPrice: Math.round(pricePerQuintal * 1.1), // Synthesize max price
              modalPrice: pricePerQuintal,
              unit: "per quintal",
              date: today,
            };
          });
          
          if (prices.length > 0) {
            source = "live";
            cache.set(cacheKey, { at: now, prices });
          }
        }
      }
    } catch (e) {
      console.error("vegetablemarketprice API fetch error/timeout:", e);
    }

    // Fallback if API completely fails (so we don't crash the UI)
    if (prices.length === 0) {
      prices = [
        { crop: "Wheat", market: "Local Market", minPrice: 2200, maxPrice: 2400, modalPrice: 2300, unit: "per quintal", date: new Date().toISOString() },
        { crop: "Rice", market: "Local Market", minPrice: 3200, maxPrice: 3500, modalPrice: 3350, unit: "per quintal", date: new Date().toISOString() },
        { crop: "Cotton", market: "Local Market", minPrice: 6500, maxPrice: 7000, modalPrice: 6800, unit: "per quintal", date: new Date().toISOString() }
      ];
      source = "unavailable";
    }

    return new Response(JSON.stringify({ prices, source }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-prices error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
