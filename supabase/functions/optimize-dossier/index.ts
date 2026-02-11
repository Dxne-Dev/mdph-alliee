// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- FONCTIONS DE MAPPING (Adaptées aux clés de l'interface QuestionnaireAnswers) ---

// --- FONCTIONS DE MAPPING V2 (Vocabulaire MDPH Expert) ---

function mapHabillage(value: string) {
    const map: any = {
        'seul': 'Autonomie acquise pour l\'habillage (habillage/déshabillage)',
        'aide_partielle': 'Autonomie partielle : nécessite une guidance verbale, une stimulation et une vérification systématique (troubles praxiques ou attentionnels)',
        'aide_complete': 'Dépendance totale : incapacité à s\'habiller seul, nécessite une aide humaine active pour l\'ensemble des gestes (habillage/déshabillage)'
    };
    return map[value] || value;
}

function mapHygiene(value: string) {
    const map: any = {
        'seul': 'Autonomie acquise pour l\'hygiène corporelle',
        'aide_partielle': 'Nécessite une supervision constante, un étayage verbal pour le respect des étapes et une vérification de la propreté',
        'aide_complete': 'Dépendance totale : requiert une assistance physique complète pour la toilette, le séchage et les soins corporels (immaturité ou incapacité motrice)'
    };
    return map[value] || value;
}

function mapToilettes(value: string) {
    const map: any = {
        'seul': 'Continent de jour et de nuit, autonome pour l\'essuyage',
        'rappels': 'Continenta acquise mais nécessite une vigilance de l\'adulte (rappels fréquents) et une aide pour l\'hygiène intime',
        'aide_complete': 'Incontinence (ou énurésie/encoprésie) nécessitant le port de protections et une gestion complète par l\'adulte'
    };
    return map[value] || value;
}

function mapAlimentation(value: string) {
    const map: any = {
        'seul': 'Autonomie pour la prise des repas, usage adapté des couverts',
        'selectivite': 'Autonomie motrice mais hypersélectivité alimentaire sévère (rigidité, troubles de l\'oralité) nécessitant une vigilance nutritionnelle',
        'aide_complete': 'Dépendance pour l\'alimentation : nécessite une aide humaine pour la découpe, l\'ingestion ou la stimulation constante (risk de fausse route ou refus)'
    };
    return map[value] || value;
}

function mapFrequenceCrises(value: string) {
    const map: any = {
        'quotidiennes': 'Quotidiennes (parfois pluriquotidiennes)',
        'hebdomadaires': 'Fréquentes (plusieurs épisodes par semaine)',
        'mensuelles': 'Régulières (plusieurs épisodes par mois)'
    };
    return map[value] || 'Non spécifiée';
}

function mapGestionEmotions(value: string) {
    const map: any = {
        'bonne': 'Régulation émotionnelle adaptée à l\'âge',
        'moyenne': 'Labilité émotionnelle : difficultés de régulation lors de contrariétés ou fatigues',
        'difficile': 'Intolérance à la frustration majeure, défaut de régulation émotionnelle, hétéro-agressivité ou auto-agressivité possible',
        'tres_difficile': 'Troubles massifs de la régulation émotionnelle, effondrements fréquents, mise en danger (défaut de conscience du danger)'
    };
    return map[value] || value;
}

function mapExpression(value: string) {
    const map: any = {
        'fluide': 'Langage oral fonctionnel et intelligible',
        'phrases_simples': 'Retard de langage : syntaxe simplifiée, vocabulaire pauvre',
        'mots_isoles': 'Langage non fonctionnel : mots isolés, jargon ou écholalie immédiate/différée',
        'non_verbal': 'Absence de langage oral (communication non verbale ou outils alternatifs type PECS/Makaton)'
    };
    return map[value] || value;
}

function mapComprehension(value: string) {
    const map: any = {
        'bonne': 'Compréhension des consignes simples et complexes',
        'reformulation': 'Troubles de la compréhension : nécessite des consignes courtes, séquencées et une reformulation systématique',
        'difficile': 'Compréhension très sélective ou contextuelle, nécessite un support visuel'
    };
    return map[value] || value;
}

function mapContactVisuel(value: string) {
    const map: any = {
        'present': 'Contact visuel établi et maintenu',
        'variable': 'Contact visuel fluctuant, difficile à soutenir dans l\'interaction sociale',
        'fuyant': 'Regard fuyant, évitement actif du contact visuel (troubles de la communication sociale)'
    };
    return map[value] || value;
}

function mapInteractions(value: string) {
    const map: any = {
        'aisees': 'Interactions sociales adaptées avec les pairs',
        'limitees': 'Maladresses sociales, difficultés à initier ou maintenir le jeu partagé, incompréhension des codes sociaux',
        'tres_limitees': 'Isolement social marqué, jeux solitaires ou stéréotypés, désintérêt pour les pairs',
        'absentes': 'Retrait relationnel massif, absence de réciprocité sociale'
    };
    return map[value] || value;
}

function mapSommeil(value: string) {
    const map: any = {
        'bon': 'Cycles de sommeil physiologiques',
        'reveils_occasionnels': 'Parasomnies ou réveils nocturnes périodiques',
        'reveils_frequents': 'Troubles sévères de l\'endormissement et du maintien du sommeil (réveils multiples)',
        'tres_perturbe': 'Insomnie chronique sévère, dette de sommeil majeure impactant le fonctionnement diurne'
    };
    return map[value] || value;
}

function mapSommeilParent(value: string) {
    const map: any = {
        'plus_7h': 'Sommeil parental préservé',
        '5-7h': 'Dette de sommeil parentale chronique',
        'moins_5h': 'Privation de sommeil sévère (aidant familial)',
        'moins_3h': 'Épuisement maternel/paternel majeur (risque de burn-out parental), vigilance nocturne constante requise'
    };
    return map[value] || value;
}

function mapImpactTravail(value: string) {
    const map: any = {
        'aucun': 'Activité professionnelle maintenue',
        'amenagements': 'Nécessité d\'aménagements horaires pour les prises en charge (absentéisme contraint)',
        'temps_partiel': 'Passage à temps partiel imposé par la charge de handicap (perte de revenus)',
        'arret': 'Cessation forcée de toute activité professionnelle pour assurer l\'aide humaine constante'
    };
    return map[value] || value;
}

function mapImpactFratrie(value: string) {
    const map: any = {
        'aucun': 'Pas de retentissement notable',
        'leger': 'Adaptation nécessaire de l\'organisation familiale',
        'tensions': 'Sentiment d\'injustice, jalousie ou inquiétude exprimée par la fratrie',
        'important': 'Souffrance psychique de la fratrie, parentification des aînés, réduction drastique du temps consacré aux autres enfants'
    };
    return map[value] || value;
}

function mapVieSociale(value: string) {
    const map: any = {
        'normale': 'Vie sociale préservée',
        'reduite': 'Restrictions des sorties et loisirs familiaux (comportements inadaptés)',
        'tres_limitee': 'Repli social de la famille, évitement des lieux publics',
        'inexistante': 'Confinement au domicile, sorties impossibles sans aide tierce'
    };
    return map[value] || value;
}

function buildSoinsTable(answers: any) {
    const rows = [];
    if (answers.orthophonist) rows.push(`| Orthophoniste | ${answers.orthophonistFreq || 'N/A'} | Remboursé |`);
    if (answers.psychomotrician) rows.push(`| Psychomotricien | N/A | ${answers.psychomotricianCost || 0}€ (Non remboursé) |`);
    if (answers.psychologist) rows.push(`| Psychologue | N/A | ${answers.psychologistCost || 0}€ (Non remboursé) |`);
    if (answers.ergotherapist) rows.push(`| Ergothérapeute | N/A | ${answers.ergotherapistCost || 0}€ (Non remboursé) |`);
    if (answers.specializedEducator) rows.push(`| Éducateur spécialisé | N/A | ${answers.educatorCost || 0}€ (Non remboursé) |`);

    if (rows.length === 0) return 'Aucun suivi paramédical en cours.';

    return `| Professionnel | Fréquence | Coût / Reste à charge |
|---|---|---|
${rows.join('\n')}`;
}

const systemPrompt = `Tu es un EXPERT en rédaction de "Projet de Vie" pour les dossiers MDPH (CDAPH).
Ton objectif est de rédiger un document de 2 pages maximum qui maximise les chances de la famille d'obtenir les compensations demandées (AEEH, AESH, PCH, compléments).

---

## TA STRATÉGIE RÉDACTIONNELLE (Langage MDPH)

Tu dois traduire les difficultés du quotidien en "besoins de compensation" et en "limitations d'activités".
Utilise impérativement ce champ lexical :
- "Défaut d'autonomie", "Sollicitation constante de l'adulte"
- "Immaturité psycho-affective", "Troubles des fonctions exécutives"
- "Défaut de conscience du danger", "Mise en danger"
- "Hypersensorialité", "Fatigabilité cognitive"
- "Étayage", "Guidance", "Incitation verbale"
- "Retentissement majeur sur la vie familiale"

---

## RÈGLES D'OR V3 (Expertise MDPH)

1. **Précision Chronologique** : Si la date de naissance et la date de diagnostic semblent très rapprochées (ex: TDAH à 1 an), ne présente pas cela comme un diagnostic définitif médicalement surprenant. Préfère : "Un parcours de soin a été initié précocement dès [DATE] face à des signes d'alerte majeurs".
2. **Narration par l'Exemple** : Dans la section 3 (Comportement), utilise l'exemple de crise fourni par le parent pour créer une narration factuelle et datée. Ne te contente pas de citer, dis : "Comme l'illustre un épisode récent : [REFORMULATION DE L'EXEMPLE]". Cela rend le dossier crédible.
3. **Précision des Demandes AESH** : Pour toute demande d'accompagnement, demande "un accompagnement sur l'intégralité du temps scolaire (soit 24h/semaine en primaire)". La MDPH apprécie la précision du volume horaire.
4. **Preuver par le Verbatim** : Intègre les citations parentales pour humaniser, mais entoure-les d'une analyse technique.
5. **Reste à Charge** : Mets en avant le coût financier des soins non remboursés comme un argument massue pour l'AEEH.

---

## STRUCTURE DU DOCUMENT (Markdown)

### 1. SITUATION ACTUELLE
- Identité, Âge, Diagnostic, Scolarité.
- Phrase d'accroche sur le parcours de soin.

### 2. RETENTISSEMENT SUR L'AUTONOMIE (Actes essentiels)
- Détailler : Toilette, Habillage, Alimentation, Élimination.
- Utiliser : "Aide active", "Guidance", "Autonomie non acquise".

### 3. TROUBLES DU COMPORTEMENT ET SÉCURITÉ
- Fréquence/Intensité des crises.
- **Narration concrète d'une crise exemplaire.**
- Notion de mise en danger.

### 4. COMMUNICATION ET SOCIALISATION
- Langage, Compréhension.
- Relations sociales et codes.

### 5. SCOLARITÉ ET APPRENTISSAGES
- Obstacles concrets en classe.
- Justification précise du besoin d'AESH (étayage, attention).

### 6. SOINS ET CHARGE FINANCIÈRE
- Tableau des suivis.
- **Reste à charge mensuel total en gras.**

### 7. IMPACT SUR LA VIE FAMILIALE
- Sommeil parent/enfant.
- Impact professionnel et fratrie.

### 8. DEMANDES FORMULÉES
- Récapitulatif clair : AEEH + Complément, AESH (24h/semaine), Orientation.

---
Rédige ce document avec un ton professionnel, factuel, mais empathique et percutant. Pas de conclusion générique.
`;

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const payload = await req.json()
        const answers = payload.answers || {}

        console.log("Optimisation V2 pour:", answers.firstName || "Inconnu");

        // @ts-ignore: Deno is provided by the execution environment
        const GROQ_API_KEY = (globalThis as any).Deno.env.get('GROQ_API_KEY')
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

## AUTONOMIE QUOTIDIENNE (Actes essentiels)

- Habillage : ${mapHabillage(answers.dressing)}
  ${answers.autonomyNotes ? `> NOTE PARENT : "${answers.autonomyNotes}"` : ''}
- Hygiène : ${mapHygiene(answers.bathing)}
- Toilettes : ${mapToilettes(answers.toileting)}
- Alimentation : ${mapAlimentation(answers.eating)}
- Peut rester seul : ${answers.canStayAlone ? 'Oui' : 'Jamais (DANGER IMMÉDIAT)'}

---

## COMPORTEMENT ET SÉCURITÉ

- Crises : ${answers.hasCrises ? 'Oui' : 'Non'}
- Fréquence : ${mapFrequenceCrises(answers.crisisFrequency)}
- Durée moyenne : ${answers.crisisDuration}
${answers.behaviorExample ? `> EXEMPLE DE CRISE : "${answers.behaviorExample}"` : ''}
- Rigidités/Routines : ${answers.hasRigidities ? 'Oui' : 'Non'}
- Régulation émotionnelle : ${mapGestionEmotions(answers.emotionRegulation)}

---

## COMMUNICATION ET SOCIALISATION

- Expression orale : ${mapExpression(answers.oralExpression)}
- Compréhension : ${mapComprehension(answers.comprehension)}
- Contact visuel : ${mapContactVisuel(answers.eyeContact)}
- Interactions sociales : ${mapInteractions(answers.peerInteractions)}

---

## SCOLARITÉ

- Difficultés signalées : ${answers.schoolDifficulties?.join(', ') || 'N/A'}
- Aménagements actuels : ${answers.currentAccommodations?.join(', ') || 'Aucun'}
- Besoin AESH ressenti : ${answers.requestMoreAesh ? 'Oui, aide insuffisante actuellement' : 'Non, suffisant'}
- Demande spécifique : ${answers.requestedSupport?.join(', ') || 'N/A'}
${answers.schoolContext ? `> CONTEXTE SCOLAIRE : "${answers.schoolContext}"` : ''}

---

## SOINS ET BUDGET

${buildSoinsTable(answers)}

- Reste à charge mensuel estimé : ${((answers.psychomotricianCost || 0) + (answers.psychologistCost || 0) + (answers.ergotherapistCost || 0) + (answers.educatorCost || 0))}€

---

## RETENTISSEMENT SUR LA VIE FAMILIALE (Charge de l'aidant)

- Sommeil enfant : ${mapSommeil(answers.childSleep)}
- Sommeil parent : ${mapSommeilParent(answers.parentSleep)}
- Impact professionnel : ${mapImpactTravail(answers.workImpact)}
- Impact fratrie : ${mapImpactFratrie(answers.siblingImpact)}
- Vie sociale famille : ${mapVieSociale(answers.socialLife)}
${answers.familyImpact ? `> VÉCU PARENTAL : "${answers.familyImpact}"` : ''}

---

## DEMANDES FORMULÉES

- AEEH de base : ${answers.requestAeeh ? 'OUI' : 'Non'}
- Complément AEEH : ${answers.aeehComplement || 'À évaluer selon reste à charge et réduction temps de travail'}
- PCH : ${answers.requestPch ? 'OUI (Aides humaines/techniques)' : 'Non'}
- AESH : ${answers.requestMoreAesh ? 'OUI (Accompagnement scolaire individuel)' : 'Non'}
${answers.finalNotes ? `> NOTES FINALES : "${answers.finalNotes}"` : ''}

---

Génère maintenant le document final complet.`;

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
