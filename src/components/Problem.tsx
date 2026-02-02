import { AlertCircle, History, Clock } from 'lucide-react';

export const Problem = () => {
    return (
        <section className="section-problem">
            <div className="container">
                <div className="problem-grid">
                    <div className="problem-text" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                        <h2 className="section-title">Le Supplice de Sisyphe Administratif</h2>
                        <p className="section-lead" style={{ marginBottom: '40px' }}>
                            "Pourquoi dois-je re-prouver chaque année que l'autisme de mon fils n'a pas disparu ?"
                        </p>

                        <div className="pain-points">
                            <div className="point">
                                <div className="icon"><AlertCircle className="text-red-500" /></div>
                                <div>
                                    <strong>71% des parents</strong>
                                    <p>disent que c'est ça, le pire : tout refaire. Le système est amnésique. Pas vous.</p>
                                </div>
                            </div>
                            <div className="point">
                                <div className="icon"><History className="text-blue-500" /></div>
                                <div>
                                    <strong>Tout reparcourir</strong>
                                    <p>Réécrire les mêmes difficultés, les mêmes soins, les mêmes échecs. Une charge mentale épuisante.</p>
                                </div>
                            </div>
                            <div className="point">
                                <div className="icon"><Clock className="text-purple-500" /></div>
                                <div>
                                    <strong>Le temps volé</strong>
                                    <p>Ce temps passé à remplir des cases identiques, c'est du temps volé à votre enfant et à votre repos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
