export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: 'Homme' | 'Femme' | 'Autre';
  telephone: string;
  email: string;
  adresse: string;
  antecedents: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface ConstantesVitales {
  temperature?: number;
  tension?: string;
  poids?: number;
  glycemie?: number;
  spo2?: number;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientNom: string;
  date: string;
  diagnostic: string;
  prescription: string;
  notes?: string;
  constantes: ConstantesVitales;
  coutTotal: number;
  montantPaye: number;
  methodePaiement: 'Espèces' | 'Mobile Money' | 'Carte Bancaire' | 'Chèque';
  statut: 'Payé' | 'Partiel' | 'Impayé';
  produitsUtilises?: {
    produitId: string;
    nom: string;
    quantite: number;
  }[];
  createdAt: string;
}

export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: 'Homme' | 'Femme';
  telephone: string;
  email: string;
  adresse: string;
  poste: string;
  specialite?: string;
  dateEmbauche: string;
  numeroSecu?: string;
  salaire: number;
  statut: 'Actif' | 'Inactif' | 'En congé';
  diplomes?: string;
  notes?: string;
  pieceIdentiteUrl?: string;
  photoUrl?: string;
}

export interface ProduitPharmacie {
  id: string;
  nom: string;
  type: 'Medicaments' | 'Consommables' | 'Equipements' | 'Services' | 'Analyses';
  reference?: string;
  codeFamille?: string;
  quantite: number;
  unite: string;
  seuilAlerte: number;
  prixUnitaire: number;
  historique: {
    id: string;
    date: string;
    quantite: number;
    infirmier: string;
    motif?: string;
  }[];
}

export interface ResultatLabo {
  id: string;
  patientId: string;
  patientNom: string;
  titre: string;
  date: string;
  fichierNom: string;
  fichierType: 'pdf' | 'image';
  fichierUrl: string;
  notes?: string;
}

export interface RendezVous {
  id: string;
  patientId: string;
  patientNom: string;
  telephone: string;
  date: string;
  heure: string;
  motif: string;
  praticien: string;
  statut: 'En attente' | 'Confirmé' | 'En consultation' | 'Terminé' | 'Annulé';
}

// Module Vente Pharmacie / Comptoir
export interface LigneVente {
  produitId: string;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

export interface VentePharmacie {
  id: string;
  numeroTicket: string;
  date: string;
  typeClient: 'Patient' | 'Lambda / Comptoir';
  clientNom: string;
  patientId?: string;
  lignes: LigneVente[];
  total: number;
  montantRecu: number;
  monnaieRendue: number;
  modePaiement: 'Espèces' | 'Mobile Money' | 'Carte Bancaire';
  vendeur: string;
  createdAt: string;
}
