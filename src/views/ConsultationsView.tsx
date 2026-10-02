import React, { useState } from 'react';
import { Consultation, Patient, ProduitPharmacie } from '../types';
import { Search, Plus, X, HeartPulse, FileText, CheckCircle2, AlertTriangle, Printer, FileDown } from 'lucide-react';
import { pdfService } from '../services/pdfService';
import { analyzeVitals } from '../services/vitalsAnalyzer';

interface ConsultationsViewProps {
  consultations: Consultation[];
  patients: Patient[];
  stock: ProduitPharmacie[];
  onAddConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt'>) => void;
  selectedPatientIdForConsultation?: string | null;
  onClearSelectedPatient: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({
  consultations,
  patients,
  stock,
  onAddConsultation,
  selectedPatientIdForConsultation,
  onClearSelectedPatient,
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (selectedPatientIdForConsultation) {
      setIsModalOpen(true);
      setFormData((prev) => ({
        ...prev,
        patientId: selectedPatientIdForConsultation,
      }));
    }
  }, [selectedPatientIdForConsultation]);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    diagnostic: '',
    prescription: '',
    notes: '',
    coutTotal: 2000,
    montantPaye: 2000,
    methodePaiement: 'Espèces' as 'Espèces' | 'Mobile Money' | 'Carte Bancaire' | 'Chèque',
    statut: 'Payé' as 'Payé' | 'Partiel' | 'Impayé',
    temperature: 37,
    tension: '120/80',
    poids: 70,
    glycemie: 1.05,
    spo2: 98,
    selectedStockItem: '',
  });

  const resteAPayer = Math.max(0, formData.coutTotal - formData.montantPaye);

  // Real-time vitals analysis on the form inputs
  const currentFormAlerts = analyzeVitals({
    temperature: formData.temperature,
    tension: formData.tension,
    poids: formData.poids,
    glycemie: formData.glycemie,
    spo2: formData.spo2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient || !formData.diagnostic) {
      alert('Veuillez renseigner les champs obligatoires.');
      return;
    }

    const produitsUtilises = formData.selectedStockItem
      ? [
          {
            produitId: formData.selectedStockItem,
            nom: stock.find((s) => s.id === formData.selectedStockItem)?.nom || 'Produit',
            quantite: 1,
          },
        ]
      : [];

    onAddConsultation({
      patientId: patient.id,
      patientNom: `${patient.nom} ${patient.prenom}`,
      date: formData.date,
      diagnostic: formData.diagnostic,
      prescription: formData.prescription,
      notes: formData.notes,
      coutTotal: Number(formData.coutTotal),
      montantPaye: Number(formData.montantPaye),
      methodePaiement: formData.methodePaiement,
      statut: resteAPayer === 0 ? 'Payé' : formData.montantPaye > 0 ? 'Partiel' : 'Impayé',
      constantes: {
        temperature: Number(formData.temperature),
        tension: formData.tension,
        poids: Number(formData.poids),
        glycemie: Number(formData.glycemie),
        spo2: Number(formData.spo2),
      },
      produitsUtilises,
    });

    setIsModalOpen(false);
    onClearSelectedPatient();
  };

  const filteredConsultations = consultations.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.patientNom.toLowerCase().includes(q) || c.diagnostic.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'Tous les statuts' ? true : c.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Consultations</h2>
          <p className="text-sm text-slate-500">Gérez les consultations et les paiements</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportation de la liste des consultations...')}
            className="px-4 py-2.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
          >
            Exporter la liste des consultations
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle consultation</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par patient ou diagnostic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
        >
          <option value="Tous les statuts">Tous les statuts</option>
          <option value="Payé">Payé</option>
          <option value="Partiel">Partiel</option>
          <option value="Impayé">Impayé</option>
        </select>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Diagnostic & Constantes</th>
                <th className="px-6 py-4">Prescription</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredConsultations.map((c) => {
                const patient = patients.find((p) => p.id === c.patientId);
                const vitalsAlerts = analyzeVitals(c.constantes);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{c.date}</td>
                    <td className="px-6 py-4 font-semibold text-sky-700">
                      <button
                        onClick={() => onSelectPatient(c.patientId)}
                        className="hover:underline"
                      >
                        {c.patientNom}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{c.diagnostic}</div>

                      {/* Vitals Alert Badge */}
                      {vitalsAlerts.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {vitalsAlerts.map((a, i) => (
                            <span
                              key={i}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                a.severity === 'critical'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {a.label}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                        <div>Température : {c.constantes?.temperature ? `${c.constantes.temperature} °C` : '-'}</div>
                        <div>Tension artérielle : {c.constantes?.tension || '-'} mmHg</div>
                        <div>Poids : {c.constantes?.poids ? `${c.constantes.poids} kg` : '-'}</div>
                        <div>Glycémie : {c.constantes?.glycemie ? `${c.constantes.glycemie} g/L` : '-'}</div>
                        <div>SpO2 : {c.constantes?.spo2 ? `${c.constantes.spo2} %` : '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs max-w-xs">{c.prescription}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{c.coutTotal.toLocaleString()} F</div>
                      <div className="text-xs text-emerald-600 font-medium">✓ Payé</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* New Action: Ordonnance PDF */}
                        {c.prescription && patient && (
                          <button
                            onClick={() => pdfService.generateOrdonnance(patient, c)}
                            title="Générer l'Ordonnance Médicale PDF"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectPatient(c.patientId)}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                        >
                          Patient
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Consultation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Nouvelle consultation</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onClearSelectedPatient();
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patient*
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} {p.prenom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Diagnostic*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paludisme simple"
                  value={formData.diagnostic}
                  onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Prescription
                </label>
                <textarea
                  rows={2}
                  placeholder="Médicaments prescrits, posologie, durée du traitement..."
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                ></textarea>
              </div>

              {/* Coûts et Paiements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Coût total (F)*
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.coutTotal}
                    onChange={(e) =>
                      setFormData({ ...formData, coutTotal: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Montant payé (F)*
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.montantPaye}
                    onChange={(e) =>
                      setFormData({ ...formData, montantPaye: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Méthode de paiement*
                  </label>
                  <select
                    value={formData.methodePaiement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        methodePaiement: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-white"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Carte Bancaire">Carte Bancaire</option>
                    <option value="Chèque">Chèque</option>
                  </select>
                </div>
              </div>

              {/* Constantes vitales avec alertes intelligentes en temps réel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Constantes vitales
                  </div>
                  {currentFormAlerts.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{currentFormAlerts[0].label} détectée</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500">Température (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 37.2"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">Tension artérielle</label>
                    <input
                      type="text"
                      placeholder="Ex: 120/80"
                      value={formData.tension}
                      onChange={(e) => setFormData({ ...formData, tension: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">Poids (kg)</label>
                    <input
                      type="number"
                      placeholder="Ex: 70"
                      value={formData.poids}
                      onChange={(e) => setFormData({ ...formData, poids: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">Glycémie (g/L)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 1.05"
                      value={formData.glycemie}
                      onChange={(e) => setFormData({ ...formData, glycemie: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500">SpO2 (%)</label>
                    <input
                      type="number"
                      placeholder="Ex: 98"
                      value={formData.spo2}
                      onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Produits utilisés (Pharmacie) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Produits utilisés (pharmacie)
                </label>
                <div className="space-y-1.5 max-h-24 overflow-y-auto border border-slate-200 p-2.5 rounded-lg bg-slate-50">
                  {stock.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedStockItem === s.id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            selectedStockItem: e.target.checked ? s.id : '',
                          })
                        }
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>
                        {s.nom} ({s.quantite} {s.unite})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-xs font-medium text-slate-600">
                Reste à payer :{' '}
                <span className={resteAPayer > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {resteAPayer} F
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClearSelectedPatient();
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
