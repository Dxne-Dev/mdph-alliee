import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ShieldCheck, Sparkles, Clock, Star, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// ============================================================
// CONFIGURATION CHARIOW — Remplace ces URLs par tes vrais liens
// ============================================================
const CHARIOW_CONFIG = {
    // Lien produit Bêta (19.63€)
    betaLink: "https://cxhbwzeo.mychariow.shop/beta-testeurs/checkout",
    // Lien produit Standard (29.99€)
    standardLink: "https://cxhbwzeo.mychariow.shop/full-access/checkout",
    // Prix affiché
    betaPrice: 19.63,
    standardPrice: 29.99,
    // Nombre de places bêta restantes (pour l'urgence)
    betaSpotsLeft: 12,
};

interface PaymentGateProps {
    childName: string;
    onPaymentSuccess: () => void;
    onSkip: () => void;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ childName, onPaymentSuccess, onSkip }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Récupérer l'email de l'utilisateur connecté
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        getUser();
    }, []);

    // Vérifier le retour après paiement (polling du statut premium)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('paid') === 'true') {
            setIsPolling(true);
            toast.loading('Vérification de votre paiement...', { id: 'payment-check' });

            let attempts = 0;
            const maxAttempts = 15; // 30 secondes max

            const pollInterval = setInterval(async () => {
                attempts++;
                try {
                    // Forcer le rafraîchissement de la session pour récupérer les metadata à jour
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    // Vérifier is_premium dans les user_metadata (mis à jour par le webhook Chariow)
                    if (user.user_metadata?.is_premium) {
                        clearInterval(pollInterval);
                        setIsPolling(false);
                        toast.success('Paiement confirmé ! 🎉', { id: 'payment-check' });
                        window.history.replaceState({}, '', window.location.pathname);
                        onPaymentSuccess();
                        return;
                    }
                } catch (e) {
                    console.warn('Erreur lors du polling:', e);
                }

                if (attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    setIsPolling(false);
                    toast.dismiss('payment-check');
                    toast('Le paiement est en cours de traitement. Rafraîchissez la page dans quelques instants.', {
                        icon: '⏳',
                        duration: 6000,
                    });
                }
            }, 2000);

            return () => clearInterval(pollInterval);
        }
    }, [onPaymentSuccess]);

    const handlePaymentClick = async () => {
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const email = user?.email || userEmail;

            if (!email) {
                toast.error("Erreur : impossible de récupérer votre email.");
                setIsLoading(false);
                return;
            }

            // Construire l'URL de retour avec le paramètre ?paid=true
            const currentPath = window.location.pathname;
            const returnUrl = encodeURIComponent(`${window.location.origin}${currentPath}?paid=true`);

            // Rediriger vers Chariow avec l'email pré-rempli
            // Adapte les paramètres selon la documentation Chariow
            const chariowUrl = `${CHARIOW_CONFIG.betaLink}?email=${encodeURIComponent(email)}&redirect_url=${returnUrl}`;

            window.location.href = chariowUrl;
        } catch (e) {
            console.error('Erreur redirection paiement:', e);
            toast.error('Erreur lors de la redirection');
            setIsLoading(false);
        }
    };

    // Si on est en mode polling (retour après paiement)
    if (isPolling) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    maxWidth: '500px',
                    margin: '80px auto',
                    textAlign: 'center',
                    background: 'white',
                    padding: '60px',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Loader2
                    size={56}
                    className="animate-spin"
                    style={{ color: 'var(--accent)', marginBottom: '24px' }}
                />
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    marginBottom: '12px',
                    fontFamily: 'Outfit, sans-serif',
                }}>
                    Confirmation en cours...
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                }}>
                    Nous vérifions votre paiement auprès de Chariow.
                    Cela prend généralement quelques secondes.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="payment-gate-container"
            style={{
                maxWidth: '960px',
                margin: '40px auto',
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
        >
            {/* Layout responsive */}
            <div className="payment-gate-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
            }}>
                {/* Colonne Gauche : Proposition de valeur */}
                <div style={{
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {/* Badge urgence */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                        color: '#059669',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        width: 'fit-content',
                        marginBottom: '24px',
                    }}>
                        <Sparkles size={16} /> OFFRE DE LANCEMENT — PLACES LIMITÉES
                    </div>

                    <h2 style={{
                        fontSize: '2.4rem',
                        fontWeight: '800',
                        color: '#0f172a',
                        lineHeight: '1.2',
                        marginBottom: '20px',
                        fontFamily: 'Outfit, sans-serif',
                    }}>
                        Finalisez le dossier {childName ? <><br /><span className="text-gradient">de {childName}</span></> : ''}
                    </h2>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#64748b',
                        marginBottom: '32px',
                        lineHeight: '1.7',
                    }}>
                        Vous avez fait le plus dur. Débloquez maintenant votre <strong>Pack Allié complet</strong> et garantissez la sérénité de votre famille pour les années à venir.
                    </p>

                    {/* Liste d'avantages */}
                    <ul style={{ display: 'grid', gap: '16px', marginBottom: '36px', listStyle: 'none', padding: 0 }}>
                        {[
                            "Synthèse MDPH experte (PDF)",
                            "Projet de Vie rédigé et optimisé par IA",
                            "Formulaire CERFA pré-rempli",
                            "Mises à jour illimitées à vie",
                            "Coffre-fort documents sécurisé"
                        ].map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#334155',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                }}
                            >
                                <div style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                {item}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Social Proof */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        background: '#f8fafc',
                        borderRadius: '14px',
                        border: '1px solid #f1f5f9',
                    }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                            ))}
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                            Recommandé par des familles en situation de handicap
                        </span>
                    </div>
                </div>

                {/* Colonne Droite : Pricing Card */}
                <div style={{
                    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '50px 40px',
                    borderLeft: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {/* Places restantes */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        marginBottom: '20px',
                    }}>
                        <Users size={14} />
                        Plus que {CHARIOW_CONFIG.betaSpotsLeft} places bêta
                    </div>

                    {/* Prix */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span style={{
                            fontSize: '1rem',
                            color: '#94a3b8',
                            textDecoration: 'line-through',
                        }}>
                            59€
                        </span>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            lineHeight: '1',
                            fontFamily: 'Outfit, sans-serif',
                        }}>
                            {CHARIOW_CONFIG.betaPrice}€
                            <span style={{
                                fontSize: '1rem',
                                color: '#94a3b8',
                                fontWeight: 'normal',
                                marginLeft: '4px',
                            }}>
                                /unique
                            </span>
                        </div>
                        <p style={{
                            color: '#64748b',
                            marginTop: '8px',
                            fontSize: '0.95rem',
                        }}>
                            Accès Bêta illimité à vie
                        </p>
                    </div>

                    {/* Badge économie */}
                    <div style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '24px',
                        textAlign: 'center',
                    }}>
                        Vous économisez 40€ vs. le tarif standard
                    </div>

                    {/* Bouton Paiement Chariow */}
                    <button
                        onClick={handlePaymentClick}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '20px',
                            background: 'var(--gradient-text)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1.15rem',
                            fontWeight: '700',
                            cursor: isLoading ? 'wait' : 'pointer',
                            boxShadow: '0 12px 24px -6px rgba(249, 115, 22, 0.4)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: isLoading ? 0.8 : 1,
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Redirection...
                            </>
                        ) : (
                            <>
                                <Lock size={20} />
                                Débloquer mon dossier — {CHARIOW_CONFIG.betaPrice}€
                            </>
                        )}
                    </button>

                    {/* Sécurité */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        marginTop: '20px',
                        textAlign: 'center',
                    }}>
                        <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>Paiement sécurisé par Chariow • Satisfait ou remboursé 30j</span>
                    </div>

                    {/* Timer urgence */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#dc2626',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginTop: '16px',
                    }}>
                        <Clock size={16} />
                        Offre bêta limitée dans le temps
                    </div>

                    {/* Bouton retour */}
                    <button
                        onClick={onSkip}
                        style={{
                            marginTop: '24px',
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Je réfléchis, retour au tableau de bord
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
