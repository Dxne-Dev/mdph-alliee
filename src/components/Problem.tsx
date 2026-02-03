import { AlertCircle, Clock, FileWarning, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export const Problem = () => {
    const pains = [
        {
            icon: <Clock size={32} />,
            title: "Des dizaines d'heures perdues",
            text: "Chaque renouvellement vous oblige à réécrire ce que vous avez déjà dit dix fois. C'est un épuisement mental permanent.",
            color: "#ef4444"
        },
        {
            icon: <FileWarning size={32} />,
            title: "La peur de l'erreur fatale",
            text: "Oublier un mot-clé ou mal formuler un besoin peut entraîner un refus et des mois de recours interminables.",
            color: "#f59e0b"
        },
        {
            icon: <SearchX size={32} />,
            title: "Documents introuvables",
            text: "Où est le bilan de l'ergothérapeute de 2023 ? La recherche de pièces jointes devient une chasse au trésor stressante.",
            color: "#3b82f6"
        }
    ];

    return (
        <section className="section-problem" style={{ padding: '120px 0', background: '#f8fafc' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '80px' }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ display: 'inline-flex', padding: '10px 20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
                        <AlertCircle size={18} style={{ marginRight: '8px' }} /> Le constat est amer
                    </motion.div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>Le système MDPH est un parcours du combattant.</h2>
                    <p style={{ fontSize: '1.25rem', color: '#64748b' }}>Pour obtenir les droits de votre enfant, vous devez devenir secrétaire, juriste et assistante sociale à la fois.</p>
                </div>

                <div className="pain-points" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                    {pains.map((pain, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0' }}
                        >
                            <div style={{ color: pain.color, marginBottom: '24px' }}>
                                {pain.icon}
                            </div>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>{pain.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{pain.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
