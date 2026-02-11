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

    const fetchDashboardData = async () => {
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

            const { data: childrenDocs } = await supabase
                .from('documents')
                .select('*')
                .eq('user_id', user.id);

            const childrenData = submissions?.map(sub => {
                const childId = sub.child_id || sub.id;
                const childDocs = childrenDocs?.filter(d => d.child_id === childId) || [];

                // Vérifier si un certificat médical est expiré (+12 mois)
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

                const hasExpiredDoc = childDocs.some(d =>
                    d.category === 'certificat_medical' &&
                    d.document_date &&
                    new Date(d.document_date) < twelveMonthsAgo
                );

                const hasMedicalCert = childDocs.some(d => d.category === 'certificat_medical');
                const hasId = childDocs.some(d => d.category === 'identite');
                const hasAddress = childDocs.some(d => d.category === 'domicile');
                const hasPhoto = childDocs.some(d => d.category === 'photo');

                return {
                    id: childId,
                    first_name: sub.answers?.firstName || 'Enfant sans nom',
                    status: sub.status || 'draft',
                    last_updated: sub.updated_at,
                    answers: sub.answers,
                    docCount: childDocs.length,
                    hasExpiredDoc,
                    docs: {
                        medical: hasMedicalCert,
                        identite: hasId,
                        domicile: hasAddress,
                        photo: hasPhoto
                    }
                };
            }) || [];

            setChildren(childrenData);
        } catch (err) {
            console.error('Refresh error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initialisation
    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    // Gérer le retour après paiement Chariow (?paid=true dans l'URL)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('paid') === 'true') {
            toast.loading('Vérification de votre paiement...', { id: 'payment-return' });

            let attempts = 0;
            const maxAttempts = 15;

            const pollInterval = setInterval(async () => {
                attempts++;
                try {
                    // Rafraîchir les données user pour obtenir les metadata à jour
                    const { data: { user: currentUser } } = await supabase.auth.getUser();
                    if (!currentUser) return;

                    // Vérifier is_premium dans user_metadata (mis à jour par le webhook Chariow)
                    if (currentUser.user_metadata?.is_premium) {
                        clearInterval(pollInterval);
                        toast.success('Paiement confirmé ! Votre accès est activé 🎉', { id: 'payment-return' });
                        // Nettoyer l'URL
                        window.history.replaceState({}, '', '/dashboard');
                        // Rafraîchir les données
                        fetchDashboardData();
                        return;
                    }
                } catch (e) {
                    console.warn('Erreur polling paiement:', e);
                }

                if (attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    toast.dismiss('payment-return');
                    toast('Le paiement est en cours de traitement. Rafraîchissez dans quelques instants.', {
                        icon: '⏳',
                        duration: 6000,
                    });
                    window.history.replaceState({}, '', '/dashboard');
                }
            }, 2000);

            return () => clearInterval(pollInterval);
        }
    }, []);

    const handleVaultClose = () => {
        setVaultOpenId(null);
        fetchDashboardData(); // Rafraîchir les compteurs
    };

    const handleCreateNew = async () => {
        const newChildId = crypto.randomUUID();
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            // 1. Créer l'enfant
            const { error: childError } = await supabase
                .from('children')
                .insert([{
                    id: newChildId,
                    parent_id: currentUser.id,
                    first_name: 'Nouvel enfant'
                }]);

            if (childError) throw childError;

            // 2. Créer la soumission
            const { error: subError } = await supabase
                .from('submissions')
                .insert([{
                    user_id: currentUser.id,
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) return;

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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            <header style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '20px 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div className="container dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--gradient-text)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 8px 16px rgba(249, 115, 22, 0.25)'
                        }}>
                            <ClipboardList size={24} />
                        </div>
                        <h1 className="logo" style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--primary)' }}>L'Allié</span> <span style={{ color: 'var(--accent)' }}>MDPH</span>
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Bonjour, <span style={{ color: 'var(--primary)' }}>{user?.email?.split('@')[0]}</span></span>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
                            className="btn-outline"
                            style={{ padding: '8px 16px', fontSize: '13px', border: '1px solid var(--border-subtle)' }}
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '48px 20px', position: 'relative' }}>
                {/* Decorative background blur */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: '400px',
                    background: 'radial-gradient(circle at top, rgba(249, 115, 22, 0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Notification Banner - Premium Orange */}
                <div style={{
                    marginBottom: '40px',
                    padding: '24px',
                    backgroundColor: '#fff3eb',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.05)'
                }} className="banner-responsive">
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'var(--gradient-text)', color: 'white',
                        borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)'
                    }}>
                        <Bell size={28} />
                    </div>
                    <div style={{ flex: '1 1 250px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                            Notifications de suivi
                        </h3>
                        <p style={{ color: 'var(--text-main)', fontSize: '15px', margin: 0, opacity: 0.8 }}>
                            Nous vous préviendrons par email 3 mois avant le renouvellement. Prochaine échéance : <span style={{ color: 'var(--accent)', fontWeight: '800' }}>05 Mars 2026</span>
                        </p>
                    </div>
                    <div className="btn-xs" style={{ margin: 0, background: 'white', color: 'var(--accent)', padding: '8px 16px', borderRadius: '8px' }}>
                        Activé
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: 'min(36px, 8vw)', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', letterSpacing: '-0.03em' }}>Mes Dossiers</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '17px', fontWeight: '500' }}>Gérez les demandes MDPH pour vos enfants</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="btn-primary"
                        style={{ padding: '16px 32px' }}
                    >
                        <Plus size={22} />
                        Nouveau dossier
                    </button>
                </div>

                {children.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '100px 40px',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px dashed var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{
                            width: '100px', height: '100px',
                            background: '#f8fafc',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            color: 'var(--accent)',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <FileText size={48} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>Aucun dossier en cours</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '450px', lineHeight: '1.6', fontSize: '16px', fontWeight: '500' }}>
                            Commencez par créer un dossier pour votre enfant. Nous vous guiderons pas à pas pour optimiser votre demande MDPH.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="btn-primary"
                            style={{ padding: '18px 48px' }}
                        >
                            <Plus size={22} />
                            Créer mon premier dossier
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '32px' }}>
                        {children.map(child => (
                            <div key={child.id} style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-subtle)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    padding: '24px 20px',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'linear-gradient(to right, #ffffff, #fcfcfc)',
                                    flexWrap: 'wrap',
                                    gap: '16px'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{
                                            width: '56px', height: '56px',
                                            borderRadius: '16px',
                                            background: 'var(--gradient-text)',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px',
                                            fontWeight: '800',
                                            boxShadow: '0 8px 20px rgba(249, 115, 22, 0.2)',
                                            flexShrink: 0
                                        }}>
                                            {child.first_name[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                                                {child.first_name}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    fontSize: '11px', padding: '4px 10px', borderRadius: '99px',
                                                    backgroundColor: child.status === 'completed' ? '#ecfdf5' : '#fff7ed',
                                                    color: child.status === 'completed' ? '#059669' : '#d97706',
                                                    fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}>
                                                    {child.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                    {child.status === 'completed' ? 'Dossier complet' : 'En rédaction'}
                                                </span>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                    Mis à jour le {new Date(child.last_updated).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(child.id)}
                                        style={{
                                            padding: '8px',
                                            color: 'var(--text-muted)',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        title="Supprimer"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', backgroundColor: '#fff' }}>
                                    {/* Étape 1 - Rédaction */}
                                    <div style={{ padding: '32px 24px', borderRight: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>1</div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Espace Rédaction
                                            </h4>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <button
                                                onClick={() => navigate(`/questionnaire/${child.id}`)}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '20px', borderRadius: '20px',
                                                    backgroundColor: 'white', border: '1px solid var(--border-subtle)',
                                                    color: 'var(--primary)', fontWeight: '700', cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'left',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--accent)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(249, 115, 22, 0.08)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                                    <div style={{ color: 'var(--accent)', background: '#fff3eb', padding: '10px', borderRadius: '12px' }}>
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '16px', color: 'var(--primary)' }}>Synthèse & Projet</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '2px' }}>
                                                            {child.status === 'completed' ? 'Voir ma synthèse' : 'Reprendre la rédaction'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} color="var(--accent)" />
                                            </button>

                                            {child.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDownloadPack(child)}
                                                    disabled={isGenerating === child.id}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '20px', borderRadius: '20px',
                                                        backgroundColor: 'var(--primary)', border: 'none',
                                                        color: 'white', fontWeight: '700', cursor: 'pointer',
                                                        transition: 'all 0.3s ease', textAlign: 'left',
                                                        boxShadow: '0 8px 16px rgba(15, 23, 42, 0.2)'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = 'var(--primary-light)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
                                                >
                                                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                                        <div style={{ color: 'var(--accent)', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                                                            {isGenerating === child.id ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Download size={24} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '16px' }}>Pack complet</div>
                                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Synthèse + CERFA</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Étape 2 - Documents */}
                                    <div style={{ padding: '40px', backgroundColor: '#fcfcfc' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>2</div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Espace Documents
                                            </h4>
                                        </div>

                                        <div style={{
                                            padding: '24px',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '24px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                                <div style={{
                                                    width: '48px', height: '48px', backgroundColor: child.docCount >= 5 ? '#ecfdf5' : '#fefce8',
                                                    color: child.docCount >= 5 ? '#10b981' : '#ca8a04',
                                                    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Heart size={24} />
                                                </div>
                                                <div style={{ textAlign: 'left' }}>
                                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                                                        Checklist Pièces
                                                    </h3>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                        {child.docCount} / 5 documents chargés
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                                {[
                                                    { label: 'Certificat Médical MDPH', isProvided: child.docs.medical },
                                                    { label: 'Pièce d\'identité enfant', isProvided: child.docs.identite },
                                                    { label: 'Justificatif de domicile', isProvided: child.docs.domicile },
                                                    { label: 'Photo d\'identité', isProvided: child.docs.photo },
                                                    { label: 'Bilans & Bilans (Optionnel)', isProvided: child.docCount > 4 }
                                                ].map((doc, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex', alignItems: 'center', gap: '10px',
                                                        fontSize: '13px', color: doc.isProvided ? 'var(--primary)' : 'var(--text-muted)',
                                                        fontWeight: '500'
                                                    }}>
                                                        <div style={{
                                                            width: '18px', height: '18px', borderRadius: '50%',
                                                            backgroundColor: doc.isProvided ? '#ecfdf5' : '#f1f5f9',
                                                            color: doc.isProvided ? '#10b981' : '#cbd5e1',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            {doc.isProvided ? <CheckCircle2 size={12} /> : <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />}
                                                        </div>
                                                        {doc.label}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setVaultOpenId(child.id)}
                                                className="btn-outline"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                    fontWeight: '700'
                                                }}
                                            >
                                                Gérer mes documents
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
                        onClose={handleVaultClose}
                        childId={vaultOpenId}
                        childName={children.find(c => c.id === vaultOpenId)?.first_name || 'Enfant'}
                    />
                )}
            </main>
        </div>
    );
};
