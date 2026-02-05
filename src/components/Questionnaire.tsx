import { useState } from 'react';
import {
    ChevronRight, ChevronLeft, Check, User, Target, Brain,
    MessageCircle, GraduationCap, Stethoscope, Home, FileText,
    Heart, CheckCircle
} from 'lucide-react';

interface QuestionnaireProps {
    onComplete: (answers: QuestionnaireAnswers) => void;
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

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, initialData }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>(initialData || {});

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
        <div className="questionnaire-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                                    gap: '6px',
                                    opacity: isActive ? 1 : 0.4,
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isCurrent ? '#2563eb' : isActive ? '#dbeafe' : '#f1f5f9',
                                    color: isCurrent ? 'white' : isActive ? '#2563eb' : '#94a3b8',
                                    transition: 'all 0.3s',
                                    boxShadow: isCurrent ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                                }}>
                                    <StepIcon size={20} />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: isCurrent ? '600' : '500',
                                    color: isCurrent ? '#2563eb' : '#64748b',
                                    display: 'none'
                                }}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div style={{
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}% `,
                        background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                        transition: 'width 0.4s ease',
                        borderRadius: '999px'
                    }} />
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                    Étape {currentStep} sur 8 — <span style={{ color: '#0f172a', fontWeight: '600' }}>{STEPS[currentStep - 1].title}</span>
                </div>
            </div>

            {/* Section Content */}
            <div className="question-section" style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                minHeight: '500px'
            }}>
                {currentStep === 1 && <Section1Situation answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 2 && <Section2Autonomie answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 3 && <Section3Comportement answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 4 && <Section4Communication answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 5 && <Section5Scolarite answers={answers} updateAnswer={updateAnswer} toggleMultiSelect={toggleMultiSelect} />}
                {currentStep === 6 && <Section6Soins answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 7 && <Section7Famille answers={answers} updateAnswer={updateAnswer} />}
                {currentStep === 8 && <Section8Demande answers={answers} updateAnswer={updateAnswer} toggleMultiSelect={toggleMultiSelect} />}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ChevronLeft size={20} />
                    Précédent
                </button>
                <button
                    onClick={nextStep}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {currentStep === 8 ? (
                        <>Terminer <Check size={20} /></>
                    ) : (
                        <>Suivant <ChevronRight size={20} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

// Section Components
const Section1Situation = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><User size={28} style={{ color: '#2563eb' }} /> Situation Actuelle</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Commençons par quelques informations de base sur votre enfant.</p>

        <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Prénom de l'enfant" required>
                    <input
                        type="text"
                        value={answers.firstName || ''}
                        onChange={(e) => updateAnswer('firstName', e.target.value)}
                        placeholder="Timéo"
                        className="input-field"
                    />
                </FormField>
                <FormField label="Nom de famille" required>
                    <input
                        type="text"
                        value={answers.lastName || ''}
                        onChange={(e) => updateAnswer('lastName', e.target.value)}
                        placeholder="Martin"
                        className="input-field"
                    />
                </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Date de naissance" required>
                    <input
                        type="date"
                        value={answers.birthDate || ''}
                        onChange={(e) => updateAnswer('birthDate', e.target.value)}
                        className="input-field"
                    />
                </FormField>
                <FormField label="Classe actuelle">
                    <select
                        value={answers.currentGrade || ''}
                        onChange={(e) => updateAnswer('currentGrade', e.target.value)}
                        className="input-field"
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
                    name="schoolType"
                    options={[
                        { value: 'publique', label: 'École publique' },
                        { value: 'privée', label: 'École privée' },
                        { value: 'spécialisée', label: 'Établissement spécialisé' }
                    ]}
                    selected={answers.schoolType}
                    onChange={(value: any) => updateAnswer('schoolType', value)}
                />
            </FormField>

            <FormField label="Diagnostic principal" required>
                <input
                    type="text"
                    value={answers.diagnosis || ''}
                    onChange={(e) => updateAnswer('diagnosis', e.target.value)}
                    placeholder="Ex: TSA, TDAH, Trisomie 21..."
                    className="input-field"
                />
            </FormField>

            <FormField label="Date du diagnostic">
                <input
                    type="month"
                    value={answers.diagnosisDate || ''}
                    onChange={(e) => updateAnswer('diagnosisDate', e.target.value)}
                    className="input-field"
                />
            </FormField>

            <FormField label="Type de demande">
                <RadioGroup
                    name="isRenewal"
                    options={[
                        { value: true, label: 'Renouvellement' },
                        { value: false, label: 'Première demande' }
                    ]}
                    selected={answers.isRenewal}
                    onChange={(value: any) => updateAnswer('isRenewal', value)}
                />
            </FormField>

            <FormField label="Votre enfant a-t-il un AESH actuellement ?">
                <RadioGroup
                    name="hasAesh"
                    options={[
                        { value: true, label: 'Oui' },
                        { value: false, label: 'Non' }
                    ]}
                    selected={answers.hasAesh}
                    onChange={(value: any) => updateAnswer('hasAesh', value)}
                />
            </FormField>

            {answers.hasAesh && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingLeft: '24px' }}>
                    <FormField label="Nombre d'heures par semaine">
                        <input
                            type="text"
                            value={answers.aeshHours || ''}
                            onChange={(e) => updateAnswer('aeshHours', e.target.value)}
                            placeholder="12h"
                            className="input-field"
                        />
                    </FormField>
                    <FormField label="Type d'AESH">
                        <RadioGroup
                            name="aeshType"
                            options={[
                                { value: 'individuel', label: 'Individuel' },
                                { value: 'mutualisé', label: 'Mutualisé' }
                            ]}
                            selected={answers.aeshType}
                            onChange={(value: any) => updateAnswer('aeshType', value)}
                        />
                    </FormField>
                </div>
            )}
        </div>
    </div>
);

const Section2Autonomie = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><Target size={28} style={{ color: '#2563eb' }} /> Autonomie au Quotidien</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Comment votre enfant se débrouille-t-il pour les actes de la vie quotidienne ?</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <FormField label="S'habille seul le matin ?">
                <RadioGroup
                    name="dressing"
                    options={[
                        { value: 'seul', label: 'Oui, seul' },
                        { value: 'aide_partielle', label: 'Avec aide partielle' },
                        { value: 'aide_complete', label: 'Non, aide complète nécessaire' }
                    ]}
                    selected={answers.dressing}
                    onChange={(value: any) => updateAnswer('dressing', value)}
                />
            </FormField>

            <FormField label="Se lave seul ?">
                <RadioGroup
                    name="bathing"
                    options={[
                        { value: 'seul', label: 'Oui, seul' },
                        { value: 'aide_partielle', label: 'Avec supervision' },
                        { value: 'aide_complete', label: 'Non, aide complète nécessaire' }
                    ]}
                    selected={answers.bathing}
                    onChange={(value: any) => updateAnswer('bathing', value)}
                />
            </FormField>

            <FormField label="Va aux toilettes seul ?">
                <RadioGroup
                    name="toileting"
                    options={[
                        { value: 'seul', label: 'Oui, complètement autonome' },
                        { value: 'rappels', label: 'Oui, mais besoin de rappels fréquents' },
                        { value: 'aide_complete', label: 'Non, aide nécessaire' }
                    ]}
                    selected={answers.toileting}
                    onChange={(value: any) => updateAnswer('toileting', value)}
                />
            </FormField>

            <FormField label="Mange seul ?">
                <RadioGroup
                    name="eating"
                    options={[
                        { value: 'seul', label: 'Oui, sans difficulté' },
                        { value: 'selectivite', label: 'Oui, mais sélectivité alimentaire / textures limitées' },
                        { value: 'aide_complete', label: 'Non, aide nécessaire' }
                    ]}
                    selected={answers.eating}
                    onChange={(value: any) => updateAnswer('eating', value)}
                />
            </FormField>

            <FormField label="Peut rester seul à la maison ?">
                <RadioGroup
                    name="canStayAlone"
                    options={[
                        { value: true, label: 'Oui' },
                        { value: false, label: 'Non, surveillance constante nécessaire' }
                    ]}
                    selected={answers.canStayAlone}
                    onChange={(value: any) => updateAnswer('canStayAlone', value)}
                />
            </FormField>

            <FormField label="Y a-t-il autre chose sur l'autonomie que vous voulez mentionner ?" optional>
                <textarea
                    value={answers.autonomyNotes || ''}
                    onChange={(e) => updateAnswer('autonomyNotes', e.target.value)}
                    placeholder="Ex: Il ne sait pas lacer ses chaussures, je dois choisir ses vêtements sinon il met la même chose 5 jours de suite..."
                    className="input-field"
                    rows={4}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section3Comportement = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><Brain size={28} style={{ color: '#2563eb' }} /> Comportement</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Parlons des aspects comportementaux et émotionnels.</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <FormField label="Votre enfant fait-il des crises lors de changements de programme ou de routine ?">
                <RadioGroup
                    name="hasCrises"
                    options={[
                        { value: true, label: 'Oui' },
                        { value: false, label: 'Non' }
                    ]}
                    selected={answers.hasCrises}
                    onChange={(value: any) => updateAnswer('hasCrises', value)}
                />
            </FormField>

            {answers.hasCrises && (
                <>
                    <FormField label="À quelle fréquence ?">
                        <RadioGroup
                            name="crisisFrequency"
                            options={[
                                { value: 'quotidiennes', label: 'Tous les jours ou presque' },
                                { value: 'hebdomadaires', label: 'Plusieurs fois par semaine' },
                                { value: 'mensuelles', label: 'Quelques fois par mois' }
                            ]}
                            selected={answers.crisisFrequency}
                            onChange={(value: any) => updateAnswer('crisisFrequency', value)}
                        />
                    </FormField>

                    <FormField label="Durée moyenne d'une crise ?">
                        <RadioGroup
                            name="crisisDuration"
                            options={[
                                { value: '0-15min', label: 'Moins de 15 minutes' },
                                { value: '15-30min', label: '15 à 30 minutes' },
                                { value: '30-60min', label: '30 à 60 minutes' },
                                { value: 'plus_1h', label: 'Plus d\'1 heure' }
                            ]}
                            selected={answers.crisisDuration}
                            onChange={(value: any) => updateAnswer('crisisDuration', value)}
                        />
                    </FormField>
                </>
            )}

            <FormField label="Gestion des émotions ?">
                <RadioGroup
                    name="emotionRegulation"
                    options={[
                        { value: 'bonne', label: 'Bonne' },
                        { value: 'moyenne', label: 'Moyenne' },
                        { value: 'difficile', label: 'Difficile' },
                        { value: 'tres_difficile', label: 'Très difficile' }
                    ]}
                    selected={answers.emotionRegulation}
                    onChange={(value: any) => updateAnswer('emotionRegulation', value)}
                />
            </FormField>

            <FormField label="Rigidités / Routines fortes ?">
                <RadioGroup
                    name="hasRigidities"
                    options={[
                        { value: true, label: 'Oui, quotidiennes' },
                        { value: false, label: 'Non ou occasionnelles' }
                    ]}
                    selected={answers.hasRigidities}
                    onChange={(value: any) => updateAnswer('hasRigidities', value)}
                />
            </FormField>

            <FormField label="Pouvez-vous décrire une situation typique de crise ?" optional>
                <textarea
                    value={answers.behaviorExample || ''}
                    onChange={(e) => updateAnswer('behaviorExample', e.target.value)}
                    placeholder="Ex: La semaine dernière on a dû changer de route pour aller à l'école à cause de travaux. Il a hurlé 40 minutes dans la voiture..."
                    className="input-field"
                    rows={4}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section4Communication = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><MessageCircle size={28} style={{ color: '#2563eb' }} /> Communication</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Comment votre enfant communique-t-il et interagit-il avec les autres ?</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <FormField label="Expression orale ?">
                <RadioGroup
                    name="oralExpression"
                    options={[
                        { value: 'fluide', label: 'Fluide et variée' },
                        { value: 'phrases_simples', label: 'Phrases simples, vocabulaire limité' },
                        { value: 'mots_isoles', label: 'Mots isolés uniquement' },
                        { value: 'non_verbal', label: 'Non verbal' }
                    ]}
                    selected={answers.oralExpression}
                    onChange={(value: any) => updateAnswer('oralExpression', value)}
                />
            </FormField>

            <FormField label="Compréhension des consignes ?">
                <RadioGroup
                    name="comprehension"
                    options={[
                        { value: 'bonne', label: 'Bonne compréhension' },
                        { value: 'reformulation', label: 'Difficile, besoin de reformulation' },
                        { value: 'difficile', label: 'Très difficile' }
                    ]}
                    selected={answers.comprehension}
                    onChange={(value: any) => updateAnswer('comprehension', value)}
                />
            </FormField>

            <FormField label="Interactions avec les autres enfants ?">
                <RadioGroup
                    name="peerInteractions"
                    options={[
                        { value: 'aisees', label: 'Aisées, a des amis' },
                        { value: 'limitees', label: 'Limitées' },
                        { value: 'tres_limitees', label: 'Très limitées' },
                        { value: 'absentes', label: 'Absentes' }
                    ]}
                    selected={answers.peerInteractions}
                    onChange={(value: any) => updateAnswer('peerInteractions', value)}
                />
            </FormField>

            <FormField label="Contact visuel ?">
                <RadioGroup
                    name="eyeContact"
                    options={[
                        { value: 'present', label: 'Présent' },
                        { value: 'variable', label: 'Variable' },
                        { value: 'fuyant', label: 'Fuyant' }
                    ]}
                    selected={answers.eyeContact}
                    onChange={(value: any) => updateAnswer('eyeContact', value)}
                />
            </FormField>
        </div>
    </div>
);

const Section5Scolarite = ({ answers, updateAnswer, toggleMultiSelect }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><GraduationCap size={28} style={{ color: '#2563eb' }} /> Scolarité</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Parlons de la vie scolaire de votre enfant.</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <FormField label="Principales difficultés en classe ? (plusieurs choix possibles)">
                <CheckboxGroup
                    options={[
                        { value: 'concentration', label: 'Concentration / Attention' },
                        { value: 'bruit', label: 'Hypersensibilité au bruit' },
                        { value: 'consignes', label: 'Compréhension des consignes' },
                        { value: 'interactions', label: 'Interactions sociales' },
                        { value: 'ecriture', label: 'Écriture / Graphisme' },
                        { value: 'lecture', label: 'Lecture' }
                    ]}
                    selected={answers.schoolDifficulties || []}
                    onToggle={(value: any) => toggleMultiSelect('schoolDifficulties', value)}
                />
            </FormField>

            <FormField label="Aménagements déjà en place ? (plusieurs choix possibles)">
                <CheckboxGroup
                    options={[
                        { value: 'tiers_temps', label: 'Tiers-temps aux évaluations' },
                        { value: 'place_isolee', label: 'Place isolée / au fond' },
                        { value: 'supports_adaptes', label: 'Supports pédagogiques adaptés' },
                        { value: 'pause', label: 'Possibilité de faire des pauses' },
                        { value: 'aucun', label: 'Aucun pour le moment' }
                    ]}
                    selected={answers.currentAccommodations || []}
                    onToggle={(value: any) => toggleMultiSelect('currentAccommodations', value)}
                />
            </FormField>

            <FormField label="L'accompagnement AESH actuel est-il suffisant ?">
                <RadioGroup
                    name="aeshSufficient"
                    options={[
                        { value: true, label: 'Oui, adapté' },
                        { value: false, label: 'Non, insuffisant' }
                    ]}
                    selected={answers.aeshSufficient}
                    onChange={(value: any) => updateAnswer('aeshSufficient', value)}
                />
            </FormField>

            <FormField label="Que souhaitez-vous demander ?">
                <CheckboxGroup
                    options={[
                        { value: 'plus_heures_aesh', label: 'Plus d\'heures AESH' },
                        { value: 'aesh_individuel', label: 'Passage à un AESH individuel' },
                        { value: 'amenagements_sup', label: 'Aménagements pédagogiques supplémentaires' },
                        { value: 'materiel', label: 'Matériel pédagogique adapté' }
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
                    className="input-field"
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
        <div>
            <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><Stethoscope size={28} style={{ color: '#2563eb' }} /> Soins et Thérapies</h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Quels sont les professionnels qui accompagnent votre enfant ?</p>

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* Orthophoniste */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <FormField label="Orthophoniste">
                        <RadioGroup
                            name="orthophonist"
                            options={[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]}
                            selected={answers.orthophonist}
                            onChange={(value: any) => updateAnswer('orthophonist', value)}
                        />
                    </FormField>
                    {answers.orthophonist && (
                        <div style={{ marginTop: '16px' }}>
                            <FormField label="Fréquence">
                                <input
                                    type="text"
                                    value={answers.orthophonistFreq || ''}
                                    onChange={(e) => updateAnswer('orthophonistFreq', e.target.value)}
                                    placeholder="Ex: 2x/semaine"
                                    className="input-field"
                                />
                            </FormField>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Heart size={14} style={{ color: '#10b981' }} /> Généralement remboursé par la Sécurité Sociale
                            </p>
                        </div>
                    )}
                </div>

                {/* Psychomotricien */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <FormField label="Psychomotricien">
                        <RadioGroup
                            name="psychomotrician"
                            options={[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]}
                            selected={answers.psychomotrician}
                            onChange={(value: any) => updateAnswer('psychomotrician', value)}
                        />
                    </FormField>
                    {answers.psychomotrician && (
                        <div style={{ marginTop: '16px' }}>
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.psychomotricianCost || ''}
                                    onChange={(e) => updateAnswer('psychomotricianCost', e.target.value)}
                                    placeholder="180"
                                    className="input-field"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Psychologue */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <FormField label="Psychologue">
                        <RadioGroup
                            name="psychologist"
                            options={[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]}
                            selected={answers.psychologist}
                            onChange={(value: any) => updateAnswer('psychologist', value)}
                        />
                    </FormField>
                    {answers.psychologist && (
                        <div style={{ marginTop: '16px' }}>
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.psychologistCost || ''}
                                    onChange={(e) => updateAnswer('psychologistCost', e.target.value)}
                                    placeholder="100"
                                    className="input-field"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Ergothérapeute */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <FormField label="Ergothérapeute">
                        <RadioGroup
                            name="ergotherapist"
                            options={[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]}
                            selected={answers.ergotherapist}
                            onChange={(value: any) => updateAnswer('ergotherapist', value)}
                        />
                    </FormField>
                    {answers.ergotherapist && (
                        <div style={{ marginTop: '16px' }}>
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.ergotherapistCost || ''}
                                    onChange={(e) => updateAnswer('ergotherapistCost', e.target.value)}
                                    placeholder="60"
                                    className="input-field"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Éducateur spécialisé */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <FormField label="Éducateur spécialisé">
                        <RadioGroup
                            name="specializedEducator"
                            options={[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]}
                            selected={answers.specializedEducator}
                            onChange={(value: any) => updateAnswer('specializedEducator', value)}
                        />
                    </FormField>
                    {answers.specializedEducator && (
                        <div style={{ marginTop: '16px' }}>
                            <FormField label="Coût mensuel (€)">
                                <input
                                    type="number"
                                    value={answers.educatorCost || ''}
                                    onChange={(e) => updateAnswer('educatorCost', e.target.value)}
                                    placeholder="150"
                                    className="input-field"
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                {/* Total */}
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: '12px',
                    border: '2px solid #2563eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Reste à charge mensuel total :</span>
                        <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#1d4ed8' }}>
                            {calculateTotalCost()}€
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section7Famille = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><Home size={28} style={{ color: '#2563eb' }} /> Retentissement Familial</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Comment le handicap impacte-t-il votre vie quotidienne et celle de votre famille ?</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <FormField label="Comment dort votre enfant ?">
                <RadioGroup
                    name="childSleep"
                    options={[
                        { value: 'bon', label: 'Bon sommeil' },
                        { value: 'reveils_occasionnels', label: 'Réveils occasionnels' },
                        { value: 'reveils_frequents', label: 'Réveils fréquents' },
                        { value: 'tres_perturbe', label: 'Très perturbé' }
                    ]}
                    selected={answers.childSleep}
                    onChange={(value: any) => updateAnswer('childSleep', value)}
                />
            </FormField>

            <FormField label="Et vous, comment dormez-vous ?">
                <RadioGroup
                    name="parentSleep"
                    options={[
                        { value: 'plus_7h', label: 'Plus de 7h par nuit' },
                        { value: '5-7h', label: '5 à 7h par nuit' },
                        { value: 'moins_5h', label: 'Moins de 5h par nuit' },
                        { value: 'moins_3h', label: 'Moins de 3h par nuit' }
                    ]}
                    selected={answers.parentSleep}
                    onChange={(value: any) => updateAnswer('parentSleep', value)}
                />
            </FormField>

            <FormField label="Impact sur votre travail ?">
                <RadioGroup
                    name="workImpact"
                    options={[
                        { value: 'aucun', label: 'Aucun impact' },
                        { value: 'amenagements', label: 'Aménagements horaires' },
                        { value: 'temps_partiel', label: 'Temps partiel subi' },
                        { value: 'arret', label: 'Arrêt de travail' }
                    ]}
                    selected={answers.workImpact}
                    onChange={(value: any) => updateAnswer('workImpact', value)}
                />
            </FormField>

            <FormField label="Impact sur la fratrie ?">
                <RadioGroup
                    name="siblingImpact"
                    options={[
                        { value: 'aucun', label: 'Aucun / Pas de fratrie' },
                        { value: 'leger', label: 'Léger' },
                        { value: 'tensions', label: 'Tensions fréquentes' },
                        { value: 'important', label: 'Impact important' }
                    ]}
                    selected={answers.siblingImpact}
                    onChange={(value: any) => updateAnswer('siblingImpact', value)}
                />
            </FormField>

            <FormField label="Vie sociale de la famille ?">
                <RadioGroup
                    name="socialLife"
                    options={[
                        { value: 'normale', label: 'Normale' },
                        { value: 'reduite', label: 'Réduite' },
                        { value: 'tres_limitee', label: 'Très limitée' },
                        { value: 'inexistante', label: 'Quasi inexistante' }
                    ]}
                    selected={answers.socialLife}
                    onChange={(value: any) => updateAnswer('socialLife', value)}
                />
            </FormField>

            <FormField label="Comment décririez-vous l'impact sur votre vie quotidienne ?" optional>
                <textarea
                    value={answers.familyImpact || ''}
                    onChange={(e) => updateAnswer('familyImpact', e.target.value)}
                    placeholder="Ex: Je suis à 80% au travail parce que je dois gérer les rdv. J'ai plus de vie sociale. Ma fille de 12 ans dit que je m'occupe que de Timéo..."
                    className="input-field"
                    rows={5}
                    style={{ resize: 'vertical' }}
                />
            </FormField>
        </div>
    </div>
);

const Section8Demande = ({ answers, updateAnswer }: any) => (
    <div>
        <h2 style={{ marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}><FileText size={28} style={{ color: '#2563eb' }} /> Votre Demande</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Que souhaitez-vous demander à la MDPH ?</p>

        <div style={{ display: 'grid', gap: '28px' }}>
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <FormField label="Demandez-vous l'AEEH (Allocation d'Éducation de l'Enfant Handicapé) ?">
                    <RadioGroup
                        name="requestAeeh"
                        options={[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]}
                        selected={answers.requestAeeh}
                        onChange={(value: any) => updateAnswer('requestAeeh', value)}
                    />
                </FormField>

                {answers.requestAeeh && (
                    <div style={{ marginTop: '20px' }}>
                        <FormField label="Quel complément souhaitez-vous ?">
                            <select
                                value={answers.aeehComplement || ''}
                                onChange={(e) => updateAnswer('aeehComplement', e.target.value)}
                                className="input-field"
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

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <FormField label="Demandez-vous la PCH (Prestation de Compensation du Handicap) ?">
                    <RadioGroup
                        name="requestPch"
                        options={[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]}
                        selected={answers.requestPch}
                        onChange={(value: any) => updateAnswer('requestPch', value)}
                    />
                </FormField>
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <FormField label="Demandez-vous plus d'heures d'AESH ?">
                    <RadioGroup
                        name="requestMoreAesh"
                        options={[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]}
                        selected={answers.requestMoreAesh}
                        onChange={(value: any) => updateAnswer('requestMoreAesh', value)}
                    />
                </FormField>

                {answers.requestMoreAesh && (
                    <div style={{ marginTop: '20px' }}>
                        <FormField label="Type d'accompagnement souhaité">
                            <RadioGroup
                                name="requestedAeshType"
                                options={[
                                    { value: 'plus_heures', label: 'Augmentation du nombre d\'heures' },
                                    { value: 'individuel', label: 'Passage à un AESH individuel (ou les deux)' }
                                ]}
                                selected={answers.requestedAeshType}
                                onChange={(value: any) => updateAnswer('requestedAeshType', value)}
                            />
                        </FormField>
                    </div>
                )}
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <FormField label="Demandez-vous du matériel pédagogique adapté ?">
                    <RadioGroup
                        name="requestEquipment"
                        options={[
                            { value: true, label: 'Oui (ordinateur, tablette, logiciels...)' },
                            { value: false, label: 'Non' }
                        ]}
                        selected={answers.requestEquipment}
                        onChange={(value: any) => updateAnswer('requestEquipment', value)}
                    />
                </FormField>
            </div>

            <FormField label="Y a-t-il autre chose que la MDPH doit absolument savoir ?" optional>
                <textarea
                    value={answers.finalNotes || ''}
                    onChange={(e) => updateAnswer('finalNotes', e.target.value)}
                    placeholder="Ex: Je fais tout ce que je peux. Je paye des soins que je peux pas vraiment me permettre. J'ai juste besoin qu'on m'aide un peu plus..."
                    className="input-field"
                    rows={5}
                    style={{ resize: 'vertical' }}
                />
            </FormField>

            <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                marginTop: '20px'
            }}>
                <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} /> Vous avez terminé le questionnaire !
                </p>
                <p style={{ fontSize: '14px', color: '#475569' }}>
                    En cliquant sur "Terminer", vos réponses seront sauvegardées et nous générerons votre Synthèse Allié personnalisée.
                </p>
            </div>
        </div>
    </div>
);

// Helper Components
const FormField = ({ label, required, optional, children }: any) => (
    <div>
        <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#0f172a',
            fontSize: '14px'
        }}>
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
            {optional && <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '12px', fontWeight: 'normal' }}>(optionnel)</span>}
        </label>
        {children}
    </div>
);

const RadioGroup = ({ name, options, selected, onChange }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option: any) => (
            <label
                key={option.value}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${selected === option.value ? '#2563eb' : '#e2e8f0'} `,
                    background: selected === option.value ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={selected === option.value}
                    onChange={() => onChange(option.value)}
                    style={{ marginRight: '12px', accentColor: '#2563eb', width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', color: '#1e293b' }}>{option.label}</span>
            </label>
        ))}
    </div>
);

const CheckboxGroup = ({ options, selected, onToggle }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option: any) => (
            <label
                key={option.value}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${selected.includes(option.value) ? '#2563eb' : '#e2e8f0'} `,
                    background: selected.includes(option.value) ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => onToggle(option.value)}
                    style={{ marginRight: '12px', accentColor: '#2563eb', width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', color: '#1e293b' }}>{option.label}</span>
            </label>
        ))}
    </div>
);
