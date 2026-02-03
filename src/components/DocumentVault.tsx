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
                        {/* Header */}
                        <div style={{ padding: '30px', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(to right, #f8fafc, white)' }}>
                            <button
                                onClick={onClose}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--primary)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileCheck size={28} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>Coffre-fort de {childName}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gérez les documents médicaux et scolaires en toute sécurité.</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                            {/* Upload Area */}
                            <div style={{ marginBottom: '30px' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '40px',
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: uploading ? '#f8fafc' : 'white'
                                    }}
                                    className="upload-zone"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={32} className="animate-spin text-accent" />
                                            <span style={{ marginTop: '12px', fontWeight: '600' }}>Envoi en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ width: '48px', height: '48px', background: '#fff3eb', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                                <Upload size={24} />
                                            </div>
                                            <span style={{ fontWeight: '600', marginBottom: '4px' }}>Cliquez pour ajouter un document</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PDF, JPG, PNG (Max 5Mo)</span>
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
                                                    padding: '16px',
                                                    background: 'white',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    gap: '16px'
                                                }}
                                            >
                                                <div style={{ width: '40px', height: '40px', background: '#f1f5f9', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <FileText size={20} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {doc.name}
                                                    </h4>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {(doc.size / 1024).toFixed(1)} Ko • {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        style={{ padding: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '6px' }}
                                                        className="action-icon"
                                                        title="Télécharger"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmItem(doc)}
                                                        style={{ padding: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '6px' }}
                                                        className="action-icon"
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
                            <div style={{ width: '60px', height: '60px', background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <AlertCircle size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Supprimer le document ?</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Cette action est irréversible. Voulez-vous supprimer "{deleteConfirmItem.name}" ?</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button onClick={() => setDeleteConfirmItem(null)} className="btn-secondary">Annuler</button>
                                <button onClick={handleDelete} className="btn-primary" style={{ background: '#ef4444' }}>Supprimer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
};
