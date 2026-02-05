import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
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
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderRadius: 3,
        marginRight: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        borderColor: '#10b981',
        backgroundColor: '#d1fae5',
    },
    checkboxUnchecked: {
        borderColor: '#ef4444',
        backgroundColor: '#fee2e2',
    },
    checkmark: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#10b981',
    },
    cross: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    itemLabel: {
        fontSize: 10,
        color: '#1e293b',
        flex: 1,
    },
    itemStatus: {
        fontSize: 9,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    statusProvided: {
        backgroundColor: '#d1fae5',
        color: '#10b981',
    },
    statusMissing: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
    },
    statusExpiring: {
        backgroundColor: '#fef3c7',
        color: '#f59e0b',
    },
    infoBox: {
        backgroundColor: '#eff6ff',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    infoText: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#1e40af',
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

interface DocumentItem {
    type: string;
    label: string;
    isProvided: boolean;
    expiryDate?: string;
    isRequired: boolean;
}

interface ChecklistDocumentProps {
    childName: string;
    documents: DocumentItem[];
}

export const ChecklistDocument = ({ childName, documents }: ChecklistDocumentProps) => {
    const today = new Date().toLocaleDateString('fr-FR');

    const requiredDocs = documents.filter(d => d.isRequired);
    const recommendedDocs = documents.filter(d => !d.isRequired);

    const countProvided = (docs: DocumentItem[]) => docs.filter(d => d.isProvided).length;

    const getDocumentStatus = (doc: DocumentItem) => {
        if (!doc.isProvided) {
            return { label: 'Manquant', style: styles.statusMissing };
        }

        if (doc.expiryDate) {
            const expiry = new Date(doc.expiryDate);
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

            if (expiry < new Date()) {
                return { label: 'Expiré', style: styles.statusMissing };
            } else if (expiry < threeMonthsFromNow) {
                return { label: 'Expire bientôt', style: styles.statusExpiring };
            }
        }

        return { label: 'Fourni', style: styles.statusProvided };
    };

    const isDocExpiring = (doc: DocumentItem) => {
        if (!doc.expiryDate || !doc.isProvided) return false;
        const expiry = new Date(doc.expiryDate);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiry < threeMonthsFromNow;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.brand}>L'Allié MDPH — Checklist Pièces Justificatives</Text>
                    <Text style={styles.title}>Dossier de {childName}</Text>
                    <Text style={styles.subtitle}>
                        État des pièces à fournir pour votre demande MDPH
                    </Text>
                    <Text style={{ fontSize: 9, color: '#94a3b8', marginTop: 12 }}>
                        Généré le {today}
                    </Text>
                </View>

                {/* Progress Summary */}
                <View style={{
                    backgroundColor: '#f8fafc',
                    padding: 20,
                    borderRadius: 12,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: '#e2e8f0'
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                        <View>
                            <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>
                                Pièces obligatoires
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>
                                {countProvided(requiredDocs)}/{requiredDocs.length}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>
                                Pièces recommandées
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>
                                {countProvided(recommendedDocs)}/{recommendedDocs.length}
                            </Text>
                        </View>
                    </View>

                    {countProvided(requiredDocs) === requiredDocs.length ? (
                        <View style={{
                            backgroundColor: '#d1fae5',
                            padding: 12,
                            borderRadius: 6,
                            borderLeftWidth: 4,
                            borderLeftColor: '#10b981'
                        }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#10b981' }}>
                                ✓ Toutes les pièces obligatoires sont fournies !
                            </Text>
                        </View>
                    ) : (
                        <View style={{
                            backgroundColor: '#fee2e2',
                            padding: 12,
                            borderRadius: 6,
                            borderLeftWidth: 4,
                            borderLeftColor: '#ef4444'
                        }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ef4444' }}>
                                ⚠ Il manque {requiredDocs.length - countProvided(requiredDocs)} pièce(s) obligatoire(s)
                            </Text>
                        </View>
                    )}
                </View>

                {/* PIÈCES OBLIGATOIRES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Pièces Obligatoires</Text>
                    <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 12, fontStyle: 'italic' }}>
                        Ces documents sont indispensables pour que votre dossier soit traité.
                    </Text>

                    {requiredDocs.map((doc, index) => {
                        const status = getDocumentStatus(doc);
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.itemRow,
                                    { backgroundColor: doc.isProvided ? '#f0fdf4' : '#fef2f2' }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        doc.isProvided ? styles.checkboxChecked : styles.checkboxUnchecked
                                    ]}
                                >
                                    <Text style={doc.isProvided ? styles.checkmark : styles.cross}>
                                        {doc.isProvided ? '✓' : '✗'}
                                    </Text>
                                </View>
                                <Text style={styles.itemLabel}>
                                    {doc.label}
                                    {doc.expiryDate && doc.isProvided && isDocExpiring(doc) && (
                                        <Text style={{ color: '#f59e0b', fontSize: 8 }}>
                                            {' '}(Valide jusqu'au {new Date(doc.expiryDate).toLocaleDateString('fr-FR')})
                                        </Text>
                                    )}
                                </Text>
                                <Text style={[styles.itemStatus, status.style]}>
                                    {status.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* PIÈCES RECOMMANDÉES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📎 Pièces Recommandées</Text>
                    <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 12, fontStyle: 'italic' }}>
                        Ces documents renforcent votre dossier et facilitent l'évaluation par la MDPH.
                    </Text>

                    {recommendedDocs.map((doc, index) => {
                        const status = getDocumentStatus(doc);
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.itemRow,
                                    { backgroundColor: doc.isProvided ? '#f0fdf4' : '#fefce8' }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        doc.isProvided ? styles.checkboxChecked : { ...styles.checkboxUnchecked, borderColor: '#f59e0b', backgroundColor: '#fef3c7' }
                                    ]}
                                >
                                    <Text style={doc.isProvided ? styles.checkmark : { ...styles.cross, color: '#f59e0b' }}>
                                        {doc.isProvided ? '✓' : '○'}
                                    </Text>
                                </View>
                                <Text style={styles.itemLabel}>{doc.label}</Text>
                                <Text style={[styles.itemStatus, status.style]}>
                                    {status.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* BOX D'AIDE */}
                <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { fontWeight: 'bold', marginBottom: 8 }]}>
                        💡 Conseils pour compléter votre dossier :
                    </Text>
                    <Text style={styles.infoText}>
                        • Le certificat médical MDPH doit dater de moins de 1 an
                    </Text>
                    <Text style={styles.infoText}>
                        • Le justificatif de domicile doit dater de moins de 3 mois
                    </Text>
                    <Text style={styles.infoText}>
                        • Les bilans récents (moins de 2 ans) sont privilégiés
                    </Text>
                    <Text style={[styles.infoText, { marginTop: 8 }]}>
                        📧 Vous pouvez ajouter ou mettre à jour vos pièces à tout moment depuis votre espace personnel sur L'Allié MDPH.
                    </Text>
                </View>

                <Text style={styles.footer}>
                    L'Allié MDPH - Checklist Pièces Justificatives - {today}
                </Text>
            </Page>
        </Document>
    );
};
