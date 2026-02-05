import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Trash2, Download, Loader2, FileCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DocumentVaultProps {
    isOpen: boolean;
    onClose: () => void;
    childId: string;
    childName: string;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ isOpen, onClose, childId, childName }) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<any>(null);

    useEffect(() => {
        if (isOpen && childId) {
            fetchDocuments();
        }
    }, [isOpen, childId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('child_id', childId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error: any) {
            console.error('Error fetching documents:', error);
            toast.error('Erreur lors du chargement des documents');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation - Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Le fichier est trop volumineux (max 5Mo)');
            return;
        }

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${user.id}/${childId}/${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('child_documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Save metadata to DB
            const { error: dbError } = await supabase
                .from('documents')
                .insert([{
                    child_id: childId,
                    user_id: user.id,
                    name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    size: file.size
                }]);

            if (dbError) throw dbError;

            toast.success('Document ajouté ! ✨');
            fetchDocuments();
        } catch (error: any) {
            console.error('Error uploading:', error);
            toast.error('Erreur lors de l\'envoi : ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirmItem) return;
        const doc = deleteConfirmItem;

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('child_documents')
                .remove([doc.file_path]);

            if (storageError) throw storageError;

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', doc.id);

            if (dbError) throw dbError;

            toast.success('Document supprimé');
            setDocuments(docs => docs.filter(d => d.id !== doc.id));
            setDeleteConfirmItem(null);
        } catch (error: any) {
            console.error('Error deleting:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDownload = async (doc: any) => {
        try {
            const { data, error } = await supabase.storage
                .from('child_documents')
                .download(doc.file_path);

            if (error) throw error;

            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error downloading:', error);
            toast.error('Erreur lors du téléchargement');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                    onClick={onClose}
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
                            maxWidth: '700px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header - Premium */}
                        <div style={{
                            padding: '32px 40px',
                            borderBottom: '1px solid var(--border-subtle)',
                            background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)',
                            position: 'relative'
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '24px',
                                    right: '24px',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '10px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = 'var(--primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '56px', height: '56px',
                                    background: 'var(--gradient-text)',
                                    color: 'white',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)'
                                }}>
                                    <FileCheck size={32} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                                        Coffre-fort de {childName}
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
                                        Gérez vos bilans et certificats en toute sécurité.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                            {/* Upload Area - Premium */}
                            <div style={{ marginBottom: '40px' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '48px',
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: uploading ? '#f8fafc' : 'linear-gradient(to bottom, #ffffff, #fafafa)',
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.01)'
                                    }}
                                    className="upload-zone"
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fffafa'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'linear-gradient(to bottom, #ffffff, #fafafa)'; }}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
                                            <span style={{ marginTop: '16px', fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem' }}>Sécurisation en cours...</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Votre fichier est en cours de transfert</span>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{
                                                width: '64px', height: '64px',
                                                background: '#fff3eb',
                                                color: 'var(--accent)',
                                                borderRadius: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '20px',
                                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)'
                                            }}>
                                                <Upload size={30} />
                                            </div>
                                            <span style={{ fontWeight: '800', marginBottom: '6px', fontSize: '1.1rem', color: 'var(--primary)' }}>Ajouter un nouveau document</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Glisser-déposer ou cliquer pour parcourir (Max 5Mo)</span>
                                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '12px' }}>Formats acceptés: PDF, JPG, PNG</span>
                                        </>
                                    )}
                                    <input type="file" onChange={handleUpload} hidden disabled={uploading} accept=".pdf,.jpg,.jpeg,.png" />
                                </label>
                            </div>

                            {/* Documents List */}
                            <div className="documents-list">
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Vos documents ({documents.length})
                                </h3>

                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--accent)' }} />
                                    </div>
                                ) : documents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                                        <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                                        <p>Aucun document pour le moment.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '20px 24px',
                                                    background: 'white',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    gap: '20px',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }}
                                                className="document-item"
                                            >
                                                <div style={{
                                                    width: '48px', height: '48px',
                                                    background: 'var(--bg-light)',
                                                    color: 'var(--primary)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    border: '1px solid var(--border-subtle)'
                                                }}>
                                                    <FileText size={24} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {doc.name}
                                                    </h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                            {(doc.size / 1024).toFixed(1)} Ko
                                                        </span>
                                                        <span style={{ color: '#cbd5e1' }}>•</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                            {new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        style={{
                                                            padding: '10px',
                                                            background: '#f8fafc',
                                                            border: '1px solid #e2e8f0',
                                                            color: 'var(--primary)',
                                                            cursor: 'pointer',
                                                            borderRadius: '10px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = 'var(--primary)'; }}
                                                        title="Télécharger"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmItem(doc)}
                                                        style={{
                                                            padding: '10px',
                                                            background: '#fff1f2',
                                                            border: '1px solid #ffe4e6',
                                                            color: '#e11d48',
                                                            cursor: 'pointer',
                                                            borderRadius: '10px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e11d48'; e.currentTarget.style.color = 'white'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '20px 30px', background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={onClose}
                                className="btn-secondary"
                                style={{ padding: '10px 24px' }}
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmItem && (
                    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', maxWidth: '400px', textAlign: 'center' }}
                        >
                            <div style={{ width: '80px', height: '80px', background: '#fef2f2', color: '#ef4444', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.1)' }}>
                                <AlertCircle size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>Supprimer le document ?</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' }}>
                                Cette action est irréversible. Voulez-vous vraiment supprimer <span style={{ color: 'var(--primary)', fontWeight: '700' }}>"{deleteConfirmItem.name}"</span> ?
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <button
                                    onClick={() => setDeleteConfirmItem(null)}
                                    className="btn-outline"
                                    style={{ padding: '14px', border: '1px solid var(--border-subtle)' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn-primary"
                                    style={{ background: '#ef4444', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)', padding: '14px' }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
};
