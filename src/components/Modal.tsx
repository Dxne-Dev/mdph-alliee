import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type ModalMode = 'founder' | 'waitlist';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    initialEmail?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, mode, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail);
        }
    }, [isOpen, initialEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        email: email,
                        type: mode,
                        consent: consent,
                        source: 'landing_page'
                    }
                ]);

            if (error) throw error;

            const message = mode === 'founder'
                ? `Merci ! Votre place au tarif Early Bird (29€) est réservée pour : ${email}`
                : `Merci ! Vous êtes sur la liste d'attente prioritaire pour le lancement public : ${email}`;

            alert(message);
            onClose();
        } catch (error: any) {
            console.error('Error saving lead:', error.message);
            alert("Désolé, une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const content = {
        founder: {
            badge: "⏳ Accès Prioritaire",
            title: "STOP ! Vous êtes en avance.",
            desc: "L'Allié ouvre officiellement ses portes dans quelques jours. En cliquant, vous venez de prouver que ce problème est urgent.",
            offer: <>Nous avons réservé votre place au <strong>tarif Early Bird de 29€</strong> (au lieu de 59€).</>,
            button: "Je veux mon accès",
            label: "Ton email (pour t’envoyer l’accès bêta + tarif fondateur)"
        },
        waitlist: {
            badge: "📧 Liste d'attente",
            title: "Rejoignez la révolution.",
            desc: "Nous finalisons les derniers détails pour vous offrir la meilleure expérience possible.",
            offer: <>Inscrivez-vous pour être prévenu(e) en priorité du <strong>lancement public (tarif standard 59€)</strong>.</>,
            button: "Me prévenir du lancement",
            label: "Ton email (pour recevoir l'invitation au lancement)"
        }
    };

    const current = content[mode];

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={onClose} disabled={loading}>
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            <span className="modal-badge">{current.badge}</span>
                            <h2>{current.title}</h2>
                            <p>{current.desc}</p>
                        </div>

                        <div className="modal-offer">
                            <p>{current.offer}</p>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="modal-email">{current.label}</label>
                                <input
                                    type="email"
                                    id="modal-email"
                                    placeholder="prenom@mail.com"
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="modal-input"
                                />
                            </div>

                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="modal-consent"
                                    required
                                    disabled={loading}
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                />
                                <label htmlFor="modal-consent">Je comprends que l’outil n’est pas un service public et ne garantit pas la décision MDPH.</label>
                            </div>

                            <button type="submit" className="btn-primary btn-block" disabled={loading}>
                                {loading ? (
                                    <>Chargement... <Loader2 size={18} className="animate-spin ml-2" /></>
                                ) : (
                                    <>{current.button} <Send size={18} style={{ marginLeft: '8px' }} /></>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
