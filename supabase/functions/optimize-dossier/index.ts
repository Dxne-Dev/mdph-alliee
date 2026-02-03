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
        const childInfo = `${answers.firstName || 'L\'enfant'}, ${answers.diagnosis || 'handicap non spécifié'}`;

        const prompt = `
      Tu es un expert MDPH. Transforme ces notes de parents en un Projet de Vie professionnel.
      Structure le texte en 3 paragraphes.
      
      CONTEXTE : ${childInfo}
      NOTES DU PARENT : ${userText || "Aucune note fournie, rédige un texte de base sur l'accompagnement nécessaire."}
      
      RÉPONSE (Directement le texte, sans introduction) :
    `

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-r1-distill-llama-70b',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 1500
            }),
        })

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Erreur Groq:", errorData);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const result = await response.json()
        let expertText = result.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer le texte.";

        // Nettoyage rigoureux
        expertText = expertText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return new Response(JSON.stringify({ expertText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        console.error("Erreur critique fonction:", err.message);
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
