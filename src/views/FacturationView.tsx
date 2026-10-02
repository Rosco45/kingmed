import React, { useState } from 'react';
import { Patient, Consultation } from '../types';
import { Receipt, Download, FileText, CheckCircle2 } from 'lucide-react';
import { pdfService } from '../services/pdfService';

interface FacturationViewProps {
  patients: Patient[];
  consultations: Consultation[];
}

export const FacturationView: React.FC<FacturationViewProps> = ({
  patients,
  consultations,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-2'); // Eric Sam selected to match 29.jpeg

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientConsultations = selectedPatient
    ? consultations.filter((c) => c.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Facturation</h2>
        <p className="text-sm text-slate-500">
          Suivi des règlements et émission de factures médicales
        </p>
      </div>

      {/* Patient Selector (Matches 28.jpeg & 29.jpeg) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Choisir un patient
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Sélectionner</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom} ({p.dateNaissance})
              </option>
            ))}
          </select>
        </div>

        {selectedPatient ? (
          <div className="pt-4 border-t border-slate-100 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {selectedPatient.nom} {selectedPatient.prenom}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Né(e) le :</span>{' '}
                  <span className="font-medium text-slate-700">{selectedPatient.dateNaissance}</span>
                </div>
                <div>
                  <span className="text-slate-400">Téléphone :</span>{' '}
                  <span className="font-medium text-slate-700">{selectedPatient.telephone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Adresse :</span>{' '}
                  <span className="font-medium text-slate-700">{selectedPatient.adresse || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Diagnostic</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Payé</th>
                      <th className="px-4 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {patientConsultations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-slate-400">
                          Aucune facture ou consultation pour ce patient.
                        </td>
                      </tr>
                    ) : (
                      patientConsultations.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                            {c.date}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{c.diagnostic}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">
                            {c.coutTotal.toLocaleString()} F
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-600">
                            {c.montantPaye.toLocaleString()} F
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                              {c.statut}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Generate Invoice PDF Button (Matches 29.jpeg) */}
            {patientConsultations.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() =>
                    pdfService.generateFacture(selectedPatient, patientConsultations[0])
                  }
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Générer la facture PDF</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            Veuillez sélectionner un patient ci-dessus pour afficher l'état de facturation.
          </div>
        )}
      </div>
    </div>
  );
};
