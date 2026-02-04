import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Note: Standard fonts available in react-pdf: Helvetica, Courier, Times-Roman
// For a premium look, we'll use Helvetica with careful weight and sizing.

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6,
        color: '#334155',
        backgroundColor: '#f8fafc',
    },
    // Sidebar-like accent
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 6,
        backgroundColor: '#2563eb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        textAlign: 'right',
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    brandName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 4,
    },
    docTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    docSubtitle: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 4,
    },
    stamp: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mainGrid: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2563eb',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 2,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        color: '#1e293b',
        fontWeight: 'bold',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    tag: {
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        padding: '3 8',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    projetDeVieContainer: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2563eb',
        borderStyle: 'solid',
        position: 'relative',
    },
    projetDeVieTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 15,
        textAlign: 'center',
    },
    projetDeVieText: {
        fontSize: 11,
        color: '#334155',
        lineHeight: 1.8,
        textAlign: 'justify',
    },
    signatureBlock: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    signatureLine: {
        width: 200,
        borderTopWidth: 1,
        borderTopColor: '#94a3b8',
        paddingTop: 8,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
    }
});

interface MDPHDocumentProps {
    data: any;
    childName: string;
}

export const MDPHDocument = ({ data, childName }: MDPHDocumentProps) => {
    const today = new Date().toLocaleDateString('fr-FR');
    const fullName = `${(data.lastName || '').toUpperCase()} ${data.firstName || childName}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar} />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.brandName}>L'Allié MDPH</Text>
                        <Text style={styles.docTitle}>Synthèse du Dossier</Text>
                        <Text style={styles.docSubtitle}>Projet de Vie & Évaluation de l'Inclusion</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.stamp}>Réf: {childName.slice(0, 3).toUpperCase()}-{today.replace(/\//g, '')}</Text>
                        <Text style={styles.docSubtitle}>Date: {today}</Text>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>■ Identification de l'Enfant</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Nom & Prénom</Text>
                            <Text style={styles.value}>{fullName}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Date de Naissance</Text>
                            <Text style={styles.value}>{data.birthDate || 'Non spécifiée'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Diagnostic déclaré</Text>
                            <Text style={styles.value}>{data.diagnosis || 'Non spécifié'}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Type de demande</Text>
                            <Text style={styles.value}>Initial ou Renouvellement</Text>
                        </View>
                    </View>
                </View>

                {/* Section Autonomie */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>■ Vie Quotidienne & Autonomie</Text>
                    <View style={styles.tagContainer}>
                        <Text style={styles.tag}>Hygiène: {data.toileting || 'Aide nécessaire'}</Text>
                        <Text style={styles.tag}>Habillage: {data.dressing || 'Aide nécessaire'}</Text>
                        <Text style={styles.tag}>Repas: {data.eating || 'Aide nécessaire'}</Text>
                        <Text style={styles.tag}>Sommeil: {data.sleep || 'Variable'}</Text>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.label}>Observations cliniques</Text>
                        <Text style={{ fontSize: 9, color: '#475569' }}>
                            Besoin d'un étayage régulier pour les actes essentiels. Les difficultés notées en {data.dressing === 'Difficile' ? 'habillage' : 'autonomie'} impactent la fluidité des transitions quotidiennes.
                        </Text>
                    </View>
                </View>

                {/* Section Scolarité */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>■ Parcours Scolaire</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Niveau Actuel</Text>
                            <Text style={styles.value}>{data.schoolLevel || 'Non renseigné'}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Aménagement</Text>
                            <Text style={styles.value}>{data.hasAesh ? `AESH (${data.aeshType || 'Indéterminé'})` : 'Pas d\'AESH'}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.label}>Soutien Paramédical</Text>
                        <Text style={styles.value}>
                            {data.therapies && data.therapies.length > 0 ? data.therapies.join(' • ') : 'Aucun déclaré'}
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Ce document est une synthèse destinée à faciliter l'évaluation par la CDAPH.</Text>
                    <Text>L'Allié MDPH - Accompagnement des familles</Text>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar} />

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.brandName}>L'Allié MDPH</Text>
                        <Text style={styles.docTitle}>Projet de Vie</Text>
                    </View>
                </View>

                <View style={styles.projetDeVieContainer}>
                    <Text style={styles.projetDeVieTitle}>Expression des Attentes et des Besoins</Text>
                    <Text style={styles.projetDeVieText}>
                        {data.expectations || "Le projet de vie n'a pas été généré lors de cette session."}
                    </Text>
                </View>

                <View style={{ marginTop: 30, padding: 15, backgroundColor: '#fdf2f2', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#991b1b', marginBottom: 5 }}>RAPPEL DOCUMENTS À JOINDRE :</Text>
                    <Text style={{ fontSize: 8, color: '#b91c1c' }}>
                        • Certificat médical de moins de 1 an.{"\n"}
                        • Justificatif de domicile.{"\n"}
                        • Comptes-rendus des bilans (Ergos, Psychos, etc.).
                    </Text>
                </View>

                <View style={styles.signatureBlock}>
                    <View>
                        <Text style={styles.signatureLine}>Signature du représentant légal</Text>
                        <Text style={{ fontSize: 7, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>Fait à ............................, le {today}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Page 2 sur 2</Text>
                </View>
            </Page>
        </Document>
    );
};
