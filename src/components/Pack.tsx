import { CheckCircle } from 'lucide-react';

export const Pack = () => {
    return (
        <section className="section-pack">
            <div className="container">
                <div className="pack-wrapper">
                    <div className="pack-image">
                        {/* Placeholder using CSS shapes for a "Document Stack" look */}
                        <div className="doc-stack">
                            <div className="doc doc-1">CERFA</div>
                            <div className="doc doc-2">PROJET DE VIE</div>
                            <div className="doc doc-3">CHECKLIST</div>
                        </div>
                    </div>
                    <div className="pack-content">
                        <h2>Ce que vous recevez (Le Pack)</h2>
                        <ul className="benefit-list">
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Cerfa Pré-rempli (Format Officiel)</strong>
                                    <p>Vos infos au bon endroit, sans bagarre avec le PDF.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Annexe "Vie Quotidienne" Structurée</strong>
                                    <p>Une synthèse claire orientée "retentissement" (scolarité, autonomie, vie sociale). C'est la pièce maîtresse qui manque à 90% des dossiers refusés.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check"><CheckCircle className="text-orange-500" /></div>
                                <div>
                                    <strong>Checklist Intelligente</strong>
                                    <p>Ce qui est obligatoire, ce qui est recommandé, ce qui manque. Zéro oubli.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
