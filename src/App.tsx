import { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Pack } from './components/Pack';
import { MVPCapabilities } from './components/MVPCapabilities';
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
                <p>
                    <Calendar size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Lancement officiel le <strong>14 février</strong> &middot; Places Bêta limitées
                </p>
                <button
                    onClick={() => openModal('founder')}
                    style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    className="btn-xs"
                >
                    Réserver ma place <ArrowRight size={14} />
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
                <Pack onCtaClick={() => openModal('founder')} />
                <MVPCapabilities />
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
