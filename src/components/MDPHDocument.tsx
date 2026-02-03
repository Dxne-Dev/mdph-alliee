import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Register a nice font if possible, otherwise stick to defaults
// Font.register({ family: 'Helvetica', ... });

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.6,
        color: '#1a202c',
    },
    header: {
        marginBottom: 30,
        borderBottom: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 10,
        backgroundColor: '#f8fafc',
        padding: 5,
        borderRadius: 3,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 150,
        fontWeight: 'bold',
        color: '#475569',
    },
    value: {
        flex: 1,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        fontSize: 9,
        color: '#94a3b8',
        textAlign: 'center',
    },
    highlightBox: {
        backgroundColor: '#f0f9ff',
        padding: 15,
        borderLeft: 4,
        borderLeftColor: '#3b82f6',
        marginTop: 10,
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
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Projet de Vie</Text>
                    <Text style={styles.subtitle}>Dossier MDPH - {childName}</Text>
                    <Text style={{ fontSize: 9, marginTop: 5, color: '#94a3b8' }}>Généré par L'Allié MDPH le {today}</Text>
                </View>

                {/* Section 1: Identity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Informations de l'enfant</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Prénom :</Text>
                        <Text style={styles.value}>{data.firstName || childName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date de naissance :</Text>
                        <Text style={styles.value}>{data.birthDate || 'Non spécifiée'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Diagnostic :</Text>
                        <Text style={styles.value}>{data.diagnosis || 'Non spécifié'}</Text>
                    </View>
                </View>

                {/* Section 2: School */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Scolarisation et Vie Sociale</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Niveau scolaire :</Text>
                        <Text style={styles.value}>{data.schoolLevel || 'Non spécifié'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Temps de présence :</Text>
                        <Text style={styles.value}>{data.timeInSchool || 'Non spécifié'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Accompagnement AESH :</Text>
                        <Text style={styles.value}>{data.hasAesh ? `Oui (${data.aeshType || 'Type non spécifié'})` : 'Non'}</Text>
                    </View>
                </View>

                {/* Section 3: Autonomy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Autonomie et Vie Quotidienne</Text>
                    <View style={styles.paragraph}>
                        <Text style={{ fontWeight: 'bold' }}>Repas : </Text>
                        <Text>{data.eating || 'Information non renseignée'}</Text>
                    </View>
                    <View style={styles.paragraph}>
                        <Text style={{ fontWeight: 'bold' }}>Habillage : </Text>
                        <Text>{data.dressing || 'Information non renseignée'}</Text>
                    </View>
                    <View style={styles.paragraph}>
                        <Text style={{ fontWeight: 'bold' }}>Propreté : </Text>
                        <Text>{data.toileting || 'Information non renseignée'}</Text>
                    </View>
                </View>

                {/* Section 4: Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Suivi et Soins</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Professionnels suivis :</Text>
                        <Text style={styles.value}>
                            {data.therapies && data.therapies.length > 0
                                ? data.therapies.join(', ')
                                : 'Aucun suivi mentionné'}
                        </Text>
                    </View>
                    {data.medication && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>Traitement / Médication :</Text>
                            <Text style={{ marginTop: 3 }}>{data.medication}</Text>
                        </View>
                    )}
                </View>

                {/* Section 5: Expectations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Expression des besoins et attentes</Text>
                    <View style={styles.highlightBox}>
                        <Text style={{ fontStyle: 'italic' }}>
                            {data.expectations || "Pas de texte d'attentes spécifique fourni."}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Ce document a été préparé pour aider à la constitution du dossier MDPH.
                    Il doit être joint au formulaire CERFA 15692*01.
                </Text>
            </Page>
        </Document>
    );
};
