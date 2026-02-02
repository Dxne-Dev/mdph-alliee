import { CheckCircle } from 'lucide-react';

interface PackProps {
    onCtaClick?: () => void;
}

export const Pack: React.FC<PackProps> = ({ onCtaClick }) => {
    return (
        <section className="section-pack">
            <div className="container">
                <div className="pack-wrapper">
                    <div className="pack-image">
                        <div className="doc-stack">
                            <div className="doc doc-1">CERFA</div>
                            <div className="doc doc-2">PROJET DE VIE</div>
                            <div className="doc doc-3">PJ & BONUS</div>
                        </div>
                    </div>
                    <div className="pack-content">
                        <h2>Ce que vous recevez (Le Pack)</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Votre dossier complet, structuré et prêt à déposer.</p>
                        <ul className="benefit-list">
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Projet de Vie structuré</strong>
                                    <p>Version renouvellement ou première demande, optimisée pour le référentiel CNSA.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Formulaire Cerfa pré-rempli</strong>
                                    <p>Toutes les cases complexes cochées pour vous, sans erreur de saisie.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Checklist "Pièces à joindre"</strong>
                                    <p>Liste intelligente incluant les documents qui arrivent à expiration.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Bonus : Fiche Liaison École</strong>
                                    <p>Un document structuré pour aider l'enseignant à décrire le quotidien scolaire.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="first-demand-card" style={{
                    marginTop: '80px',
                    padding: '40px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center'
                }}>
                    <h3>C'est votre premier dossier ?</h3>
                    <p style={{ maxWidth: '600px', margin: '15px auto 30px', color: 'var(--text-muted)' }}>
                        Pas de panique. L'outil vous guide de A à Z. Vous répondez au questionnaire, on traduit, vous déposez.
                    </p>
                    <button className="btn-sm" onClick={onCtaClick} style={{ padding: '12px 24px', fontSize: '1rem' }}>
                        Commencer ma première demande
                    </button>
                </div>
            </div>
        </section>
    );
};
