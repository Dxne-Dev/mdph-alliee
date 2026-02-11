import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check } from 'lucide-react';

interface HealthDataConsentModalProps {
    onConsent: () => void;
}

export const HealthDataConsentModal: React.FC<HealthDataConsentModalProps> = ({ onConsent }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#fff7ed',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                        color: '#ea580c'
                    }}>
                        <ShieldAlert size={32} strokeWidth={2} />
                    </div>

                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        marginBottom: '16px',
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        Données de santé sensibles
                    </h2>

                    <p style={{
                        color: 'var(--text-muted)',
                        lineHeight: '1.6',
                        fontSize: '1rem',
                        marginBottom: '24px'
                    }}>
                        Les informations que vous allez saisir concernent la santé et le handicap de votre enfant.
                        Ces données sont <strong>strictement confidentielles</strong>, chiffrées, et utilisées uniquement pour générer votre dossier MDPH.
                    </p>

                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        border: '1px solid #cbd5e1'
                    }}>
                        <label style={{
                            display: 'flex',
                            gap: '12px',
                            cursor: 'pointer',
                            alignItems: 'flex-start'
                        }}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                style={{
                                    marginTop: '4px',
                                    width: '18px',
                                    height: '18px',
                                    accentColor: 'var(--accent)',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>
                                Je consens au traitement de ces données sensibles conformément à la <a href="#" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Politique de Confidentialité</a>.
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={onConsent}
                        disabled={!isChecked}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isChecked ? 'var(--gradient-text)' : '#e2e8f0',
                            color: isChecked ? 'white' : '#94a3b8',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: isChecked ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Check size={20} />
                        Continuer vers le questionnaire
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
