import React, { useState, type FormEvent } from 'react';

interface FooterProps {
    onWaitlistSubmit: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onWaitlistSubmit }) => {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onWaitlistSubmit(email);
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-form-container">
                    <h4>Pas encore prêt(e) ? Rejoignez la liste d'attente.</h4>
                    <p>Recevez nos conseils et soyez prévenu(e) de l'ouverture publique (Tarif standard 59€).</p>
                    <form className="footer-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="footer-consent"
                                required
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                            />
                            <label htmlFor="footer-consent">Je comprends que l'outil n'est pas un service public et ne garantit pas la décision MDPH.</label>
                        </div>
                        <button type="submit" className="btn-sm">Me prévenir (Gratuit)</button>
                    </form>
                </div>

                <hr className="footer-divider" />

                <p className="copyright">&copy; 2026 L'Allié MDPH. Tous droits réservés.</p>
                <p className="disclaimer">
                    L'Allié MDPH est un outil d'assistance rédactionnelle. Il ne dispense pas de conseils juridiques ou médicaux.
                    Les taux d'incapacité et les attributions d'aides restent à la discrétion exclusive des CDAPH. Non affilié à la MDPH.
                </p>
            </div>
        </footer>
    );
};
