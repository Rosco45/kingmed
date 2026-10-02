import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header, UserRole, ROLES } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { ConsultationsView } from './views/ConsultationsView';
import { EmployesView } from './views/EmployesView';
import { CarnetSanteView } from './views/CarnetSanteView';
import { ResultatLaboView } from './views/ResultatLaboView';
import { StockPharmacieView } from './views/StockPharmacieView';
import { VentePharmacieView } from './views/VentePharmacieView';
import { FacturationView } from './views/FacturationView';
import { RendezVousView } from './views/RendezVousView';
import { ParametresView } from './views/ParametresView';
import { MedicalCalculatorModal } from './components/MedicalCalculatorModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { storageService } from './services/storage';
import { Patient, Consultation, Employe, ProduitPharmacie, ResultatLabo, RendezVous, VentePharmacie } from './types';
import { Lock, Activity } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>(ROLES[1]); // Default to Bellize Zorru (Infirmière/Pharmacie) or Sam Eric

  // Modals for smart tools
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Core data states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [stock, setStock] = useState<ProduitPharmacie[]>([]);
  const [labo, setLabo] = useState<ResultatLabo[]>([]);
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [ventesPharmacie, setVentesPharmacie] = useState<VentePharmacie[]>([]);

  // Navigation helpers
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [consultationPreselectedPatient, setConsultationPreselectedPatient] = useState<string | null>(null);

  // Load initial data
  const loadData = () => {
    setPatients(storageService.getPatients());
    setConsultations(storageService.getConsultations());
    setEmployes(storageService.getEmployes());
    setStock(storageService.getStock());
    setLabo(storageService.getLabo());
    setRdvs(storageService.getRDV());
    setVentesPharmacie(storageService.getVentesPharmacie());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute low stock count
  const lowStockCount = stock.filter((s) => s.quantite <= s.seuilAlerte).length;

  // Handlers: Patients
  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newPatient, ...patients];
    setPatients(updated);
    storageService.savePatients(updated);
  };

  const handleUpdatePatient = (patient: Patient) => {
    const updated = patients.map((p) => (p.id === patient.id ? patient : p));
    setPatients(updated);
    storageService.savePatients(updated);
  };

  const handleDeletePatient = (id: string) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    storageService.savePatients(updated);
  };

  // Handlers: Consultations (with auto stock deduction)
  const handleAddConsultation = (consData: Omit<Consultation, 'id' | 'createdAt'>) => {
    const newCons: Consultation = {
      ...consData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedCons = [newCons, ...consultations];
    setConsultations(updatedCons);
    storageService.saveConsultations(updatedCons);

    // Auto stock decrement
    if (consData.produitsUtilises && consData.produitsUtilises.length > 0) {
      const usedItem = consData.produitsUtilises[0];
      const updatedStock = stock.map((s) => {
        if (s.id === usedItem.produitId) {
          const newQty = Math.max(0, s.quantite - usedItem.quantite);
          const historyEntry = {
            id: `h-${Date.now()}`,
            date: new Date().toLocaleString('fr-FR'),
            quantite: -usedItem.quantite,
            infirmier: currentRole.name,
            motif: `Dispensation consultation ${consData.patientNom}`,
          };
          return {
            ...s,
            quantite: newQty,
            historique: [...(s.historique || []), historyEntry],
          };
        }
        return s;
      });
      setStock(updatedStock);
      storageService.saveStock(updatedStock);
    }
  };

  // Handlers: Employes
  const handleAddEmploye = (empData: Omit<Employe, 'id'>) => {
    const newEmp: Employe = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    const updated = [newEmp, ...employes];
    setEmployes(updated);
    storageService.saveEmployes(updated);
  };

  const handleUpdateEmploye = (emp: Employe) => {
    const updated = employes.map((e) => (e.id === emp.id ? emp : e));
    setEmployes(updated);
    storageService.saveEmployes(updated);
  };

  const handleDeleteEmploye = (id: string) => {
    const updated = employes.filter((e) => e.id !== id);
    setEmployes(updated);
    storageService.saveEmployes(updated);
  };

  // Handlers: Stock
  const handleAddStock = (produitId: string, quantite: number, infirmier: string) => {
    const updatedStock = stock.map((s) => {
      if (s.id === produitId) {
        return {
          ...s,
          quantite: s.quantite + quantite,
          historique: [
            ...(s.historique || []),
            {
              id: `h-${Date.now()}`,
              date: new Date().toLocaleString('fr-FR'),
              quantite: +quantite,
              infirmier,
              motif: 'Réapprovisionnement',
            },
          ],
        };
      }
      return s;
    });
    setStock(updatedStock);
    storageService.saveStock(updatedStock);
  };

  const handleRemoveStock = (produitId: string, quantite: number, infirmier: string) => {
    const updatedStock = stock.map((s) => {
      if (s.id === produitId) {
        return {
          ...s,
          quantite: Math.max(0, s.quantite - quantite),
          historique: [
            ...(s.historique || []),
            {
              id: `h-${Date.now()}`,
              date: new Date().toLocaleString('fr-FR'),
              quantite: -quantite,
              infirmier,
              motif: 'Retrait manuel',
            },
          ],
        };
      }
      return s;
    });
    setStock(updatedStock);
    storageService.saveStock(updatedStock);
  };

  const handleAddNewProduct = (prodData: Omit<ProduitPharmacie, 'id' | 'historique'>) => {
    const newProd: ProduitPharmacie = {
      ...prodData,
      id: `stk-${Date.now()}`,
      historique: [],
    };
    const updated = [newProd, ...stock];
    setStock(updated);
    storageService.saveStock(updated);
  };

  // Handler: Validation d'une vente de pharmacie au comptoir
  const handleValidateSale = (venteData: Omit<VentePharmacie, 'id' | 'createdAt'>) => {
    const newVente: VentePharmacie = {
      ...venteData,
      id: `vnt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Décrémenter les stocks et enregistrer l'historique
    let updatedStock = [...stock];
    venteData.lignes.forEach((ligne) => {
      updatedStock = updatedStock.map((s) => {
        if (s.id === ligne.produitId) {
          const newQty = Math.max(0, s.quantite - ligne.quantite);
          const historyEntry = {
            id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            date: new Date().toLocaleString('fr-FR'),
            quantite: -ligne.quantite,
            infirmier: currentRole.name,
            motif: `Vente comptoir (${venteData.clientNom}) [${venteData.numeroTicket}]`,
          };
          return {
            ...s,
            quantite: newQty,
            historique: [...(s.historique || []), historyEntry],
          };
        }
        return s;
      });
    });

    // 2. Mettre à jour les ventes
    const updatedVentes = [newVente, ...ventesPharmacie];

    setStock(updatedStock);
    setVentesPharmacie(updatedVentes);

    storageService.saveStock(updatedStock);
    storageService.saveVentesPharmacie(updatedVentes);
  };

  // Handlers: Labo
  const handleAddLabResult = (resultData: Omit<ResultatLabo, 'id'>) => {
    const newRes: ResultatLabo = {
      ...resultData,
      id: `lab-${Date.now()}`,
    };
    const updated = [newRes, ...labo];
    setLabo(updated);
    storageService.saveLabo(updated);
  };

  // Handlers: Rendez-vous
  const handleAddRDV = (rdvData: Omit<RendezVous, 'id'>) => {
    const newRdv: RendezVous = {
      ...rdvData,
      id: `rdv-${Date.now()}`,
    };
    const updated = [newRdv, ...rdvs];
    setRdvs(updated);
    storageService.saveRDV(updated);
  };

  const handleUpdateRDVStatus = (id: string, statut: RendezVous['statut']) => {
    const updated = rdvs.map((r) => (r.id === id ? { ...r, statut } : r));
    setRdvs(updated);
    storageService.saveRDV(updated);
  };

  const handleStartConsultationFromRDV = (patientId: string) => {
    setConsultationPreselectedPatient(patientId);
    setCurrentTab('consultations');
  };

  // Reset database
  const handleResetDatabase = () => {
    storageService.resetAll();
    loadData();
  };

  // Titles mapping
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Tableau de bord', subtitle: "Vue d'ensemble et indicateurs de performance" },
    patients: { title: 'Patients', subtitle: 'Gestion et fiches médicales des patients' },
    consultations: { title: 'Consultations', subtitle: 'Examens cliniques, prescriptions et suivi' },
    employes: { title: 'Personnel & RH', subtitle: 'Gestion des médecins, infirmiers et employés' },
    parametres: { title: 'Paramètres', subtitle: "Sécurité et configuration de l'application" },
    rendezvous: { title: 'Rendez-vous', subtitle: 'Planning des rendez-vous et salle d’attente' },
    'carnet-sante': { title: 'Carnet de santé', subtitle: 'Dossier médical patient et export PDF' },
    'resultat-labo': { title: 'Résultats laboratoire', subtitle: 'Examens, analyses et bilans d’imagerie' },
    'stock-pharmacie': { title: 'Stock pharmacie', subtitle: 'Gestion des stocks et réapprovisionnement' },
    'vente-pharmacie': { title: 'Ventes Pharmacie (Comptoir)', subtitle: 'Délivrance directe aux patients et clients de passage' },
    facturation: { title: 'Facturation & Caisse', subtitle: 'Paiements, reçus et états comptables' },
  };

  // Authentication gate screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto text-sky-600">
            <Activity className="w-8 h-8 text-sky-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Kingmed</h2>
            <p className="text-xs text-slate-500 mt-1">Plateforme Médicale & Clinique</p>
          </div>
          <p className="text-sm text-slate-600">
            Session déconnectée. Cliquez ci-dessous pour vous reconnecter.
          </p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium shadow transition-all"
          >
            Se connecter en tant qu'administrateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'patients') setSelectedPatientId(null);
        }}
        onLogout={() => setIsAuthenticated(false)}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          title={titles[currentTab].title}
          subtitle={titles[currentTab].subtitle}
          onLogout={() => setIsAuthenticated(false)}
          lowStockCount={lowStockCount}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          currentRole={currentRole}
          onRoleChange={(role) => setCurrentRole(role)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              consultations={consultations}
              stock={stock}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectPatient={(pId) => {
                setSelectedPatientId(pId);
                setCurrentTab('patients');
              }}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView
              patients={patients}
              consultations={consultations}
              onAddPatient={handleAddPatient}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
              selectedPatientId={selectedPatientId}
              onSelectPatient={setSelectedPatientId}
              onOpenConsultationModal={(patientId) => {
                setConsultationPreselectedPatient(patientId);
                setCurrentTab('consultations');
              }}
            />
          )}

          {currentTab === 'consultations' && (
            <ConsultationsView
              consultations={consultations}
              patients={patients}
              stock={stock}
              onAddConsultation={handleAddConsultation}
              selectedPatientIdForConsultation={consultationPreselectedPatient}
              onClearSelectedPatient={() => setConsultationPreselectedPatient(null)}
              onSelectPatient={(pId) => {
                setSelectedPatientId(pId);
                setCurrentTab('patients');
              }}
            />
          )}

          {currentTab === 'employes' && (
            <EmployesView
              employes={employes}
              onAddEmploye={handleAddEmploye}
              onUpdateEmploye={handleUpdateEmploye}
              onDeleteEmploye={handleDeleteEmploye}
            />
          )}

          {currentTab === 'carnet-sante' && (
            <CarnetSanteView patients={patients} consultations={consultations} />
          )}

          {currentTab === 'resultat-labo' && (
            <ResultatLaboView
              patients={patients}
              labResults={labo}
              onAddLabResult={handleAddLabResult}
            />
          )}

          {currentTab === 'stock-pharmacie' && (
            <StockPharmacieView
              stock={stock}
              onAddStock={handleAddStock}
              onRemoveStock={handleRemoveStock}
              onAddNewProduct={handleAddNewProduct}
            />
          )}

          {currentTab === 'vente-pharmacie' && (
            <VentePharmacieView
              stock={stock}
              patients={patients}
              ventes={ventesPharmacie}
              onValidateSale={handleValidateSale}
              currentSellerName={currentRole.name}
            />
          )}

          {currentTab === 'facturation' && (
            <FacturationView patients={patients} consultations={consultations} />
          )}

          {currentTab === 'rendezvous' && (
            <RendezVousView
              rdvs={rdvs}
              patients={patients}
              onAddRDV={handleAddRDV}
              onUpdateStatus={handleUpdateRDVStatus}
              onStartConsultation={handleStartConsultationFromRDV}
            />
          )}

          {currentTab === 'parametres' && (
            <ParametresView
              onResetDatabase={handleResetDatabase}
              onLogout={() => setIsAuthenticated(false)}
            />
          )}
        </main>
      </div>

      {/* Smart Tools Modals */}
      <MedicalCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        patients={patients}
        consultations={consultations}
        employes={employes}
        stock={stock}
        onNavigate={(tab) => setCurrentTab(tab)}
        onSelectPatient={(pId) => setSelectedPatientId(pId)}
      />
    </div>
  );
}
