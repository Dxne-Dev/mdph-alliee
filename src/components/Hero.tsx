import { motion } from 'framer-motion';
import { Check, ArrowDown, FileText, ArrowRight } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    return (
        <header className="hero">
            <div className="container hero-content">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="badge"
                >
                    Pour parents d'enfants TDAH / TSA / DYS
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Renouvellement MDPH : <span className="text-gradient">ne repartez plus jamais de zéro.</span>
                </motion.h1>

                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Vous avez déjà tout prouvé. Pourquoi recommencer ? <br />
                    L'Allié garde votre dossier en mémoire. Mettez à jour uniquement ce qui a changé. Imprimez. Déposez.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ marginBottom: '30px', fontWeight: '700', color: 'var(--accent)' }}
                >
                    🚀 Lancement officiel le 14 février
                </motion.div>

                <motion.div
                    className="hero-cta-group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}
                >
                    <button onClick={onCtaClick} className="btn-primary">
                        Je renouvelle mon dossier
                        <span className="btn-sub">Accès Fondateur &middot; 29€ à vie</span>
                    </button>
                    <button onClick={onCtaClick} className="btn-outline" style={{
                        background: 'transparent',
                        border: '2px solid var(--primary)',
                        padding: '16px 32px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}>
                        Première demande <ArrowRight size={18} />
                    </button>
                </motion.div>
                <p className="trust-text" style={{ marginTop: '20px' }}>Jointe par +500 parents sur liste d'attente</p>
            </div>

            {/* Abstract Visual / Glass Effect */}
            <motion.div
                className="hero-visual"
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 10 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className="glass-card">
                    <div className="check-item">
                        <div className="check-icon"><Check size={14} /></div>
                        <div className="check-text">
                            <strong>L'Allié garde en mémoire :</strong> Bilans 2024, École, Soins.
                        </div>
                    </div>
                    <div className="arrow-down"><ArrowDown /></div>
                    <div className="result-item">
                        <div className="result-icon"><FileText size={14} /></div>
                        <div className="result-text">
                            <strong>Dossier 2026 :</strong> "Génération en 1 clic. Seuls les changements sont demandés."
                        </div>
                    </div>
                </div>
            </motion.div>
        </header>
    );
};
