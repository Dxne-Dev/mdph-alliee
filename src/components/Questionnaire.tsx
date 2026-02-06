import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, Check, User, Target, Brain,
    MessageCircle, GraduationCap, Stethoscope, Home, FileText,
    Heart, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionnaireProps {
    onComplete: (answers: QuestionnaireAnswers) => void;
    onSave?: (answers: Partial<QuestionnaireAnswers>) => void;
    initialData?: Partial<QuestionnaireAnswers>;
}

export interface QuestionnaireAnswers {
    // Section 1: Situation Actuelle
    firstName: string;
    lastName: string;
    birthDate: string;
    currentGrade: string;
    schoolType: 'publique' | 'privée' | 'spécialisée';
    diagnosis: string;
    diagnosisDate: string;
    isRenewal: boolean;
    hasAesh: boolean;
    aeshHours?: string;
    aeshType?: 'individuel' | 'mutualisé';

    // Section 2: Autonomie Quotidienne
    dressing: 'seul' | 'aide_partielle' | 'aide_complete';
    bathing: 'seul' | 'aide_partielle' | 'aide_complete';
    toileting: 'seul' | 'rappels' | 'aide_complete';
    eating: 'seul' | 'selectivite' | 'aide_complete';
    canStayAlone: boolean;
    autonomyNotes?: string;

    // Section 3: Comportement
    hasCrises: boolean;
    crisisFrequency?: 'quotidiennes' | 'hebdomadaires' | 'mensuelles';
    crisisDuration?: '0-15min' | '15-30min' | '30-60min' | 'plus_1h';
    emotionRegulation: 'bonne' | 'moyenne' | 'difficile' | 'tres_difficile';
    hasRigidities: boolean;
    behaviorExample?: string;

    // Section 4: Communication
    oralExpression: 'fluide' | 'phrases_simples' | 'mots_isoles' | 'non_verbal';
    comprehension: 'bonne' | 'reformulation' | 'difficile';
    peerInteractions: 'aisees' | 'limitees' | 'tres_limitees' | 'absentes';
    eyeContact: 'present' | 'variable' | 'fuyant';

    // Section 5: Scolarité
    schoolDifficulties: string[];
    currentAccommodations: string[];
    aeshSufficient: boolean;
    requestedSupport: string[];
    schoolContext?: string;

    // Section 6: Soins
    orthophonist: boolean;
    orthophonistFreq?: string;
    psychomotrician: boolean;
    psychomotricianCost?: number;
    psychologist: boolean;
    psychologistCost?: number;
    ergotherapist: boolean;
    ergotherapistCost?: number;
    specializedEducator: boolean;
    educatorCost?: number;

    // Section 7: Retentissement Familial
    childSleep: 'bon' | 'reveils_occasionnels' | 'reveils_frequents' | 'tres_perturbe';
    parentSleep: 'plus_7h' | '5-7h' | 'moins_5h' | 'moins_3h';
    workImpact: 'aucun' | 'amenagements' | 'temps_partiel' | 'arret';
    siblingImpact: 'aucun' | 'leger' | 'tensions' | 'important';
    socialLife: 'normale' | 'reduite' | 'tres_limitee' | 'inexistante';
    familyImpact?: string;

    // Section 8: Demande
    requestAeeh: boolean;
    aeehComplement?: 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5' | 'cat6';
    requestPch: boolean;
    requestMoreAesh: boolean;
    requestedAeshType?: 'individuel' | 'plus_heures';
    requestEquipment: boolean;
    finalNotes?: string;
    expectations?: string;
}

const STEPS = [
    { id: 1, title: 'Situation', Icon: User },
    { id: 2, title: 'Autonomie', Icon: Target },
    { id: 3, title: 'Comportement', Icon: Brain },
    { id: 4, title: 'Communication', Icon: MessageCircle },
    { id: 5, title: 'Scolarité', Icon: GraduationCap },
    { id: 6, title: 'Soins', Icon: Stethoscope },
    { id: 7, title: 'Famille', Icon: Home },
    { id: 8, title: 'Demande', Icon: FileText }
];

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, onSave, initialData }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>(initialData || {});

    // Auto-save logic
    useEffect(() => {
        if (!onSave) return;
        const timer = setTimeout(() => {
            onSave(answers);
        }, 1000); // 1s debounce
        return () => clearTimeout(timer);
    }, [answers, onSave]);

    const updateAnswer = (field: keyof QuestionnaireAnswers, value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const toggleMultiSelect = (field: keyof QuestionnaireAnswers, value: string) => {
        const current = (answers[field] as string[]) || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        updateAnswer(field, updated);
    };

    const nextStep = () => {
        if (currentStep < 8) setCurrentStep(currentStep + 1);
        else onComplete(answers as QuestionnaireAnswers);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const progress = (currentStep / 8) * 100;

    return (
        <div className="questionnaire-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '10px 20px 40px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-outline"
                    style={{
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        color: 'var(--text-muted)'
                    }}
                >
                    <ChevronLeft size={18} /> Retour au tableau de bord
                </button>
            </div>

            {/* Progress Bar - Premium Style */}
            <div style={{
                marginBottom: '50px',
                background: 'white',
                padding: '30px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-subtle)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        background: '#e2e8f0',
                        zIndex: 0
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                height: '100%',
                                background: 'var(--gradient-text)',
                                borderRadius: '999px'
                            }}
                        />
                    </div>
                    {STEPS.map((step) => {
                        const StepIcon = step.Icon;
                        const isActive = currentStep >= step.id;
                        const isCurrent = currentStep === step.id;
                        return (
                            <div
                                key={step.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    zIndex: 2,
                                    width: '12.5%'
                                }}
                            >
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isCurrent ? 'var(--gradient-text)' : isActive ? 'var(--primary)' : 'white',
                                    color: (isCurrent || isActive) ? 'white' : '#94a3b8',
                                    border: (isCurrent || isActive) ? 'none' : '2px solid #f1f5f9',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isCurrent ? '0 8px 16px -4px rgba(249, 115, 22, 0.4)' : 'none',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => setCurrentStep(step.id)}
                                >
                                    <StepIcon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: isCurrent ? 'var(--accent)' : isActive ? 'var(--primary)' : '#94a3b8',
                                    transition: 'all 0.3s',
                                    textAlign: 'center'
                                }}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <span style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    fontWeight: '500',
                    background: '#f8fafc',
                    padding: '6px 16px',
                    borderRadius: '50px',
                    border: '1px solid #f1f5f9'
                }}>
                    Étape <span style={{ color: 'var(--accent)', fontWeight: '800' }}>{currentStep}</span> sur 8 — {STEPS[currentStep - 1].title}
                </span>
            </div>

            {/* Section Content */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="question-section"
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '48px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-subtle)',
                    minHeight: '600px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative Background Element */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.03) 0%, transparent 70%)',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {currentStep === 1 && <Section1Situation answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 2 && <Section2Autonomie answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 3 && <Section3Comportement answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 4 && <Section4Communication answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 5 && <Section5Scolarite answers={answers} updateAnswer={updateAnswer} toggleMultiSelect={toggleMultiSelect} />}
                    {currentStep === 6 && <Section6Soins answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 7 && <Section7Famille answers={answers} updateAnswer={updateAnswer} />}
                    {currentStep === 8 && <Section8Demande answers={answers} updateAnswer={updateAnswer} toggleMultiSelect={toggleMultiSelect} />}
                </div>
            </motion.div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="btn-outline"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        opacity: currentStep === 1 ? 0.3 : 1,
                        padding: '16px 32px'
                    }}
                >
                    <ChevronLeft size={22} />
                    Précédent
                </button>
                <button
                    onClick={nextStep}
                    className="btn-primary"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px 40px',
                        fontSize: '1.1rem'
                    }}
                >
                    {currentStep === 8 ? (
                        <>Valider mon dossier <Check size={22} /></>
                    ) : (
                        <>Suivant <ChevronRight size={22} /></>
                    )}
                </button>
            </div>
        </div >
    );
};

// Section Components
const Section1Situation = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
            <User size={32} style={{ color: 'var(--accent)' }} /> Situation Actuelle
        </h2>
        <p className="step-subtext">Commençons par quelques informations de base sur votre enfant.</p>

        <div className="form-grid-2col">
            <FormField label="Prénom de l'enfant" required>
                <input
                    type="text"
                    value={answers.firstName || ''}
                    onChange={(e) => updateAnswer('firstName', e.target.value)}
                    placeholder="Timéo"
                    className="modal-input"
                />
            </FormField>
            <FormField label="Nom de famille" required>
                <input
                    type="text"
                    value={answers.lastName || ''}
                    onChange={(e) => updateAnswer('lastName', e.target.value)}
                    placeholder="Martin"
                    className="modal-input"
                />
            </FormField>
        </div>

        <div className="form-grid-2col">
            <FormField label="Date de naissance" required>
                <input
                    type="date"
                    value={answers.birthDate || ''}
                    onChange={(e) => updateAnswer('birthDate', e.target.value)}
                    className="modal-input"
                />
            </FormField>
            <FormField label="Classe actuelle">
                <select
                    value={answers.currentGrade || ''}
                    onChange={(e) => updateAnswer('currentGrade', e.target.value)}
                    className="modal-input"
                >
                    <option value="">Sélectionner...</option>
                    <option value="PS">PS (Petite Section)</option>
                    <option value="MS">MS (Moyenne Section)</option>
                    <option value="GS">GS (Grande Section)</option>
                    <option value="CP">CP</option>
                    <option value="CE1">CE1</option>
                    <option value="CE2">CE2</option>
                    <option value="CM1">CM1</option>
                    <option value="CM2">CM2</option>
                    <option value="6eme">6ème</option>
                    <option value="5eme">5ème</option>
                    <option value="4eme">4ème</option>
                    <option value="3eme">3ème</option>
                    <option value="autre">Autre</option>
                </select>
            </FormField>
        </div>

        <FormField label="Type d'établissement">
            <RadioGroup
                options={[
                    { label: 'École Publique', value: 'publique' },
                    { label: 'École Privée', value: 'privée' },
                    { label: 'Établissement Spécialisé', value: 'spécialisée' }
                ]}
                selected={answers.schoolType}
                onChange={(val: any) => updateAnswer('schoolType', val)}
            />
        </FormField>

        <div className="form-grid-2col">
            <FormField label="Diagnostic principal" required>
                <input
                    type="text"
                    value={answers.diagnosis || ''}
                    onChange={(e) => updateAnswer('diagnosis', e.target.value)}
                    placeholder="Ex: Autisme (TSA), TDAH..."
                    className="modal-input"
                />
            </FormField>
            <FormField label="Date du diagnostic">
                <input
                    type="date"
                    value={answers.diagnosisDate || ''}
                    onChange={(e) => updateAnswer('diagnosisDate', e.target.value)}
                    className="modal-input"
                />
            </FormField>
        </div>

        <FormField label="S'agit-il d'un renouvellement ?">
            <RadioGroup
                options={[
                    { label: 'Oui, c\'est un renouvellement', value: true },
                    { label: 'Non, c\'est une première demande', value: false }
                ]}
                selected={answers.isRenewal}
                onChange={(val: any) => updateAnswer('isRenewal', val)}
            />
        </FormField>

        <FormField label="Votre enfant a-t-il un AESH actuellement ?">
            <RadioGroup
                options={[
                    { label: 'Oui', value: true },
                    { label: 'Non', value: false }
                ]}
                selected={answers.hasAesh}
                onChange={(val: any) => updateAnswer('hasAesh', val)}
            />
        </FormField>

        {answers.hasAesh && (
            <div className="form-grid-2col nested-form-grid">
                <FormField label="Nombre d'heures par semaine">
                    <input
                        type="text"
                        value={answers.aeshHours || ''}
                        onChange={(e) => updateAnswer('aeshHours', e.target.value)}
                        placeholder="12h"
                        className="modal-input"
                    />
                </FormField>
                <FormField label="Type d'AESH">
                    <RadioGroup
                        options={[
                            { label: 'Individuel', value: 'individuel' },
                            { label: 'Mutualisé', value: 'mutualisé' }
                        ]}
                        selected={answers.aeshType}
                        onChange={(val: any) => updateAnswer('aeshType', val)}
                    />
                </FormField>
            </div>
        )}
    </div>
);

const Section2Autonomie = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><Target size={32} style={{ color: 'var(--accent)' }} /> Autonomie au Quotidien</h2>
        <p className="step-subtext">Comment votre enfant se débrouille-t-il pour les actes de la vie quotidienne ?</p>

        <div className="form-grid-1col">
            <FormField label="S'habille seul le matin ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, seul', value: 'seul' },
                        { label: 'Avec aide partielle', value: 'aide_partielle' },
                        { label: 'Non, aide complète nécessaire', value: 'aide_complete' }
                    ]}
                    selected={answers.dressing}
                    onChange={(val: any) => updateAnswer('dressing', val)}
                />
            </FormField>

            <FormField label="Se lave seul ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, seul', value: 'seul' },
                        { label: 'Avec supervision', value: 'aide_partielle' },
                        { label: 'Non, aide complète nécessaire', value: 'aide_complete' }
                    ]}
                    selected={answers.bathing}
                    onChange={(val: any) => updateAnswer('bathing', val)}
                />
            </FormField>

            <FormField label="Va aux toilettes seul ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, complètement autonome', value: 'seul' },
                        { label: 'Oui, mais besoin de rappels fréquents', value: 'rappels' },
                        { label: 'Non, aide nécessaire', value: 'aide_complete' }
                    ]}
                    selected={answers.toileting}
                    onChange={(val: any) => updateAnswer('toileting', val)}
                />
            </FormField>

            <FormField label="Mange seul ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, sans difficulté', value: 'seul' },
                        { label: 'Oui, mais sélectivité alimentaire / textures limitées', value: 'selectivite' },
                        { label: 'Non, aide nécessaire', value: 'aide_complete' }
                    ]}
                    selected={answers.eating}
                    onChange={(val: any) => updateAnswer('eating', val)}
                />
            </FormField>

            <FormField label="Peut rester seul à la maison ?">
                <RadioGroup
                    options={[
                        { label: 'Oui', value: true },
                        { label: 'Non, surveillance constante nécessaire', value: false }
                    ]}
                    selected={answers.canStayAlone}
                    onChange={(val: any) => updateAnswer('canStayAlone', val)}
                />
            </FormField>

            <FormField label="Y a-t-il autre chose sur l'autonomie que vous voulez mentionner ?" optional>
                <textarea
                    value={answers.autonomyNotes || ''}
                    onChange={(e) => updateAnswer('autonomyNotes', e.target.value)}
                    placeholder="Ex: Il ne sait pas lacer ses chaussures, je dois choisir ses vêtements sinon il met la même chose 5 jours de suite..."
                    className="modal-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section3Comportement = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><Brain size={32} style={{ color: 'var(--accent)' }} /> Comportement</h2>
        <p className="step-subtext">Parlons des aspects comportementaux et émotionnels.</p>

        <div className="form-grid-1col">
            <FormField label="Votre enfant fait-il des crises lors de changements de programme ou de routine ?">
                <RadioGroup
                    options={[
                        { label: 'Oui', value: true },
                        { label: 'Non', value: false }
                    ]}
                    selected={answers.hasCrises}
                    onChange={(val: any) => updateAnswer('hasCrises', val)}
                />
            </FormField>

            {answers.hasCrises && (
                <>
                    <FormField label="À quelle fréquence ?">
                        <RadioGroup
                            options={[
                                { label: 'Tous les jours ou presque', value: 'quotidiennes' },
                                { label: 'Plusieurs fois par semaine', value: 'hebdomadaires' },
                                { label: 'Quelques fois par mois', value: 'mensuelles' }
                            ]}
                            selected={answers.crisisFrequency}
                            onChange={(val: any) => updateAnswer('crisisFrequency', val)}
                        />
                    </FormField>

                    <FormField label="Durée moyenne d'une crise ?">
                        <RadioGroup
                            options={[
                                { label: 'Moins de 15 minutes', value: '0-15min' },
                                { label: '15 à 30 minutes', value: '15-30min' },
                                { label: '30 à 60 minutes', value: '30-60min' },
                                { label: 'Plus d\'1 heure', value: 'plus_1h' }
                            ]}
                            selected={answers.crisisDuration}
                            onChange={(val: any) => updateAnswer('crisisDuration', val)}
                        />
                    </FormField>
                </>
            )}

            <FormField label="Gestion des émotions ?">
                <RadioGroup
                    options={[
                        { label: 'Bonne', value: 'bonne' },
                        { label: 'Moyenne', value: 'moyenne' },
                        { label: 'Difficile', value: 'difficile' },
                        { label: 'Très difficile', value: 'tres_difficile' }
                    ]}
                    selected={answers.emotionRegulation}
                    onChange={(val: any) => updateAnswer('emotionRegulation', val)}
                />
            </FormField>

            <FormField label="Rigidités / Routines fortes ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, quotidiennes', value: true },
                        { label: 'Non ou occasionnelles', value: false }
                    ]}
                    selected={answers.hasRigidities}
                    onChange={(val: any) => updateAnswer('hasRigidities', val)}
                />
            </FormField>

            <FormField label="Pouvez-vous décrire une situation typique de crise ?" optional>
                <textarea
                    value={answers.behaviorExample || ''}
                    onChange={(e) => updateAnswer('behaviorExample', e.target.value)}
                    placeholder="Ex: La semaine dernière on a dû changer de route pour aller à l'école à cause de travaux. Il a hurlé 40 minutes dans la voiture..."
                    className="modal-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section4Communication = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><MessageCircle size={32} style={{ color: 'var(--accent)' }} /> Communication</h2>
        <p className="step-subtext">Comment votre enfant communique-t-il et interagit-il avec les autres ?</p>

        <div className="form-grid-1col">
            <FormField label="Expression orale ?">
                <RadioGroup
                    options={[
                        { label: 'Fluide et variée', value: 'fluide' },
                        { label: 'Phrases simples, vocabulaire limité', value: 'phrases_simples' },
                        { label: 'Mots isolés uniquement', value: 'mots_isoles' },
                        { label: 'Non verbal', value: 'non_verbal' }
                    ]}
                    selected={answers.oralExpression}
                    onChange={(val: any) => updateAnswer('oralExpression', val)}
                />
            </FormField>

            <FormField label="Compréhension des consignes ?">
                <RadioGroup
                    options={[
                        { label: 'Bonne compréhension', value: 'bonne' },
                        { label: 'Difficile, besoin de reformulation', value: 'reformulation' },
                        { label: 'Très difficile', value: 'difficile' }
                    ]}
                    selected={answers.comprehension}
                    onChange={(val: any) => updateAnswer('comprehension', val)}
                />
            </FormField>

            <FormField label="Interactions avec les autres enfants ?">
                <RadioGroup
                    options={[
                        { label: 'Aisées, a des amis', value: 'aisees' },
                        { label: 'Limitées', value: 'limitees' },
                        { label: 'Très limitées', value: 'tres_limitees' },
                        { label: 'Absentes', value: 'absentes' }
                    ]}
                    selected={answers.peerInteractions}
                    onChange={(val: any) => updateAnswer('peerInteractions', val)}
                />
            </FormField>

            <FormField label="Contact visuel ?">
                <RadioGroup
                    options={[
                        { label: 'Présent', value: 'present' },
                        { label: 'Variable', value: 'variable' },
                        { label: 'Fuyant', value: 'fuyant' }
                    ]}
                    selected={answers.eyeContact}
                    onChange={(val: any) => updateAnswer('eyeContact', val)}
                />
            </FormField>
        </div>
    </div>
);

const Section5Scolarite = ({ answers, updateAnswer, toggleMultiSelect }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><GraduationCap size={32} style={{ color: 'var(--accent)' }} /> Scolarité</h2>
        <p className="step-subtext">Parlons de la vie scolaire de votre enfant.</p>

        <div className="form-grid-1col">
            <FormField label="Principales difficultés en classe ? (plusieurs choix possibles)">
                <CheckboxGroup
                    options={[
                        { label: 'Concentration / Attention', value: 'concentration' },
                        { label: 'Hypersensibilité au bruit', value: 'bruit' },
                        { label: 'Compréhension des consignes', value: 'consignes' },
                        { label: 'Interactions sociales', value: 'interactions' },
                        { label: 'Écriture / Graphisme', value: 'ecriture' },
                        { label: 'Lecture', value: 'lecture' }
                    ]}
                    selected={answers.schoolDifficulties || []}
                    onToggle={(value: any) => toggleMultiSelect('schoolDifficulties', value)}
                />
            </FormField>

            <FormField label="Aménagements déjà en place ? (plusieurs choix possibles)">
                <CheckboxGroup
                    options={[
                        { label: 'Tiers-temps aux évaluations', value: 'tiers_temps' },
                        { label: 'Place isolée / au fond', value: 'place_isolee' },
                        { label: 'Supports pédagogiques adaptés', value: 'supports_adaptes' },
                        { label: 'Possibilité de faire des pauses', value: 'pause' },
                        { label: 'Aucun pour le moment', value: 'aucun' }
                    ]}
                    selected={answers.currentAccommodations || []}
                    onToggle={(value: any) => toggleMultiSelect('currentAccommodations', value)}
                />
            </FormField>

            <FormField label="L'accompagnement AESH actuel est-il suffisant ?">
                <RadioGroup
                    options={[
                        { label: 'Oui, adapté', value: true },
                        { label: 'Non, insuffisant', value: false }
                    ]}
                    selected={answers.aeshSufficient}
                    onChange={(val: any) => updateAnswer('aeshSufficient', val)}
                />
            </FormField>

            <FormField label="Que souhaitez-vous demander ?">
                <CheckboxGroup
                    options={[
                        { label: 'Plus d\'heures AESH', value: 'plus_heures_aesh' },
                        { label: 'Passage à un AESH individuel', value: 'aesh_individuel' },
                        { label: 'Aménagements pédagogiques supplémentaires', value: 'amenagements_sup' },
                        { label: 'Matériel pédagogique adapté', value: 'materiel' }
                    ]}
                    selected={answers.requestedSupport || []}
                    onToggle={(value: any) => toggleMultiSelect('requestedSupport', value)}
                />
            </FormField>

            <FormField label="Comment se passe l'école au quotidien ?" optional>
                <textarea
                    value={answers.schoolContext || ''}
                    onChange={(e) => updateAnswer('schoolContext', e.target.value)}
                    placeholder="Ex: La maîtresse fait ce qu'elle peut mais elle a 28 élèves. Timéo décroche au bout de 20 min. Il fugue parfois dans le couloir..."
                    className="modal-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section6Soins = ({ answers, updateAnswer }: any) => {
    const calculateTotalCost = () => {
        let total = 0;
        if (answers.psychomotricianCost) total += Number(answers.psychomotricianCost);
        if (answers.psychologistCost) total += Number(answers.psychologistCost);
        if (answers.ergotherapistCost) total += Number(answers.ergotherapistCost);
        if (answers.educatorCost) total += Number(answers.educatorCost);
        return total;
    };

    return (
        <div className="section-card">
            <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><Stethoscope size={32} style={{ color: 'var(--accent)' }} /> Soins et Thérapies</h2>
            <p className="step-subtext">Quels sont les professionnels qui accompagnent votre enfant ?</p>

            <div className="form-grid-1col">
                {/* Orthophoniste */}
                <div className="sub-section-card">
                    <FormField label="Orthophoniste">
                        <RadioGroup
                            options={[
                                { label: 'Oui', value: true },
                                { label: 'Non', value: false }
                            ]}
                            selected={answers.orthophonist}
                            onChange={(val: any) => updateAnswer('orthophonist', val)}
                        />
                    </FormField>
                    {answers.orthophonist && (
                        <div className="nested-form-grid">
                            <FormField label="Fréquence">
                                <input
                                    type="text"
                                    value={answers.orthophonistFreq || ''}
                                    onChange={(e) => updateAnswer('orthophonistFreq', e.target.value)}
                                    placeholder="Ex: 2x/semaine"
                                    className="modal-input"
                                />
                            </FormField>
                            <p className="info-text">
                                <Heart size={14} style={{ color: 'var(--success)' }} /> Généralement remboursé par la Sécurité Sociale
                            </p>
                        </div>
                    )}
                </div>

                {/* Psychomotricien */}
                <div className="sub-section-card">
                    <FormField label="Psychomotricien">
                        <RadioGroup
                            options={[
                                { label: 'Oui', value: true },
                                { label: 'Non', value: false }
                            ]}
                            selected={answers.psychomotrician}
                            onChange={(val: any) => updateAnswer('psychomotrician', val)}
                        />
                    </FormField>
                    {answers.psychomotrician && (
                        <div className="nested-form-grid">
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.psychomotricianCost || ''}
                                    onChange={(e) => updateAnswer('psychomotricianCost', e.target.value)}
                                    placeholder="180"
                                    className="modal-input"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Psychologue */}
                <div className="sub-section-card">
                    <FormField label="Psychologue">
                        <RadioGroup
                            options={[
                                { label: 'Oui', value: true },
                                { label: 'Non', value: false }
                            ]}
                            selected={answers.psychologist}
                            onChange={(val: any) => updateAnswer('psychologist', val)}
                        />
                    </FormField>
                    {answers.psychologist && (
                        <div className="nested-form-grid">
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.psychologistCost || ''}
                                    onChange={(e) => updateAnswer('psychologistCost', e.target.value)}
                                    placeholder="100"
                                    className="modal-input"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Ergothérapeute */}
                <div className="sub-section-card">
                    <FormField label="Ergothérapeute">
                        <RadioGroup
                            options={[
                                { label: 'Oui', value: true },
                                { label: 'Non', value: false }
                            ]}
                            selected={answers.ergotherapist}
                            onChange={(val: any) => updateAnswer('ergotherapist', val)}
                        />
                    </FormField>
                    {answers.ergotherapist && (
                        <div className="nested-form-grid">
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.ergotherapistCost || ''}
                                    onChange={(e) => updateAnswer('ergotherapistCost', e.target.value)}
                                    placeholder="60"
                                    className="modal-input"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Éducateur spécialisé */}
                <div className="sub-section-card">
                    <FormField label="Éducateur spécialisé">
                        <RadioGroup
                            options={[
                                { label: 'Oui', value: true },
                                { label: 'Non', value: false }
                            ]}
                            selected={answers.specializedEducator}
                            onChange={(val: any) => updateAnswer('specializedEducator', val)}
                        />
                    </FormField>
                    {answers.specializedEducator && (
                        <div className="nested-form-grid">
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.educatorCost || ''}
                                    onChange={(e) => updateAnswer('educatorCost', e.target.value)}
                                    placeholder="150"
                                    className="modal-input"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="total-cost-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Reste à charge mensuel total :</span>
                        <span style={{ fontWeight: 'bold', fontSize: '24px', color: 'var(--primary)' }}>
                            {calculateTotalCost()}€
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section7Famille = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><Home size={32} style={{ color: 'var(--accent)' }} /> Retentissement Familial</h2>
        <p className="step-subtext">Comment le handicap impacte-t-il votre vie quotidienne et celle de votre famille ?</p>

        <div className="form-grid-1col">
            <FormField label="Comment dort votre enfant ?">
                <RadioGroup
                    options={[
                        { label: 'Bon sommeil', value: 'bon' },
                        { label: 'Réveils occasionnels', value: 'reveils_occasionnels' },
                        { label: 'Réveils fréquents', value: 'reveils_frequents' },
                        { label: 'Très perturbé', value: 'tres_perturbe' }
                    ]}
                    selected={answers.childSleep}
                    onChange={(val: any) => updateAnswer('childSleep', val)}
                />
            </FormField>

            <FormField label="Et vous, comment dormez-vous ?">
                <RadioGroup
                    options={[
                        { label: 'Plus de 7h par nuit', value: 'plus_7h' },
                        { label: '5 à 7h par nuit', value: '5-7h' },
                        { label: 'Moins de 5h par nuit', value: 'moins_5h' },
                        { label: 'Moins de 3h par nuit', value: 'moins_3h' }
                    ]}
                    selected={answers.parentSleep}
                    onChange={(val: any) => updateAnswer('parentSleep', val)}
                />
            </FormField>

            <FormField label="Impact sur votre travail ?">
                <RadioGroup
                    options={[
                        { label: 'Aucun impact', value: 'aucun' },
                        { label: 'Aménagements horaires', value: 'amenagements' },
                        { label: 'Temps partiel subi', value: 'temps_partiel' },
                        { label: 'Arrêt de travail', value: 'arret' }
                    ]}
                    selected={answers.workImpact}
                    onChange={(val: any) => updateAnswer('workImpact', val)}
                />
            </FormField>

            <FormField label="Impact sur la fratrie ?">
                <RadioGroup
                    options={[
                        { label: 'Aucun / Pas de fratrie', value: 'aucun' },
                        { label: 'Léger', value: 'leger' },
                        { label: 'Tensions fréquentes', value: 'tensions' },
                        { label: 'Impact important', value: 'important' }
                    ]}
                    selected={answers.siblingImpact}
                    onChange={(val: any) => updateAnswer('siblingImpact', val)}
                />
            </FormField>

            <FormField label="Vie sociale de la famille ?">
                <RadioGroup
                    options={[
                        { label: 'Normale', value: 'normale' },
                        { label: 'Réduite', value: 'reduite' },
                        { label: 'Très limitée', value: 'tres_limitee' },
                        { label: 'Quasi inexistante', value: 'inexistante' }
                    ]}
                    selected={answers.socialLife}
                    onChange={(val: any) => updateAnswer('socialLife', val)}
                />
            </FormField>

            <FormField label="Comment décririez-vous l'impact sur votre vie quotidienne ?" optional>
                <textarea
                    value={answers.familyImpact || ''}
                    onChange={(e) => updateAnswer('familyImpact', e.target.value)}
                    placeholder="Ex: Je suis à 80% au travail parce que je dois gérer les rdv. J'ai plus de vie sociale. Ma fille de 12 ans dit que je m'occupe que de Timéo..."
                    className="modal-input"
                    rows={5}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section8Demande = ({ answers, updateAnswer }: any) => (
    <div className="section-card">
        <h2 className="step-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}><FileText size={32} style={{ color: 'var(--accent)' }} /> Votre Demande</h2>
        <p className="step-subtext">Que souhaitez-vous demander à la MDPH ?</p>

        <div className="form-grid-1col">
            <div className="sub-section-card">
                <FormField label="Demandez-vous l'AEEH (Allocation d'Éducation de l'Enfant Handicapé) ?">
                    <RadioGroup
                        options={[
                            { label: 'Oui', value: true },
                            { label: 'Non', value: false }
                        ]}
                        selected={answers.requestAeeh}
                        onChange={(val: any) => updateAnswer('requestAeeh', val)}
                    />
                </FormField>

                {answers.requestAeeh && (
                    <div className="nested-form-grid">
                        <FormField label="Quel complément souhaitez-vous ?">
                            <select
                                value={answers.aeehComplement || ''}
                                onChange={(e) => updateAnswer('aeehComplement', e.target.value)}
                                className="modal-input"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="cat1">Catégorie 1 (Dépenses &lt; 230€/mois)</option>
                                <option value="cat2">Catégorie 2 (Contrainte modérée ou coût 230-391€)</option>
                                <option value="cat3">Catégorie 3 (Contrainte importante ou coût 391-587€)</option>
                                <option value="cat4">Catégorie 4 (Contrainte importante + coût ou présence requise)</option>
                                <option value="cat5">Catégorie 5 (Contrainte permanente ou coût élevé)</option>
                                <option value="cat6">Catégorie 6 (Contrainte permanente + coût ou présence continue)</option>
                            </select>
                        </FormField>
                    </div>
                )}
            </div>

            <div className="sub-section-card">
                <FormField label="Demandez-vous la PCH (Prestation de Compensation du Handicap) ?">
                    <RadioGroup
                        options={[
                            { label: 'Oui', value: true },
                            { label: 'Non', value: false }
                        ]}
                        selected={answers.requestPch}
                        onChange={(val: any) => updateAnswer('requestPch', val)}
                    />
                </FormField>
            </div>

            <div className="sub-section-card">
                <FormField label="Demandez-vous plus d'heures d'AESH ?">
                    <RadioGroup
                        options={[
                            { label: 'Oui', value: true },
                            { label: 'Non', value: false }
                        ]}
                        selected={answers.requestMoreAesh}
                        onChange={(val: any) => updateAnswer('requestMoreAesh', val)}
                    />
                </FormField>

                {answers.requestMoreAesh && (
                    <div className="nested-form-grid">
                        <FormField label="Type d'accompagnement souhaité">
                            <RadioGroup
                                options={[
                                    { label: 'Augmentation du nombre d\'heures', value: 'plus_heures' },
                                    { label: 'Passage à un AESH individuel (ou les deux)', value: 'individuel' }
                                ]}
                                selected={answers.requestedAeshType}
                                onChange={(val: any) => updateAnswer('requestedAeshType', val)}
                            />
                        </FormField>
                    </div>
                )}
            </div>

            <div className="sub-section-card">
                <FormField label="Demandez-vous du matériel pédagogique adapté ?">
                    <RadioGroup
                        options={[
                            { label: 'Oui (ordinateur, tablette, logiciels...)', value: true },
                            { label: 'Non', value: false }
                        ]}
                        selected={answers.requestEquipment}
                        onChange={(val: any) => updateAnswer('requestEquipment', val)}
                    />
                </FormField>
            </div>

            <FormField label="Y a-t-il autre chose que la MDPH doit absolument savoir ?" optional>
                <textarea
                    value={answers.finalNotes || ''}
                    onChange={(e) => updateAnswer('finalNotes', e.target.value)}
                    placeholder="Ex: Je fais tout ce que je peux. Je paye des soins que je peux pas vraiment me permettre. J'ai juste besoin qu'on m'aide un peu plus..."
                    className="modal-input"
                    rows={5}
                    style={{ resize: 'vertical' }}
                />
            </FormField>

            <div className="completion-card">
                <p style={{ fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={20} style={{ color: 'var(--success)' }} /> Vous avez terminé le questionnaire !
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    En cliquant sur "Terminer", vos réponses seront sauvegardées et nous générerons votre Synthèse Allié personnalisée.
                </p>
            </div>
        </div>
    </div>
);

// Helper Components
const FormField = ({ label, children, required, optional }: any) => (
    <div className="question-group">
        <label className="question-label">
            {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
            {optional && <span className="optional-text">(optionnel)</span>}
        </label>
        {children}
    </div>
);

const RadioGroup = ({ options, selected, onChange }: any) => (
    <div className="radio-group-container">
        {options.map((option: any) => (
            <label
                key={option.value.toString()}
                className={`radio-tile ${selected === option.value ? 'selected' : ''}`}
            >
                <input
                    type="radio"
                    name={option.label}
                    value={option.value}
                    checked={selected === option.value}
                    onChange={() => onChange(option.value)}
                    className="hidden-radio"
                />
                <span className="radio-content">{option.label}</span>
            </label>
        ))}
    </div>
);

const CheckboxGroup = ({ options, selected, onToggle }: any) => (
    <div className="checkbox-group-container">
        {options.map((option: any) => (
            <label
                key={option.value}
                className={`checkbox-tile ${selected.includes(option.value) ? 'selected' : ''}`}
            >
                <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => onToggle(option.value)}
                    className="hidden-checkbox"
                />
                <span className="checkbox-content">{option.label}</span>
            </label>
        ))}
    </div>
);
