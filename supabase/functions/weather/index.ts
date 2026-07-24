import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map Open-Meteo weather codes to OpenWeatherMap main conditions
function mapWeatherCode(code: number): { main: string; description: string } {
  if (code === 0) return { main: "Clear", description: "clear sky" };
  if (code >= 1 && code <= 3) return { main: "Clouds", description: "partly cloudy" };
  if (code === 45 || code === 48) return { main: "Clouds", description: "fog" };
  if (code >= 51 && code <= 57) return { main: "Drizzle", description: "drizzle" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { main: "Rain", description: "rain" };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { main: "Snow", description: "snow" };
  if (code >= 95 && code <= 99) return { main: "Rain", description: "thunderstorm" };
  return { main: "Clear", description: "clear sky" };
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

    const { city } = await req.json();
    if (!city) {
      return new Response(JSON.stringify({ error: "City is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Geocode the city
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error("Failed to fetch geocoding data");
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return new Response(JSON.stringify({ error: "Location not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;

    // Step 2: Fetch weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
    const weatherData = await weatherRes.json();

    // Format like OpenWeatherMap
    const currentCondition = mapWeatherCode(weatherData.current.weather_code);
    const cur = {
      main: {
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
      },
      wind: {
        speed: weatherData.current.wind_speed_10m / 3.6, // Convert km/h to m/s for OWM compat
      },
      weather: [currentCondition],
    };

    // Construct 5-day forecast list
    const fore = {
      list: [],
    };
    
    for (let i = 0; i < Math.min(5, weatherData.daily.time.length); i++) {
      const dateStr = weatherData.daily.time[i]; // "YYYY-MM-DD"
      const cond = mapWeatherCode(weatherData.daily.weather_code[i]);
      // The frontend groups by date, so we just need one entry per day at 12:00:00
      (fore.list as any[]).push({
        dt_txt: `${dateStr} 12:00:00`,
        main: {
          temp: (weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2,
        },
        weather: [cond],
      });
    }

    return new Response(JSON.stringify({ current: cur, forecast: fore }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weather error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
