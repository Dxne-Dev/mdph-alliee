import { useNavigate, useParams } from 'react-router-dom';
import { Questionnaire } from './Questionnaire';


export const QuestionnaireScreen = () => {
    const { childId } = useParams();
    const navigate = useNavigate();

    const handleComplete = (answers: any) => {
        console.log('Questionnaire completed:', answers);
        alert('Merci ! Vos réponses ont été enregistrées. Prochaine étape : La génération de vos documents.');
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
