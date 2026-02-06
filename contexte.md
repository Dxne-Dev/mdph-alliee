# 📋 Roadmap & Contexte : L'Allié MDPH

Ce document récapitule les étapes restantes pour finaliser le MVP de "L'Allié MDPH" en prévision du lancement (prévu le 14 février).

---

## 🚀 1. Optimisation du Cœur IA (Priorité Haute)
Améliorer la qualité de la synthèse générée pour passer d'un texte "correct" à un texte "expert/percutant".

- [x] **Mise à jour du System Prompt** : Intégrer la variante "Traducteur de dignité" (complété ✅).
- [x] **Refonte du User Prompt** : Passage à une structure template/JSON optimisée (complété ✅).
- [x] **Mapping Sémantique** : Refonte des fonctions de mapping pour un impact MDPH maximal (complété ✅).
- [x] **Calcul du Reste à Charge** : Intégré dans le flux de génération (complété ✅).

## 📄 2. Amélioration des Documents (Sortie)
- [x] **Mise en page PDF Synthesis** : Rendu dynamique des sections et tableaux Markdown (complété ✅).
- [x] **Extension du Cerfa** : Mappage dynamique des champs Nom, Prénom, Ville de naissance et Représentant (complété ✅).

## 🛠️ 3. Nouvelles Fonctionnalités & UX
- [x] **Système de Checklist PJ** : Checklist dynamique basée sur le nombre de documents (V1 complétée ✅).
- [x] **Gestion des Mots de Passe** : Flux "Mot de passe oublié" intégré via Supabase Auth (complété ✅).
- [x] **Alertes Documents** : (V2) Signaler si un certificat médical a plus de 12 mois (complété ✅).

## 💰 4. Monétisation & Légal
- [ ] **Stripe Live** : Passer du lien de test au lien Stripe réel (Payment Link).
- [ ] **Pages Légales** : Rédiger et intégrer les Mentions Légales et les CGV (obligatoire pour le lancement).
- [ ] **Emailing Transactionnel** : Configurer l'envoi d'un email de confirmation avec le pack après paiement.

## 🧪 5. Tests & Qualité
- [ ] **Test Bout-en-Bout** : Effectuer un parcours complet (Inscription -> Questionnaire -> Paiement -> Téléchargement) sur mobile et desktop.
- [ ] **Validation Prompt** : Vérifier que l'IA ne génère jamais d'informations non fournies (hallucinations).

---

## 📦 Stack Technique Actuelle
- **Frontend** : React 19 + Vite + Framer Motion
- **Design** : Vanilla CSS (Theme Navy/Orange Premium)
- **Backend / DB** : Supabase
- **IA** : Llama 3.3 70B (via Groq API)
- **PDF** : @react-pdf/renderer + pdf-lib
- **Paiement** : Stripe (Payment Links)

---
*Dernière mise à jour : 6 février 2026*
