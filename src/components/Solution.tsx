import { BrainCircuit, Languages, ShieldCheck } from 'lucide-react';

export const Solution = () => {
    return (
        <section className="section-solution">
            <div className="container text-center" style={{ textAlign: 'center' }}>
                <h2 className="section-title">Ce n'est pas à vous de changer.<br />C'est à votre dossier de s'adapter.</h2>
                <p className="section-lead">
                    Trois piliers pour que votre réalité de parent soit enfin comprise sans effort inutile.
                </p>
            </div>

            <div className="steps-container">
                {/* Pillar 1 */}
                <div className="step-card">
                    <div className="icon-main" style={{ marginBottom: '20px', color: 'var(--accent)' }}><BrainCircuit size={40} /></div>
                    <h3>Mémoire "Éléphant"</h3>
                    <p>Vos données restent. L'an prochain, vous actualisez seulement ce qui a changé (classe, autonomie, soins…). Fini la page blanche.</p>
                </div>

                {/* Pillar 2 */}
                <div className="step-card featured">
                    <div className="icon-main" style={{ marginBottom: '20px', color: 'white' }}><Languages size={40} /></div>
                    <h3>Traduction Expert</h3>
                    <p>Notre moteur transforme vos réponses simples en <strong>langage administratif MDPH</strong>. Nous utilisons les mots-clés qui déclenchent les aides.</p>
                </div>

                {/* Pillar 3 */}
                <div className="step-card">
                    <div className="icon-main" style={{ marginBottom: '20px', color: 'var(--accent)' }}><ShieldCheck size={40} /></div>
                    <h3>Coffre-Fort PJ</h3>
                    <p>Bilans, certificats, ordonnances : tout est centralisé. Rien ne se perd, tout est prêt pour le prochain dépôt.</p>
                </div>
            </div>
        </section>
    );
};
