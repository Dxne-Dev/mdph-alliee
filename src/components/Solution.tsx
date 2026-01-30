export const Solution = () => {
    return (
        <section className="section-solution">
            <div className="container text-center" style={{ textAlign: 'center' }}>
                <h2 className="section-title">Ce n'est pas à vous de changer.<br />C'est à votre dossier de s'adapter.</h2>
                <p className="section-lead">
                    Vous n'êtes ni avocat, ni médecin. Vous êtes un parent qui veut juste que son enfant ait sa chance.
                    <br /><strong>L'Allié MDPH</strong> est le pont entre votre vécu et leur grille d'évaluation.
                </p>
            </div>

            <div className="steps-container">
                {/* Step 1 */}
                <div className="step-card">
                    <div className="step-number">01</div>
                    <h3>Vous cochez le vécu</h3>
                    <p>Fini la page blanche. Un questionnaire simple, clinique, QCM. <em>"Sait-il lacer ses chaussures ?", "Supporte-t-il le bruit ?"</em>. Vous décrivez des faits, pas des plaidoyers.</p>
                </div>

                {/* Step 2 */}
                <div className="step-card featured">
                    <div className="step-number">02</div>
                    <h3>L'algo "traduit"</h3>
                    <p>Notre moteur transforme vos croix en arguments. Il sélectionne les <strong>mots-clés déclencheurs</strong> du référentiel CNSA. <br /><em>Votre réalité → Langage administratif irréfutable.</em></p>
                </div>

                {/* Step 3 */}
                <div className="step-card">
                    <div className="step-number">03</div>
                    <h3>Vous déposez</h3>
                    <p>Vous téléchargez un <strong>Pack Dossier PDF</strong> propre, froid, carré. Cerfa pré-rempli, Annexe "Vie Quotidienne" structurée, Checklist des pièces.</p>
                </div>
            </div>
        </section>
    );
};
