import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Loader2, Utensils, Shirt, Baby, Sparkles, X, LogOut } from 'lucide-react';
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
        { id: 1, title: "L'Enfant", fields: ['firstName', 'diagnosis', 'birthDate'] },
        { id: 2, title: "Vie Scolaire", fields: ['schoolLevel', 'timeInSchool', 'hasAesh', 'aeshType'] },
        { id: 3, title: "Autonomie & Quotidien", fields: ['dressing', 'eating', 'toileting', 'sleep'] },
        { id: 4, title: "Suivi Médical", fields: ['therapies', 'medication'] },
        { id: 5, title: "Projet de Vie", fields: ['expectations'] },
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
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-xl font-bold mb-6">Commençons par l'essentiel</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="question-label">Prénom de l'enfant</label>
                                <input
                                    className="modal-input"
                                    value={answers.firstName || ''}
                                    onChange={e => setAnswer('firstName', e.target.value)}
                                    placeholder="Ex: Léo"
                                />
                            </div>
                            <div>
                                <label className="question-label">Date de naissance</label>
                                <input
                                    type="date"
                                    className="modal-input"
                                    value={answers.birthDate || ''}
                                    onChange={e => setAnswer('birthDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="question-label">Difficulté principale (Diagnostic)</label>
                                <select
                                    className="modal-input"
                                    value={answers.diagnosis || ''}
                                    onChange={e => setAnswer('diagnosis', e.target.value)}
                                >
                                    <option value="">Choisir...</option>
                                    <option value="TSA">TSA (Trouble du Spectre de l'Autisme)</option>
                                    <option value="TDAH">TDAH (Trouble de l'Attention)</option>
                                    <option value="DYS">Troubles DYS (Dyslexie, etc.)</option>
                                    <option value="TDI">Trouble du Développement Intellectuel</option>
                                    <option value="Autre">Autre situation de handicap</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-xl font-bold mb-2">Vie Scolaire</h3>
                        <p className="text-muted mb-6 text-sm">C'est souvent ici que se joue l'attribution de l'AESH.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="question-label">Niveau scolaire actuel</label>
                                <select className="modal-input" value={answers.schoolLevel || ''} onChange={e => setAnswer('schoolLevel', e.target.value)}>
                                    <option value="">Sélectionnez...</option>
                                    <option value="Maternelle PS">Maternelle (PS)</option>
                                    <option value="Maternelle MS">Maternelle (MS)</option>
                                    <option value="Maternelle GS">Maternelle (GS)</option>
                                    <option value="CP">CP</option>
                                    <option value="CE1">CE1</option>
                                    <option value="CE2">CE2</option>
                                    <option value="CM1">CM1</option>
                                    <option value="CM2">CM2</option>
                                    <option value="Collège">Collège (ULIS ou Ordinaire)</option>
                                    <option value="IME">IME / Institut spécialisé</option>
                                </select>
                            </div>

                            <div>
                                <label className="question-label">Temps de scolarisation</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Temps plein', 'Temps partiel (matin)', 'Quelques heures/semaine', 'Instruction en Famille (IEF)'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setAnswer('timeInSchool', opt)}
                                            className={`option-card ${answers.timeInSchool === opt ? 'selected' : ''}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="question-label">A-t-il actuellement une AESH (AVS) ?</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setAnswer('hasAesh', true)}
                                        className={`option-card flex-1 ${answers.hasAesh === true ? 'selected' : ''}`}
                                    >
                                        Oui
                                    </button>
                                    <button
                                        onClick={() => setAnswer('hasAesh', false)}
                                        className={`option-card flex-1 ${answers.hasAesh === false ? 'selected' : ''}`}
                                    >
                                        Non
                                    </button>
                                </div>
                            </div>

                            {answers.hasAesh && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label className="question-label">Type d'aide humaine ?</label>
                                    <select className="modal-input" value={answers.aeshType || ''} onChange={e => setAnswer('aeshType', e.target.value)}>
                                        <option value="">Précisez...</option>
                                        <option value="Individualisée (AESH-i)">Individualisée (AESH-i) - Pour lui seul</option>
                                        <option value="Mutualisée (AESH-m)">Mutualisée (AESH-m) - Partagée avec d'autres</option>
                                    </select>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-xl font-bold mb-6">Autonomie & Quotidien chez vous</h3>

                        <div className="space-y-8">
                            <div>
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Utensils size={18} className="text-accent" /> Repas & Alimentation
                                </label>
                                <div className="space-y-2">
                                    {['Mange seul et proprement', 'Mange seul mais salit beaucoup', 'A besoin qu\'on coupe ses aliments', 'Doit être nourri à la cuillère'].map(opt => (
                                        <label key={opt} className={`radio-tile ${answers.eating === opt ? 'selected' : ''}`}>
                                            <input type="radio" checked={answers.eating === opt} onChange={() => setAnswer('eating', opt)} className="hidden-radio" />
                                            <div className="radio-content">{opt}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shirt size={18} className="text-accent" /> Habillage
                                </label>
                                <select className="modal-input" value={answers.dressing || ''} onChange={e => setAnswer('dressing', e.target.value)}>
                                    <option value="">Sélectionnez...</option>
                                    <option value="Autonome total">S'habille totalement seul</option>
                                    <option value="Aide boutons/lacets">Sait s'habiller sauf gestes fins (boutons, lacets)</option>
                                    <option value="Aide choix">Sait s'habiller mais ne sait pas choisir ses vêtements (météo)</option>
                                    <option value="Dépendant">Doit être habillé par un tiers</option>
                                </select>
                            </div>

                            <div>
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Baby size={18} className="text-accent" /> Propreté (Toilettes)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Totale (Jour/Nuit)', 'Diurne uniquement', 'Accidents fréquents', 'Port de couches permanent'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setAnswer('toileting', opt)}
                                            className={`option-card ${answers.toileting === opt ? 'selected' : ''}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-xl font-bold mb-2">Suivi Médical & Soins</h3>
                        <p className="text-muted mb-6 text-sm">Listez les professionnels qui suivent votre enfant.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="question-label">Qui voit-il régulièrement ? (Cochez tout)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Orthophoniste', 'Psychomotricien(ne)', 'Psychologue', 'Ergolibéral', 'Pédopsychiatre', 'Neuropédiatre'].map(pro => (
                                        <button
                                            key={pro}
                                            onClick={() => {
                                                const current = answers.therapies || [];
                                                const exists = current.includes(pro);
                                                setAnswer('therapies', exists ? current.filter((p: string) => p !== pro) : [...current, pro]);
                                            }}
                                            className={`option-card ${answers.therapies?.includes(pro) ? 'selected' : ''}`}
                                        >
                                            {pro}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="question-label">Prend-il un traitement médicamenteux ?</label>
                                <textarea
                                    className="modal-input"
                                    placeholder="Ex: Ritaline LP 20mg le matin, Mélatonine le soir..."
                                    value={answers.medication || ''}
                                    onChange={e => setAnswer('medication', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
                                <Sparkles size={24} />
                            </div>
                            Projet de Vie (Le mot de la fin)
                        </h3>
                        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                            <p className="text-sm text-blue-800">
                                <strong>Conseil de l'Allié :</strong> Ne soyez pas modeste. Décrivez "la pire journée". C'est ici que vous demandez concrètement les aides (AESH, matériel, orientation...).
                            </p>
                        </div>

                        <div>
                            <label className="question-label">Quelles sont vos demandes prioritaires pour l'année à venir ?</label>
                            <textarea
                                className="modal-input w-full p-4"
                                style={{ minHeight: '200px', lineHeight: '1.6' }}
                                value={answers.expectations || ''}
                                onChange={e => setAnswer('expectations', e.target.value)}
                                placeholder="Ex: Je demande le maintien de l'AESH à 12h car sans elle, il ne peut pas rester attentif. Je souhaite aussi la prise en charge du transport pour aller au CMPP..."
                            />
                        </div>
                    </motion.div>
                )
            default:
                return <div>Étape inconnue</div>;
        }
    };

    return (
        <div className="questionnaire-layout" style={{ maxWidth: '800px', margin: '40px auto' }}>
            {/* Header Amélioré */}
            <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Gauche : La Marque */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        M
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>L'Allié MDPH</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Mode Édition</span>
                    </div>
                </div>

                {/* Droite : Quitter & Progression */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>Étape {step}/{steps.length}</span>
                        <div style={{ width: '100px', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / steps.length) * 100}%` }}
                                style={{ height: '100%', background: 'var(--accent)' }}
                            ></motion.div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            background: 'white',
                            border: '1px solid var(--border-subtle)',
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={16} /> Retour au tableau de bord
                    </button>
                </div>
            </header>

            <div className="questionnaire-card" style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

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
        </div>
    );
};
