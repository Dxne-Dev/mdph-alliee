-- ============================================================
-- SCRIPT SQL - Intégration Paiement Chariow
-- À exécuter dans Supabase SQL Editor
-- ============================================================
-- NOTE : Pas de table "users" dans le schema public.
-- On utilise auth.users (métadonnées) pour le statut premium.
-- Seule la table "transactions" est créée ici pour le tracking.

-- 1. Créer la table transactions pour le suivi des paiements
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2),
  coupon_code TEXT,
  product_name TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_coupon ON transactions(coupon_code);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- 3. Activer RLS sur la table transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Politique RLS : les utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Le webhook utilise SUPABASE_SERVICE_ROLE_KEY → il bypass RLS automatiquement.
-- Pas besoin de politique INSERT pour les utilisateurs normaux.

-- ============================================================
-- REQUÊTES UTILES POUR LE SUIVI (à exécuter manuellement)
-- ============================================================

-- Voir toutes les transactions
-- SELECT * FROM transactions ORDER BY created_at DESC;

-- Stats par partenaire (coupon tracking)
-- SELECT
--   coupon_code AS partenaire,
--   COUNT(*) AS ventes,
--   SUM(amount) AS total_revenus
-- FROM transactions
-- WHERE coupon_code IS NOT NULL
-- GROUP BY coupon_code
-- ORDER BY ventes DESC;

-- Vérifier les utilisateurs premium (via auth.users metadata)
-- SELECT id, email, raw_user_meta_data->>'is_premium' AS is_premium
-- FROM auth.users
-- WHERE raw_user_meta_data->>'is_premium' = 'true';
