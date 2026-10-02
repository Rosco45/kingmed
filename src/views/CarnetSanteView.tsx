import React, { useState } from 'react';
import { Patient, Consultation } from '../types';
import { BookOpen, Download, Calendar, Activity, CheckCircle2, FileDown, AlertTriangle } from 'lucide-react';
import { pdfService } from '../services/pdfService';
import { analyzeVitals } from '../services/vitalsAnalyzer';

interface CarnetSanteViewProps {
  patients: Patient[];
  consultations: Consultation[];
}

export const CarnetSanteView: React.FC<CarnetSanteViewProps> = ({
  patients,
  consultations,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-2');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientConsultations = selectedPatient
    ? consultations.filter((c) => c.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Carnet de santé</h2>
        <p className="text-sm text-slate-500">Consultez et exportez le dossier médical du patient</p>
      </div>

      {/* Patient Selector */}
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

            {/* Medical History Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-sky-600 text-white text-[11px] font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Diagnostic</th>
                      <th className="px-4 py-3">Prescription</th>
                      <th className="px-4 py-3">Temp.</th>
                      <th className="px-4 py-3">Tension</th>
                      <th className="px-4 py-3">Poids</th>
                      <th className="px-4 py-3">Glycémie</th>
                      <th className="px-4 py-3">SpO2</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {patientConsultations.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-6 text-slate-400">
                          Aucun passage médical enregistré pour ce patient.
                        </td>
                      </tr>
                    ) : (
                      patientConsultations.map((c) => {
                        const vitalsAlerts = analyzeVitals(c.constantes);

                        return (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                              {c.date}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-sky-700">{c.diagnostic}</span>
                              {vitalsAlerts.length > 0 && (
                                <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Constantes à surveiller
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-700 max-w-xs">{c.prescription}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {c.constantes?.temperature ? `${c.constantes.temperature}°C` : '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {c.constantes?.tension || '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {c.constantes?.poids ? `${c.constantes.poids} kg` : '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {c.constantes?.glycemie || '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {c.constantes?.spo2 ? `${c.constantes.spo2}%` : '-'}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              {c.prescription && (
                                <button
                                  onClick={() => pdfService.generateOrdonnance(selectedPatient, c)}
                                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 ml-auto"
                                  title="Télécharger l'Ordonnance"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                  <span>Ordonnance</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export PDF Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => pdfService.generateCarnetSante(selectedPatient, patientConsultations)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Exporter le carnet en PDF</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            Veuillez sélectionner un patient ci-dessus pour afficher son carnet de santé.
          </div>
        )}
      </div>
    </div>
  );
};
