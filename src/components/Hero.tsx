import { motion } from 'framer-motion';
import { Check, ArrowDown, FileText } from 'lucide-react';

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
                    Ils jugent l'avenir de votre enfant sur <span className="text-gradient">un formulaire papier.</span>
                </motion.h1>

                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Ne leur donnez pas le bâton pour vous battre. <strong>L'Allié</strong> traduit votre réalité de parent en langage administratif irréfutable. Sans larmes. En 15 minutes.
                </motion.p>

                <motion.div
                    className="hero-cta-group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <button onClick={onCtaClick} className="btn-primary">
                        Je sécurise mon dossier
                        <span className="btn-sub">Acompte 9€ remboursable &middot; Aucun engagement</span>
                    </button>
                    <p className="trust-text">Jointe par +500 parents sur liste d'attente</p>
                </motion.div>
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
                            <strong>Vous cochez :</strong> "Il ne tient pas en place."
                        </div>
                    </div>
                    <div className="arrow-down"><ArrowDown /></div>
                    <div className="result-item">
                        <div className="result-icon"><FileText size={14} /></div>
                        <div className="result-text">
                            <strong>L'Allié écrit :</strong> "Trouble de l'attention avec impulsivité motrice nécessitant guidance."
                        </div>
                    </div>
                </div>
            </motion.div>
        </header>
    );
};
