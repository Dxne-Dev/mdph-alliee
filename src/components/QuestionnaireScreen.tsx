import { useNavigate, useParams } from 'react-router-dom';
import { Questionnaire } from './Questionnaire';
import { ArrowLeft } from 'lucide-react';

export const QuestionnaireScreen = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const handleComplete = (answers: any) => {
        console.log('Questionnaire completed:', answers);
        // Here we would call the OpenAI API or redirect to payment/success
        alert('Merci ! Vos réponses ont été enregistrées. Prochaine étape : La génération de vos documents.');
        navigate('/dashboard');
    };

    return (
        <div className="questionnaire-screen" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid var(--border-subtle)', marginBottom: '40px' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        <ArrowLeft size={18} /> Retour au tableau de bord
                    </button>
                    <div className="logo" style={{ marginLeft: 'auto' }}>L'Allié <span className="highlight">MDPH</span></div>
                </div>
            </nav>

            <main className="container" style={{ padding: '0 20px 80px' }}>
                <Questionnaire
                    childId={childId || ''}
                    onComplete={handleComplete}
                />
            </main>
        </div>
    );
};
