import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Questionnaire } from './Questionnaire';
import { toast } from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';
import { MDPHDocument } from './MDPHDocument';
import { FileDown, ArrowLeft, Loader2, Sparkles, Edit3, Package, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { PDFDocument } from 'pdf-lib';

// DossierReview Component
const DossierReview = ({ answers, onSave, onBack }: { answers: any, onSave: (newAnswers: any) => void, onBack: () => void }) => {
    const [editedAnswers, setEditedAnswers] = useState(answers);

    const handleFieldChange = (field: string, value: string) => {
        setEditedAnswers({ ...editedAnswers, [field]: value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
        >
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>
                    <ArrowLeft size={18} /> Retour
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Révision de votre dossier</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Vérifiez et ajustez les textes optimisés par l'Allié.</p>
                </div>
                <div style={{ width: '100px' }}></div>
            </div>

            <div className="review-grid" style={{ display: 'grid', gap: '30px' }}>
                {/* Simulated AI Insight Card */}
                <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid #bfdbfe', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '12px', color: '#3b82f6' }}>
                        <Sparkles size={30} />
                    </div>
                    <div>
                        <h4 style={{ color: '#1e40af', marginBottom: '4px', fontWeight: '800' }}>Analyse de l'Allié terminée</h4>
                        <p style={{ color: '#1e40af', opacity: 0.8, fontSize: '0.95rem' }}>J'ai structuré vos réponses pour qu'elles correspondent aux critères d'évaluation de la MDPH. Vous pouvez affiner le "Projet de Vie" ci-dessous.</p>
                    </div>
                </div>

                {/* Summary Section */}
                <div style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Edit3 size={20} className="text-accent" /> Votre Projet de Vie
                    </h3>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '0.9rem', color: '#475569' }}>
                            ATTENTES ET BESOINS (SECTION ÉLÉMENTAIRE)
                        </label>
                        <textarea
                            value={editedAnswers.expectations}
                            onChange={(e) => handleFieldChange('expectations', e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '300px',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                color: '#1e293b',
                                background: '#f8fafc',
                                resize: 'vertical'
                            }}
                        />
                        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Conseil : Ce texte sera l'élément central de votre dossier PDF.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Diagnostic</span>
                            <p style={{ fontWeight: '500', marginTop: '4px' }}>{editedAnswers.diagnosis}</p>
                        </div>
                        <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Scolarité</span>
                            <p style={{ fontWeight: '500', marginTop: '4px' }}>{editedAnswers.schoolLevel} ({editedAnswers.timeInSchool})</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button
                        onClick={() => onSave(editedAnswers)}
                        className="btn-primary"
                        style={{ padding: '16px 40px', fontSize: '1.1rem', background: '#059669', borderColor: '#059669', cursor: 'pointer' }}
                    >
                        <CheckCircle size={20} /> Valider et générer mon PDF
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const QuestionnaireScreen = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [stage, setStage] = useState<'questionnaire' | 'optimizing' | 'review' | 'success'>('questionnaire');
    const [completedAnswers, setCompletedAnswers] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [optimizationMessage, setOptimizationMessage] = useState('Analyse des réponses...');

    const handleComplete = async (answers: any) => {
        setCompletedAnswers(answers);
        setStage('optimizing');
        window.scrollTo(0, 0);

        // Simulation logic for the UI feedback
        const messages = [
            'Analyse des points de blocage...',
            'Traduction en terminologie MDPH...',
            'Mise en forme du Projet de Vie...',
            'Finalisation de la synthèse experte...'
        ];

        let msgIndex = 0;
        const interval = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            setOptimizationMessage(messages[msgIndex]);
        }, 1500);

        try {
            const { data, error } = await supabase.functions.invoke('optimize-dossier', {
                body: { answers }
            });

            if (error) throw error;

            setCompletedAnswers({
                ...answers,
                expectations: data.expertText || answers.expectations
            });

            clearInterval(interval);
            setStage('review');
            toast.success('Optimisation terminée !');
        } catch (error) {
            console.error('AI Error:', error);
            clearInterval(interval);
            toast.error("L'optimisation a pris un peu de retard, passage en mode manuel.");
            setStage('review');
        }
    };

    const handleSaveReview = async (newAnswers: any) => {
        setCompletedAnswers(newAnswers);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('submissions')
                    .update({ answers: newAnswers, status: 'completed' })
                    .eq('child_id', childId)
                    .eq('user_id', user.id);
            }
            setStage('success');
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error saving review:', error);
            toast.error('Erreur lors de la validation');
        }
    };

    const downloadPack = async () => {
        if (!completedAnswers) return;

        setIsGenerating(true);
        toast.loading('Génération du Pack Allié...', { id: 'generating' });

        try {
            // 1. Génération de la Synthèse (Notre PDF)
            const doc = <MDPHDocument data={completedAnswers} childName={completedAnswers.firstName || 'Enfant'} />;
            const synthesisBlob = await pdf(doc).toBlob();

            // Téléchargement de la synthèse
            const synthesisUrl = URL.createObjectURL(synthesisBlob);
            const synthesisLink = document.createElement('a');
            synthesisLink.href = synthesisUrl;
            synthesisLink.download = `Synthese_MDPH_${completedAnswers.firstName}.pdf`;
            synthesisLink.click();

            // 2. Préparation du CERFA Pré-rempli (Bonus)
            try {
                // Utilisation d'un chemin relatif (évite CORS et les DNS externes capricieux)
                // Note : le fichier doit être présent dans le dossier /public/
                const cerfaUrl = '/cerfa_15692.pdf';
                const response = await fetch(cerfaUrl);

                if (!response.ok) throw new Error('CERFA local introuvable');

                const existingPdfBytes = await response.arrayBuffer();

                // Vérification de sécurité : est-ce vraiment un PDF ? 
                // (évite de parser du HTML en cas de 404 sur le dev server)
                const header = new Uint8Array(existingPdfBytes.slice(0, 5));
                const headerString = String.fromCharCode(...header);

                if (headerString !== '%PDF-') {
                    console.warn("Le fichier local n'est pas un PDF valide. Remplissage ignoré.");
                    toast.success('Synthèse générée !', { id: 'generating' });
                    return;
                }

                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const form = pdfDoc.getForm();

                try {
                    // Liste des champs possibles pour le NOM
                    const nomFields = [
                        'topmostSubform[0].Page1[0].NomFamille[0]',
                        'nom d\'usage',
                        'nom de naissance',
                        'Nom'
                    ];

                    // Liste des champs possibles pour le PRENOM
                    const prenomFields = [
                        'topmostSubform[0].Page1[0].Prenom[0]',
                        'préno',
                        'Prénom',
                        'Prenom'
                    ];

                    const nom = completedAnswers.lastName?.toUpperCase() || '';
                    const prenom = completedAnswers.firstName || '';

                    // On remplit le premier champ trouvé dans chaque liste
                    for (const f of nomFields) {
                        const field = form.getTextField(f);
                        if (field) { field.setText(nom); break; }
                    }
                    for (const f of prenomFields) {
                        const field = form.getTextField(f);
                        if (field) { field.setText(prenom); break; }
                    }

                } catch (e) {
                    console.warn("Automation partielle du CERFA");
                }

                const cerfaPdfBytes = await pdfDoc.save();
                const cerfaBlob = new Blob([cerfaPdfBytes], { type: 'application/pdf' });
                const cerfaLink = document.createElement('a');
                cerfaLink.href = URL.createObjectURL(cerfaBlob);
                cerfaLink.download = `CERFA_15692_PreRempli_${completedAnswers.firstName}.pdf`;
                cerfaLink.click();

                toast.success('Pack complet généré !', { id: 'generating' });
            } catch (cerfaErr) {
                console.error('Erreur CERFA:', cerfaErr);
                toast.success('Synthèse générée !', { id: 'generating' });
            }

        } catch (error) {
            console.error('Error generating Pack:', error);
            toast.error('Erreur lors de la génération', { id: 'generating' });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="questionnaire-screen" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <main className="container" style={{ padding: '40px 20px 80px' }}>
                <AnimatePresence mode="wait">
                    {stage === 'questionnaire' && (
                        <motion.div
                            key="questionnaire"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Questionnaire
                                childId={childId || ''}
                                onComplete={handleComplete}
                            />
                        </motion.div>
                    )}

                    {stage === 'optimizing' && (
                        <motion.div
                            key="optimizing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                maxWidth: '500px',
                                margin: '100px auto',
                                textAlign: 'center',
                                background: 'white',
                                padding: '60px',
                                borderRadius: '24px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div className="ai-loader" style={{ marginBottom: '30px', position: 'relative', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        border: '4px solid #f3f4f6',
                                        borderTop: '4px solid var(--primary)',
                                        borderRadius: '50%'
                                    }}
                                />
                                <Sparkles size={30} className="text-primary" style={{ position: 'absolute' }} />
                            </div>

                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', background: 'linear-gradient(90deg, #1e293b, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
                                L'Allié prépare votre dossier
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1rem', minHeight: '1.5em' }}>
                                {optimizationMessage}
                            </p>

                            <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '30px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "easeInOut" }}
                                    style={{ height: '100%', background: 'var(--primary)' }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {stage === 'review' && (
                        <DossierReview
                            answers={completedAnswers}
                            onSave={handleSaveReview}
                            onBack={() => setStage('questionnaire')}
                        />
                    )}

                    {stage === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                maxWidth: '600px',
                                margin: '60px auto',
                                textAlign: 'center',
                                background: 'white',
                                padding: '60px',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)' }}>
                                <Package size={50} />
                            </div>

                            <h1 style={{ fontSize: '2.2rem', marginBottom: '16px', color: '#0f172a', fontWeight: '800' }}>Votre Pack est prêt !</h1>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
                                Nous avons généré votre **Projet de Vie** personnalisé ainsi que le **formulaire CERFA officiel** partiellement pré-rempli.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button
                                    onClick={downloadPack}
                                    disabled={isGenerating}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        padding: '20px',
                                        fontSize: '1.2rem',
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isGenerating ? (
                                        <><Loader2 size={24} className="animate-spin" /> Préparation du Pack...</>
                                    ) : (
                                        <><FileDown size={24} /> Télécharger mon Pack Complet</>
                                    )}
                                </button>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn-secondary"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        padding: '18px',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        background: 'transparent'
                                    }}
                                >
                                    <ArrowLeft size={20} /> Retour au tableau de bord
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default QuestionnaireScreen;
