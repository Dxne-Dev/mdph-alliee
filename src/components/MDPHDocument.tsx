import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155',
        backgroundColor: '#ffffff',
    },
    // En-tête ultra-robuste
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
        marginBottom: 8, // Marge claire pour éviter le chevauchement
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
    // Contenu
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
    projetBox: {
        marginTop: 20,
        padding: 20,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#2563eb',
        borderLeftWidth: 5,
    },
    projetText: {
        fontSize: 11,
        lineHeight: 1.6,
        textAlign: 'justify',
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
    data: any;
    childName: string;
}

export const MDPHDocument = ({ data, childName }: MDPHDocumentProps) => {
    const today = new Date().toLocaleDateString('fr-FR');
    const fullName = `${(data.lastName || '').toUpperCase()} ${data.firstName || childName}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Synthèse Officielle</Text>
                    <Text style={styles.title}>Dossier de Synthèse</Text>
                    <Text style={styles.subtitle}>Aide à la complétion du projet de vie et évaluation des besoins</Text>

                    <View style={styles.metaRow}>
                        <Text>ENFANT : {fullName}</Text>
                        <Text>GÉNÉRÉ LE : {today}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Identification & Diagnostic</Text>
                    <View style={styles.grid}>
                        <View style={styles.infoBox}><Text style={styles.label}>Nom complet</Text><Text style={styles.value}>{fullName}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Date de Naissance</Text><Text style={styles.value}>{data.birthDate || 'Non spécifiée'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Diagnostic</Text><Text style={styles.value}>{data.diagnosis || 'Non spécifié'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Niveau Scolaire</Text><Text style={styles.value}>{data.schoolLevel || 'Non spécifié'}</Text></View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Autonomie & Vie Quotidienne</Text>
                    <Text style={{ fontSize: 9, marginBottom: 8, color: '#475569' }}>
                        Évaluation basique des actes essentiels de la vie (Hygiène, Habillage, Repas, Sommeil).
                    </Text>
                    <View style={styles.grid}>
                        <View style={styles.infoBox}><Text style={styles.label}>Hygiène</Text><Text style={styles.value}>{data.toileting || 'Aide humaine'}</Text></View>
                        <View style={styles.infoBox}><Text style={styles.label}>Habillage</Text><Text style={styles.value}>{data.dressing || 'Aide humaine'}</Text></View>
                    </View>
                </View>

                <View style={styles.projetBox}>
                    <Text style={styles.sectionTitle}>Projet de Vie (Synthèse IA)</Text>
                    <Text style={styles.projetText}>
                        {data.expectations || "L'expression des attentes n'a pas été finalisée lors de la saisie."}
                    </Text>
                </View>

                <Text style={styles.footer}>
                    Ce document est une aide à la décision. L'Allié MDPH - {today} - Page 1/1
                </Text>
            </Page>
        </Document>
    );
};
