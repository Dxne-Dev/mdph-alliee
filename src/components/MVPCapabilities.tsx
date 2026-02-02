import { ClipboardCheck, Sparkles, FileDown } from 'lucide-react';

export const MVPCapabilities = () => {
    return (
        <section className="section-mvp" style={{ padding: '100px 0', background: 'white' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 className="section-title" style={{ marginBottom: '60px' }}>
                    Ce que l'Allié fera réellement pour vous
                </h2>

                <div className="mvp-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '30px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Card 1 */}
                    <div className="mvp-card" style={{
                        padding: '40px 30px',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left',
                        transition: 'transform 0.3s'
                    }}>
                        <div style={{ color: 'var(--accent)', marginBottom: '20px' }}><ClipboardCheck size={40} /></div>
                        <h3 style={{ marginBottom: '15px' }}>Questionnaire Intelligent</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Fini les formulaires froids. Vous répondez à des questions simples sur votre quotidien. Plus besoin d'être un expert administratif.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="mvp-card" style={{
                        padding: '40px 30px',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left',
                        transition: 'transform 0.3s'
                    }}>
                        <div style={{ color: 'var(--accent)', marginBottom: '20px' }}><Sparkles size={40} /></div>
                        <h3 style={{ marginBottom: '15px' }}>Traduction par IA</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            L'IA convertit votre vécu en langage administratif "irréfutable", en utilisant le référentiel précis attendu par la MDPH.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="mvp-card" style={{
                        padding: '40px 30px',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left',
                        transition: 'transform 0.3s'
                    }}>
                        <div style={{ color: 'var(--accent)', marginBottom: '20px' }}><FileDown size={40} /></div>
                        <h3 style={{ marginBottom: '15px' }}>Génération de Pack PDF</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            En un clic, téléchargez votre Projet de Vie structuré et votre Cerfa pré-rempli. Tout est prêt pour le dépôt immédiat.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
