import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Maman de Lucas, 7 ans — TSA',
    text: "J'ai passé 3 semaines à essayer de rédiger le projet de vie toute seule. Avec L'Allié MDPH, c'était fait en 40 minutes. Et surtout, le dossier a été accepté du premier coup.",
    stars: 5,
    highlight: 'Accepté du premier coup',
  },
  {
    name: 'Sophie D.',
    role: 'Maman de Léa, 5 ans — TDAH',
    text: "Le questionnaire m'a fait réaliser des choses que je n'avais même pas pensé à mentionner. L'IA a transformé mes réponses en arguments solides. Notre AEEH complément 3 a été accordée.",
    stars: 5,
    highlight: 'AEEH complément 3 accordée',
  },
  {
    name: 'Karim B.',
    role: 'Papa de Sami, 9 ans — Dyspraxie',
    text: "On avait déjà eu un refus. Avec L'Allié, on a refait le dossier en mettant en avant les bonnes choses. Résultat : AESH individuel obtenu au renouvellement. Merci infiniment.",
    stars: 5,
    highlight: 'AESH individuel obtenu',
  },
];

export const Testimonials = () => (
  <section id="testimonials" style={{ padding: '120px 0', background: 'white' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '20px' }}>
          Ils ont fait confiance à <span className="text-gradient">L'Allié MDPH</span>
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Des familles comme la vôtre qui ont obtenu les droits qu'elles méritaient.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            style={{
              background: '#fafbfc',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}
          >
            {/* Quote icon */}
            <Quote size={32} style={{ color: 'var(--accent)', opacity: 0.2, position: 'absolute', top: '20px', right: '24px' }} />

            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {Array.from({ length: t.stars }).map((_, j) => (
                <Star key={j} size={18} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>

            {/* Text */}
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, flex: 1, marginBottom: '20px', fontStyle: 'italic' }}>
              "{t.text}"
            </p>

            {/* Highlight badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#059669',
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '20px',
              alignSelf: 'flex-start',
            }}>
              <ShieldCheck size={14} /> {t.highlight}
            </div>

            {/* Author */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{t.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
          * Témoignages représentatifs de l'expérience utilisateur typique. Résultats individuels variables.
        </p>
      </div>
    </div>
  </section>
);
