import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Pack } from './components/Pack';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Modal, type ModalMode } from './components/Modal';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('founder');
    const [prefillEmail, setPrefillEmail] = useState('');

    const openModal = (mode: ModalMode, email: string = '') => {
        setModalMode(mode);
        setPrefillEmail(email);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="sticky-bar">
                <p>Places Bêta limitées &middot; <strong>Tarif Fondateur disponible</strong></p>
                <button
                    onClick={() => openModal('founder')}
                    style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    className="btn-xs"
                >
                    Réserver ma place (9€) <ArrowRight size={14} />
                </button>
            </div>

            <nav className="navbar">
                <div className="logo">L'Allié <span className="highlight">MDPH</span></div>
                <button onClick={() => openModal('founder')} className="btn-sm">Accès Fondateur</button>
            </nav>

            <main>
                <Hero onCtaClick={() => openModal('founder')} />
                <Problem />
                <Solution />
                <Pack />
                <Pricing onCtaClick={(mode) => openModal(mode)} />
                <FAQ />
            </main>

            <Footer onWaitlistSubmit={(email) => openModal('waitlist', email)} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialEmail={prefillEmail}
            />
        </>
    );
}

export default App;
