import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('signup');
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin + '/auth',
                    }
                });
                if (error) throw error;
                setSuccessMessage("Nous venons de vous envoyer un lien de confirmation à " + email + ".");
                setShowSuccess(true);
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            } else if (mode === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/auth/reset-password',
                });
                if (error) throw error;
                setSuccessMessage("Un lien de réinitialisation a été envoyé à " + email + ".");
                setShowSuccess(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'var(--bg-light)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ textAlign: 'center', padding: '20px 0' }}
                        >
                            <div style={{ marginBottom: '20px', color: '#22c55e' }}>
                                <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                                {mode === 'reset' ? 'Email envoyé' : 'Vérifiez vos emails'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                                {successMessage}<br /><br />
                                <span style={{ fontSize: '0.85rem' }}>Pensez à regarder dans vos <strong>spams</strong> si vous ne le voyez pas.</span>
                            </p>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    setMode('login');
                                }}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Retour à la connexion
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button onClick={onBack} className="btn-back" style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                marginBottom: '20px',
                                padding: '0'
                            }}>
                                <ArrowLeft size={16} /> Retour
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                                    {mode === 'signup' ? 'Créer mon compte' : mode === 'login' ? 'Me connecter' : 'Réinitialisation'}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {mode === 'signup'
                                        ? 'Commencez à sécuriser votre dossier MDPH.'
                                        : mode === 'login'
                                            ? 'Accédez à votre espace "Mémoire".'
                                            : 'Entrez votre email pour recevoir un lien.'}
                                </p>
                            </div>

                            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px 12px 12px 40px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border-subtle)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                {mode !== 'reset' && (
                                    <div className="form-group">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Mot de passe</label>
                                            {mode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('reset')}
                                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    Mot de passe oublié ?
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 12px 12px 40px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--border-subtle)',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
                                )}

                                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                                    {loading ? <Loader2 className="animate-spin" /> : (mode === 'signup' ? "S'inscrire" : mode === 'login' ? "Se connecter" : "Envoyer le lien")}
                                </button>
                            </form>

                            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    {mode === 'signup' ? "Déjà un compte ?" : mode === 'login' ? "Pas encore de compte ?" : ""}
                                    <button
                                        onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer', marginLeft: '5px' }}
                                    >
                                        {mode === 'signup' ? 'Se connecter' : mode === 'login' ? 'S’inscrire' : 'Retour à la connexion'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
