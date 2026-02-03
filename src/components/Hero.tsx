import { motion } from 'framer-motion';
import { Check, ArrowDown, FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    return (
        <header className="hero" style={{ padding: '120px 0 160px' }}>
            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="badge"
                    style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent)', border: '1px solid rgba(249, 115, 22, 0.2)' }}
                >
                    <Zap size={14} style={{ marginRight: '8px' }} /> Nouveau : Assistant IA Intégré
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    style={{ fontSize: '4.5rem', lineHeight: '1.1', fontWeight: 800, letterSpacing: '-0.04em' }}
                >
                    Renouvellement MDPH : <br />
                    <span className="text-gradient">ne repartez plus de zéro.</span>
                </motion.h1>

                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ fontSize: '1.4rem', marginTop: '30px', color: '#475569' }}
                >
                    Vous avez déjà tout prouvé une fois. Pourquoi recommencer ? <br />
                    L'Allié mémorise votre dossier et <strong>rédige votre projet de vie</strong> à votre place.
                </motion.p>

                <motion.div
                    className="hero-cta-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '50px' }}
                >
                    <button onClick={onCtaClick} className="btn-primary" style={{ padding: '20px 45px', fontSize: '1.1rem' }}>
                        Commencer mon dossier
                        <ArrowRight size={20} />
                    </button>
                    <button onClick={onCtaClick} className="btn-outline" style={{ padding: '20px 45px' }}>
                        Découvrir comment ça marche
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="trust-text" 
                    style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                        <ShieldCheck size={16} className="text-accent" /> Données sécurisées 100% France
                    </div>
                    <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                        <Check size={16} className="text-accent" /> Utilisé par +500 parents
                    </div>
                </motion.div>
            </div>

            {/* Premium Visual Component */}
            <motion.div
                className="hero-visual"
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                style={{ marginTop: '80px', width: '100%', maxWidth: '1000px', margin: '80px auto 0' }}
            >
                <div style={{ 
                    background: 'white', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '8px',
                    boxShadow: '0 50px 100px -20px rgba(15, 23, 42, 0.15)',
                    border: '1px solid #e2e8f0',
                    position: 'relative'
                }}>
                    <div style={{ background: '#f8fafc', borderRadius: '16px', height: '400px', display: 'flex', overflow: 'hidden' }}>
                        <div style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '24px' }}>
                            <div style={{ height: '32px', width: '80%', background: '#f1f5f9', borderRadius: '6px', marginBottom: '24px' }} />
                            <div style={{ spaceY: '12px' }}>
                                {[1,2,3,4].map(i => (
                                    <div key={i} style={{ height: '40px', background: i === 1 ? '#fff3eb' : 'white', border: i === 1 ? '1px solid #f97316' : '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                                        <div style={{ width: '16px', height: '16px', background: i === 1 ? '#f97316' : '#e2e8f0', borderRadius: '4px', marginRight: '12px' }} />
                                        <div style={{ height: '10px', width: '60%', background: i === 1 ? '#ea580c' : '#f1f5f9', borderRadius: '10px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '40px' }}>
                            <div style={{ maxWidth: '500px' }}>
                                <div style={{ height: '24px', width: '40%', background: '#e2e8f0', borderRadius: '6px', marginBottom: '32px' }} />
                                <div style={{ height: '12px', width: '100%', background: '#f1f5f9', borderRadius: '10px', marginBottom: '16px' }} />
                                <div style={{ height: '12px', width: '90%', background: '#f1f5f9', borderRadius: '10px', marginBottom: '16px' }} />
                                <div style={{ height: '12px', width: '95%', background: '#f1f5f9', borderRadius: '10px', marginBottom: '32px' }} />
                                <div style={{ height: '150px', width: '100%', background: 'white', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#fff3eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Glissez vos bilans ici</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </header>
    );
};

