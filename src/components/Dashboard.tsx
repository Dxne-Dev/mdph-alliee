import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, User, FileText, ChevronRight, LogOut } from 'lucide-react';

export const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: childrenData } = await supabase
                    .from('children')
                    .select('*')
                    .eq('parent_id', user.id);

                setChildren(childrenData || []);
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleAddChild = async () => {
        const firstName = prompt("Prénom de l'enfant ?");
        const diagnosis = prompt("Diagnostic (TSA, TDAH, DYS...) ?");

        if (firstName && diagnosis) {
            const { data, error } = await supabase
                .from('children')
                .insert([{
                    parent_id: user.id,
                    first_name: firstName,
                    diagnosis: diagnosis
                }])
                .select();

            if (error) {
                alert("Erreur lors de l'ajout : " + error.message);
            } else {
                setChildren([...children, ...data]);
            }
        }
    };

    const startQuestionnaire = (childId: string) => {
        window.location.href = `/questionnaire/${childId}`;
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Chargement...</div>;

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <div className="logo">L'Allié <span className="highlight">MDPH</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><User size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {user?.email}</span>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Déconnexion">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '40px 20px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Bienvenue dans votre espace</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Gérez les dossiers de vos enfants et vos renouvellements.</p>
                    </div>
                    <button onClick={handleAddChild} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plus size={20} /> Ajouter un enfant
                    </button>
                </header>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                    {children.length === 0 ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '80px',
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px dashed var(--border-subtle)'
                        }}>
                            <div style={{ marginBottom: '20px', color: 'var(--text-muted)' }}><User size={48} strokeWidth={1} style={{ margin: '0 auto' }} /></div>
                            <h3>Vous n'avez pas encore ajouté d'enfant</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Commencez par ajouter le profil de votre enfant pour lancer le questionnaire.</p>
                            <button onClick={handleAddChild} className="btn-primary" style={{ margin: '0 auto' }}>Commencer maintenant</button>
                        </div>
                    ) : (
                        children.map(child => (
                            <div key={child.id} className="child-card" style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                border: '1px solid var(--border-subtle)'
                            }}>
                                <h3 style={{ marginBottom: '5px' }}>{child.first_name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{child.diagnosis}</p>

                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Dossier 2026</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Statut : Non commencé</p>
                                        </div>
                                        <ChevronRight size={20} style={{ color: 'var(--accent)' }} />
                                    </div>
                                </div>

                                <button onClick={() => startQuestionnaire(child.id)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <FileText size={18} style={{ marginRight: '8px' }} /> Lancer le questionnaire
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};
