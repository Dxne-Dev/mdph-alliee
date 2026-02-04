import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const payload = await req.json()
        const answers = payload.answers || {}

        console.log("Optimisation pour:", answers.firstName || "Inconnu");

        const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
        if (!GROQ_API_KEY) {
            console.error("ERREUR: GROQ_API_KEY manquante dans les secrets Supabase");
            throw new Error('GROQ_API_KEY not configured');
        }

        // Récupération sécurisée du texte utilisateur
        const userText = answers.expectations || "";
        const school = answers.schoolLevel || "non spécifiée";
        const childInfo = `${answers.firstName || 'L\'enfant'}, ${answers.diagnosis || 'handicap non spécifié'}, scolarité : ${school}`;

        const prompt = `
      Tu es un expert en rédaction de dossiers MDPH. Ton rôle est de rédiger le "Projet de Vie".
      
      CONTEXTE : ${childInfo}
      NOTES DU PARENT : ${userText || "L'enfant a besoin d'un accompagnement pour compenser ses difficultés au quotidien et à l'école."}
      
      CONSIGNES :
      - Utilise un ton INSTITUTIONNEL, ADMINISTRATIF et FACTUEL.
      - Ne parle PAS de "carrière professionnelle", de "productivité" ou d'entreprise.
      - Concentre-toi sur : l'inclusion scolaire, l'autonomie quotidienne et les besoins de compensation.
      - Utilise le "nous" (les parents) ou la 3ème personne pour parler de l'enfant.
      - RÉPONSE (Le texte du projet de vie uniquement) :
    `

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 1500
            }),
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Détail Erreur Groq:", errorData);
            return new Response(JSON.stringify({
                error: "Erreur Groq",
                details: errorData
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: response.status,
            })
        }

        const result = await response.json()
        let expertText = result.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer le texte.";

        expertText = expertText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return new Response(JSON.stringify({ expertText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        return new Response(JSON.stringify({
            error: "Critical Function Error",
            message: err.message
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
