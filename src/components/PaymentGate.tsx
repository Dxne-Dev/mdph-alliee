import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PaymentGateProps {
    childName: string;
    onPaymentSuccess: () => void;
    onSkip: () => void;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ childName, onPaymentSuccess, onSkip }) => {
    const [isLoading, setIsLoading] = useState(false);

    // TODO: Remplacer par votre lien de paiement Stripe réel (Mode Test ou Prod)
    // Astuce: Créez un lien de paiement dans Stripe Dashboard -> Payment Links.
    // Configurez l'URL de redirection après paiement vers : https://votre-app.com/dashboard?payment_success=true
    const STRIPE_LINK = "https://buy.stripe.com/test_...";

    const handlePaymentClick = async () => {
        setIsLoading(true);

        // Simulation pour la démo / MVP si pas de lien Stripe configuré
        if (STRIPE_LINK === "https://buy.stripe.com/test_...") {
            toast.loading("Simulation du paiement...", { duration: 2000 });
            setTimeout(async () => {
                // Simuler le succès du paiement en mettant à jour le profil utilisateur
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        // On stocke le statut 'premium' dans les métadonnées de l'utilisateur ou une table profiles
                        // Ici, on met à jour les métadonnées pour faire simple
                        await supabase.auth.updateUser({
                            data: { is_premium: true }
                        });

                        toast.success("Paiement validé (Simulation) !");
                        onPaymentSuccess();
                    }
                } catch (e) {
                    toast.error("Erreur lors de la simulation");
                }
                setIsLoading(false);
            }, 2000);
            return;
        }

        // Vraie redirection Stripe
        window.location.href = STRIPE_LINK;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="payment-gate-container"
            style={{
                maxWidth: '900px',
                margin: '40px auto',
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr', // Layout moderne asymétrique
            }}
        >
            {/* Colonne Gauche : Valeur */}
            <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#ecfdf5', color: '#059669', padding: '6px 12px',
                    borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700',
                    width: 'fit-content', marginBottom: '24px'
                }}>
                    <Sparkles size={16} /> OFFRE DE LANCEMENT
                </div>

                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '20px' }}>
                    Finalisez le dossier {childName ? `de ${childName}` : ''}
                </h2>

                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
                    Vous avez fait le plus dur. Débloquez maintenant votre Pack Allié complet et garantissez la sérénité de votre famille pour les années à venir.
                </p>

                <ul style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
                    {[
                        "Synthèse MDPH experte (PDF)",
                        "Projet de Vie rédigé et optimisé",
                        "Formulaire CERFA pré-rempli",
                        "Mises à jour illimitées à vie",
                        "Coffre-fort documents sécurisé"
                    ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '500' }}>
                            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '4px', borderRadius: '50%' }}>
                                <Check size={16} strokeWidth={3} />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span>Paiement sécurisé par Stripe • Satisfait ou remboursé 30j</span>
                </div>
            </div>

            {/* Colonne Droite : Action */}
            <div style={{
                background: '#f8fafc', padding: '50px', borderLeft: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <span style={{ fontSize: '1rem', color: '#64748b', textDecoration: 'line-through' }}>150€</span>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>29€<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/unique</span></div>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Accès à vie pour ce dossier</p>
                </div>

                <button
                    onClick={handlePaymentClick}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                        transition: 'transform 0.1s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    {isLoading ? 'Redirection...' : <><Lock size={20} /> Débloquer mon dossier</>}
                </button>

                <button
                    onClick={onSkip}
                    style={{
                        marginTop: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Je réfléchis, retour au tableau de bord
                </button>
            </div>
        </motion.div>
    );
};
