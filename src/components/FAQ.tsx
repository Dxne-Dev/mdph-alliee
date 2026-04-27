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
            answer: "L'outil est disponible dès maintenant en accès anticipé pour les 50 premiers utilisateurs au tarif de lancement de 19€. Inscrivez-vous pour commencer votre dossier immédiatement."
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
            answer: "L'Allié est particulièrement optimisé pour les neuro-atypies (TDAH, TSA) et les troubles DYS (dyslexie, dyspraxie, etc.), car ces dossiers reposent énormément sur la qualité du Projet de Vie. Il fonctionne aussi pour d'autres types de handicap."
        },
        {
            question: "Mes données médicales sont-elles en sécurité ?",
            answer: "Absolument. Vos données sont hébergées en Union Européenne via Supabase, chiffrées, et jamais revendues. Elles sont automatiquement supprimées 60 jours après la génération de votre dossier. Vous restez seul maître de vos données."
        },
        {
            question: "Combien de temps faut-il pour compléter le questionnaire ?",
            answer: "Entre 20 et 40 minutes selon la complexité de votre situation. Le questionnaire est structuré en 8 sections claires. Vous pouvez sauvegarder et reprendre à tout moment."
        },
        {
            question: "Puis-je modifier mon dossier après la génération ?",
            answer: "Oui. Vous pouvez modifier vos réponses et régénérer votre synthèse autant de fois que nécessaire, sans frais supplémentaire. Votre accès est à vie."
        },
        {
            question: "Comment fonctionne l'intelligence artificielle ?",
            answer: "Notre IA analyse vos réponses et les reformule en langage administratif expert, en utilisant le vocabulaire et les critères du référentiel MDPH. Elle ne fabrique jamais d'informations : elle restructure et argumente ce que vous décrivez."
        },
        {
            question: "Que contient exactement le dossier généré ?",
            answer: "Vous recevez : une synthèse administrative complète (PDF), un projet de vie rédigé par l'IA, une checklist des pièces justificatives avec alertes de validité des certificats, et les informations pour pré-remplir votre CERFA."
        },
        {
            question: "Est-ce que ça marche pour un renouvellement ?",
            answer: "Oui. L'outil est conçu autant pour les premières demandes que pour les renouvellements. Il met en avant l'évolution de la situation et les besoins persistants, ce qui est crucial lors d'un renouvellement."
        },
        {
            question: "Le paiement est-il sécurisé ?",
            answer: "Oui. Le paiement est traité par Stripe, leader mondial du paiement en ligne. Nous ne stockons jamais vos données bancaires. Vous bénéficiez d'une garantie satisfait ou remboursé de 14 jours."
        },
        {
            question: "Puis-je utiliser l'outil pour plusieurs enfants ?",
            answer: "Oui. Votre compte vous permet d'ajouter plusieurs profils enfants et de gérer un dossier distinct pour chacun, le tout avec un seul paiement."
        },
        {
            question: "Quels documents dois-je préparer avant de commencer ?",
            answer: "Idéalement : le diagnostic de votre enfant, ses bilans récents (orthophonie, psychomotricité, etc.), et les informations sur sa scolarité. Utilisez notre checklist gratuite pour vérifier que vous avez tout."
        },
        {
            question: "L'outil calcule-t-il le montant de mes aides ?",
            answer: "Non. Pour éviter toute erreur, nous ne calculons pas le montant des aides. Nous vous recommandons d'utiliser le simulateur officiel de la CAF ou de consulter un professionnel pour estimer votre reste à charge."
        },
        {
            question: "Comment fonctionne la checklist gratuite ?",
            answer: "C'est un outil 100% gratuit et anonyme. Vous cochez les documents que vous avez, indiquez les dates, et nous vous disons ce qui manque et ce qui est périmé. Aucune inscription requise."
        },
        {
            question: "Quelle est la différence entre l'AEEH et la PCH ?",
            answer: "L'AEEH (Allocation d'Éducation de l'Enfant Handicapé) compense les frais liés au handicap. La PCH (Prestation de Compensation du Handicap) finance l'aide humaine, technique ou l'aménagement du logement. L'Allié vous aide à demander les deux si nécessaire."
        },
        {
            question: "Combien de temps dure le traitement d'un dossier MDPH ?",
            answer: "En moyenne 4 à 6 mois, parfois plus selon les départements. Un dossier incomplet allonge considérablement ce délai. C'est pourquoi un dossier complet et bien rédigé dès le départ est crucial."
        },
        {
            question: "Puis-je partager mon dossier avec un professionnel ?",
            answer: "Oui. Vous pouvez télécharger votre synthèse en PDF et la partager librement avec votre médecin, assistante sociale, ou toute personne qui vous accompagne."
        },
        {
            question: "Que se passe-t-il si mon dossier est refusé ?",
            answer: "Vous pouvez modifier vos réponses, ajouter des informations complémentaires et régénérer un nouveau dossier sans frais. L'Allié reste disponible pour vos recours et renouvellements futurs."
        },
        {
            question: "Comment vous contacter en cas de problème ?",
            answer: "Écrivez-nous à alassanemomo244@gmail.com. Nous répondons sous 48h maximum. Nous travaillons aussi à mettre en place un chat d'assistance pour une aide encore plus rapide."
        },
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
