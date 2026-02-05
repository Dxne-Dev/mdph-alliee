import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
    Plus, FileText, ChevronRight, Download, Trash2,
    CheckCircle2, Clock, ArrowRight, Bell, ClipboardList, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DocumentVault } from './DocumentVault';

// Services de génération PDF
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { MDPHDocument } from './MDPHDocument';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [vaultOpenId, setVaultOpenId] = useState<string | null>(null);

    // Initialisation
    useEffect(() => {
        const initDashboard = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/auth');
                    return;
                }
                setUser(user);

                const { data: submissions, error } = await supabase
                    .from('submissions')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                const childrenData = submissions?.map(sub => ({
                    id: sub.child_id || sub.id,
                    first_name: sub.answers?.firstName || 'Enfant sans nom',
                    status: sub.status || 'draft',
                    last_updated: sub.updated_at,
                    answers: sub.answers
                })) || [];

                setChildren(childrenData);

            } catch (error) {
                console.error('Erreur chargement dashboard:', error);
                toast.error('Impossible de charger vos dossiers.');
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, [navigate]);

    const handleCreateNew = async () => {
        const newChildId = crypto.randomUUID();
        try {
            // 1. Créer l'enfant dans la table 'children' (utiliser parent_id au lieu de user_id)
            const { error: childError } = await supabase
                .from('children')
                .insert([{
                    id: newChildId,
                    parent_id: user.id, // Correction ici
                    first_name: 'Nouvel enfant'
                }]);

            if (childError) throw childError;

            // 2. Créer la soumission liée
            const { error: subError } = await supabase
                .from('submissions')
                .insert([{
                    user_id: user.id,
                    child_id: newChildId,
                    status: 'draft',
                    answers: {}
                }]);

            if (subError) throw subError;

            navigate(`/questionnaire/${newChildId}`);
        } catch (e) {
            console.error('Erreur création:', e);
            toast.error('Impossible de créer un nouveau dossier');
        }
    };

    const handleDelete = async (childId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible.')) return;

        try {
            // Supprimer d'abord les submissions (dépendance FK)
            await supabase.from('submissions').delete().eq('child_id', childId);
            // Puis l'enfant
            await supabase.from('children').delete().eq('id', childId);

            setChildren(prev => prev.filter(c => c.id !== childId));
            toast.success('Dossier supprimé');
        } catch (e) {
            console.error('Erreur suppression:', e);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDownloadPack = async (child: any) => {
        const tid = toast.loading('Préparation du téléchargement...', { id: 'dl-' + child.id });
        setIsGenerating(child.id);

        try {
            if (!child.answers) throw new Error("Aucune donnée");

            // 1. Synthèse
            const doc = <MDPHDocument data={child.answers} />;
            const synthesisBlob = await pdf(doc).toBlob();

            const synthesisUrl = URL.createObjectURL(synthesisBlob);
            const a = document.createElement('a');
            a.href = synthesisUrl;
            a.download = `Synthese_Allie_${child.first_name}.pdf`;
            a.click();

            // 2. CERFA
            try {
                const response = await fetch('/support_client.pdf?v=1');
                if (response.ok) {
                    const existingPdfBytes = await response.arrayBuffer();
                    const header = new Uint8Array(existingPdfBytes.slice(0, 5));
                    if (String.fromCharCode(...header) === '%PDF-') {
                        const pdfDoc = await PDFDocument.load(existingPdfBytes);
                        const form = pdfDoc.getForm();

                        try {
                            form.getTextField('topmostSubform[0].Page1[0].NomFamille[0]')?.setText(child.answers.lastName?.toUpperCase() || '');
                            form.getTextField('topmostSubform[0].Page1[0].Prenom[0]')?.setText(child.answers.firstName || '');
                        } catch (e) { console.warn('Erreur remplissage partiel CERFA', e); }

                        const cerfaBytes = await pdfDoc.save();
                        const cerfaBlob = new Blob([cerfaBytes as any], { type: 'application/pdf' });
                        const cerfaUrl = URL.createObjectURL(cerfaBlob);
                        const b = document.createElement('a');
                        b.href = cerfaUrl;
                        b.download = `CERFA_PreRempli_${child.first_name}.pdf`;
                        b.click();

                        toast.success('Pack complet téléchargé !', { id: tid });
                    }
                }
            } catch (cerfaError) {
                console.warn("Échec génération CERFA", cerfaError);
                toast.success('Synthèse téléchargée (CERFA indisponible)', { id: tid });
            }

        } catch (error) {
            console.error('Erreur download:', error);
            toast.error('Erreur lors du téléchargement', { id: tid });
        } finally {
            setIsGenerating(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            <ClipboardList size={22} />
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>L'Allié MDPH</h1>
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
                        style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        Quitter
                    </button>
                </div>
            </header>

            <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

                {/* Notification Banner */}
                <div style={{
                    marginBottom: '32px',
                    padding: '20px 24px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        backgroundColor: '#eff6ff', color: '#2563eb',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Bell size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                            Notifications actives
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            Nous vous préviendrons par email 3 mois avant le renouvellement. Prochaine échéance : <span style={{ color: '#2563eb', fontWeight: '600' }}>05 Mars 2026</span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>Mes Dossiers</h2>
                        <p style={{ color: '#64748b', fontSize: '15px' }}>Gérez les demandes MDPH pour vos enfants</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            backgroundColor: '#2563eb', color: 'white',
                            padding: '12px 24px', borderRadius: '12px',
                            fontWeight: '600', transition: 'all 0.2s',
                            cursor: 'pointer', border: 'none',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <Plus size={20} />
                        Nouveau dossier
                    </button>
                </div>

                {children.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 20px',
                        backgroundColor: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0',
                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', backgroundColor: '#f8fafc',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px', color: '#94a3b8'
                        }}>
                            <FileText size={40} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Aucun dossier en cours</h3>
                        <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.6' }}>
                            Commencez par créer un dossier pour votre enfant. Nous vous guiderons pas à pas pour optimiser votre dossier.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                backgroundColor: '#2563eb', color: 'white',
                                padding: '14px 28px', borderRadius: '12px',
                                fontWeight: '600', cursor: 'pointer', border: 'none'
                            }}
                        >
                            Créer mon premier dossier
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '32px' }}>
                        {children.map(child => (
                            <div key={child.id} style={{
                                backgroundColor: 'white', borderRadius: '24px',
                                border: '1px solid #e2e8f0', overflow: 'hidden',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.2s ease'
                            }}>
                                <div style={{
                                    padding: '24px 32px', borderBottom: '1px solid #f1f5f9',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '16px',
                                            backgroundColor: '#eff6ff', color: '#2563eb',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px', fontWeight: '800'
                                        }}>
                                            {child.first_name[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                                                {child.first_name}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    fontSize: '12px', padding: '4px 12px', borderRadius: '99px',
                                                    backgroundColor: child.status === 'completed' ? '#dcfce7' : '#fef9c3',
                                                    color: child.status === 'completed' ? '#166534' : '#854d0e',
                                                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em'
                                                }}>
                                                    {child.status === 'completed' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                                                    {child.status === 'completed' ? 'Dossier complet' : 'Brouillon'}
                                                </span>
                                                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                                                    Mis à jour le {new Date(child.last_updated).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(child.id)}
                                        style={{
                                            padding: '10px', color: '#94a3b8',
                                            background: 'transparent', border: 'none', cursor: 'pointer',
                                            borderRadius: '10px', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        title="Supprimer"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', backgroundColor: '#fff' }}>
                                    {/* Étape 1 */}
                                    <div style={{ padding: '32px', borderRight: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</div>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Espace Rédaction
                                            </h4>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <button
                                                onClick={() => navigate(`/questionnaire/${child.id}`)}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '20px', borderRadius: '16px',
                                                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                                                    color: '#0f172a', fontWeight: '600', cursor: 'pointer',
                                                    transition: 'all 0.2s', textAlign: 'left'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = '#fff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                            >
                                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                    <div style={{ color: '#2563eb' }}><FileText size={24} /></div>
                                                    <div>
                                                        <div style={{ fontSize: '16px' }}>Questionnaire & Synthèse</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                                                            {child.status === 'completed' ? 'Consulter mon dossier' : 'Reprendre la rédaction'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} color="#cbd5e1" />
                                            </button>

                                            {child.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDownloadPack(child)}
                                                    disabled={isGenerating === child.id}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '20px', borderRadius: '16px',
                                                        backgroundColor: '#eff6ff', border: '1px solid #dbeafe',
                                                        color: '#1e40af', fontWeight: '700', cursor: 'pointer',
                                                        transition: 'all 0.2s', textAlign: 'left'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                                                >
                                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                        <div style={{ color: '#2563eb' }}>
                                                            {isGenerating === child.id ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div> : <Download size={24} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '16px' }}>Télécharger le Pack Complet</div>
                                                            <div style={{ fontSize: '12px', color: '#3b82f6' }}>Synthèse AI + CERFA pré-rempli</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Étape 2 */}
                                    <div style={{ padding: '32px', backgroundColor: '#fafafa' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Espace Documents
                                            </h4>
                                        </div>

                                        <div style={{
                                            padding: '24px', border: '1px solid #e2e8f0', borderRadius: '20px',
                                            backgroundColor: 'white', textAlign: 'center'
                                        }}>
                                            <div style={{
                                                width: '56px', height: '56px', backgroundColor: '#ecfdf5', color: '#10b981',
                                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 16px'
                                            }}>
                                                <Heart size={28} />
                                            </div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                                Coffre-fort Numérique
                                            </h3>
                                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                                                Centralisez vos certificats médicaux et bilans en un seul lieu sécurisé.
                                            </p>
                                            <button
                                                onClick={() => setVaultOpenId(child.id)}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '12px',
                                                    backgroundColor: 'white', border: '1px solid #e2e8f0',
                                                    color: '#0f172a', fontWeight: '600', cursor: 'pointer',
                                                    transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                                            >
                                                Ouvrir mes documents
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {vaultOpenId && children.find(c => c.id === vaultOpenId) && (
                    <DocumentVault
                        isOpen={true}
                        onClose={() => setVaultOpenId(null)}
                        childId={vaultOpenId}
                        childName={children.find(c => c.id === vaultOpenId)?.first_name || 'Enfant'}
                    />
                )}
            </main>
        </div>
    );
};
