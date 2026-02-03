import { CheckCircle, FileText, Sparkles, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PackProps {
    onCtaClick?: () => void;
}

export const Pack: React.FC<PackProps> = ({ onCtaClick }) => {
    return (
        <section className="section-pack" style={{ padding: '120px 0', background: 'white', overflow: 'hidden' }}>
            <div className="container">
                <div className="pack-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="pack-image"
                        style={{ flex: 1, position: 'relative' }}
                    >
                        <div className="doc-stack" style={{ position: 'relative', height: '450px', width: '100%' }}>
                            <div style={{ position: 'absolute', top: '0', left: '20px', width: '320px', height: '420px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', transform: 'rotate(-6deg)', zIndex: 1, boxShadow: 'var(--shadow-lg)' }} />
                            <div style={{ position: 'absolute', top: '10px', left: '40px', width: '320px', height: '420px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', transform: 'rotate(-3deg)', zIndex: 2, boxShadow: 'var(--shadow-lg)' }} />
                            <div style={{ position: 'absolute', top: '20px', left: '60px', width: '320px', height: '420px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', zIndex: 3, boxShadow: 'var(--shadow-lg)', padding: '40px' }}>
                                <div style={{ height: '30px', width: '60%', background: '#f1f5f9', borderRadius: '6px', marginBottom: '40px' }} />
                                <div style={{ spaceY: '20px' }}>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} style={{ height: '12px', width: i === 6 ? '40%' : '100%', background: '#f8fafc', borderRadius: '10px', marginBottom: '16px' }} />
                                    ))}
                                </div>
                                <div style={{ marginTop: '40px', padding: '20px', background: '#fff3eb', borderRadius: '12px', border: '1px solid #f97316' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', marginBottom: '8px' }}>Projet de Vie</div>
                                    <div style={{ height: '10px', width: '80%', background: '#ea580c', borderRadius: '10px' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="pack-content"
                        style={{ flex: 1 }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Tout ce dont vous avez besoin. <br /><span className="text-gradient">En un seul pack.</span></h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px' }}>Nous ne faisons pas que des formulaires. Nous construisons votre défense.</p>

                        <div style={{ display: 'grid', gap: '30px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ color: 'var(--accent)', flexShrink: 0 }}><Sparkles size={24} /></div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Projet de Vie Expert</h4>
                                    <p style={{ color: '#64748b' }}>Un récit de vie structuré, mettant en avant les points clés pour vos droits.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ color: 'var(--accent)', flexShrink: 0 }}><FileText size={24} /></div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Synthèse Cerfa</h4>
                                    <p style={{ color: '#64748b' }}>Une application qui vous dit exactement quoi cocher, case par case.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ color: 'var(--accent)', flexShrink: 0 }}><ShieldCheck size={24} /></div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Checklist de dépôt</h4>
                                    <p style={{ color: '#64748b' }}>Zéro oubli. On vérifie chaque pièce justificative avec vous.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ color: 'var(--accent)', flexShrink: 0 }}><Mail size={24} /></div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Modèles de courriers</h4>
                                    <p style={{ color: '#64748b' }}>Relances, suivi d'envoi et recours gracieux pré-rédigés.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="first-demand-card"
                    style={{
                        marginTop: '100px',
                        padding: '60px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>C'est votre premier dossier ?</h3>
                        <p style={{ maxWidth: '650px', margin: '0 auto 40px', color: '#64748b', fontSize: '1.1rem' }}>
                            Pas de panique. L'outil vous guide de A à Z. Vous répondez au questionnaire, on traduit votre quotidien, vous déposez sereinement.
                        </p>
                        <button className="btn-primary" onClick={onCtaClick}>
                            Démarrer ma première demande
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
