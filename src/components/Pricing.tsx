import React from 'react';
import { Lock, FileText, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { type ModalMode } from './Modal';

interface PricingProps {
    onCtaClick: (mode: ModalMode) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onCtaClick }) => {
    return (
        <section id="pricing" className="section-pricing">
            <div className="container">
                <div className="section-header text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="section-title">Choisissez votre accès</h2>
                    <p className="section-lead">Choisissez l'option qui vous convient le mieux pour sécuriser votre futur dossier.</p>
                </div>

                <div className="pricing-grid">
                    {/* Option A - Payante */}
                    <div className="pricing-card recommended">
                        <div className="ribbon">Signal Fort &middot; Recommandé</div>
                        <h3 className="card-tag">Option A : Tarif Fondateur</h3>
                        <div className="price">
                            <span className="currency">€</span>9<span className="period"> (Réservation)</span>
                        </div>
                        <p className="price-sub">
                            Accès Bêta &middot; Remboursable à tout moment<br />
                            <strong>+ 20€ au lancement (Total 29€)</strong>
                        </p>

                        <hr className="divider" />

                        <ul className="pricing-features">
                            <li><Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Accès prioritaire à l'outil</li>
                            <li><FileText size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Dossiers illimités (Pack complet)</li>
                            <li><ShieldCheck size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Checklist anti-rejet</li>
                            <li><Sparkles size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Support prioritaire mail</li>
                        </ul>

                        <button className="btn-primary" onClick={() => onCtaClick('founder')}>
                            Je réserve (9€ remboursables)
                        </button>
                    </div>

                    {/* Option B - Gratuite */}
                    <div className="pricing-card secondary">
                        <h3 className="card-tag">Option B : Liste d'attente</h3>
                        <div className="price">
                            <span className="currency">€</span>0
                        </div>
                        <p className="price-sub">Soyer prévenu(e) au lancement public</p>

                        <hr className="divider" />

                        <ul className="pricing-features">
                            <li><Send size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Notifications par email</li>
                            <li><Sparkles size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Accès au tarif public (59€)</li>
                            <li><Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Sans priorité d'accès</li>
                        </ul>

                        <div style={{ marginTop: 'auto' }}>
                            <button className="btn-secondary" onClick={() => onCtaClick('waitlist')}>
                                Je rejoins la liste d’attente (gratuit)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pricing-explanation">
                    <p className="micro-text">
                        <strong>Pourquoi une bêta payante ?</strong> Parce que je veux construire avec des familles qui en ont vraiment besoin — et mesurer si ça vaut le coup de le produire jusqu'au bout.
                    </p>
                </div>
            </div>
        </section>
    );
};
