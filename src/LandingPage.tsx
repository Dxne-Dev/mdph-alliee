import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Pack } from './components/Pack';
import { MVPCapabilities } from './components/MVPCapabilities';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export const LandingPage: React.FC = () => {
    const handleCta = () => window.location.href = '/auth';

    return (
        <div style={{ background: 'var(--bg-light)' }}>
            <nav className="navbar">
                <div className="logo">L'Allié <span className="highlight">MDPH</span></div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button onClick={handleCta} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem', border: '1px solid var(--border-subtle)' }}>Connexion</button>
                    <button onClick={handleCta} className="btn-sm">S'inscrire</button>
                </div>
            </nav>

            <main>
                <Hero onCtaClick={handleCta} />
                <Problem />
                <Solution />
                <Pack onCtaClick={handleCta} />
                <MVPCapabilities />
                <Pricing onCtaClick={handleCta} />
                <FAQ />
            </main>

            <Footer />
        </div>
    );
};

