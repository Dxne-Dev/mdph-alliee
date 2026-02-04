import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 10.5,
        lineHeight: 1.5,
        color: '#1e293b',
    },
    header: {
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#3b82f6',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: 'bold',
    },
    metaInfo: {
        fontSize: 9,
        marginTop: 8,
        color: '#94a3b8',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 12,
        borderLeft: 4,
        borderLeftColor: '#2563eb',
        paddingLeft: 10,
        backgroundColor: '#f1f5f9',
        paddingVertical: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '50%',
        marginBottom: 10,
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        color: '#0f172a',
        fontWeight: 'medium',
    },
    paragraph: {
        marginBottom: 12,
        fontSize: 10.5,
        textAlign: 'justify',
        color: '#334155',
    },
    aiBox: {
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 8,
        border: 1,
        borderColor: '#e2e8f0',
        marginTop: 10,
    },
    aiTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    tag: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '3 8',
        borderRadius: 4,
        fontSize: 8,
        marginRight: 5,
        marginBottom: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 15,
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 50,
        fontSize: 8,
        color: '#94a3b8',
    }
});

interface MDPHDocumentProps {
    data: any;
    childName: string;
}

export const MDPHDocument = ({ data, childName }: MDPHDocumentProps) => {
    const today = new Date().toLocaleDateString('fr-FR');

    return (
        <Document>
            {/* PAGE 1: Synthèse Administrative et Vie Quotidienne */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Dossier de Synthèse</Text>
                    <Text style={styles.subtitle}>Aide à la complétion MDPH - Projet de Vie</Text>
                    <View style={styles.metaInfo}>
                        <Text>IdEnfant: {childName.toUpperCase()}</Text>
                        <Text>Édité le {today} par L'Allié MDPH</Text>
                    </View>
                </View>

                {/* Section 1: Identification */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>I. IDENTIFICATION DE L'ENFANT</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Nom / Prénom</Text>
                            <Text style={styles.value}>{data.firstName || childName}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Date de Naissance</Text>
                            <Text style={styles.value}>{data.birthDate || 'Non renseigné'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Diagnostic Principal</Text>
                            <Text style={styles.value}>{data.diagnosis || 'Non spécifié'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Statut Dossier</Text>
                            <Text style={styles.value}>Initial / Renouvellement</Text>
                        </View>
                    </View>
                </View>

                {/* Section 2: Autonomie */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>II. ÉVALUATION DE L'AUTONOMIE (VIE QUOTIDIENNE)</Text>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={styles.label}>Actes essentiels de la vie</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                            <Text style={styles.tag}>Hygiène: {data.toileting || 'Partielle'}</Text>
                            <Text style={styles.tag}>Habillage: {data.dressing || 'Partiel'}</Text>
                            <Text style={styles.tag}>Repas: {data.eating || 'Partiel'}</Text>
                            <Text style={styles.tag}>Sommeil: {data.sleep || 'Stable'}</Text>
                        </View>
                    </View>
                    <View style={styles.paragraph}>
                        <Text style={{ fontWeight: 'bold' }}>Observations sur l'autonomie : </Text>
                        <Text>
                            L'enfant rencontre des difficultés dans les tâches de la vie courante nécessitant une guidance verbale {data.dressing === 'Difficile' ? "permanente" : "ponctuelle"}
                            et une aide humaine pour les gestes de précision.
                        </Text>
                    </View>
                </View>

                {/* Section 3: Scolarité */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>III. PARCOURS SCOLAIRE ET SOCIAL</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Établissement / Niveau</Text>
                            <Text style={styles.value}>{data.schoolLevel || 'Non renseigné'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Temps de scolarisation</Text>
                            <Text style={styles.value}>{data.timeInSchool || 'Temps plein'}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>Compensation actuelle</Text>
                        <Text style={styles.value}>
                            {data.hasAesh ? `Accompagnement AESH (${data.aeshType || 'Mutualisée'})` : 'Pas d\'accompagnement humain notifié'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Document confidentiel - Ce dossier de synthèse ne remplace pas les certificats médicaux officiels.
                </Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </Page>

            {/* PAGE 2: Projet de Vie et Attentes */}
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>IV. SUIVI MÉDICAL ET PARAMÉDICAL</Text>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>Équipe de soins mobile</Text>
                        <Text style={styles.value}>
                            {data.therapies && data.therapies.length > 0 ? data.therapies.join(' • ') : 'Aucun suivi déclaré'}
                        </Text>
                    </View>
                    {data.medication && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.label}>Traitements en cours</Text>
                            <Text style={styles.value}>{data.medication}</Text>
                        </View>
                    )}
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>V. PROJET DE VIE (ATTENTES ET BESOINS)</Text>
                    <View style={styles.aiBox}>
                        <Text style={styles.aiTitle}>Synthèse rédigée par l'Allié MDPH</Text>
                        <Text style={styles.paragraph}>
                            {data.expectations || "L'expression des attentes n'a pas été finalisée lors de la saisie."}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 30, padding: 15, border: 1, borderColor: '#cbd5e1', borderStyle: 'dashed', borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#475569', marginBottom: 5 }}>CONSEILS POUR L'ENVOI :</Text>
                    <Text style={{ fontSize: 9, color: '#64748b' }}>
                        1. Imprimez ce document et joignez-le à la section "Projet de Vie" du Cerfa.{"\n"}
                        2. N'oubliez pas de joindre le certificat médical de moins de 12 mois.{"\n"}
                        3. Joignez les comptes rendus des thérapeutes (Ergothérapeute, Psychomotricien, etc.).
                    </Text>
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Accompagnement à la parentalité et au handicap.{"\n"}
                    Ce document est optimisé pour être lu par les évaluateurs de la CDAPH.
                </Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </Page>
        </Document>
    );
};
