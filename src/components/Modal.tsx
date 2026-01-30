import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

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
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail);
            setStatus('idle');
            setConsent(false);
        }
    }, [isOpen, initialEmail]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

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

            setStatus('success');
            triggerConfetti();
        } catch (error: any) {
            console.error('Error saving lead:', error.message);
            setStatus('error');
        }
    };

    const content = {
        founder: {
            badge: "⏳ Accès Prioritaire",
            title: "STOP ! Vous êtes en avance.",
            desc: "L'Allié ouvre officiellement ses portes dans quelques jours. En cliquant, vous venez de prouver que ce problème est urgent.",
            offer: <>Nous avons réservé votre place au <strong>tarif Early Bird de 29€</strong> (au lieu de 59€).</>,
            button: "Je veux mon accès",
            label: "Ton email (pour t’envoyer l’accès bêta + tarif fondateur)",
            successMsg: "Votre place au tarif Early Bird est réservée ! Surveillez votre boîte mail."
        },
        waitlist: {
            badge: "📧 Liste d'attente",
            title: "Rejoignez la révolution.",
            desc: "Nous finalisons les derniers détails pour vous offrir la meilleure expérience possible.",
            offer: <>Inscrivez-vous pour être prévenu(e) en priorité du <strong>lancement public (tarif standard 59€)</strong>.</>,
            button: "Me prévenir du lancement",
            label: "Ton email (pour recevoir l'invitation au lancement)",
            successMsg: "Vous êtes sur la liste d'attente prioritaire ! Merci de votre confiance."
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
                        <button className="modal-close" onClick={onClose} disabled={status === 'loading'}>
                            <X size={24} />
                        </button>

                        {status === 'success' ? (
                            <motion.div
                                className="modal-success-view"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="success-icon-wrapper">
                                    <CheckCircle2 size={80} className="text-green-500" />
                                </div>
                                <h2 className="success-title">C'est validé !</h2>
                                <p className="success-message">{current.successMsg}</p>
                                <button className="btn-primary btn-block" onClick={onClose} style={{ marginTop: '20px' }}>
                                    Super !
                                </button>
                            </motion.div>
                        ) : (
                            <>
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
                                            disabled={status === 'loading'}
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
                                            disabled={status === 'loading'}
                                            checked={consent}
                                            onChange={(e) => setConsent(e.target.checked)}
                                        />
                                        <label htmlFor="modal-consent">Je comprends que l’outil n’est pas un service public et ne garantit pas la décision MDPH.</label>
                                    </div>

                                    {status === 'error' && (
                                        <p className="error-text" style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                                            Une erreur est survenue. Veuillez réessayer.
                                        </p>
                                    )}

                                    <button type="submit" className="btn-primary btn-block" disabled={status === 'loading'}>
                                        {status === 'loading' ? (
                                            <>Chargement... <Loader2 size={18} className="animate-spin ml-2" /></>
                                        ) : (
                                            <>{current.button} <Send size={18} style={{ marginLeft: '8px' }} /></>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
