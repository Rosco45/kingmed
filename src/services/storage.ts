import { Patient, Consultation, Employe, ProduitPharmacie, ResultatLabo, RendezVous, VentePharmacie } from '../types';
import { CLINIQUE_PRODUCTS } from '../data/cliniqueProducts';

const STORAGE_KEYS = {
  PATIENTS: 'kingmed_patients',
  CONSULTATIONS: 'kingmed_consultations',
  EMPLOYES: 'kingmed_employes',
  STOCK: 'kingmed_stock',
  LABO: 'kingmed_labo',
  RENDEZ_VOUS: 'kingmed_rdv',
  VENTES_PHARMACIE: 'kingmed_ventes_pharmacie',
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    nom: 'DOSSEH',
    prenom: 'Marvellous',
    dateNaissance: '2002-02-07',
    genre: 'Homme',
    telephone: '1234567865',
    email: 'info@edusmartschool.com',
    adresse: 'Quartier Administratif, Lomé',
    antecedents: 'Asthme',
    notes: 'Patient sous surveillance respiratoire saisonnière',
    createdAt: '2025-08-02',
  },
  {
    id: 'p-2',
    nom: 'Sam',
    prenom: 'Eric',
    dateNaissance: '1983-06-02',
    genre: 'Homme',
    telephone: '1234567865',
    email: 'info@edusmartschool.com',
    adresse: 'BP13, Lomé',
    antecedents: 'Aucun antécédent majeur signalé',
    notes: 'Suivi régulier',
    createdAt: '2025-08-02',
  },
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'c-1',
    patientId: 'p-2',
    patientNom: 'Sam Eric',
    date: '2025-08-02',
    diagnostic: 'Paludisme',
    prescription: 'Paracetamol 1000g (1cp 3x/j pendant 3 jours)',
    notes: 'Patient présentant un état fébrile et courbatures depuis 48h.',
    constantes: {
      temperature: 37,
      tension: '120/80',
      poids: 79,
      glycemie: 1.05,
      spo2: 99,
    },
    coutTotal: 2000,
    montantPaye: 2000,
    methodePaiement: 'Espèces',
    statut: 'Payé',
    produitsUtilises: [
      { produitId: 'stk-sql-266', nom: 'PARACETAMOL', quantite: 1 },
    ],
    createdAt: '2025-08-02T10:30:00Z',
  },
];

export const INITIAL_EMPLOYES: Employe[] = [
  {
    id: 'emp-1',
    nom: 'Bellize',
    prenom: 'Zorru',
    dateNaissance: '1996-07-02',
    genre: 'Femme',
    telephone: '1234567865',
    email: 'bellize.zorru@clinique.org',
    poste: 'Infirmière Diplômée d\'État',
    specialite: 'Radio & Soins',
    dateEmbauche: '2024-06-05',
    numeroSecu: '12345',
    salaire: 40000,
    statut: 'Actif',
    adresse: 'Lomé',
    diplomes: 'Diplôme d\'État',
    notes: 'Excellente assiduité, responsable du bloc radio.',
  },
  {
    id: 'emp-2',
    nom: 'Directeur',
    prenom: 'Dr.',
    dateNaissance: '1975-03-12',
    genre: 'Homme',
    telephone: '90123456',
    email: 'directeur@clinique.org',
    poste: 'Médecin Chef / Directeur Médical',
    specialite: 'Médecine Générale & Urgences',
    dateEmbauche: '2020-01-15',
    numeroSecu: '75031',
    salaire: 450000,
    statut: 'Actif',
    adresse: 'Lomé',
    diplomes: 'Doctorat d\'État en Médecine',
    notes: 'Directeur médical issu de la base clinique_db.',
  },
  {
    id: 'emp-3',
    nom: 'Bado',
    prenom: 'Dr.',
    dateNaissance: '1982-11-20',
    genre: 'Homme',
    telephone: '91234567',
    email: 'dr.bado@clinique.org',
    poste: 'Médecin Praticien',
    specialite: 'Gynécologie & Obstétrique',
    dateEmbauche: '2022-04-01',
    numeroSecu: '82112',
    salaire: 350000,
    statut: 'Actif',
    adresse: 'Lomé',
    diplomes: 'Diplôme de Spécialisation Médicale',
    notes: 'Praticien issu de la base clinique_db.',
  },
  {
    id: 'emp-4',
    nom: 'Bibi',
    prenom: 'Mme',
    dateNaissance: '1988-08-14',
    genre: 'Femme',
    telephone: '92345678',
    email: 'bibi@clinique.org',
    poste: 'Sage-femme Major / Infirmière en chef',
    specialite: 'Maternité & PMI',
    dateEmbauche: '2021-09-10',
    numeroSecu: '88081',
    salaire: 180000,
    statut: 'Actif',
    adresse: 'Lomé',
    diplomes: 'Diplôme d\'État de Sage-femme',
    notes: 'Infirmière en chef issue de la base clinique_db.',
  },
  {
    id: 'emp-5',
    nom: 'Soso',
    prenom: 'Mme',
    dateNaissance: '1995-05-24',
    genre: 'Femme',
    telephone: '93456789',
    email: 'soso@clinique.org',
    poste: 'Chargée d\'Accueil & Facturation',
    specialite: 'Caisse & Admission',
    dateEmbauche: '2023-02-01',
    numeroSecu: '95052',
    salaire: 90000,
    statut: 'Actif',
    adresse: 'Lomé',
    diplomes: 'BTS Gestion & Comptabilité',
    notes: 'Opératrice de caisse issue de la base clinique_db.',
  },
];

// Catalogue complet issu du fichier SQL clinique_db.sql (339 produits & prestations)
export const INITIAL_STOCK: ProduitPharmacie[] = CLINIQUE_PRODUCTS;

export const INITIAL_LABO: ResultatLabo[] = [
  {
    id: 'lab-1',
    patientId: 'p-2',
    patientNom: 'Sam Eric',
    titre: 'Analyse 2 (NFS / Goutte épaisse)',
    date: '02/08/2025',
    fichierNom: 'rapport_nfs_sam_eric.pdf',
    fichierType: 'pdf',
    fichierUrl: '#',
    notes: 'Frottis positif à Plasmodium falciparum.',
  },
  {
    id: 'lab-2',
    patientId: 'p-2',
    patientNom: 'Sam Eric',
    titre: 'Analyse Radiologique Thorax',
    date: '02/08/2025',
    fichierNom: 'radio_thorax.jpg',
    fichierType: 'image',
    fichierUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    notes: 'Cliché sans anomalie pleuro-parenchymateuse évolutive.',
  },
];

export const INITIAL_RDV: RendezVous[] = [
  {
    id: 'rdv-1',
    patientId: 'p-2',
    patientNom: 'Sam Eric',
    telephone: '1234567865',
    date: '2025-08-05',
    heure: '09:30',
    motif: 'Consultation de suivi Paludisme',
    praticien: 'Dr. Mensah',
    statut: 'Confirmé',
  },
  {
    id: 'rdv-2',
    patientId: 'p-1',
    patientNom: 'DOSSEH Marvellous',
    telephone: '1234567865',
    date: '2025-08-06',
    heure: '11:00',
    motif: 'Contrôle spirométrie & asthme',
    praticien: 'Dr. Mensah',
    statut: 'En attente',
  },
];

export const INITIAL_VENTES_PHARMACIE: VentePharmacie[] = [
  {
    id: 'vnt-1',
    numeroTicket: 'TKT-20250802-001',
    date: '02/08/2025 11:15',
    typeClient: 'Lambda / Comptoir',
    clientNom: 'M. Koffi (Client de passage)',
    lignes: [
      {
        produitId: 'stk-1',
        produitNom: 'Paracetamol 1000g',
        quantite: 2,
        prixUnitaire: 1000,
        totalLigne: 2000,
      },
    ],
    total: 2000,
    montantRecu: 2000,
    monnaieRendue: 0,
    modePaiement: 'Espèces',
    vendeur: 'Bellize Zorru',
    createdAt: '2025-08-02T11:15:00Z',
  },
];

export const storageService = {
  getPatients: (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS) || localStorage.getItem('koulmed_patients');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    return JSON.parse(data);
  },
  savePatients: (patients: Patient[]) => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  },

  getConsultations: (): Consultation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS) || localStorage.getItem('koulmed_consultations');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
      return INITIAL_CONSULTATIONS;
    }
    return JSON.parse(data);
  },
  saveConsultations: (consultations: Consultation[]) => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  },

  getEmployes: (): Employe[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYES) || localStorage.getItem('koulmed_employes');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYES, JSON.stringify(INITIAL_EMPLOYES));
      return INITIAL_EMPLOYES;
    }
    return JSON.parse(data);
  },
  saveEmployes: (employes: Employe[]) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYES, JSON.stringify(employes));
  },

  getStock: (): ProduitPharmacie[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK) || localStorage.getItem('koulmed_stock');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
      return INITIAL_STOCK;
    }
    try {
      const parsed: ProduitPharmacie[] = JSON.parse(data);
      // Migration automatique : si le navigateur avait l'ancien stock de démo (<= 6 articles), on charge le catalogue SQL complet
      if (Array.isArray(parsed) && parsed.length <= 6 && INITIAL_STOCK.length > 6) {
        localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
        return INITIAL_STOCK;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
      return INITIAL_STOCK;
    }
  },
  saveStock: (stock: ProduitPharmacie[]) => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  },
  loadCliniqueCatalog: (): ProduitPharmacie[] => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(CLINIQUE_PRODUCTS));
    return CLINIQUE_PRODUCTS;
  },
  importSqlDump: (sqlContent: string): { importedProducts: number; success: boolean; message: string } => {
    try {
      // Regex pour extraire les tuples INSERT INTO `products`
      const matches = sqlContent.match(/INSERT INTO `products`[\s\S]*?VALUES([\s\S]*?);/);
      if (!matches || !matches[1]) {
        return { importedProducts: 0, success: false, message: "Aucune instruction 'INSERT INTO products' trouvée dans le fichier SQL." };
      }

      const tupleRegex = /\(\s*(\d+)\s*,\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*(\d+)\s*,\s*([\d.]+)\s*,\s*'([^']*)'\s*\)/g;
      const valuesStr = matches[1];
      const parsedProducts: ProduitPharmacie[] = [];
      let m;

      while ((m = tupleRegex.exec(valuesStr)) !== null) {
        const [, pid, ref, desig, famille, unite, , min_stock, prix] = m;
        const cleanRef = ref.replace(/\\'/g, "'").trim();
        const cleanDesig = desig.replace(/\\'/g, "'").trim();
        const minStockNum = parseInt(min_stock, 10) || 5;
        const prixNum = parseFloat(prix) || 0;

        let prodType: 'Medicaments' | 'Consommables' | 'Equipements' | 'Services' | 'Analyses' = 'Consommables';
        let uniteLabel = unite || 'Unité';
        let qte = 50;

        if (famille === 'PRODMEDICA' || famille === 'PRODPHCIE') {
          prodType = 'Medicaments';
          uniteLabel = 'Boîte';
          qte = 45;
        } else if (famille === 'SERVICES' || famille === 'SERV') {
          prodType = 'Services';
          uniteLabel = 'Acte';
          qte = 999;
        } else if (famille === 'PRODANALYS') {
          prodType = 'Analyses';
          uniteLabel = 'Examen';
          qte = 999;
        }

        parsedProducts.push({
          id: `stk-sql-${pid}`,
          reference: cleanRef,
          nom: cleanDesig,
          type: prodType,
          quantite: qte,
          unite: uniteLabel,
          seuilAlerte: minStockNum,
          prixUnitaire: Math.round(prixNum),
          codeFamille: famille,
          historique: []
        });
      }

      if (parsedProducts.length > 0) {
        localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(parsedProducts));
        return { importedProducts: parsedProducts.length, success: true, message: `${parsedProducts.length} articles importés avec succès depuis le fichier SQL.` };
      }
      return { importedProducts: 0, success: false, message: "Impossible d'extraire les lignes de produits." };
    } catch (err: any) {
      return { importedProducts: 0, success: false, message: `Erreur d'analyse SQL: ${err.message}` };
    }
  },

  getLabo: (): ResultatLabo[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LABO) || localStorage.getItem('koulmed_labo');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LABO, JSON.stringify(INITIAL_LABO));
      return INITIAL_LABO;
    }
    return JSON.parse(data);
  },
  saveLabo: (labo: ResultatLabo[]) => {
    localStorage.setItem(STORAGE_KEYS.LABO, JSON.stringify(labo));
  },

  getRDV: (): RendezVous[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RENDEZ_VOUS) || localStorage.getItem('koulmed_rdv');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RENDEZ_VOUS, JSON.stringify(INITIAL_RDV));
      return INITIAL_RDV;
    }
    return JSON.parse(data);
  },
  saveRDV: (rdv: RendezVous[]) => {
    localStorage.setItem(STORAGE_KEYS.RENDEZ_VOUS, JSON.stringify(rdv));
  },

  getVentesPharmacie: (): VentePharmacie[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VENTES_PHARMACIE) || localStorage.getItem('koulmed_ventes_pharmacie');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VENTES_PHARMACIE, JSON.stringify(INITIAL_VENTES_PHARMACIE));
      return INITIAL_VENTES_PHARMACIE;
    }
    return JSON.parse(data);
  },
  saveVentesPharmacie: (ventes: VentePharmacie[]) => {
    localStorage.setItem(STORAGE_KEYS.VENTES_PHARMACIE, JSON.stringify(ventes));
  },

  resetAll: () => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
    localStorage.setItem(STORAGE_KEYS.EMPLOYES, JSON.stringify(INITIAL_EMPLOYES));
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_STOCK));
    localStorage.setItem(STORAGE_KEYS.LABO, JSON.stringify(INITIAL_LABO));
    localStorage.setItem(STORAGE_KEYS.RENDEZ_VOUS, JSON.stringify(INITIAL_RDV));
    localStorage.setItem(STORAGE_KEYS.VENTES_PHARMACIE, JSON.stringify(INITIAL_VENTES_PHARMACIE));
  },

  exportAllData: () => {
    const data = {
      patients: storageService.getPatients(),
      consultations: storageService.getConsultations(),
      employes: storageService.getEmployes(),
      stock: storageService.getStock(),
      labo: storageService.getLabo(),
      rendezVous: storageService.getRDV(),
      ventesPharmacie: storageService.getVentesPharmacie(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kingmed_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
