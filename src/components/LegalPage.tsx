import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
    title: string;
    content: React.ReactNode;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, content }) => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-outline"
                    style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} /> Retour
                </button>

                <div style={{
                    background: 'white',
                    padding: '60px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    lineHeight: '1.8',
                    color: '#334155'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: '#1e293b',
                        marginBottom: '40px',
                        borderBottom: '2px solid #f1f5f9',
                        paddingBottom: '20px'
                    }}>
                        {title}
                    </h1>

                    <div className="legal-content">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};
