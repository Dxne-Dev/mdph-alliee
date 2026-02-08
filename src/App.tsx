import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { LandingPage } from './LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { QuestionnaireScreen } from './components/QuestionnaireScreen';
import { Modal, type ModalMode } from './components/Modal';
import { Toaster } from 'react-hot-toast';
import { LegalPage } from './components/LegalPage';
import { MentionsLegalesContent, ConfidentialityContent, CGVContent, CGUContent } from './LegalContent';

function App() {
    const [session, setSession] = useState<any>(null);
    const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('founder');
    const [prefillEmail, setPrefillEmail] = useState('');

    useEffect(() => {
        // Check for current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const openLandingModal = (mode: ModalMode, email: string = '') => {
        setModalMode(mode);
        setPrefillEmail(email);
        setIsLandingModalOpen(true);
    };

    return (
        <Router>
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#334155', color: '#fff', borderRadius: '12px' } }} />
            <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={
                    session ? <Navigate to="/dashboard" /> : (
                        <>
                            <LandingPage onOpenModal={openLandingModal} />
                            <Modal
                                isOpen={isLandingModalOpen}
                                onClose={() => setIsLandingModalOpen(false)}
                                mode={modalMode}
                                initialEmail={prefillEmail}
                            />
                        </>
                    )
                } />

                {/* Auth Route */}
                <Route path="/auth" element={
                    session ? <Navigate to="/dashboard" /> : (
                        <Auth
                            onBack={() => window.location.href = '/'}
                            onSuccess={() => window.location.href = '/dashboard'}
                        />
                    )
                } />

                {/* Dashboard Route (Protected) */}
                <Route path="/dashboard" element={
                    session ? <Dashboard /> : <Navigate to="/auth" />
                } />

                {/* Questionnaire Route (Protected) */}
                <Route path="/questionnaire/:childId" element={
                    session ? <QuestionnaireScreen /> : <Navigate to="/auth" />
                } />

                {/* Legal Routes */}
                <Route path="/mentions-legales" element={<LegalPage title="Mentions Légales" content={<MentionsLegalesContent />} />} />
                <Route path="/confidentialite" element={<LegalPage title="Politique de Confidentialité" content={<ConfidentialityContent />} />} />
                <Route path="/cgv" element={<LegalPage title="Conditions Générales de Vente" content={<CGVContent />} />} />
                <Route path="/cgu" element={<LegalPage title="Conditions Générales d'Utilisation" content={<CGUContent />} />} />

                {/* Catch-all to landing */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
