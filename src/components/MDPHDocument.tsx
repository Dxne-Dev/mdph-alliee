import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { QuestionnaireAnswers } from './Questionnaire';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
    },
    brand: {
        color: '#2563eb',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: 'normal',
    },
    metaRow: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        color: '#94a3b8',
    },
    card: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 8,
        textAlign: 'justify',
    },
    bulletPoint: {
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 6,
        marginLeft: 15,
    },
    table: {
        marginTop: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 6,
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSize: 9,
        color: '#475569',
    },
    tableCell: {
        fontSize: 9,
        color: '#1e293b',
    },
    highlight: {
        backgroundColor: '#fff3eb',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
    },
    projetPage: {
        padding: 50,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    projetCard: {
        marginTop: 10,
        padding: 30,
        borderRadius: 12,
        backgroundColor: '#fcfdfe',
        borderWidth: 1,
        borderColor: '#2563eb',
        minHeight: 600,
    },
    projetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#dbeafe',
        paddingBottom: 15,
    },
    projetText: {
        fontSize: 12,
        lineHeight: 1.8,
        textAlign: 'justify',
        color: '#1e293b',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        fontSize: 8,
        color: '#94a3b8',
    }
});

interface MDPHDocumentProps {
    data: QuestionnaireAnswers;
}

export const MDPHDocument = ({ data }: MDPHDocumentProps) => {
    const today = new Date().toLocaleDateString('fr-FR');
    const fullName = `${(data.lastName || '').toUpperCase()} ${data.firstName || ''}`;

    // Helper function to generate text descriptions from QCM answers
    const getAutonomyDescription = () => {
        const descriptions = [];

        if (data.dressing === 'aide_complete') {
            descriptions.push(`Incapacité à s'habiller seul. Nécessite une aide quotidienne pour l'habillage complet.`);
        } else if (data.dressing === 'aide_partielle') {
            descriptions.push(`Besoin d'une aide partielle pour l'habillage.`);
        }

        if (data.bathing === 'aide_complete') {
            descriptions.push(`Requiert une assistance complète pour la toilette.`);
        } else if (data.bathing === 'aide_partielle') {
            descriptions.push(`Besoin de supervision pour l'hygiène corporelle.`);
        }

        if (data.eating === 'selectivite') {
            descriptions.push(`Mange seul mais présente des restrictions alimentaires importantes (hypersélectivité, textures limitées).`);
        } else if (data.eating === 'aide_complete') {
            descriptions.push(`Nécessite une aide pour les repas.`);
        }

        if (!data.canStayAlone) {
            descriptions.push(`Ne peut rester seul à aucun moment. Surveillance constante nécessaire.`);
        }

        return descriptions;
    };

    const getBehaviorDescription = () => {
        let text = '';

        if (data.hasCrises) {
            const freqMap: any = {
                'quotidiennes': 'tous les jours ou presque',
                'hebdomadaires': 'plusieurs fois par semaine',
                'mensuelles': 'quelques fois par mois'
            };
            const durationMap: any = {
                '0-15min': 'moins de 15 minutes',
                '15-30min': '15 à 30 minutes',
                '30-60min': '30 à 60 minutes',
                'plus_1h': 'plus d\'une heure'
            };

            text += `Les crises surviennent ${freqMap[data.crisisFrequency || '']} avec une durée moyenne de ${durationMap[data.crisisDuration || '']}, avec manifestations intenses (cris, pleurs, impossibilité de communication). `;
        }

        if (data.hasRigidities) {
            text += `Rituels quotidiens impératifs. Toute modification de routine génère une détresse majeure. `;
        }

        const emotionMap: any = {
            'tres_difficile': 'très altérée',
            'difficile': 'altérée',
            'moyenne': 'partielle',
            'bonne': 'correcte'
        };

        if (data.emotionRegulation && data.emotionRegulation !== 'bonne') {
            text += `Régulation émotionnelle ${emotionMap[data.emotionRegulation]}.`;
        }

        return text;
    };

    const getCommunicationDescription = () => {
        const exprMap: any = {
            'fluide': 'Expression orale fluide et variée',
            'phrases_simples': 'Expression orale limitée à des phrases simples',
            'mots_isoles': 'Communication par mots isolés uniquement',
            'non_verbal': 'Communication non verbale'
        };

        const comprMap: any = {
            'bonne': 'bonne compréhension des consignes',
            'reformulation': 'compréhension des consignes altérée, nécessitant des reformulations systématiques',
            'difficile': 'compréhension des consignes très difficile'
        };

        const interMap: any = {
            'aisees': 'Interactions avec les pairs aisées',
            'limitees': 'Interactions avec les pairs limitées',
            'tres_limitees': 'Interactions avec les pairs très limitées',
            'absentes': 'Absence d\'interactions avec les pairs'
        };

        const contactMap: any = {
            'present': 'Contact visuel présent',
            'variable': 'Contact visuel variable',
            'fuyant': 'Contact visuel fuyant'
        };

        return `${exprMap[data.oralExpression || '']}, ${comprMap[data.comprehension || '']}. ${interMap[data.peerInteractions || '']}. ${contactMap[data.eyeContact || '']}.`;
    };

    const getSchoolDescription = () => {
        let text = `${data.firstName} est scolarisé(e) en classe de ${data.currentGrade || 'N/A'}. `;

        if (data.schoolDifficulties && data.schoolDifficulties.length > 0) {
            const diffMap: any = {
                'concentration': 'décrochage attentionnel',
                'bruit': 'hypersensibilité au bruit',
                'consignes': 'difficultés à suivre les consignes collectives',
                'interactions': 'difficultés d\'interactions sociales',
                'ecriture': 'difficultés en écriture/graphisme',
                'lecture': 'difficultés en lecture'
            };

            const difficulties = data.schoolDifficulties.map(d => diffMap[d] || d).join(', ');
            text += `La scolarité est fortement impactée par : ${difficulties}. `;
        }

        if (data.hasAesh) {
            text += `Un accompagnement AESH ${data.aeshType || ''} de ${data.aeshHours || 'N/A'} heures par semaine est actuellement en place`;
            if (!data.aeshSufficient) {
                text += `, mais s'avère **insuffisant**`;
            }
            text += `. `;
        }

        if (data.currentAccommodations && data.currentAccommodations.length > 0) {
            const accomMap: any = {
                'tiers_temps': 'tiers-temps aux évaluations',
                'place_isolee': 'placement isolé',
                'supports_adaptes': 'supports pédagogiques adaptés',
                'pause': 'possibilité de faire des pauses'
            };
            const accoms = data.currentAccommodations.map(a => accomMap[a] || a).join(', ');
            text += `Aménagements en place : ${accoms}. `;
        }

        return text;
    };

    const calculateTotalCost = () => {
        let total = 0;
        if (data.psychomotricianCost) total += Number(data.psychomotricianCost);
        if (data.psychologistCost) total += Number(data.psychologistCost);
        if (data.ergotherapistCost) total += Number(data.ergotherapistCost);
        if (data.educatorCost) total += Number(data.educatorCost);
        return total;
    };

    const getFamilyImpactDescription = () => {
        const sleepMap: any = {
            'reveils_frequents': 'présente des réveils nocturnes fréquents',
            'reveils_occasionnels': 'présente des réveils occasionnels',
            'tres_perturbe': 'sommeil très perturbé',
            'bon': 'sommeil de bonne qualité'
        };

        const parentSleepMap: any = {
            'moins_3h': 'moins de 3 heures par nuit',
            'moins_5h': 'moins de 5 heures par nuit',
            '5-7h': '5 à 7 heures par nuit',
            'plus_7h': 'plus de 7 heures par nuit'
        };

        const workMap: any = {
            'temps_partiel': 'Temps partiel contraint pour assurer les accompagnements aux rendez-vous',
            'amenagements': 'Aménagements horaires nécessaires',
            'arret': 'Arrêt de travail',
            'aucun': 'Aucun impact professionnel'
        };

        const siblingMap: any = {
            'important': 'Impact important sur la fratrie',
            'tensions': 'Tensions au sein de la fratrie',
            'leger': 'Léger impact sur la fratrie',
            'aucun': ''
        };

        const socialMap: any = {
            'inexistante': 'Vie sociale quasi inexistante',
            'tres_limitee': 'Vie sociale très limitée',
            'reduite': 'Vie sociale réduite',
            'normale': 'Vie sociale normale'
        };

        let text = `${data.firstName} ${sleepMap[data.childSleep || '']}. Le parent dort en moyenne ${parentSleepMap[data.parentSleep || '']}. `;

        if (data.workImpact && data.workImpact !== 'aucun') {
            text += `${workMap[data.workImpact]}. `;
        }

        if (data.siblingImpact && data.siblingImpact !== 'aucun') {
            text += `${siblingMap[data.siblingImpact]}. `;
        }

        if (data.socialLife && data.socialLife !== 'normale') {
            text += `${socialMap[data.socialLife]}.`;
        }

        return text;
    };

    const getDemandeDescription = () => {
        const demands = [];

        if (data.requestAeeh) {
            const catMap: any = {
                'cat1': 'catégorie 1',
                'cat2': 'catégorie 2',
                'cat3': 'catégorie 3',
                'cat4': 'catégorie 4',
                'cat5': 'catégorie 5',
                'cat6': 'catégorie 6'
            };
            demands.push(`${data.isRenewal ? 'Renouvellement' : 'Attribution'} de l'AEEH avec complément de ${catMap[data.aeehComplement || 'cat2'] || 'catégorie 2'} (ou supérieur si justifié)`);
        }

        if (data.requestPch) {
            demands.push('Attribution de la PCH (Prestation de Compensation du Handicap)');
        }

        if (data.requestMoreAesh) {
            if (data.requestedAeshType === 'individuel') {
                demands.push('Passage à un accompagnement AESH individualisé');
            } else {
                demands.push('Augmentation significative du nombre d\'heures d\'AESH');
            }
        }

        if (data.requestEquipment) {
            demands.push('Attribution de matériel pédagogique adapté');
        }

        return demands;
    };

    return (
        <Document>
            {/* PAGE 1: SYNTHÈSE ADMINISTRATIVE */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Synthèse Officielle</Text>
                    <Text style={styles.title}>Dossier de Synthèse</Text>
                    <Text style={styles.subtitle}>
                        Volet 1 : Résumé administratif et évaluation de l'autonomie
                    </Text>

                    <View style={styles.metaRow}>
                        <Text>ENFANT : {fullName}</Text>
                        <Text>GÉNÉRÉ LE : {today}</Text>
                    </View>
                </View>

                {/* SECTION 1: SITUATION */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>I. Identification & Diagnostic</Text>
                    <Text style={styles.paragraph}>
                        {data.firstName} {data.lastName}, né(e) le {new Date(data.birthDate || '').toLocaleDateString('fr-FR')},
                        est porteur d'un diagnostic de {data.diagnosis}
                        {data.diagnosisDate && ` diagnostiqué en ${new Date(data.diagnosisDate + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}.
                    </Text>
                    <Text style={styles.paragraph}>
                        {data.firstName} est actuellement scolarisé(e) en classe de {data.currentGrade}
                        en établissement {data.schoolType === 'publique' ? 'public' : data.schoolType === 'privée' ? 'privé' : 'spécialisé'}.
                    </Text>
                    <Text style={styles.paragraph}>
                        Ce document a pour objectif de présenter le retentissement concret de son handicap sur son quotidien,
                        sa scolarité et l'équilibre de notre famille, afin de solliciter {data.isRenewal ? 'le renouvellement' : 'l\'attribution'} de droits MDPH.
                    </Text>
                </View>

                {/* SECTION 2: AUTONOMIE */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>II. Retentissement sur l'Autonomie Quotidienne</Text>
                    <Text style={styles.paragraph}>
                        {data.firstName} présente des limitations dans les actes de la vie quotidienne :
                    </Text>
                    {getAutonomyDescription().map((desc, index) => (
                        <Text key={index} style={styles.bulletPoint}>• {desc}</Text>
                    ))}
                    {data.autonomyNotes && (
                        <Text style={styles.paragraph}>
                            {data.autonomyNotes}
                        </Text>
                    )}
                </View>

                {/* SECTION 3: COMPORTEMENT */}
                {data.hasCrises && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>III. Troubles du Comportement</Text>
                        <Text style={styles.paragraph}>
                            {getBehaviorDescription()}
                        </Text>
                        {data.behaviorExample && (
                            <View style={styles.highlight}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6, color: '#ea580c' }}>
                                    Exemple de situation vécue :
                                </Text>
                                <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#475569' }}>
                                    {data.behaviorExample}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* SECTION 4: COMMUNICATION */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>IV. Communication et Interactions Sociales</Text>
                    <Text style={styles.paragraph}>
                        {getCommunicationDescription()}
                    </Text>
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Synthèse Page 1/2 - {today}
                </Text>
            </Page>

            {/* PAGE 2: PROJET DE VIE */}
            <Page size="A4" style={styles.projetPage}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Synthèse Officielle</Text>
                    <Text style={styles.title}>Le Projet de Vie</Text>
                    <Text style={styles.subtitle}>
                        Volet 2 : Scolarité, Soins, Impact Familial et Expression des Attentes
                    </Text>
                </View>

                {/* SECTION 5: PROJET DE VIE (AI Optimized or Manual) */}
                <View style={[styles.card, { minHeight: 650 }]}>
                    <Text style={styles.sectionTitle}>V. Projet de Vie</Text>
                    {data.expectations ? (
                        <View>
                            <Text style={styles.paragraph}>
                                Ce projet de vie a été structuré pour mettre en lumière les besoins de compensation et les limitations d'activité de {data.firstName} de manière experte.
                            </Text>
                            <View style={{ marginTop: 15, padding: 20, backgroundColor: '#fcfdfe', borderLeftWidth: 3, borderLeftColor: '#2563eb' }}>
                                <Text style={[styles.projetText, { fontSize: 10 }]}>
                                    {data.expectations}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.paragraph}>
                                {getSchoolDescription()}
                            </Text>
                            {data.schoolContext && (
                                <View style={styles.highlight}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6, color: '#ea580c' }}>
                                        Contexte scolaire au quotidien :
                                    </Text>
                                    <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#475569' }}>
                                        {data.schoolContext}
                                    </Text>
                                </View>
                            )}

                            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>VI. Retentissement Familial</Text>
                            <Text style={styles.paragraph}>
                                {getFamilyImpactDescription()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* SECTION 6: SOINS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>VI. Soins en Cours et Reste à Charge</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { width: '50%' }]}>Professionnel</Text>
                            <Text style={[styles.tableHeader, { width: '25%' }]}>Fréquence</Text>
                            <Text style={[styles.tableHeader, { width: '25%' }]}>Coût mensuel</Text>
                        </View>
                        {data.orthophonist && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '50%' }]}>Orthophoniste</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>{data.orthophonistFreq || 'N/A'}</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>Remboursé</Text>
                            </View>
                        )}
                        {data.psychomotrician && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '50%' }]}>Psychomotricien</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>1x/semaine</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>{data.psychomotricianCost}€</Text>
                            </View>
                        )}
                        {data.psychologist && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '50%' }]}>Psychologue</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>2x/mois</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>{data.psychologistCost}€</Text>
                            </View>
                        )}
                        {data.ergotherapist && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '50%' }]}>Ergothérapeute</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>1x/mois</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>{data.ergotherapistCost}€</Text>
                            </View>
                        )}
                        {data.specializedEducator && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '50%' }]}>Éducateur spécialisé</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>Variable</Text>
                                <Text style={[styles.tableCell, { width: '25%' }]}>{data.educatorCost}€</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 10 }]}>
                        Reste à charge mensuel total : {calculateTotalCost()}€
                    </Text>
                </View>

                {/* SECTION 7: FAMILLE (Only if no AI expectations) */}
                {!data.expectations && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>VII. Retentissement sur la Vie Familiale</Text>
                        <Text style={styles.paragraph}>
                            {getFamilyImpactDescription()}
                        </Text>
                        {data.familyImpact && (
                            <View style={styles.highlight}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6, color: '#ea580c' }}>
                                    Expression de la famille :
                                </Text>
                                <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#475569' }}>
                                    {data.familyImpact}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* SECTION 8: DEMANDE */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{data.expectations ? 'VII.' : 'VIII.'} Notre Demande</Text>
                    <Text style={styles.paragraph}>
                        Nous sollicitons :
                    </Text>
                    {getDemandeDescription().map((demand, index) => (
                        <Text key={index} style={styles.bulletPoint}>• {demand}</Text>
                    ))}
                    {data.finalNotes && (
                        <View style={styles.highlight}>
                            <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#475569', fontStyle: 'italic' }}>
                                {data.finalNotes}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Projet de Vie Page 2/2 - {today}
                </Text>
            </Page>
        </Document>
    );
};
