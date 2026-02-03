import { BrainCircuit, FileSignature, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Solution = () => {
    return (
        <section className="section-solution" style={{ padding: '120px 0', background: 'white' }}>
            <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}
                >
                    Ce n'est pas à vous de changer.<br />
                    C'est à votre dossier de s'adapter.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="section-lead"
                    style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '750px', margin: '0 auto' }}
                >
                    Trois piliers conçus pour transformer votre réalité de parent en un dossier administratif parfait, sans effort inutile.
                </motion.p>
            </div>

            <div className="steps-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {/* Pillar 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="step-card"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                    <div style={{ width: '60px', height: '60px', background: '#fff3eb', color: '#f97316', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <BrainCircuit size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Mémoire Intelligente</h3>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>L'Allié garde vos données en mémoire d'une année sur l'autre. Vous n'actualisez que ce qui change réellement.</p>
                </motion.div>

                {/* Pillar 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="step-card"
                    style={{ background: 'var(--primary)', color: 'white', transform: 'scale(1.05)', boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.3)' }}
                >
                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <FileSignature size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'white' }}>Rédaction Assistée</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>L'intelligence artificielle transforme vos notes en un <strong>"Projet de Vie"</strong> structuré et professionnel, prêt à être déposé.</p>
                </motion.div>

                {/* Pillar 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="step-card"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', color: '#0ea5e9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Coffre-fort Sécurisé</h3>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>Vos bilans et comptes-rendus médicaux sont chiffrés et stockés dans un espace personnel dédié à chaque enfant.</p>
                </motion.div>
            </div>
        </section>
    );
};

