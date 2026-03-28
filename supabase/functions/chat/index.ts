import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate user via JWT
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

    const { messages, mode } = await req.json();

    // Try providers in order: NVIDIA -> Gemini -> Lovable AI gateway
    const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!NVIDIA_API_KEY && !GEMINI_API_KEY && !LOVABLE_API_KEY) {
      throw new Error("No AI API key configured (NVIDIA_API_KEY, GEMINI_API_KEY, or LOVABLE_API_KEY)");
    }

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

    let response: Response;

    // Try NVIDIA first - primary provider for best responses
    if (NVIDIA_API_KEY) {
      console.log("[v0] Attempting NVIDIA API for chat");
      try {
        response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${NVIDIA_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta/llama-2-70b-chat-v1",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            temperature: 0.3,
            max_tokens: 1024,
            stream: true,
          }),
        });

        if (response.ok) {
          console.log("[v0] NVIDIA API streaming response successful");
          return new Response(response.body, {
            headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
          });
        } else {
          const status = response.status;
          const text = await response.text();
          console.warn(`[v0] NVIDIA API failed with status ${status}:`, text);
          
          if (status === 429) {
            console.log("[v0] NVIDIA rate limited, attempting fallback");
          }
        }
      } catch (error) {
        console.error("[v0] NVIDIA API error:", error);
      }
    }

    // Fallback: Try Gemini
    if (GEMINI_API_KEY) {
      console.log("[v0] Attempting Gemini API for chat");
      // Use Google Gemini API directly
      const geminiMessages = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Krishi AI, ready to help with agricultural advice." }] },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ];

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API error:", response.status, errText);

        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Transform Gemini SSE stream to OpenAI-compatible SSE stream
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const transformStream = new TransformStream({
        transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          const lines = text.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                // Emit in OpenAI-compatible format so the existing frontend parser works
                const openaiChunk = {
                  choices: [{ delta: { content } }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
              }
            } catch {
              // skip unparseable chunks
            }
          }
        },
        flush(controller) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        },
      });

      const transformedStream = response.body!.pipeThrough(transformStream);

      return new Response(transformedStream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Fallback: Lovable AI gateway
      console.log("[v0] Using Lovable AI gateway");
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    }
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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

    let response: Response;

    if (GEMINI_API_KEY) {
      // Use Google Gemini API directly
      const geminiMessages = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Krishi AI, ready to help with agricultural advice." }] },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ];

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API error:", response.status, errText);

        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Transform Gemini SSE stream to OpenAI-compatible SSE stream
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const transformStream = new TransformStream({
        transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          const lines = text.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                // Emit in OpenAI-compatible format so the existing frontend parser works
                const openaiChunk = {
                  choices: [{ delta: { content } }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
              }
            } catch {
              // skip unparseable chunks
            }
          }
        },
        flush(controller) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        },
      });

      const transformedStream = response.body!.pipeThrough(transformStream);

      return new Response(transformedStream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Fallback: Lovable AI gateway
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    }
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
