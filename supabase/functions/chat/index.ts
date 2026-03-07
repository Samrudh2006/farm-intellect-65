import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      chat: `You are an expert Indian agricultural AI assistant called "Krishi AI". You provide real, actionable farming advice based on Indian agricultural practices, ICAR recommendations, and current best practices.

Key expertise areas:
- Crop management (Kharif, Rabi, Zaid seasons)
- Pest & disease identification and treatment (IPM practices)
- Soil health management and fertilizer recommendations (NPK, micronutrients)
- Weather-based advisories for Indian states
- Government schemes (PM-KISAN, PMFBY, Soil Health Card, eNAM)
- Market prices and mandi information
- Irrigation techniques (drip, sprinkler, flood)
- Organic farming practices

Always provide specific, practical advice. Include dosages, timings, and varieties when relevant. Reference Indian conditions, states, and local practices. Use both English and Hindi terms when helpful. Format responses with markdown for clarity.`,

      disease: `You are an expert plant pathologist specializing in Indian crops. When given a description of crop symptoms, provide:
1. Most likely disease/pest identification with confidence level
2. Severity assessment (low/medium/high)
3. Immediate treatment recommendations with specific product names and dosages
4. Preventive measures for future
5. When to consult a local agricultural officer

Be specific about Indian crop varieties and locally available treatments. Always recommend IPM (Integrated Pest Management) approaches first.`,

      recommendation: `You are an AI crop recommendation engine for Indian farmers. Based on the provided soil parameters (N, P, K, pH, organic carbon), location, season, and farm details, recommend the best crops to grow.

For each recommended crop, provide:
- Crop name and suitable varieties for the region
- Expected yield per hectare
- Estimated profit range
- Planting window
- Water requirements
- Key fertilizer schedule
- Risk factors
- Market demand assessment

Use ICAR data and Indian agricultural statistics. Be specific to the region and season provided.`,

      yield: `You are an agricultural yield prediction AI for Indian farming. Based on crop type, soil quality, irrigation method, farm size, and management practices, provide:
1. Predicted yield (quintals/hectare)
2. Confidence level
3. Contributing factors analysis
4. Risk assessment
5. Specific actionable recommendations to maximize yield
6. Comparison with state/national averages

Reference Indian agricultural data and ICAR benchmarks.`
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.chat;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
