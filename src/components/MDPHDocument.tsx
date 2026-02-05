import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoBox: {
        width: '50%',
        marginBottom: 10,
    },
    label: {
        fontSize: 8,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    // Styles spécifiques pour la page Projet de Vie
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
        minHeight: 600, // Pour donner un aspect "page pleine"
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
    },
    watermark: {
        position: 'absolute',
        top: 400,
        left: 100,
        fontSize: 60,
        color: '#f1f5f9',
        transform: 'rotate(-45deg)',
        zIndex: -1,
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
            {/* PAGE 1 : RÉSUMÉ ADMINISTRATIF */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Synthèse Officielle</Text>
                    <Text style={styles.title}>Dossier de Synthèse</Text>
                    <Text style={styles.subtitle}>Volet 1 : Résumé administratif et évaluation de l'autonomie</Text>

                    <View style={styles.metaRow}>
                        <Text>ENFANT : {fullName}</Text>
                        <Text>GÉNÉRÉ LE : {today}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>I. Identification & Diagnostic</Text>
                    <View style={styles.grid}>
                        <View style={styles.infoBox}><Text style={styles.label}>Nom complet</Text><Text style={styles.value}>{fullName}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Date de Naissance</Text><Text style={styles.value}>{data.birthDate || 'Non spécifiée'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Diagnostic Principal</Text><Text style={styles.value}>{data.diagnosis || 'Non spécifié'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Niveau Scolaire</Text><Text style={styles.value}>{data.schoolLevel || 'Non spécifié'}</Text></View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>II. Autonomie & Vie Quotidienne</Text>
                    <Text style={{ fontSize: 9, marginBottom: 12, color: '#475569', fontStyle: 'italic' }}>
                        Synthèse des points de vigilance sur les actes essentiels de la vie.
                    </Text>
                    <View style={styles.grid}>
                        <View style={styles.infoBox}><Text style={styles.label}>Hygiène / Toilettes</Text><Text style={styles.value}>{data.toileting || 'Aide humaine requise'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Habillage / Déshabillage</Text><Text style={styles.value}>{data.dressing || 'Aide humaine requise'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Prise des repas</Text><Text style={styles.value}>{data.eating || 'Guidance nécessaire'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Qualité du Sommeil</Text><Text style={styles.value}>{data.sleep || 'Stable'}</Text></View>
                    </View>
                </View>

                <View style={{ marginTop: 30, padding: 15, backgroundColor: '#eff6ff', borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1e40af', marginBottom: 5 }}>Note à l'attention de l'évaluateur CDAPH :</Text>
                    <Text style={{ fontSize: 9, color: '#1e40af', lineHeight: 1.4 }}>
                        Ce document résume les éléments clés saisis par la famille pour faciliter la lecture de la demande.
                        Le "Projet de Vie" complet se trouve en page suivante.
                    </Text>
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Synthèse Page 1/2 - {today}
                </Text>
            </Page>

            {/* PAGE 2 : PROJET DE VIE COMPLET */}
            <Page size="A4" style={styles.projetPage}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Synthèse Officielle</Text>
                    <Text style={styles.title}>Le Projet de Vie</Text>
                    <Text style={styles.subtitle}>Volet 2 : Expression des attentes et des besoins de l'enfant et de la famille</Text>
                </View>

                <View style={styles.projetCard}>
                    <Text style={styles.projetTitle}>Expression de la Famille</Text>
                    <Text style={styles.projetText}>
                        {data.expectations || "L'expression des attentes n'a pas été finalisée. Ce document sert de base à la rédaction du projet de vie définitif."}
                    </Text>
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Projet de Vie Page 2/2 - {today}
                </Text>
            </Page>
        </Document>
    );
};
