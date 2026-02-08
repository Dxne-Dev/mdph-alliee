import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ModalMode } from './Modal';

interface PricingProps {
    onCtaClick: (mode: ModalMode) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onCtaClick }) => {
    return (
        <section id="pricing" className="section-pricing" style={{ padding: '120px 0', background: '#f8fafc' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>Payez une fois. <span className="text-gradient">Renouvelez à vie.</span></h2>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>L'investissement le plus rentable pour la tranquillité administrative de votre famille.</p>
                </div>

                {/* Argument Massue Banner */}
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto 60px',
                    background: 'white',
                    padding: '24px',
                    borderRadius: '20px',
                    border: '2px dashed #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '40px',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>Écrivain public</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', textDecoration: 'line-through' }}>150€ / dossier</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', color: '#e2e8f0' }}>vs</div>
                    <div>
                        <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>L'Allié MDPH</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>29€ À VIE</div>
                    </div>
                </div>

                <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', alignItems: 'stretch' }}>
                    {/* Bêta Tier */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="pricing-card"
                        style={{ padding: '40px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, width: 'fit-content', marginBottom: '20px' }}>30 PLACES UNIQUEMENT</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Offre Bêta</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>19€</div>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '32px' }}>Paiement unique à vie</p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'grid', gap: '16px', flex: 1 }}>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '0.95rem' }}><Check size={18} className="text-accent" /> Accès complet à vie</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '0.95rem' }}><Check size={18} className="text-accent" /> Support direct fondateur</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '0.95rem' }}><Check size={18} className="text-accent" /> Vos retours améliorent l'outil</li>
                        </ul>

                        <button className="btn-outline" onClick={() => onCtaClick('founder')} style={{ width: '100%' }}>
                            Devenir Bêta-testeur
                        </button>
                    </motion.div>

                    {/* Early Bird (Featured) */}
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
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1
                        }}
                    >
                        <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--accent)', color: 'white', padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>LANCEMENT</div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 800, marginBottom: '16px' }}>Early Bird</h3>
                        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>29€</div>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>Jusqu'au 28 février</p>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '32px' }} />

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'grid', gap: '20px', flex: 1 }}>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Mémoire du dossier à vie</li>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Synthèse & Cerfa inclus</li>
                            <li style={{ display: 'flex', gap: '12px', color: 'white', fontWeight: 500 }}><Check size={20} className="text-accent" /> Mises à jour illimitées</li>
                        </ul>

                        <button className="btn-primary" onClick={() => onCtaClick('founder')} style={{ width: '100%', padding: '20px' }}>
                            Réserver mon accès
                        </button>
                    </motion.div>

                    {/* Standard Tier */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="pricing-card"
                        style={{ padding: '40px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', opacity: 0.8 }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#64748b' }}>Prix Standard</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>49€</div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '32px' }}>Après le lancement</p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', textAlign: 'left', display: 'grid', gap: '16px', flex: 1 }}>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}><Check size={18} /> Accès complet à vie</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}><Check size={18} /> Tous les outils inclus</li>
                            <li style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}><Check size={18} /> Accès après le 01/03</li>
                        </ul>

                        <button className="btn-outline" disabled style={{ width: '100%', cursor: 'not-allowed' }}>
                            Bientôt disponible
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
