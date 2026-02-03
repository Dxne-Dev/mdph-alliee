import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', padding: '24px 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
            >
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={24} style={{ color: '#94a3b8' }} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <p style={{ paddingBottom: '32px', color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px' }}>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FAQ = () => {
    const faqs = [
        {
            question: "Quand l'outil sera-t-il disponible ?",
            answer: "Le lancement officiel est fixé au 14 février. En réservant votre accès aujourd'hui, vous ferez partie des premiers à recevoir votre lien de connexion et à commencer votre dossier."
        },
        {
            question: "Est-ce un outil officiel de la MDPH ?",
            answer: "Non. C'est un outil privé d'aide à la constitution de dossier. Il ne remplace pas l'organisme MDPH, mais il vous aide à produire des documents de haute qualité, structurés et argumentés comme le feraient des experts."
        },
        {
            question: "Garantissez-vous l'accord des aides ?",
            answer: "Méfiez-vous de quiconque vous promet un accord à 100%. La commission MDPH reste souveraine. Cependant, un dossier clair, carré et utilisant les mots-clés du référentiel décuple vos chances et évite les malentendus administratifs."
        },
        {
            question: "L'outil est-il adapté pour tous les handicaps ?",
            answer: "L'Allié est particulièrement optimisé pour les neuro-atypies (TDAH, TSA) et les troubles DYS (dyslexie, dyspraxie, etc.), car ces dossiers reposent énormément sur la qualité du Projet de Vie."
        },
        {
            question: "Mes données médicales sont-elles en sécurité ?",
            answer: "Absolument. Nous utilisons un chiffrement de bout en bout et vos documents sont stockés sur des serveurs sécurisés conformes aux normes de santé françaises. Vous restez seul maître de vos données."
        }
    ];

    return (
        <section className="section-faq" style={{ padding: '120px 0', background: 'white' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', padding: '10px 20px', background: '#f1f5f9', color: 'var(--primary)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
                            <HelpCircle size={18} style={{ marginRight: '8px' }} /> FAQ
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>Vous avez des questions ?</h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Nous avons les réponses pour vous aider à avancer sereinement.</p>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
