import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Loader2, Utensils, Shirt, Baby, Sparkles, LogOut } from 'lucide-react';
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

            // 1. Fetch Child Profile Data
            const { data: childData } = await supabase
                .from('children')
                .select('first_name, diagnosis')
                .eq('id', childId)
                .single();

            // 2. Load Existing Submission
            const { data: existing } = await supabase
                .from('submissions')
                .select('*')
                .eq('child_id', childId)
                .eq('status', 'draft')
                .single();

            if (existing) {
                setSubmissionId(existing.id);
                // Merge child data only if fields are missing OR empty in existing answers
                const currentAnswers = existing.answers || {};
                const mergedAnswers = {
                    ...currentAnswers,
                    firstName: currentAnswers.firstName || childData?.first_name || '',
                    diagnosis: currentAnswers.diagnosis || childData?.diagnosis || '',
                };
                setAnswers(mergedAnswers);
                setStep(existing.current_step || 1);
            } else {
                // New submission: Pre-fill with child data
                const initialAnswers = {
                    firstName: childData?.first_name || '',
                    diagnosis: childData?.diagnosis || '',
                };

                const { data: newSub } = await supabase
                    .from('submissions')
                    .insert([{
                        child_id: childId,
                        user_id: user.id,
                        status: 'draft',
                        answers: initialAnswers,
                        current_step: 1
                    }])
                    .select()
                    .single();

                if (newSub) {
                    setSubmissionId(newSub.id);
                    setAnswers(initialAnswers);
                }
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="step-header">Commençons par l'essentiel</h3>
                        <div className="step-subtext">Quelques informations de base pour identifier le dossier.</div>

                        <div className="space-y-8">
                            <div className="question-group">
                                <label className="question-label">Prénom de l'enfant</label>
                                <input
                                    className="modal-input"
                                    value={answers.firstName || ''}
                                    onChange={e => setAnswer('firstName', e.target.value)}
                                    placeholder="Ex: Léo"
                                />
                            </div>

                            <div className="question-group">
                                <label className="question-label">Date de naissance</label>
                                <input
                                    type="date"
                                    className="modal-input"
                                    value={answers.birthDate || ''}
                                    onChange={e => setAnswer('birthDate', e.target.value)}
                                />
                            </div>

                            <div className="question-group">
                                <label className="question-label">Difficulté principale (Diagnostic)</label>
                                <select
                                    className="modal-input"
                                    value={answers.diagnosis || ''}
                                    onChange={e => setAnswer('diagnosis', e.target.value)}
                                >
                                    <option value="">Choisir...</option>
                                    <option value="TSA (Trouble du Spectre de l'Autisme)">TSA (Trouble du Spectre de l'Autisme)</option>
                                    <option value="TDAH (Trouble de l'Attention)">TDAH (Trouble de l'Attention)</option>
                                    <option value="Troubles DYS (Dyslexie, Dyspraxie...)">Troubles DYS (Dyslexie, Dyspraxie...)</option>
                                    <option value="Retard de développement">Retard de développement</option>
                                    <option value="Autre">Autre situation de handicap</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="step-header">Vie Scolaire</h3>
                        <p className="step-subtext">C'est souvent ici que se joue l'attribution de l'AESH.</p>

                        <div className="space-y-8">
                            <div className="question-group">
                                <label className="question-label">En quelle classe est-il ?</label>
                                <select className="modal-input" value={answers.schoolLevel || ''} onChange={e => setAnswer('schoolLevel', e.target.value)}>
                                    <option value="">Choisir...</option>
                                    <option value="Crèche / Garderie">Crèche / Garderie</option>
                                    <option value="Maternelle">Maternelle</option>
                                    <option value="CP">CP</option>
                                    <option value="CE1-CE2">CE1 / CE2</option>
                                    <option value="CM1-CM2">CM1 / CM2</option>
                                    <option value="Collège">Collège (ULIS ou Ordinaire)</option>
                                    <option value="IME">IME / Institut spécialisé</option>
                                </select>
                            </div>

                            <div className="question-group">
                                <label className="question-label">Temps de scolarisation</label>
                                <div className="space-y-3">
                                    {['Temps plein', 'Temps partiel (matin)', 'Quelques heures/semaine', 'Instruction en Famille (IEF)'].map(opt => (
                                        <label key={opt} className={`radio-tile ${answers.timeInSchool === opt ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="timeInSchool"
                                                checked={answers.timeInSchool === opt}
                                                onChange={() => setAnswer('timeInSchool', opt)}
                                                className="hidden-radio"
                                            />
                                            <div className="radio-content">{opt}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="question-group">
                                <label className="question-label">A-t-il actuellement une AESH (AVS) ?</label>
                                <div className="space-y-3">
                                    <label className={`radio-tile ${answers.hasAesh === true ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="hasAesh"
                                            checked={answers.hasAesh === true}
                                            onChange={() => setAnswer('hasAesh', true)}
                                            className="hidden-radio"
                                        />
                                        <div className="radio-content">Oui</div>
                                    </label>
                                    <label className={`radio-tile ${answers.hasAesh === false ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="hasAesh"
                                            checked={answers.hasAesh === false}
                                            onChange={() => setAnswer('hasAesh', false)}
                                            className="hidden-radio"
                                        />
                                        <div className="radio-content">Non</div>
                                    </label>
                                </div>
                            </div>

                            {answers.hasAesh && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 question-group">
                                    <label className="question-label">Type d'aide humaine ?</label>
                                    <div className="space-y-3">
                                        {[
                                            { val: "Individualisée (AESH-i)", label: "Individualisée (AESH-i) - Pour lui seul" },
                                            { val: "Mutualisée (AESH-m)", label: "Mutualisée (AESH-m) - Partagée avec d'autres" }
                                        ].map(opt => (
                                            <label key={opt.val} className={`radio-tile ${answers.aeshType === opt.val ? 'selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="aeshType"
                                                    checked={answers.aeshType === opt.val}
                                                    onChange={() => setAnswer('aeshType', opt.val)}
                                                    className="hidden-radio"
                                                />
                                                <div className="radio-content">{opt.label}</div>
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="step-header">Autonomie & Quotidien</h3>
                        <p className="step-subtext">Ces détails aident à évaluer le taux d'incapacité.</p>

                        <div className="space-y-8">
                            <div className="question-group">
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Utensils size={18} className="text-accent" /> Repas & Alimentation
                                </label>
                                <div className="space-y-3">
                                    {['Mange seul et proprement', 'Mange seul mais salit beaucoup', 'A besoin qu\'on coupe ses aliments', 'Doit être nourri à la cuillère'].map(opt => (
                                        <label key={opt} className={`radio-tile ${answers.eating === opt ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="eating"
                                                checked={answers.eating === opt}
                                                onChange={() => setAnswer('eating', opt)}
                                                className="hidden-radio"
                                            />
                                            <div className="radio-content">{opt}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="question-group">
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shirt size={18} className="text-accent" /> Habillage
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { val: "Autonome total", label: "S'habille totalement seul" },
                                        { val: "Aide boutons/lacets", label: "Sait s'habiller sauf gestes fins (boutons, lacets)" },
                                        { val: "Aide choix", label: "Sait s'habiller mais ne sait pas choisir ses vêtements (météo)" },
                                        { val: "Dépendant", label: "Doit être habillé par un tiers" }
                                    ].map(opt => (
                                        <label key={opt.val} className={`radio-tile ${answers.dressing === opt.val ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="dressing"
                                                checked={answers.dressing === opt.val}
                                                onChange={() => setAnswer('dressing', opt.val)}
                                                className="hidden-radio"
                                            />
                                            <div className="radio-content">{opt.label}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="question-group">
                                <label className="question-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Baby size={18} className="text-accent" /> Propreté (Toilettes)
                                </label>
                                <div className="space-y-3">
                                    {['Totale (Jour/Nuit)', 'Diurne uniquement', 'Accidents fréquents', 'Port de couches permanent'].map(opt => (
                                        <label key={opt} className={`radio-tile ${answers.toileting === opt ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="toileting"
                                                checked={answers.toileting === opt}
                                                onChange={() => setAnswer('toileting', opt)}
                                                className="hidden-radio"
                                            />
                                            <div className="radio-content">{opt}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="step-header">Suivi Médical & Soins</h3>
                        <p className="step-subtext">Listez les professionnels qui suivent votre enfant régulièrement.</p>

                        <div className="space-y-8">
                            <div className="question-group">
                                <label className="question-label">Qui voit-il régulièrement ? (Plusieurs choix possibles)</label>
                                <div className="space-y-3">
                                    {['Orthophoniste', 'Psychomotricien(ne)', 'Psychologue', 'Ergolibéral', 'Pédopsychiatre', 'Neuropédiatre'].map(pro => (
                                        <label
                                            key={pro}
                                            className={`radio-tile ${answers.therapies?.includes(pro) ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={answers.therapies?.includes(pro) || false}
                                                onChange={() => {
                                                    const current = answers.therapies || [];
                                                    const exists = current.includes(pro);
                                                    setAnswer('therapies', exists ? current.filter((p: string) => p !== pro) : [...current, pro]);
                                                }}
                                                className="hidden-radio"
                                            />
                                            <div className="radio-content">{pro}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="question-group">
                                <label className="question-label">Traitement médicamenteux ?</label>
                                <textarea
                                    className="modal-input"
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                    value={answers.medication || ''}
                                    onChange={e => setAnswer('medication', e.target.value)}
                                    placeholder="Si oui, précisez le traitement..."
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

            <div className="questionnaire-card" style={{ background: 'white', padding: '60px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

                <div className="step-content" style={{ minHeight: '400px' }}>
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className="stepper-footer" style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
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
