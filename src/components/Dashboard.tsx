import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, User, FileText, LogOut, LayoutDashboard, Settings, Bell, X, Baby, Heart, ShieldCheck, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [childForm, setChildForm] = useState({ firstName: '', diagnosis: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Settings dropdown & edit modal
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingChild, setEditingChild] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    const handleAddChildClick = () => {
        console.log("Opening add child modal");
        setChildForm({ firstName: '', diagnosis: '' });
        setIsAddChildModalOpen(true);
    };

    const submitAddChild = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with:", childForm);

        if (!user) {
            console.error("No user found");
            return;
        }

        if (!childForm.firstName || !childForm.diagnosis) {
            console.warn("Form incomplete");
            return;
        }

        setIsSubmitting(true);

        const saveChild = async () => {
            console.log("Starting add child process for user:", user.id);

            // 1. Check if profile exists
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            // 2. Create profile if missing
            if (!existingProfile) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: user.id,
                        full_name: user.email?.split('@')[0] || 'Utilisateur'
                    }]);

                if (insertError) throw insertError;
            }

            // 3. Insert the child
            const { data: childData, error: childError } = await supabase
                .from('children')
                .insert([{
                    parent_id: user.id,
                    first_name: childForm.firstName,
                    diagnosis: childForm.diagnosis
                }])
                .select();

            if (childError) throw childError;

            if (childData) {
                setChildren([...children, ...childData]);
            }

            setIsAddChildModalOpen(false);
            setChildForm({ firstName: '', diagnosis: '' });
            return childData;
        };

        toast.promise(saveChild(), {
            loading: 'Enregistrement de l\'enfant...',
            success: 'Enfant ajouté avec succès ! ✨',
            error: (err) => `Erreur : ${err.message || 'Impossible d\'ajouter l\'enfant'}`
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const startQuestionnaire = (childId: string) => {
        window.location.href = `/questionnaire/${childId}`;
    };

    const handleEditChild = (child: any) => {
        setEditingChild(child);
        setChildForm({ firstName: child.first_name, diagnosis: child.diagnosis });
        setOpenMenuId(null);
        setIsEditModalOpen(true);
    };

    const handleDeleteChild = async (childId: string) => {
        setOpenMenuId(null);

        const deleteChild = async () => {
            const { error } = await supabase
                .from('children')
                .delete()
                .eq('id', childId);

            if (error) throw error;
            setChildren(children.filter(c => c.id !== childId));
        };

        toast.promise(deleteChild(), {
            loading: 'Suppression en cours...',
            success: 'Profil enfant supprimé',
            error: (err) => `Erreur : ${err.message}`
        });
    };

    const submitEditChild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingChild || !childForm.firstName || !childForm.diagnosis) return;

        setIsSubmitting(true);

        const updateChild = async () => {
            const { data, error } = await supabase
                .from('children')
                .update({
                    first_name: childForm.firstName,
                    diagnosis: childForm.diagnosis
                })
                .eq('id', editingChild.id)
                .select();

            if (error) throw error;

            if (data) {
                setChildren(children.map(c => c.id === editingChild.id ? data[0] : c));
            }
            setIsEditModalOpen(false);
            setEditingChild(null);
            setChildForm({ firstName: '', diagnosis: '' });
            return data;
        };

        toast.promise(updateChild(), {
            loading: 'Mise à jour...',
            success: 'Profil mis à jour ! ✨',
            error: (err) => `Erreur : ${err.message}`
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Chargement de votre espace...</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Improved Navbar */}
            <nav style={{
                background: 'white',
                borderBottom: '1px solid var(--border-subtle)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '15px 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                        L'Allié <span className="highlight">MDPH</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '50px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <User size={16} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%' }} className="nav-icon-btn">
                                <Bell size={20} />
                            </button>
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '50%' }} title="Déconnexion">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '60px 20px' }}>
                <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                            <LayoutDashboard size={16} /> Tableau de bord
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', letterSpacing: '-1px' }}>Bonjour, ravi de vous revoir</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Gérez les dossiers et les actualisations de vos enfants.</p>
                    </div>
                    <button onClick={handleAddChildClick} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <Plus size={20} /> Ajouter un enfant
                    </button>
                </header>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' }}>
                    {children.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '100px 40px',
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px dashed #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ width: '80px', height: '80px', background: '#fff3eb', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <User size={40} strokeWidth={1.5} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Votre espace est prêt</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '450px', fontSize: '1.1rem' }}>Commencez par ajouter le profil de votre enfant pour que l'Allié puisse mémoriser ses besoins.</p>
                            <button onClick={handleAddChildClick} className="btn-primary" style={{ padding: '16px 40px' }}>
                                Ajouter mon premier enfant
                            </button>
                        </motion.div>
                    ) : (
                        children.map((child, index) => (
                            <motion.div
                                key={child.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="child-card"
                                style={{
                                    background: 'white',
                                    padding: '32px',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === child.id ? null : child.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Settings size={20} />
                                    </button>

                                    {openMenuId === child.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            background: 'white',
                                            borderRadius: 'var(--radius-sm)',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                            border: '1px solid var(--border-subtle)',
                                            minWidth: '150px',
                                            zIndex: 50,
                                            overflow: 'hidden'
                                        }}>
                                            <button
                                                onClick={() => handleEditChild(child)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Edit3 size={16} /> Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChild(child.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'left',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <Trash2 size={16} /> Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', background: 'var(--primary)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800' }}>
                                        {child.first_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{child.first_name}</h3>
                                        <span style={{
                                            background: '#e0f2fe',
                                            color: '#0369a1',
                                            padding: '4px 10px',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {child.diagnosis}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '24px',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Session MDPH 2026</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '700', background: '#fff3eb', padding: '2px 8px', borderRadius: '4px' }}>
                                            À commencer
                                        </span>
                                    </div>
                                    <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '12px' }}>
                                        <div style={{ width: '0%', height: '100%', background: 'var(--accent)', borderRadius: '2px' }}></div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Aucun document généré pour le moment.
                                    </p>
                                </div>

                                <button
                                    onClick={() => startQuestionnaire(child.id)}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        padding: '16px',
                                        fontSize: '1rem',
                                        background: 'var(--primary)',
                                        boxShadow: 'none'
                                    }}
                                >
                                    <FileText size={18} style={{ marginRight: '8px' }} /> Lancer l'actualisation
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Add Child Modal */}
            <AnimatePresence>
                {isAddChildModalOpen && (
                    <div
                        className="modal-overlay"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.7)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                            padding: '20px'
                        }}
                        onClick={() => setIsAddChildModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                width: '100%',
                                maxWidth: '500px',
                                padding: '40px',
                                position: 'relative',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <button
                                onClick={() => setIsAddChildModalOpen(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#fff3eb', color: 'var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <Baby size={30} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Ajouter un enfant</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Ces informations nous aident à personnaliser ses documents.</p>
                            </div>

                            <form onSubmit={submitAddChild} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Prénom de l'enfant</label>
                                    <div style={{ position: 'relative' }}>
                                        <Heart size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            required
                                            value={childForm.firstName}
                                            onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
                                            placeholder="Ex: Léo"
                                            className="modal-input"
                                            style={{ width: '100%', paddingLeft: '40px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Diagnostic ou trouble principal</label>
                                    <div style={{ position: 'relative' }}>
                                        <ShieldCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <select
                                            required
                                            value={childForm.diagnosis}
                                            onChange={(e) => setChildForm({ ...childForm, diagnosis: e.target.value })}
                                            className="modal-input"
                                            style={{ width: '100%', paddingLeft: '40px' }}
                                        >
                                            <option value="">Choisir un diagnostic...</option>
                                            <option value="TSA (Trouble du Spectre de l'Autisme)">TSA (Autisme)</option>
                                            <option value="TDAH (Trouble de l'Attention)">TDAH</option>
                                            <option value="Troubles DYS (Dyslexie, Dyspraxie...)">Troubles DYS</option>
                                            <option value="Retard de développement">Retard de développement</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                                >
                                    {isSubmitting ? 'Création...' : 'Valider et ajouter'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Child Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div
                        className="modal-overlay"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.7)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                            padding: '20px'
                        }}
                        onClick={() => { setIsEditModalOpen(false); setEditingChild(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                width: '100%',
                                maxWidth: '500px',
                                padding: '40px',
                                position: 'relative',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <button
                                onClick={() => { setIsEditModalOpen(false); setEditingChild(null); }}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <Edit3 size={30} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Modifier le profil</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Mettez à jour les informations de {editingChild?.first_name}.</p>
                            </div>

                            <form onSubmit={submitEditChild} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Prénom de l'enfant</label>
                                    <div style={{ position: 'relative' }}>
                                        <Heart size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            required
                                            value={childForm.firstName}
                                            onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
                                            placeholder="Ex: Léo"
                                            className="modal-input"
                                            style={{ width: '100%', paddingLeft: '40px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Diagnostic ou trouble principal</label>
                                    <div style={{ position: 'relative' }}>
                                        <ShieldCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <select
                                            required
                                            value={childForm.diagnosis}
                                            onChange={(e) => setChildForm({ ...childForm, diagnosis: e.target.value })}
                                            className="modal-input"
                                            style={{ width: '100%', paddingLeft: '40px' }}
                                        >
                                            <option value="">Choisir un diagnostic...</option>
                                            <option value="TSA (Trouble du Spectre de l'Autisme)">TSA (Autisme)</option>
                                            <option value="TDAH (Trouble de l'Attention)">TDAH</option>
                                            <option value="Troubles DYS (Dyslexie, Dyspraxie...)">Troubles DYS</option>
                                            <option value="Retard de développement">Retard de développement</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                                >
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
