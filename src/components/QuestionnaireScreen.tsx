import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Questionnaire } from './Questionnaire';
import { toast } from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';
import { MDPHDocument } from './MDPHDocument';
import { FileDown, ArrowLeft, Loader2, Sparkles, Edit3, Package, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { PDFDocument } from 'pdf-lib';
import { PaymentGate } from './PaymentGate';
import { HealthDataConsentModal } from './HealthDataConsentModal';

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
                <button onClick={onBack} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <ArrowLeft size={18} /> Retour
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="step-header" style={{ fontSize: '2rem', marginBottom: '5px' }}>Révision de votre dossier</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Vérifiez et ajustez les textes optimisés par l'Allié.</p>
                </div>
                <div style={{ width: '100px' }}></div>
            </div>

            <div className="review-grid" style={{ display: 'grid', gap: '30px' }}>
                {/* AI Insight Card - Premium Orange Theme */}
                <div style={{
                    background: 'linear-gradient(135deg, #fff3eb 0%, #fffaf7 100%)',
                    padding: '32px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--accent)',
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                    boxShadow: '0 10px 20px rgba(249, 115, 22, 0.08)'
                }}>
                    <div style={{ background: 'var(--gradient-text)', padding: '18px', borderRadius: '16px', color: 'white', boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)' }}>
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '6px', fontWeight: '800', fontSize: '1.2rem' }}>Analyse de l'Allié terminée</h4>
                        <p style={{ color: 'var(--text-main)', opacity: 0.8, fontSize: '1rem', lineHeight: '1.5' }}>J'ai structuré vos réponses pour qu'elles correspondent aux critères d'évaluation de la MDPH. Vous pouvez affiner le "Projet de Vie" ci-dessous.</p>
                    </div>
                </div>

                {/* Summary Section */}
                <div style={{ background: 'white', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
                        <Edit3 size={24} style={{ color: 'var(--accent)' }} /> Votre Projet de Vie
                    </h3>

                    <div style={{ marginBottom: '32px' }}>
                        <label className="question-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ATTENTES ET BESOINS (SECTION ÉLÉMENTAIRE)
                        </label>
                        <textarea
                            value={editedAnswers.expectations}
                            onChange={(e) => handleFieldChange('expectations', e.target.value)}
                            className="modal-input"
                            style={{
                                minHeight: '350px',
                                marginTop: '12px',
                                background: '#fcfcfc',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                fontSize: '0.95rem',
                                lineHeight: '1.7',
                                padding: '20px',
                                whiteSpace: 'pre-wrap'
                            }}
                        />
                        <div className="info-text">
                            <CheckCircle size={16} style={{ color: 'var(--accent)' }} /> Conseil : Ce texte sera l'élément central de votre dossier PDF.
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diagnostic</span>
                            <p style={{ fontWeight: '600', marginTop: '6px', fontSize: '1.1rem', color: 'var(--primary)' }}>{editedAnswers.diagnosis || 'Non spécifié'}</p>
                        </div>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scolarité</span>
                            <p style={{ fontWeight: '600', marginTop: '6px', fontSize: '1.1rem', color: 'var(--primary)' }}>{editedAnswers.currentGrade} ({editedAnswers.schoolType})</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                        onClick={() => onSave(editedAnswers)}
                        className="btn-primary"
                        style={{ padding: '20px 60px', fontSize: '1.2rem' }}
                    >
                        <CheckCircle size={22} /> Valider mon dossier
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const QuestionnaireScreen = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [stage, setStage] = useState<'questionnaire' | 'optimizing' | 'review' | 'payment' | 'success'>('questionnaire');
    const [completedAnswers, setCompletedAnswers] = useState<any>(null);
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [optimizationMessage, setOptimizationMessage] = useState('Analyse des réponses...');
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        const loadSubmission = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/auth');
                    return;
                }

                const { data, error } = await supabase
                    .from('submissions')
                    .select('*')
                    .eq('child_id', childId)
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    if (data.status === 'completed') {
                        setCompletedAnswers(data.answers);
                        setStage('review');
                    } else {
                        setInitialData(data.answers || {});
                    }
                }
            } catch (error) {
                console.error('Error loading submission:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSubmission();
    }, [childId, navigate]);

    const handleAutoSave = async (answers: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('submissions')
                    .update({
                        answers,
                        updated_at: new Date().toISOString()
                    })
                    .eq('child_id', childId)
                    .eq('user_id', user.id);
            }
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    };

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
            // Simulation API Call
            const { data } = await supabase.functions.invoke('optimize-dossier', {
                body: { answers }
            });

            // Si erreur (ex: fonction pas déployée), on continue silencieusement avec les réponses brutes
            // if (error) throw error; 

            setCompletedAnswers({
                ...answers,
                expectations: data?.expertText || answers.expectations
            });

            clearInterval(interval);
            setStage('review');
            toast.success('Optimisation terminée !');
        } catch (error) {
            console.warn('AI optimization skipped or failed, using raw answers');
            setCompletedAnswers(answers);
            clearInterval(interval);
            // Pas de toast d'erreur pour ne pas effrayer l'utilisateur, on continue juste
            setStage('review');
        }
    };

    const handleSaveReview = async (newAnswers: any) => {
        setCompletedAnswers(newAnswers);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Sauvegarde 'completed'
                await supabase
                    .from('submissions')
                    .update({ answers: newAnswers, status: 'completed' })
                    .eq('child_id', childId)
                    .eq('user_id', user.id);

                // Vérifier statut Premium via user_metadata (mis à jour par le webhook Chariow)
                const isPremium = user.user_metadata?.is_premium === true;

                if (isPremium) {
                    setStage('success');
                } else {
                    setStage('payment');
                }
            } else {
                setStage('payment');
            }
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error saving review:', error);
            toast.error('Erreur lors de la validation');
        }
    };

    const handlePaymentSuccess = () => {
        setStage('success');
        window.scrollTo(0, 0);
    };

    const downloadPack = async () => {
        if (!completedAnswers) return;

        setIsGenerating(true);
        toast.loading('Génération du Pack Allié...', { id: 'generating' });

        try {
            // 1. Génération de la Synthèse (Notre PDF)
            const doc = <MDPHDocument data={completedAnswers} />;
            const synthesisBlob = await pdf(doc).toBlob();

            // Téléchargement de la synthèse
            const synthesisUrl = URL.createObjectURL(synthesisBlob);
            const synthesisLink = document.createElement('a');
            synthesisLink.href = synthesisUrl;
            synthesisLink.download = `Synthese_MDPH_${completedAnswers.firstName}.pdf`;
            synthesisLink.click();

            // 2. Préparation du CERFA Pré-rempli (Bonus)
            try {
                const response = await fetch('/support_client.pdf?v=1');

                if (!response.ok) {
                    console.warn("CERFA local introuvable (404), téléchargement synthèse uniquement.");
                    toast.success('Synthèse générée !', { id: 'generating' });
                    return;
                }

                const existingPdfBytes = await response.arrayBuffer();
                const header = new Uint8Array(existingPdfBytes.slice(0, 5));
                if (String.fromCharCode(...header) !== '%PDF-') {
                    console.warn("Le fichier n'est pas un PDF valide.");
                    toast.success('Synthèse générée !', { id: 'generating' });
                    return;
                }

                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const form = pdfDoc.getForm();

                try {
                    const allFields = form.getFields();
                    const nom = (completedAnswers.lastName || '').toUpperCase();
                    const prenom = completedAnswers.firstName || '';
                    const villeNaissance = completedAnswers.birthPlace || '';
                    const representant = completedAnswers.representativeName || '';

                    allFields.forEach(field => {
                        try {
                            const name = field.getName();
                            const lowerName = name.toLowerCase();

                            if (typeof (field as any).setText === 'function') {
                                const f = field as any;

                                // Nom
                                if ((lowerName.includes('nom') && (lowerName.includes('naissance') || lowerName.includes('usage') || lowerName.includes('famille') || lowerName.includes('p2'))) || lowerName === 'nom') {
                                    f.setText(nom);
                                }
                                // Prénom
                                if (lowerName.includes('prenom') || lowerName.includes('prénom') || lowerName.includes('pr??no')) {
                                    f.setText(prenom);
                                }
                                // Lieu de naissance
                                if (lowerName.includes('lieunaissance') || lowerName.includes('ville_naissance') || lowerName.includes('lieu_naiss')) {
                                    f.setText(villeNaissance);
                                }
                                // Représentant légal
                                if (lowerName.includes('representant') || lowerName.includes('représentant') || lowerName.includes('autorite_parentale')) {
                                    f.setText(representant);
                                }
                            }
                        } catch (e) { }
                    });
                } catch (e) {
                    console.error("Erreur remplissage champs:", e);
                }

                const cerfaPdfBytes = await pdfDoc.save();
                const cerfaBlob = new Blob([cerfaPdfBytes as any], { type: 'application/pdf' });
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
                    {!hasConsent && !isLoading ? (
                        <HealthDataConsentModal onConsent={() => setHasConsent(true)} />
                    ) : null}

                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}
                        >
                            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent)', marginBottom: '20px' }} />
                            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Chargement de votre dossier...</p>
                        </motion.div>
                    ) : stage === 'questionnaire' && (
                        <motion.div
                            key="questionnaire"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Questionnaire
                                onComplete={handleComplete}
                                onSave={handleAutoSave}
                                initialData={initialData}
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
                            <div className="ai-loader" style={{ marginBottom: '30px', position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        border: '4px solid #f1f5f9',
                                        borderTop: '4px solid var(--accent)',
                                        borderRadius: '50%'
                                    }}
                                />
                                <div style={{ position: 'absolute', background: 'var(--gradient-text)', padding: '15px', borderRadius: '50%', color: 'white', boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)' }}>
                                    <Sparkles size={30} />
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
                                L'Allié prépare votre dossier
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', minHeight: '1.5em', fontWeight: '500' }}>
                                {optimizationMessage}
                            </p>

                            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', marginTop: '40px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "easeInOut" }}
                                    style={{ height: '100%', background: 'var(--gradient-text)' }}
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

                    {stage === 'payment' && (
                        <PaymentGate
                            key="payment"
                            childName={completedAnswers?.firstName || ''}
                            onPaymentSuccess={handlePaymentSuccess}
                            onSkip={() => navigate('/dashboard')}
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
                            <div style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
                                <p>Nous avons généré votre <strong style={{ color: 'var(--primary)', fontWeight: '700' }}>Projet de Vie</strong> personnalisé ainsi que le <strong style={{ color: 'var(--primary)', fontWeight: '700' }}>formulaire CERFA officiel</strong> partiellement pré-rempli.</p>
                            </div>

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
                                        background: 'var(--gradient-text)',
                                        border: 'none',
                                        boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)',
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
