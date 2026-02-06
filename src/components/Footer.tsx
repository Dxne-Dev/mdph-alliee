import React, { useState, type FormEvent } from 'react';
import { Mail, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <footer className="footer" style={{ padding: '100px 0 60px', background: 'var(--primary)', color: 'white' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', marginBottom: '80px' }}>
                    <div>
                        <div className="logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '24px' }}>L'Allié <span className="highlight">MDPH</span></div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '32px', maxWidth: '450px' }}>
                            La mission de l'Allié est de redonner de l'air aux parents d'enfants extraordinaires, en simplifiant la charge mentale administrative.
                        </p>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <ShieldCheck size={18} /> Hébergement sécurisé
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <Heart size={18} /> Fait pour les parents
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Restez informé(e)</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Inscrivez-vous pour recevoir nos guides et être prévenu du lancement.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    required
                                    style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    id="footer-consent"
                                    required
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    style={{ marginTop: '4px' }}
                                />
                                <label htmlFor="footer-consent" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                                    J'accepte de recevoir des nouvelles de l'Allié MDPH.
                                </label>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                Me prévenir
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>&copy; 2026 L'Allié MDPH. Tous droits réservés.</p>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <Link to="/mentions-legales" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Mentions Légales</Link>
                        <Link to="/confidentialite" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
