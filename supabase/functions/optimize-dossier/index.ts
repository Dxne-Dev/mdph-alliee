import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- FONCTIONS DE MAPPING (Adaptées aux clés de l'interface QuestionnaireAnswers) ---

function mapHabillage(value: string) {
    const map: any = {
        'seul': 'Autonomie complète',
        'aide_partielle': 'Aide partielle nécessaire (guidance, vérification)',
        'aide_complete': 'Dépendance totale pour l\'habillage'
    };
    return map[value] || value;
}

function mapHygiene(value: string) {
    const map: any = {
        'seul': 'Autonomie pour l\'hygiène',
        'aide_partielle': 'Supervision nécessaire',
        'aide_complete': 'Assistance complète requise pour la toilette'
    };
    return map[value] || value;
}

function mapToilettes(value: string) {
    const map: any = {
        'seul': 'Autonome',
        'rappels': 'Autonome mais rappels fréquents nécessaires',
        'aide_complete': 'Assistance complète requise'
    };
    return map[value] || value;
}

function mapAlimentation(value: string) {
    const map: any = {
        'seul': 'Autonome',
        'selectivite': 'Mange seul mais hypersélectivité alimentaire (textures limitées)',
        'aide_complete': 'Assistance complète requise'
    };
    return map[value] || value;
}

function mapFrequenceCrises(value: string) {
    const map: any = {
        'quotidiennes': 'Quotidiennes',
        'hebdomadaires': 'Fréquentes (plusieurs fois par semaine)',
        'mensuelles': 'Régulières (plusieurs fois par mois)'
    };
    return map[value] || 'Non spécifiée';
}

function mapGestionEmotions(value: string) {
    const map: any = {
        'bonne': 'Gestion adaptée',
        'moyenne': 'Difficultés légères de régulation',
        'difficile': 'Difficultés de régulation émotionnelle',
        'tres_difficile': 'Régulation émotionnelle très altérée'
    };
    return map[value] || value;
}

function mapExpression(value: string) {
    const map: any = {
        'fluide': 'Expression orale adaptée à l\'âge',
        'phrases_simples': 'Expression limitée à des phrases simples',
        'mots_isoles': 'Expression limitée à des mots isolés',
        'non_verbal': 'Communication non verbale uniquement'
    };
    return map[value] || value;
}

function mapComprehension(value: string) {
    const map: any = {
        'bonne': 'Compréhension adaptée',
        'reformulation': 'Compréhension altérée, reformulations nécessaires',
        'difficile': 'Compréhension très limitée'
    };
    return map[value] || value;
}

function mapContactVisuel(value: string) {
    const map: any = {
        'present': 'Contact visuel adapté',
        'variable': 'Contact visuel variable',
        'fuyant': 'Contact visuel fuyant'
    };
    return map[value] || value;
}

function mapInteractions(value: string) {
    const map: any = {
        'aisees': 'Interactions adaptées',
        'limitees': 'Interactions limitées',
        'tres_limitees': 'Interactions très limitées, absence de relations amicales',
        'absentes': 'Absence d\'interactions avec les pairs'
    };
    return map[value] || value;
}

function mapSommeil(value: string) {
    const map: any = {
        'bon': 'Sommeil normal',
        'reveils_occasionnels': 'Réveils nocturnes occasionnels',
        'reveils_frequents': 'Réveils nocturnes fréquents',
        'tres_perturbe': 'Sommeil très perturbé'
    };
    return map[value] || value;
}

function mapSommeilParent(value: string) {
    const map: any = {
        'plus_7h': 'Sommeil non impacté (+7h)',
        '5-7h': 'Moins de 6h de sommeil par nuit',
        'moins_5h': 'Moins de 5h de sommeil par nuit en moyenne',
        'moins_3h': 'Sommeil très dégradé, épuisement majeur'
    };
    return map[value] || value;
}

function mapImpactTravail(value: string) {
    const map: any = {
        'aucun': 'Pas d\'impact sur l\'activité professionnelle',
        'amenagements': 'Aménagements d\'horaires nécessaires',
        'temps_partiel': 'Temps partiel contraint par les besoins de l\'enfant',
        'arret': 'Cessation d\'activité professionnelle'
    };
    return map[value] || value;
}

function mapImpactFratrie(value: string) {
    const map: any = {
        'aucun': 'Pas d\'impact significatif',
        'leger': 'Impact léger',
        'tensions': 'Tensions régulières',
        'important': 'Impact fort, sentiment d\'injustice exprimé'
    };
    return map[value] || value;
}

function mapVieSociale(value: string) {
    const map: any = {
        'normale': 'Vie sociale préservée',
        'reduite': 'Vie sociale réduite',
        'tres_limitee': 'Vie sociale très limitée',
        'inexistante': 'Vie sociale quasi inexistante'
    };
    return map[value] || value;
}

function buildSoinsTable(answers: any) {
    const rows = [];
    if (answers.orthophonist) rows.push(`| Orthophoniste | ${answers.orthophonistFreq || 'N/A'} | Remboursé |`);
    if (answers.psychomotrician) rows.push(`| Psychomotricien | N/A | ${answers.psychomotricianCost || 0}€ |`);
    if (answers.psychologist) rows.push(`| Psychologue | N/A | ${answers.psychologistCost || 0}€ |`);
    if (answers.ergotherapist) rows.push(`| Ergothérapeute | N/A | ${answers.ergotherapistCost || 0}€ |`);
    if (answers.specializedEducator) rows.push(`| Éducateur spécialisé | N/A | ${answers.educatorCost || 0}€ |`);

    if (rows.length === 0) return 'Aucun suivi paramédical en cours.';

    return `| Professionnel | Fréquence | Coût mensuel |
|---|---|---|
${rows.join('\n')}`;
}

const systemPrompt = `Tu es un rédacteur expert spécialisé dans les dossiers MDPH pour enfants TND (TSA, TDAH, troubles dys).

TON RÔLE : Transformer les réponses d'un parent en un "Projet de Vie" structuré, professionnel et percutant.

Tu es un "traducteur de dignité" : tu prends le vécu brut et tu le reformules dans le langage que la CDAPH attend.

---

RÈGLES ABSOLUES :

1. JAMAIS inventer d'informations non fournies
2. JAMAIS promettre un résultat ("ce dossier garantit...")
3. JAMAIS minimiser les difficultés
4. JAMAIS utiliser un ton larmoyant ou suppliant
5. TOUJOURS utiliser le vocabulaire MDPH :
   - "retentissement" (pas "impact")
   - "limitations d'activité"
   - "restriction de participation"
   - "besoin de compensation"
   - "aide humaine"
   - "fatigabilité"
   - "défaut d'autonomie"
   - "accompagnement individualisé"

6. TOUJOURS être concret et chiffré :
   ❌ "Il a du mal à s'habiller"
   ✅ "Incapacité à s'habiller seul, nécessitant une aide quotidienne"

7. TOUJOURS utiliser "nous" (les parents) ou la 3ème personne pour l'enfant

8. LONGUEUR : 800-1000 mots maximum (2 pages)

---

STRUCTURE OBLIGATOIRE (8 sections) :

### 1. SITUATION ACTUELLE
### 2. RETENTISSEMENT SUR L'AUTONOMIE QUOTIDIENNE
### 3. TROUBLES DU COMPORTEMENT
### 4. COMMUNICATION ET INTERACTIONS SOCIALES
### 5. RETENTISSEMENT SCOLAIRE
### 6. SOINS EN COURS ET RESTE À CHARGE
### 7. RETENTISSEMENT SUR LA VIE FAMILIALE
### 8. DEMANDE

---

FORMAT DE SORTIE :
- Markdown
- Titre : ## PROJET DE VIE — [PRÉNOM] [INITIALE], [ÂGE] ANS
- Sous-titre : *[Première demande / Renouvellement] de droits MDPH*
- Sections numérotées : ### 1. SITUATION ACTUELLE
- Terminer par : *Document généré par L'Allié MDPH*`;

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const payload = await req.json()
        const answers = payload.answers || {}

        console.log("Optimisation pour:", answers.firstName || "Inconnu");

        const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
        if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

        // Calcul de l'âge approximatif
        const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : 0;
        const currentYear = new Date().getFullYear();
        const age = birthYear ? currentYear - birthYear : 'N/A';

        const userPrompt = `Génère le Projet de Vie MDPH avec les informations suivantes.

---

## ENFANT
- Prénom : ${answers.firstName}
- Âge : ${age} ans
- Date de naissance : ${answers.birthDate}
- Diagnostic : ${answers.diagnosis}
- Date du diagnostic : ${answers.diagnosisDate}
- Classe : ${answers.currentGrade}
- AESH actuel : ${answers.hasAesh ? `Oui, ${answers.aeshType}, ${answers.aeshHours}h/semaine` : 'Non'}

## CONTEXTE
- Type de demande : ${answers.isRenewal ? 'Renouvellement' : 'Première demande'}

## AUTONOMIE QUOTIDIENNE
- Habillage : ${mapHabillage(answers.dressing)}
- Hygiène : ${mapHygiene(answers.bathing)}
- Toilettes : ${mapToilettes(answers.toileting)}
- Alimentation : ${mapAlimentation(answers.eating)}
- Peut rester seul : ${answers.canStayAlone ? 'Peut rester seul sur de courtes périodes' : 'Ne peut jamais rester seul, surveillance constante impérative'}
${answers.autonomyNotes ? `- Précision parent : "${answers.autonomyNotes}"` : ''}

## COMPORTEMENT
- Crises : ${answers.hasCrises ? 'Oui' : 'Non'}
- Fréquence : ${mapFrequenceCrises(answers.crisisFrequency)}
- Durée moyenne : ${answers.crisisDuration}
${answers.behaviorExample ? `- Exemple fourni : "${answers.behaviorExample}"` : ''}
- Rigidités : ${answers.hasRigidities ? 'Oui' : 'Non'}
- Gestion émotions : ${mapGestionEmotions(answers.emotionRegulation)}

## COMMUNICATION
- Expression orale : ${mapExpression(answers.oralExpression)}
- Compréhension : ${mapComprehension(answers.comprehension)}
- Contact visuel : ${mapContactVisuel(answers.eyeContact)}
- Interactions pairs : ${mapInteractions(answers.peerInteractions)}

## SCOLARITÉ
- Difficultés : ${answers.schoolDifficulties?.join(', ') || 'N/A'}
- Aménagements en place : ${answers.currentAccommodations?.join(', ') || 'Aucun'}
- AESH suffisant : ${answers.aeshSufficient ? 'Oui' : 'Non'}
- Demande : ${answers.requestedSupport?.join(', ') || 'N/A'}
${answers.schoolContext ? `- Commentaire parent : "${answers.schoolContext}"` : ''}

## SOINS
${buildSoinsTable(answers)}
- Reste à charge estimé : ${((answers.psychomotricianCost || 0) + (answers.psychologistCost || 0) + (answers.ergotherapistCost || 0) + (answers.educatorCost || 0))}€

## RETENTISSEMENT FAMILIAL
- Sommeil enfant : ${mapSommeil(answers.childSleep)}
- Sommeil parent : ${mapSommeilParent(answers.parentSleep)}
- Impact travail : ${mapImpactTravail(answers.workImpact)}
- Impact fratrie : ${mapImpactFratrie(answers.siblingImpact)}
- Vie sociale : ${mapVieSociale(answers.socialLife)}
${answers.familyImpact ? `- Commentaire parent : "${answers.familyImpact}"` : ''}

## DEMANDE
- AEEH : ${answers.requestAeeh ? `Oui` : 'Non'}
- Complément souhaité : ${answers.aeehComplement || 'Non spécifié'}
- PCH : ${answers.requestPch ? 'Oui' : 'Non'}
- AESH : ${answers.requestMoreAesh ? `Oui` : 'Non'}
${answers.finalNotes ? `- Message du parent : "${answers.finalNotes}"` : ''}

---

Génère maintenant le Projet de Vie structuré. Intègre les verbatims du parent de manière fluide. Maximum 2 pages.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.4,
                max_tokens: 2000
            }),
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Détail Erreur Groq:", errorData);
            throw new Error('Groq API Error');
        }

        const result = await response.json()
        let expertText = result.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer le texte.";
        expertText = expertText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return new Response(JSON.stringify({ expertText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
