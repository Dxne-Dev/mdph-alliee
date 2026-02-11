-- ============================================================
-- SCRIPT SQL - Intégration Paiement Chariow (Version Robuste)
-- ============================================================

-- 1. Créer la table transactions
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

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- 3. Activer RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Gérer la politique (Suppression si existe pour éviter l'erreur 42710)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'transactions' 
        AND policyname = 'Users can view own transactions'
    ) THEN
        DROP POLICY "Users can view own transactions" ON transactions;
    END IF;
END
$$;

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
