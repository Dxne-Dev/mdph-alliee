import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { LandingPage } from './LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { QuestionnaireScreen } from './components/QuestionnaireScreen';
import { Modal, type ModalMode } from './components/Modal';

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

                {/* Catch-all to landing */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
