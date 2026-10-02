import React, { useState } from 'react';
import { Search, X, Users, FileText, Package, UserCheck, ArrowRight } from 'lucide-react';
import { Patient, Consultation, Employe, ProduitPharmacie } from '../types';
import { ActiveTab } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  consultations: Consultation[];
  employes: Employe[];
  stock: ProduitPharmacie[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectPatient: (patientId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  consultations,
  employes,
  stock,
  onNavigate,
  onSelectPatient,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedPatients = q
    ? patients.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.prenom.toLowerCase().includes(q) ||
          p.telephone.includes(q)
      )
    : [];

  const matchedConsultations = q
    ? consultations.filter(
        (c) => c.diagnostic.toLowerCase().includes(q) || c.prescription.toLowerCase().includes(q)
      )
    : [];

  const matchedEmployes = q
    ? employes.filter(
        (e) =>
          e.nom.toLowerCase().includes(q) ||
          e.prenom.toLowerCase().includes(q) ||
          e.poste.toLowerCase().includes(q)
      )
    : [];

  const matchedStock = q
    ? stock.filter((s) => s.nom.toLowerCase().includes(q) || s.type.toLowerCase().includes(q))
    : [];

  const hasResults =
    matchedPatients.length > 0 ||
    matchedConsultations.length > 0 ||
    matchedEmployes.length > 0 ||
    matchedStock.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Recherche rapide (patient, médicament, personnel, diagnostic)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Effacer
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {!query && (
            <div className="text-center py-8 text-slate-400">
              Tapez un mot-clé pour lancer la recherche transversale dans toute la clinique.
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-8 text-slate-400">
              Aucun résultat trouvé pour « <strong className="text-slate-600">{query}</strong> ».
            </div>
          )}

          {/* Patients Results */}
          {matchedPatients.length > 0 && (
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>Patients ({matchedPatients.length})</span>
              </div>
              <div className="space-y-1">
                {matchedPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPatient(p.id);
                      onNavigate('patients');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-sky-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-sky-200 transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-800">
                        {p.nom} {p.prenom}
                      </span>
                      <span className="text-slate-400 ml-2">({p.telephone})</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultations Results */}
          {matchedConsultations.length > 0 && (
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Consultations & Diagnostics ({matchedConsultations.length})</span>
              </div>
              <div className="space-y-1">
                {matchedConsultations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onNavigate('consultations');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-emerald-200 transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{c.diagnostic}</span>
                      <span className="text-slate-500 ml-2">— {c.patientNom}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock Results */}
          {matchedStock.length > 0 && (
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>Pharmacie & Stock ({matchedStock.length})</span>
              </div>
              <div className="space-y-1">
                {matchedStock.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onNavigate('stock-pharmacie');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-amber-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-amber-200 transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{s.nom}</span>
                      <span className="text-slate-500 ml-2">
                        ({s.quantite} {s.unite} en stock)
                      </span>
                    </div>
                    <span className="text-amber-700 font-semibold">{s.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Results */}
          {matchedEmployes.length > 0 && (
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Personnel ({matchedEmployes.length})</span>
              </div>
              <div className="space-y-1">
                {matchedEmployes.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onNavigate('employes');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-purple-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-purple-200 transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-800">
                        {e.nom} {e.prenom}
                      </span>
                      <span className="text-slate-500 ml-2">({e.poste})</span>
                    </div>
                    <span className="text-purple-700 font-medium">{e.statut}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
