import React from 'react';
import { Lock, FileText, ShieldCheck, Sparkles, Send, Repeat } from 'lucide-react';
import { type ModalMode } from './Modal';

interface PricingProps {
    onCtaClick: (mode: ModalMode) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onCtaClick }) => {
    return (
        <section id="pricing" className="section-pricing">
            <div className="container">
                <div className="section-header text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="section-title">Payez une fois. Renouvelez à vie.</h2>
                    <p className="section-lead">L'investissement le plus rentable pour la tranquillité administrative de votre famille.</p>
                </div>

                <div className="pricing-grid">
                    {/* Option Comparison - Left (Public Scribe) */}
                    <div className="pricing-card secondary" style={{ opacity: 0.8 }}>
                        <h3 className="card-tag">Accompagnement Classique</h3>
                        <div className="price">
                            <span className="currency">€</span>150
                        </div>
                        <p className="price-sub">Tarif moyen par dossier</p>

                        <hr className="divider" />

                        <ul className="pricing-features">
                            <li><FileText size={16} /> Payé à chaque dépôt</li>
                            <li><Lock size={16} /> Pas de mémoire du dossier</li>
                            <li><Repeat size={16} /> Tout refaire l'an prochain</li>
                        </ul>

                        <div style={{ marginTop: 'auto' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coût total sur 3 ans : ~450€</p>
                        </div>
                    </div>

                    {/* Option A - L'Allié (Winner) */}
                    <div className="pricing-card recommended">
                        <div className="ribbon">Accès Illimité</div>
                        <h3 className="card-tag">Option A : L'Allié MDPH</h3>
                        <div className="price">
                            <span className="currency">€</span>29
                        </div>
                        <p className="price-sub">
                            Paiement unique &middot; Vie illimitée<br />
                            <strong>Inclut tous les renouvellements futurs</strong>
                        </p>

                        <hr className="divider" />

                        <ul className="pricing-features">
                            <li><ShieldCheck size={16} /> Mémoire du dossier conservée</li>
                            <li><Repeat size={16} /> Renouvellements en 2 clics</li>
                            <li><Sparkles size={16} /> Toutes les mises à jour incl.</li>
                            <li><Lock size={16} /> Coffre-fort numérique sécurisé</li>
                        </ul>

                        <button className="btn-primary" onClick={() => onCtaClick('founder')}>
                            Je m'inscris (29€ à vie)
                        </button>
                    </div>

                    {/* Option B - Gratuite */}
                    <div className="pricing-card secondary">
                        <h3 className="card-tag">Option B : Liste d'attente</h3>
                        <div className="price">
                            <span className="currency">€</span>0
                        </div>
                        <p className="price-sub">Soyez prévenu(e) au lancement</p>

                        <hr className="divider" />

                        <ul className="pricing-features">
                            <li><Send size={16} /> Notifications par email</li>
                            <li><Sparkles size={16} /> Accès au tarif public (59€)</li>
                            <li><Lock size={16} /> Sans priorité d'accès</li>
                        </ul>

                        <div style={{ marginTop: 'auto' }}>
                            <button className="btn-secondary" onClick={() => onCtaClick('waitlist')}>
                                Rejoindre la liste
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pricing-explanation">
                    <p className="micro-text" style={{ fontSize: '1rem' }}>
                        Votre accès inclut toutes les mises à jour futures et les renouvellements pour votre enfant.
                        <strong> C'est le dernier outil que vous achèterez pour votre dossier MDPH.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};
