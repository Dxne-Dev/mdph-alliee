import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuestionnaireProps {
    childId: string;
    onComplete: (answers: any) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ childId, onComplete }) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [submissionId, setSubmissionId] = useState<string | null>(null);

    // Load existing submission or create one
    useEffect(() => {
        const initSubmission = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: existing } = await supabase
                .from('submissions')
                .select('*')
                .eq('child_id', childId)
                .eq('status', 'draft')
                .single();

            if (existing) {
                setSubmissionId(existing.id);
                setAnswers(existing.answers || {});
                setStep(existing.current_step || 1);
            } else {
                const { data: newSub } = await supabase
                    .from('submissions')
                    .insert([{ child_id: childId, user_id: user.id, status: 'draft' }])
                    .select()
                    .single();

                if (newSub) setSubmissionId(newSub.id);
            }
        };

        initSubmission();
    }, [childId]);

    // Auto-save logic
    useEffect(() => {
        if (!submissionId || Object.keys(answers).length === 0) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            await supabase
                .from('submissions')
                .update({ answers, current_step: step, updated_at: new Date() })
                .eq('id', submissionId);
            setSaving(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [answers, step, submissionId]);

    const steps = [
        { id: 1, title: "L'Enfant", fields: ['firstName', 'diagnosis'] },
        { id: 2, title: "Autonomie Quotidienne", fields: ['dressing', 'hygiene'] },
        { id: 3, title: "Vie Scolaire", fields: ['aesh', 'schoolAdaptations'] },
        { id: 4, title: "Projet de Vie", fields: ['expectations'] },
    ];

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const setAnswer = (field: string, value: any) => {
        setAnswers((prev: any) => ({ ...prev, [field]: value }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h3 style={{ marginBottom: '20px' }}>Commençons par faire connaissance</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Prénom de l'enfant</label>
                            <input
                                className="modal-input"
                                value={answers.firstName || ''}
                                onChange={e => setAnswer('firstName', e.target.value)}
                                placeholder="Ex: Léo"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Diagnostic principal</label>
                            <select
                                className="modal-input"
                                value={answers.diagnosis || ''}
                                onChange={e => setAnswer('diagnosis', e.target.value)}
                            >
                                <option value="">Choisir...</option>
                                <option value="TSA">TSA (Autisme)</option>
                                <option value="TDAH">TDAH (Trouble de l'attention)</option>
                                <option value="DYS">DYS (Dyslexie, Dyspraxie...)</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ marginBottom: '20px' }}>L'Autonomie au quotidien</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Pour l'habillage, l'enfant :</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {['S\'habille seul', 'A besoin d\'aide (boutons, lacets)', 'Doit être habillé entièrement'].map(opt => (
                                    <label key={opt} style={{ display: 'flex', gap: '10px', cursor: 'pointer', padding: '15px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: answers.dressing === opt ? '#fff3eb' : 'white', borderColor: answers.dressing === opt ? 'var(--accent)' : 'var(--border-subtle)' }}>
                                        <input type="radio" name="dressing" checked={answers.dressing === opt} onChange={() => setAnswer('dressing', opt)} />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ marginBottom: '20px' }}>Vos attentes et besoins</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Que souhaitez-vous que la MDPH comprenne en priorité ? (L'IA traduira ce texte)</p>
                        <textarea
                            className="modal-input"
                            style={{ minHeight: '150px', resize: 'vertical' }}
                            value={answers.expectations || ''}
                            onChange={e => setAnswer('expectations', e.target.value)}
                            placeholder="Ex: Je souhaite une aide pour les soins d'infirmier à domicile..."
                        />
                    </motion.div>
                )
            default:
                return <div>Étape en cours de développement... Nous ajoutons les questions administratives spécifiques.</div>;
        }
    };

    return (
        <div className="questionnaire-stepper" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div className="stepper-header" style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>ÉTAPE {step} SUR {steps.length}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{steps[step - 1].title}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / steps.length) * 100}%` }}
                        style={{ height: '100%', background: 'var(--accent)' }}
                    ></motion.div>
                </div>
            </div>

            <div className="step-content" style={{ minHeight: '350px' }}>
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>

            <div className="stepper-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} disabled={step === 1} className="btn-secondary" style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
                    <ChevronLeft size={18} /> Précédent
                </button>

                {step < steps.length ? (
                    <button onClick={handleNext} className="btn-primary">
                        Suivant <ChevronRight size={18} />
                    </button>
                ) : (
                    <button onClick={() => onComplete(answers)} className="btn-primary" style={{ background: '#22c55e', borderColor: '#22c55e' }}>
                        <CheckCircle size={18} /> Finaliser mon dossier
                    </button>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', height: '20px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {saving ? <><Loader2 size={12} className="animate-spin" /> Sauvegarde...</> : <><Save size={12} /> Sauvegardé automatiquement</>}
                </span>
            </div>
        </div>
    );
};
