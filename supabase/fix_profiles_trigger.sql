-- ============================================================
-- SCRIPT CORRECTIF : CRÉATION AUTOMATIQUE DES PROFILS
-- Ce script résout l'erreur "Key is not present in table profiles"
-- ============================================================

-- 1. Fonction qui sera exécutée à chaque nouvel inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name', -- Récupère le prénom si dispo
    NEW.raw_user_meta_data->>'last_name'  -- Récupère le nom si dispo
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger (Déclencheur)
-- Si le trigger existe déjà, on le supprime pour le recréer proprement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BONUS : Réparer les utilisateurs existants qui n'ont pas de profil
-- Cela va insérer une ligne dans profiles pour tous ceux qui manquent à l'appel
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
