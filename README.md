# Kingmed - Système Intégré de Gestion Médicale & Clinique

**Kingmed** est une application web moderne et réactive conçue pour la gestion complète des opérations cliniques, médicales et pharmaceutiques d'un établissement de santé (clinique, cabinet médical, centre de soins).

---

## 🌟 Fonctionnalités Principales

- **📊 Tableau de bord clinique** : Indicateurs financiers en temps réel, alertes de stock critique, suivi des pathologies fréquentes et taux de recouvrement.
- **👥 Dossiers Patients** : Gestion complète des fiches médicales, antécédents, constantes vitales et historique des consultations.
- **🩺 Consultations & Constantes** : Saisie des diagnostics et prescriptions avec détection automatique des anomalies vitales (fièvre, hypertension, hypothermie, désaturation SpO2) et déduction automatique du stock lors de la délivrance de médicaments.
- **💊 Pharmacie & Gestion des Stocks** : Catalogue complet de médicaments et consommables, alertes de seuil critique et traçabilité des mouvements par soignant.
- **🛒 Vente Comptoir / Caisse Pharmacie** : Point de vente rapide avec gestion de panier, calcul de monnaie, encaissements multi-modes (Espèces, Mobile Money, Carte) et impression instantanée de ticket de caisse.
- **📄 Facturation & Recouvrement** : Suivi des règlements (Payé, Partiel, Impayé) et émission de factures médicales.
- **📘 Carnet de Santé Numérique** : Vue chronologique des consultations avec génération et export PDF haute fidélité.
- **🔬 Résultats de Laboratoire** : Gestion et archivage des bilans et examens biologiques.
- **📅 Prise de Rendez-vous** : Planification et gestion du flux de patients par praticien.
- **🧮 Outils & Calculatrices Cliniques** : Calcul d'IMC, posologies pédiatriques au poids et débits de perfusion (gouttes/min).
- **🔍 Recherche Globale** : Accès rapide à n'importe quel dossier ou produit dans toute l'application.

---

## 🛠️ Stack Technique

- **Frontend** : React 18, TypeScript, Vite
- **Styles** : Tailwind CSS, Lucide React (icônes)
- **Export Documents** : jsPDF (génération côté client de reçus, factures et carnets de santé)
- **Stockage** : LocalStorage avec service de persistance dédié et possibilité d'export/import JSON

---

## 🚀 Installation et Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm

### Installation des dépendances
```bash
npm install
```

### Lancement en mode développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

### Compilation pour la production
```bash
npm run build
```

---

## 📄 Licence
Ce projet est privé et réservé à un usage médical / clinique.
