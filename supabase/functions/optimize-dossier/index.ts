import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { answers } = await req.json()
        const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

        if (!GROQ_API_KEY) {
            throw new Error('Missing GROQ_API_KEY')
        }

        const prompt = `
      Tu es un expert en rédaction de dossiers MDPH (Maison Départementale des Personnes Handicapées).
      Ton rôle est de transformer les réponses brutes d'un parent en un "Projet de Vie" structuré, professionnel et percutant.

      CONSIGNES :
      1. Utilise un langage administratif et médical précis (ex: "difficultés de concentration" -> "troubles des fonctions exécutives").
      2. Mets en avant l'impact du handicap sur la vie quotidienne, scolaire et sociale.
      3. Sois empathique mais factuel. Pas de fioritures, va droit au but pour l'évaluateur.
      4. Structure le texte en paragraphes clairs.

      DONNÉES :
      - Enfant: ${answers.firstName}
      - Diagnostic: ${answers.diagnosis}
      - Scolarité: ${answers.schoolLevel}
      - Difficultés notées: ${answers.expectations}
      - Autonomie: Repas: ${answers.eating}, Habillage: ${answers.dressing}

      RÉDIGE LE PROJET DE VIE (en français) :
    `

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-r1-distill-llama-70b',
                messages: [
                    { role: 'system', content: 'Tu es un expert MDPH français.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
            }),
        })

        const result = await response.json()

        // Some basic text cleaning for DeepSeek (it sometimes includes <think> tags)
        let expertText = result.choices[0].message.content;
        expertText = expertText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return new Response(JSON.stringify({ expertText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
