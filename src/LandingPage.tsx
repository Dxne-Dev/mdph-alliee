import { ArrowRight } from 'lucide-react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Pack } from './components/Pack';
import { MVPCapabilities } from './components/MVPCapabilities';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Calendar } from 'lucide-react';

interface LandingPageProps {
    onOpenModal: (mode: 'founder' | 'waitlist', email?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenModal }) => {
    return (
        <>
            <div className="sticky-bar">
                <p>
                    <Calendar size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Lancement officiel le <strong>14 février</strong> &middot; Places Bêta limitées
                </p>
                <button
                    onClick={() => onOpenModal('founder')}
                    style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    className="btn-xs"
                >
                    Réserver ma place <ArrowRight size={14} />
                </button>
            </div>

            <nav className="navbar">
                <div className="logo">L'Allié <span className="highlight">MDPH</span></div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.location.href = '/auth'} className="btn-sm btn-outline" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Connexion</button>
                    <button onClick={() => onOpenModal('founder')} className="btn-sm">Accès Fondateur</button>
                </div>
            </nav>

            <main>
                <Hero onCtaClick={() => onOpenModal('founder')} />
                <Problem />
                <Solution />
                <Pack onCtaClick={() => onOpenModal('founder')} />
                <MVPCapabilities />
                <Pricing onCtaClick={(mode) => onOpenModal(mode)} />
                <FAQ />
            </main>

            <Footer onWaitlistSubmit={(email) => onOpenModal('waitlist', email)} />
        </>
    );
};
