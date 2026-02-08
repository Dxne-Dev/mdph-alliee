import React from 'react';
import { Lock, FileText, Sparkles, Send, Repeat, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ModalMode } from './Modal';

interface PricingProps {
    onCtaClick: (mode: ModalMode) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onCtaClick }) => {
    return (
        <section id="pricing" className="section-pricing" style={{ padding: '120px 0', background: '#f8fafc' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>Payez une fois. <span className="text-gradient">Renouvelez à vie.</span></h2>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>L'investissement le plus rentable pour la tranquillité administrative de votre famille.</p>
                </div>

                <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', alignItems: 'center' }}>
                    {/* Option Comparison - Left */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="pricing-card"
                        style={{ padding: '40px', background: 'white', opacity: 0.7, border: '1px solid #e2e8f0' }}
                    >
                        <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Accompagnement Classique</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>150€</div>
                        <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '32px' }}>Par dossier (moyenne)</p>

                        <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '32px' }} />

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', display: 'grid', gap: '16px' }}>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '0.95rem' }}><FileText size={18} /> Payé à chaque dépôt</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '0.95rem' }}><Lock size={18} /> Pas de mémoire du dossier</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '0.95rem' }}><Repeat size={18} /> Tout refaire l'an prochain</li>
                        </ul>
                    </motion.div>

                    {/* L'Allié (Winner) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="pricing-card recommended"
                        style={{
                            padding: '60px 40px',
                            background: 'var(--primary)',
                            color: 'white',
                            transform: 'scale(1.05)',
                            boxShadow: '0 40px 80px -20px rgba(15, 23, 42, 0.3)',
                            border: '2px solid var(--accent)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--accent)', color: 'white', padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>OFFRE BÊTA</div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 800, marginBottom: '24px' }}>OPTION A : L'ALLIÉ MDPH</h3>
                        <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>29€</div>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>Paiement unique. Vie illimitée.</p>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '32px' }} />

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'grid', gap: '20px' }}>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Mémoire du dossier à vie</li>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Projet de vie automatique</li>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Coffre-fort PJ sécurisé</li>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Mises à jour gratuites</li>
                        </ul>

                        <button className="btn-primary" onClick={() => onCtaClick('founder')} style={{ width: '100%', padding: '20px' }}>
                            Réserver mon accès à 29€
                        </button>
                    </motion.div>

                    {/* Option B - Waitlist */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="pricing-card"
                        style={{ padding: '40px', background: 'white', border: '1px solid #e2e8f0' }}
                    >
                        <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Liste d'attente</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>0€</div>
                        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '32px' }}>Soyez prévenu au lancement</p>

                        <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '32px' }} />

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'grid', gap: '16px' }}>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b' }}><Send size={18} /> Notifications email</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b' }}><Sparkles size={18} /> Tarif public au lancement (59€)</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b' }}><Lock size={18} /> Sans priorité d'accès</li>
                        </ul>

                        <button className="btn-outline" onClick={() => onCtaClick('waitlist')} style={{ width: '100%', padding: '16px' }}>
                            Rejoindre la liste
                        </button>
                    </motion.div>
                </div>

                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1rem', color: '#64748b', fontStyle: 'italic' }}>
                        * Votre accès inclut tous les renouvellements futurs pour votre enfant sans aucun frais supplémentaire.
                    </p>
                </div>
            </div>
        </section>
    );
};
