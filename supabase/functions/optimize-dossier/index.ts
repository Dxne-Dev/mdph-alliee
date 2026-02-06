import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- FONCTIONS DE MAPPING (Adaptées aux clés de l'interface QuestionnaireAnswers) ---

function mapHabillage(value: string) {
    const map: any = {
        'seul': 'Autonomie complète pour l\'habillage',
        'aide_partielle': 'Nécessite une aide partielle pour l\'habillage (guidance verbale, vérification)',
        'aide_complete': 'Incapacité à s\'habiller seul, aide quotidienne nécessaire pour l\'habillage complet'
    };
    return map[value] || value;
}

function mapHygiene(value: string) {
    const map: any = {
        'seul': 'Autonomie pour l\'hygiène corporelle',
        'aide_partielle': 'Nécessite une supervision constante pour l\'hygiène',
        'aide_complete': 'Requiert une assistance complète pour la toilette et les soins corporels'
    };
    return map[value] || value;
}

function mapToilettes(value: string) {
    const map: any = {
        'seul': 'Autonome pour l\'hygiène intime',
        'rappels': 'Autonome mais rappels fréquents et guidance nécessaires',
        'aide_complete': 'Assistance complète requise pour les besoins physiologiques'
    };
    return map[value] || value;
}

function mapAlimentation(value: string) {
    const map: any = {
        'seul': 'Autonome pour la prise des repas',
        'selectivite': 'Mange seul mais hypersélectivité alimentaire sévère (parfois limitée à quelques textures/aliments)',
        'aide_complete': 'Assistance complète requise pour l\'alimentation'
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
        'bonne': 'Gestion émotionnelle adaptée',
        'moyenne': 'Difficultés de régulation émotionnelle par moments',
        'difficile': 'Difficultés franches de régulation émotionnelle',
        'tres_difficile': 'Défaut majeur de régulation émotionnelle, fragilité extrême'
    };
    return map[value] || value;
}

function mapExpression(value: string) {
    const map: any = {
        'fluide': 'Expression orale fluide et adaptée',
        'phrases_simples': 'Langage limité à des phrases simples ou une syntaxe réduite',
        'mots_isoles': 'Communication limitée à des mots isolés ou une écholalie',
        'non_verbal': 'Communication non verbale uniquement'
    };
    return map[value] || value;
}

function mapComprehension(value: string) {
    const map: any = {
        'bonne': 'Compréhension adaptée des consignes complexes',
        'reformulation': 'Compréhension altérée nécessitant des reformulations systématiques',
        'difficile': 'Compréhension très limitée des consignes simples'
    };
    return map[value] || value;
}

function mapContactVisuel(value: string) {
    const map: any = {
        'present': 'Contact visuel établi et maintenu',
        'variable': 'Contact visuel fuyant ou instable',
        'fuyant': 'Absence de contact visuel direct'
    };
    return map[value] || value;
}

function mapInteractions(value: string) {
    const map: any = {
        'aisees': 'Interactions sociales fluides avec les pairs',
        'limitees': 'Interactions sociales limitées ou par intérêt',
        'tres_limitees': 'Isolement social marqué, absence de relations amicales stables',
        'absentes': 'Retrait social complet, absence d\'interactions spontanées'
    };
    return map[value] || value;
}

function mapSommeil(value: string) {
    const map: any = {
        'bon': 'Sommeil préservé',
        'reveils_occasionnels': 'Réveils nocturnes périodiques',
        'reveils_frequents': 'Troubles du sommeil marqués avec réveils fréquents',
        'tres_perturbe': 'Insomnie sévère ou sommeil très fragmenté'
    };
    return map[value] || value;
}

function mapSommeilParent(value: string) {
    const map: any = {
        'plus_7h': 'Sommeil non impacté (+7h)',
        '5-7h': 'Dette de sommeil régulière (moins de 6h réelles)',
        'moins_5h': 'Privation de sommeil chronique (moins de 5h en moyenne)',
        'moins_3h': 'Épuisement physique majeur, sommeil inférieur à 3h'
    };
    return map[value] || value;
}

function mapImpactTravail(value: string) {
    const map: any = {
        'aucun': 'Pas d\'impact professionnel direct',
        'amenagements': 'Aménagements d\'horaires indispensables pour les soins',
        'temps_partiel': 'Passage à temps partiel contraint par la charge d\'accompagnement',
        'arret': 'Cessation d\'activité professionnelle subie'
    };
    return map[value] || value;
}

function mapImpactFratrie(value: string) {
    const map: any = {
        'aucun': 'Pas de retentissement notable sur la fratrie',
        'leger': 'Impact léger sur l\'organisation',
        'tensions': 'Tensions régulières et sentiment d\'injustice exprimé',
        'important': 'Souffrance de la fratrie, isolement des frères et sœurs'
    };
    return map[value] || value;
}

function mapVieSociale(value: string) {
    const map: any = {
        'normale': 'Vie sociale de la famille préservée',
        'reduite': 'Vie sociale réduite aux cercles proches',
        'tres_limitee': 'Isolement social de la cellule familiale',
        'inexistante': 'Vie sociale inexistante par impossibilité de sorties'
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

const systemPrompt = `Tu es un rédacteur expert spécialisé dans les dossiers MDPH (Maison Départementale des Personnes Handicapées) pour les enfants porteurs de troubles du neurodéveloppement (TSA, TDAH, troubles dys, etc.).

Ta mission : transformer les réponses brutes d'un parent en un document "Projet de Vie" structuré, professionnel et percutant, destiné à être joint au dossier MDPH.

---

## TON RÔLE

Tu es un "traducteur de dignité". Tu prends le vécu quotidien d'une famille épuisée et tu le reformules dans le langage que la CDAPH (Commission des Droits et de l'Autonomie) attend et comprend.

Tu ne minimises jamais. Tu ne dramatises pas non plus. Tu retranscris fidèlement la réalité en utilisant les termes administratifs appropriés.

---

## RÈGLES ABSOLUES

1. **Jamais de promesse de résultat** : Tu ne garantis pas l'obtention des droits. Tu présentes les faits.

2. **Langage MDPH** : Utilise les termes attendus par les évaluateurs :
   - "retentissement" (pas "impact")
   - "limitations d'activité"
   - "restriction de participation"
   - "besoin de compensation"
   - "aide humaine"
   - "fatigabilité"
   - "défaut d'autonomie"
   - "accompagnement individualisé"

3. **Concret et chiffré** : Privilégie les faits mesurables.
   - ❌ "Il a du mal à s'habiller"
   - ✅ "Incapacité à s'habiller seul, nécessitant une aide quotidienne de 15 minutes matin et soir"

4. **Structure imposée** : Le document doit TOUJOURS suivre les 8 sections définies.

5. **Longueur** : 2 pages maximum (environ 800-1000 mots).

6. **Ton** : Factuel, respectueux, sans pathos excessif mais sans minimisation.

7. **Reprends les verbatims du parent** : Quand le parent a écrit quelque chose de fort dans un champ libre, intègre-le (reformulé si besoin) pour garder l'authenticité.

---

## STRUCTURE DU DOCUMENT (8 SECTIONS)

### 1. SITUATION ACTUELLE
- Prénom, âge, diagnostic, date du diagnostic
- Scolarisation actuelle (classe, établissement, AESH éventuel)
- Contexte familial si pertinent (famille monoparentale, fratrie)
- Objet du document (première demande / renouvellement)

### 2. RETENTISSEMENT SUR L'AUTONOMIE QUOTIDIENNE
- Habillage, Hygiène, Alimentation
- Déplacements / sécurité

### 3. TROUBLES DU COMPORTEMENT
- Nature des crises, Fréquence, Durée moyenne, Déclencheurs
- Exemple concret et Rigidités/routines

### 4. COMMUNICATION ET INTERACTIONS SOCIALES
- Expression orale, Compréhension, Contact visuel, Relations avec les pairs

### 5. RETENTISSEMENT SCOLAIRE
- Difficultés observées, Aménagements en place, Insuffisances actuelles

### 6. SOINS EN COURS ET RESTE À CHARGE
- Liste des professionnels, fréquence, coût et reste à charge mensuel total

### 7. RETENTISSEMENT SUR LA VIE FAMILIALE
- Sommeil, travail, fratrie, vie sociale, épuisement parental

### 8. DEMANDE
- Lister clairement ce qui est demandé et justifier chaque demande

---

## CE QUE TU NE FAIS JAMAIS

- Inventer des informations non fournies
- Utiliser un ton larmoyant ou suppliant
- Promettre un résultat
- Utiliser du jargon médical non fourni par le parent
- Dépasser 2 pages
- Oublier une section

---

---

FORMAT DE SORTIE

Génère le document en Markdown avec :
- Titre principal : ## PROJET DE VIE — [PRÉNOM] [INITIALE NOM], [ÂGE] ANS
- Sous-titre : *[Première demande / Renouvellement] de droits MDPH*
- Sections numérotées : ### 1. SITUATION ACTUELLE, etc.
- Listes à puces pour la lisibilité
- Tableau pour les soins si pertinent
- Signature finale : *Document généré par L'Allié MDPH*`;

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

        const userPrompt = `Génère le Projet de Vie pour le dossier MDPH de cet enfant.

---

## INFORMATIONS ENFANT

- Prénom : ${answers.firstName}
- Nom (initiale) : ${answers.lastName ? answers.lastName.charAt(0) + '.' : ''}
- Âge : ${age} ans (né le ${answers.birthDate})
- Diagnostic : ${answers.diagnosis}
- Date du diagnostic : ${answers.diagnosisDate}
- Classe : ${answers.currentGrade}
- Établissement : ${answers.schoolName || 'Non spécifié'}
- AESH actuel : ${answers.hasAesh ? `Oui, ${answers.aeshType}, ${answers.aeshHours}h/semaine` : 'Non'}

---

## CONTEXTE FAMILIAL

- Type de demande : ${answers.isRenewal ? 'Renouvellement' : 'Première demande'}
- Famille monoparentale : ${answers.isSingleParent ? 'Oui' : 'Non'}
- Fratrie : ${answers.siblings || 'Non spécifié'}

---

## AUTONOMIE QUOTIDIENNE

- Habillage seul : ${mapHabillage(answers.dressing)}
  ${answers.autonomyNotes ? `- Verbatim parent : "${answers.autonomyNotes}"` : ''}
- Hygiène : ${mapHygiene(answers.bathing)}
- Toilettes : ${mapToilettes(answers.toileting)}
- Alimentation : ${mapAlimentation(answers.eating)}
- Peut rester seul : ${answers.canStayAlone ? 'Oui' : 'Jamais'}

---

## COMPORTEMENT

- Crises lors de changements : ${answers.hasCrises ? 'Oui' : 'Non'}
- Fréquence : ${mapFrequenceCrises(answers.crisisFrequency)}
- Durée moyenne : ${answers.crisisDuration}
${answers.behaviorExample ? `- Exemple fourni par le parent : "${answers.behaviorExample}"` : ''}
- Rigidités/routines : ${answers.hasRigidities ? 'Oui' : 'Non'}
- Gestion des émotions : ${mapGestionEmotions(answers.emotionRegulation)}

---

## COMMUNICATION

- Expression orale : ${mapExpression(answers.oralExpression)}
- Compréhension : ${mapComprehension(answers.comprehension)}
- Contact visuel : ${mapContactVisuel(answers.eyeContact)}
- Interactions avec les pairs : ${mapInteractions(answers.peerInteractions)}

---

## SCOLARITÉ

- Difficultés en classe : ${answers.schoolDifficulties?.join(', ') || 'N/A'}
- Aménagements en place : ${answers.currentAccommodations?.join(', ') || 'Aucun'}
- AESH actuel suffisant : ${answers.aeshSufficient ? 'Oui' : 'Non'}
- Demande : ${answers.requestedSupport?.join(', ') || 'N/A'}
${answers.schoolContext ? `- Commentaire parent : "${answers.schoolContext}"` : ''}

---

## SOINS

${buildSoinsTable(answers)}

- Reste à charge mensuel : ${((answers.psychomotricianCost || 0) + (answers.psychologistCost || 0) + (answers.ergotherapistCost || 0) + (answers.educatorCost || 0))}€

---

## RETENTISSEMENT FAMILIAL

- Sommeil enfant : ${mapSommeil(answers.childSleep)}
- Sommeil parent : ${mapSommeilParent(answers.parentSleep)}
- Impact travail : ${mapImpactTravail(answers.workImpact)}
- Impact fratrie : ${mapImpactFratrie(answers.siblingImpact)}
- Vie sociale : ${mapVieSociale(answers.socialLife)}
${answers.familyImpact ? `- Commentaire parent : "${answers.familyImpact}"` : ''}

---

## DEMANDE

- AEEH : ${answers.requestAeeh ? 'Oui' : 'Non'}
- Complément souhaité : ${answers.aeehComplement || 'Non spécifié'}
- PCH : ${answers.requestPch ? 'Oui' : 'Non'}
- AESH : ${answers.requestMoreAesh ? 'Oui' : 'Non'}
${answers.finalNotes ? `- Commentaire final du parent : "${answers.finalNotes}"` : ''}

---

Génère maintenant le Projet de Vie structuré en suivant les 8 sections imposées. Maximum 2 pages. Langage MDPH. Intègre les verbatims du parent de manière fluide.`;

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
