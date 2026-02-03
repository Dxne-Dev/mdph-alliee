import { useNavigate, useParams } from 'react-router-dom';
import { Questionnaire } from './Questionnaire';
import { toast } from 'react-hot-toast';

export const QuestionnaireScreen = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const handleComplete = (answers: any) => {
        console.log('Questionnaire completed:', answers);
        toast.success('Dossier complété avec succès ! ✨\nVos réponses sont enregistrées.', {
            duration: 5000,
            icon: '✅'
        });
        navigate('/dashboard');
    };

    return (
        <div className="questionnaire-screen" style={{ minHeight: '100vh', background: '#f8fafc' }}>


            <main className="container" style={{ padding: '0 20px 80px' }}>
                <Questionnaire
                    childId={childId || ''}
                    onComplete={handleComplete}
                />
            </main>
        </div>
    );
};

export default QuestionnaireScreen;
