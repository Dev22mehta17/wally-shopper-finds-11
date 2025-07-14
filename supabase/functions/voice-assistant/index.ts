import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, query } = await req.json()
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let transcription = query;
    
    // If audio is provided, transcribe it using Whisper
    if (audio) {
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        body: (() => {
          const formData = new FormData();
          const audioBlob = new Blob([Uint8Array.from(atob(audio), c => c.charCodeAt(0))], { 
            type: 'audio/webm' 
          });
          formData.append('file', audioBlob, 'audio.webm');
          formData.append('model', 'whisper-1');
          return formData;
        })(),
      });

      const whisperData = await whisperResponse.json();
      transcription = whisperData.text;
    }

    // Use GPT-4 to generate product suggestions
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a helpful shopping assistant for Walmart. Given a user's request, suggest 3-5 relevant products. 
            Respond with a JSON object containing:
            - "message": A friendly response to the user
            - "products": Array of products with "name", "price", "category", "description", "rating" fields
            
            Example categories: Electronics, Clothing, Home & Garden, Sports, Books, Food, etc.
            Prices should be realistic Walmart prices.
            Ratings should be between 3.5-5.0.`
          },
          {
            role: 'user',
            content: transcription
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const gptData = await gptResponse.json();
    const aiResponse = JSON.parse(gptData.choices[0].message.content);

    return new Response(
      JSON.stringify({
        transcription,
        response: aiResponse,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})