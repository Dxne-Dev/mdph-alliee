import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
    Plus, FileText, ChevronRight, Download, Trash2,
    CheckCircle2, Clock, ArrowRight, Bell
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
            // 1. D'abord créer l'enfant dans la table 'children'
            const { error: childError } = await supabase
                .from('children')
                .insert([{
                    id: newChildId,
                    user_id: user.id,
                    first_name: 'Nouvel enfant'
                }]);

            if (childError) throw childError;

            // 2. Ensuite créer la soumission liée
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>L'Allié MDPH</h1>
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
                        style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

                {/* Notification Banner */}
                <div style={{
                    marginBottom: '40px',
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        backgroundColor: '#f0f9ff', color: '#0ea5e9',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Bell size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                            Notifications actives
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Nous vous préviendrons par email 3 mois avant le renouvellement de vos dossiers MDPH.
                            <br />
                            <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '500' }}>Prochaine vérification : 05 Mars 2026</span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>Mes Dossiers</h2>
                        <p style={{ color: '#64748b' }}>Gérez les demandes de vos enfants</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#2563eb', color: 'white',
                            padding: '10px 20px', borderRadius: '8px',
                            fontWeight: '500', transition: 'all 0.2s',
                            cursor: 'pointer', border: 'none'
                        }}
                    >
                        <Plus size={20} />
                        Nouveau dossier
                    </button>
                </div>

                {children.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px 20px',
                        backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0'
                    }}>
                        <div style={{
                            width: '64px', height: '64px', backgroundColor: '#eff6ff',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', color: '#2563eb'
                        }}>
                            <FileText size={32} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Aucun dossier en cours</h3>
                        <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                            Commencez par créer un dossier pour votre enfant. Nous vous guiderons étape par étape.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                backgroundColor: '#2563eb', color: 'white',
                                padding: '12px 24px', borderRadius: '8px',
                                fontWeight: '500', cursor: 'pointer', border: 'none'
                            }}
                        >
                            Commencer maintenant
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {children.map(child => (
                            <div key={child.id} style={{
                                backgroundColor: 'white', borderRadius: '16px',
                                border: '1px solid #e2e8f0', overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                            }}>
                                <div style={{
                                    padding: '24px', borderBottom: '1px solid #f1f5f9',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                                }}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{
                                            width: '60px', height: '60px', borderRadius: '12px',
                                            backgroundColor: '#eff6ff', color: '#2563eb',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '24px', fontWeight: 'bold'
                                        }}>
                                            {child.first_name[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                                                {child.first_name}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    fontSize: '12px', padding: '4px 10px', borderRadius: '99px',
                                                    backgroundColor: child.status === 'completed' ? '#dcfce7' : '#fef9c3',
                                                    color: child.status === 'completed' ? '#166534' : '#854d0e',
                                                    fontWeight: '600'
                                                }}>
                                                    {child.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                    {child.status === 'completed' ? 'Dossier prêt' : 'En cours de rédaction'}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                    Dernière modif : {new Date(child.last_updated).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleDelete(child.id)}
                                            style={{
                                                padding: '8px', color: '#ef4444',
                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px'
                                            }}
                                            title="Supprimer le dossier"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                                    <div style={{ padding: '24px', borderRight: '1px solid #f1f5f9' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            ÉTAPE 1 : Questionnaire & Synthèse
                                        </h4>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <button
                                                onClick={() => navigate(`/questionnaire/${child.id}`)}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '16px', borderRadius: '8px',
                                                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                                                    color: '#0f172a', fontWeight: '500', cursor: 'pointer',
                                                    transition: 'all 0.2s', textAlign: 'left'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{ color: '#2563eb' }}><FileText size={20} /></div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>Questionnaire MDPH</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                            {child.status === 'completed' ? 'Revoir les réponses' : 'Continuer la rédaction'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} color="#94a3b8" />
                                            </button>

                                            {child.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDownloadPack(child)}
                                                    disabled={isGenerating === child.id}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '16px', borderRadius: '8px',
                                                        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                                                        color: '#1e40af', fontWeight: '500', cursor: 'pointer',
                                                        transition: 'all 0.2s', textAlign: 'left'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ color: '#1e40af' }}>
                                                            {isGenerating === child.id ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div> : <Download size={20} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '600' }}>Télécharger le Pack Allié</div>
                                                            <div style={{ fontSize: '12px', color: '#60a5fa' }}>Synthèse PDF + CERFA pré-rempli</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={16} color="#1e40af" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ padding: '24px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-start' }}>
                                            ÉTAPE 2 : Pièces Justificatives
                                        </h4>

                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <div style={{
                                                width: '64px', height: '64px', backgroundColor: '#f0fdf4', color: '#16a34a',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 16px'
                                            }}>
                                                <FileText size={28} />
                                            </div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
                                                Gérez vos documents
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                                Stockez et organisez les certificats, bilans et autres justificatifs.
                                            </p>
                                            <button
                                                onClick={() => setVaultOpenId(child.id)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 20px', borderRadius: '8px',
                                                    backgroundColor: 'white', border: '1px solid #cbd5e1',
                                                    color: '#0f172a', fontWeight: '500', cursor: 'pointer',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                Ouvrir le coffre-fort
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
