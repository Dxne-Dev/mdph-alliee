import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ClipboardCheck, ArrowRight, ShieldCheck, Calendar, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const REQUIRED = [
  'Formulaire Cerfa 15692*01 (demande MDPH)',
  'Certificat médical MDPH (Cerfa 15695*01)',
  "Justificatif d'identité de l'enfant",
  'Justificatif de domicile (moins de 3 mois)',
  "Photo d'identité récente",
];

const RECOMMENDED = [
  'Bilan orthophonique',
  'Bilan psychomoteur',
  'Bilan ergothérapie',
  'Bilan psychologique / neuropsychologique',
  'Compte-rendu médical du spécialiste',
  "GEVASCO ou PAP de l'école",
  "Courrier de l'enseignant ou directeur",
  'Projet de Vie rédigé',
  'Factures des soins non remboursés',
];

const HAS_EXPIRY = new Set([
  'Certificat médical MDPH (Cerfa 15695*01)',
  'Justificatif de domicile (moins de 3 mois)',
  'Bilan orthophonique', 'Bilan psychomoteur', 'Bilan ergothérapie',
  'Bilan psychologique / neuropsychologique',
  'Compte-rendu médical du spécialiste',
]);

type Status = 'provided' | 'missing' | undefined;

export const FreeChecklist = () => {
  const [started, setStarted] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dates, setDates] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const toggle = (label: string) => setChecked(p => ({ ...p, [label]: !p[label] }));
  const setDate = (label: string, v: string) => setDates(p => ({ ...p, [label]: v }));

  const getDateStatus = (label: string) => {
    if (!dates[label]) return null;
    const d = new Date(dates[label]);
    const ago12 = new Date(); ago12.setMonth(ago12.getMonth() - 12);
    const ago9 = new Date(); ago9.setMonth(ago9.getMonth() - 9);
    if (d < ago12) return 'expired';
    if (d < ago9) return 'expiring';
    return 'valid';
  };

  const reqMissing = REQUIRED.filter(d => !checked[d]);
  const expired = [...REQUIRED, ...RECOMMENDED].filter(d => checked[d] && getDateStatus(d) === 'expired');
  const expiring = [...REQUIRED, ...RECOMMENDED].filter(d => checked[d] && getDateStatus(d) === 'expiring');
  const score = Math.round((REQUIRED.filter(d => checked[d]).length / REQUIRED.length) * 100);
  const isReady = reqMissing.length === 0 && expired.length === 0;

  // --- INTRO ---
  if (!started) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <nav className="navbar" style={{ top: 0 }}><Link to="/" className="logo">L'Allié <span className="highlight">MDPH</span></Link><Link to="/auth" className="btn-sm">Se connecter</Link></nav>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'inline-flex', padding: '10px 20px', background: '#fff3eb', color: 'var(--accent)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
            <ClipboardCheck size={18} style={{ marginRight: '8px' }} /> Outil 100% gratuit
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>Votre dossier MDPH est-il <span className="text-gradient">complet ?</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px', lineHeight: 1.7 }}>En 2 minutes, vérifiez que vous n'avez rien oublié. Pas de compte requis, pas de paiement. Juste la liste de ce qui manque.</p>
          <button onClick={() => setStarted(true)} className="btn-primary" style={{ padding: '20px 50px', fontSize: '1.15rem' }}>Vérifier mon dossier <ArrowRight size={20} /></button>
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}><ShieldCheck size={16} style={{ color: 'var(--accent)' }} /> Aucune donnée conservée</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}><Lock size={16} style={{ color: 'var(--accent)' }} /> 100% anonyme</div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // --- RESULTS ---
  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <nav className="navbar" style={{ top: 0 }}><Link to="/" className="logo">L'Allié <span className="highlight">MDPH</span></Link><Link to="/auth" className="btn-sm">Se connecter</Link></nav>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ background: isReady ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)', padding: '48px', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '40px', border: `2px solid ${isReady ? '#10b981' : '#ef4444'}` }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: isReady ? '#059669' : '#dc2626', marginBottom: '8px' }}>{score}%</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: isReady ? '#065f46' : '#991b1b' }}>{isReady ? '✅ Votre dossier est prêt !' : `⚠️ Il manque ${reqMissing.length} pièce(s) obligatoire(s)`}</h2>
            <p style={{ color: isReady ? '#047857' : '#b91c1c' }}>{isReady ? 'Toutes les pièces obligatoires sont fournies.' : 'Votre dossier risque d\'être refusé ou retardé.'}</p>
          </div>

          {reqMissing.length > 0 && <ResultSection icon={<XCircle size={22} />} title="Pièces obligatoires manquantes" color="#dc2626" borderColor="#fecaca" items={reqMissing} />}
          {expired.length > 0 && <ResultSection icon={<AlertTriangle size={22} />} title="Documents expirés (+12 mois)" color="#ea580c" borderColor="#fed7aa" items={expired.map(d => `${d} — expiré`)} />}
          {expiring.length > 0 && <ResultSection icon={<Calendar size={22} />} title="Expirent bientôt (9-12 mois)" color="#d97706" borderColor="#fde68a" items={expiring} />}

          <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', marginTop: '40px', color: 'white' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '12px' }}>Besoin d'aide pour rédiger votre dossier ?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '28px', fontSize: '1.05rem' }}>L'Allié MDPH génère votre Projet de Vie et votre CERFA pré-rempli grâce à l'IA. À partir de 19€.</p>
            <Link to="/auth" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Créer mon dossier complet <ArrowRight size={20} /></Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={() => setDone(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>← Modifier mes réponses</button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // --- FORM ---
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <nav className="navbar" style={{ top: 0 }}><Link to="/" className="logo">L'Allié <span className="highlight">MDPH</span></Link><Link to="/auth" className="btn-sm">Se connecter</Link></nav>
      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '40px 20px 100px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}><ClipboardCheck size={28} style={{ color: 'var(--accent)', verticalAlign: 'middle', marginRight: '8px' }} />Checklist Pièces Justificatives</h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Cochez ce que vous avez. Nous vous dirons ce qui manque.</p>
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} /> Pièces Obligatoires</h2>
          <div style={{ display: 'grid', gap: '10px', marginBottom: '36px' }}>
            {REQUIRED.map(label => <DocRow key={label} label={label} isChecked={!!checked[label]} hasExpiry={HAS_EXPIRY.has(label)} date={dates[label]} dateStatus={getDateStatus(label)} onToggle={() => toggle(label)} onDate={v => setDate(label, v)} required />)}
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} /> Pièces Recommandées</h2>
          <div style={{ display: 'grid', gap: '10px', marginBottom: '36px' }}>
            {RECOMMENDED.map(label => <DocRow key={label} label={label} isChecked={!!checked[label]} hasExpiry={HAS_EXPIRY.has(label)} date={dates[label]} dateStatus={getDateStatus(label)} onToggle={() => toggle(label)} onDate={v => setDate(label, v)} />)}
          </div>

          <button onClick={() => { setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.15rem', justifyContent: 'center' }}>Voir mon résultat <ArrowRight size={20} /></button>
        </motion.div>
      </div>
    </div>
  );
};

const DocRow = ({ label, isChecked, hasExpiry, date, dateStatus, onToggle, onDate, required }: { label: string; isChecked: boolean; hasExpiry: boolean; date?: string; dateStatus: string | null; onToggle: () => void; onDate: (v: string) => void; required?: boolean }) => (
  <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: `1px solid ${isChecked ? '#bbf7d0' : '#e2e8f0'}`, padding: '14px 18px', transition: 'all 0.2s' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}>
        <input type="checkbox" checked={isChecked} onChange={onToggle} style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: isChecked ? '#047857' : '#1e293b' }}>{label}</span>
      </label>
      {required && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>OBLIGATOIRE</span>}
    </div>
    <AnimatePresence>
      {isChecked && hasExpiry && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Calendar size={14} style={{ color: '#64748b' }} />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Date du document :</span>
            <input type="date" value={date || ''} onChange={e => onDate(e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
            {dateStatus === 'expired' && <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>⚠️ +12 mois</span>}
            {dateStatus === 'expiring' && <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>⏳ Expire bientôt</span>}
            {dateStatus === 'valid' && <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>✓ Valide</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ResultSection = ({ icon, title, color, borderColor, items }: { icon: React.ReactNode; title: string; color: string; borderColor: string; items: string[] }) => (
  <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '20px', border: `1px solid ${borderColor}` }}>
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color, marginBottom: '16px', fontSize: '1.05rem' }}>{icon} {title}</h3>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '0.9rem' }}>
        <XCircle size={16} style={{ color, flexShrink: 0 }} /> {item}
      </div>
    ))}
  </div>
);
