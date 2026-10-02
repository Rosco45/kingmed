import React from 'react';
import { Patient, Consultation, ProduitPharmacie } from '../types';
import { Users, Calendar, Wallet, AlertCircle, ArrowRight, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';
import { analyzeVitals } from '../services/vitalsAnalyzer';

interface DashboardProps {
  patients: Patient[];
  consultations: Consultation[];
  stock: ProduitPharmacie[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectPatient: (patientId: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  patients,
  consultations,
  stock,
  onNavigate,
  onSelectPatient,
}) => {
  const totalRevenus = consultations.reduce((acc, c) => acc + (c.montantPaye || 0), 0);
  const totalFacture = consultations.reduce((acc, c) => acc + (c.coutTotal || 0), 0);
  const totalImpayes = consultations.reduce(
    (acc, c) => acc + Math.max(0, (c.coutTotal || 0) - (c.montantPaye || 0)),
    0
  );

  const tauxRecouvrement = totalFacture > 0 ? Math.round((totalRevenus / totalFacture) * 100) : 100;

  const derniersPatients = patients.slice(0, 5);
  const dernieresConsultations = consultations.slice(0, 5);

  // Pathologies breakdown
  const pathologiesCount: Record<string, number> = {};
  consultations.forEach((c) => {
    const key = c.diagnostic || 'Autre';
    pathologiesCount[key] = (pathologiesCount[key] || 0) + 1;
  });

  // Low stock items
  const lowStockItems = stock.filter((s) => s.quantite <= s.seuilAlerte);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tableau de bord</h2>
          <p className="text-sm text-slate-500">Aujourd'hui, samedi 2 août 2025 • Vue clinique globale</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Taux de recouvrement caisse : </span>
          <strong className="text-emerald-700">{tauxRecouvrement}%</strong>
        </div>
      </div>

      {/* Alerte bannière si stock faible */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-900">
                Alerte Réapprovisionnement Pharmacie
              </div>
              <div className="text-xs text-amber-700">
                {lowStockItems.length} produit(s) ont atteint ou dépassé leur seuil critique (ex :{' '}
                {lowStockItems.map((s) => s.nom).join(', ')}).
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('stock-pharmacie')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0"
          >
            Gérer les stocks
          </button>
        </div>
      )}

      {/* KPI Cards (Matches 0.jpeg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 border-r-4 border-r-blue-500 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Patients</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{patients.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 border-r-4 border-r-emerald-500 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Consultations</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{consultations.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 border-r-4 border-r-purple-500 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Wallet className="w-4 h-4 text-purple-500" />
              <span>Revenus (temps réel)</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{totalRevenus.toLocaleString()} F</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 border-r-4 border-r-rose-500 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Montant impayé</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{totalImpayes.toLocaleString()} F</div>
          </div>
        </div>
      </div>

      {/* Grid: Derniers patients & Dernières consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers patients */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-sky-600 px-6 py-3.5 text-white flex items-center justify-between">
            <h3 className="font-semibold text-sm">Derniers patients</h3>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs text-sky-100 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              Voir tous <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {derniersPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => {
                  onSelectPatient(patient.id);
                  onNavigate('patients');
                }}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {patient.prenom[0]}
                    {patient.nom[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {patient.nom} {patient.prenom}
                    </div>
                    <div className="text-xs text-slate-500">{patient.telephone}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {patient.dateNaissance ? `${patient.genre}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières consultations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-600 px-6 py-3.5 text-white flex items-center justify-between">
            <h3 className="font-semibold text-sm">Dernières consultations</h3>
            <button
              onClick={() => onNavigate('consultations')}
              className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              Voir toutes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {dernieresConsultations.map((consultation) => {
              const alerts = analyzeVitals(consultation.constantes);

              return (
                <div key={consultation.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                      {consultation.statut}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <span>{consultation.diagnostic}</span>
                        {alerts.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Alerte vitale"></span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{consultation.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">
                      {consultation.coutTotal.toLocaleString()} F
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">
                      Payé: {consultation.montantPaye.toLocaleString()} F
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytics Row: Graphique mensuel & Répartition des diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Résumé mensuel Graphique (Matches 00.jpeg) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-2">Résumé mensuel</h3>
          <p className="text-center font-semibold text-slate-700 text-sm mb-6">
            Résumé mensuel des consultations et revenus
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-xs font-medium">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-sky-500 rounded-sm"></div>
              <span className="text-slate-600">Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-emerald-500 rounded-sm"></div>
              <span className="text-slate-600">Revenus (F)</span>
            </div>
          </div>

          <div className="relative h-56 flex items-end justify-center gap-16 border-b border-slate-200 px-8">
            <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between text-[11px] text-slate-400 pr-2">
              <span>2 000</span>
              <span>1 500</span>
              <span>1 000</span>
              <span>500</span>
              <span>0</span>
            </div>

            <div className="flex items-end gap-3 h-full pb-1">
              <div
                className="w-12 bg-sky-500 rounded-t flex flex-col justify-end items-center pb-2 text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                style={{ height: '20%' }}
              >
                <span className="text-[10px]">{consultations.length}</span>
              </div>
              <div
                className="w-24 bg-emerald-500 rounded-t flex flex-col justify-end items-center pb-2 text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                style={{ height: '100%' }}
              >
                <span className="text-xs font-bold">{totalRevenus} F</span>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500 mt-2 font-medium">08/2025</div>
        </div>

        {/* Pathologies Répartition */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Motifs Fréquents</h3>
            <p className="text-xs text-slate-400 mb-4">Répartition des diagnostics posés</p>

            <div className="space-y-4">
              {Object.entries(pathologiesCount).map(([diag, count]) => {
                const pct = Math.round((count / (consultations.length || 1)) * 100);
                return (
                  <div key={diag} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{diag}</span>
                      <span className="font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 text-center">
            <button
              onClick={() => onNavigate('consultations')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
            >
              Accéder au registre complet des consultations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
