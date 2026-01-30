import { AlertCircle, Scale, BrainCircuit } from 'lucide-react';

export const Problem = () => {
    return (
        <section className="section-problem">
            <div className="container">
                <div className="problem-grid">
                    <div className="problem-text">
                        <h2>La "Page 4" est un piège.</h2>
                        <p>Vous la connaissez. C'est celle où l'on vous demande de décrire le "Projet de vie" et le quotidien. C'est le moment le plus violent de l'année.</p>

                        <div className="pain-points">
                            <div className="point">
                                <div className="icon"><AlertCircle className="text-red-500" /></div>
                                <div>
                                    <strong>Le sentiment de trahison</strong>
                                    <p>Lister les échecs de votre propre enfant. "Il ne sait pas se laver", "Il n'a pas d'amis". Vous avez l'impression de le trahir noir sur blanc.</p>
                                </div>
                            </div>
                            <div className="point">
                                <div className="icon"><Scale className="text-blue-500" /></div>
                                <div>
                                    <strong>L'injustice administrative</strong>
                                    <p>L'administration n'a pas de cœur, elle a un algorithme. Si vous dites "il est fatigué", ça vaut 0 point. Si vous ne parlez pas leur langue, le dossier est rejeté.</p>
                                </div>
                            </div>
                            <div className="point">
                                <div className="icon"><BrainCircuit className="text-purple-500" /></div>
                                <div>
                                    <strong>La paralysie de la page blanche</strong>
                                    <p>Comment décrire sans s'effondrer ? Comment être factuel quand on a les nerfs à vif ? Résultat : vous repoussez, vous doutez, vous dormez mal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
