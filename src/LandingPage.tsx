import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Pack } from './components/Pack';
import { MVPCapabilities } from './components/MVPCapabilities';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

interface LandingPageProps {
    onOpenModal: (mode: 'founder' | 'waitlist', email?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenModal }) => {
    return (
        <div style={{ background: 'var(--bg-light)' }}>
            <nav className="navbar">
                <div className="logo">L'Allié <span className="highlight">MDPH</span></div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button onClick={() => window.location.href = '/auth'} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem', border: '1px solid var(--border-subtle)' }}>Connexion</button>
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
        </div>
    );
};

