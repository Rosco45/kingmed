import React, { useState } from 'react';
import { RendezVous, Patient } from '../types';
import { Calendar, Plus, Clock, User, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface RendezVousViewProps {
  rdvs: RendezVous[];
  patients: Patient[];
  onAddRDV: (rdv: Omit<RendezVous, 'id'>) => void;
  onUpdateStatus: (id: string, status: RendezVous['statut']) => void;
  onStartConsultation: (patientId: string) => void;
}

export const RendezVousView: React.FC<RendezVousViewProps> = ({
  rdvs,
  patients,
  onAddRDV,
  onUpdateStatus,
  onStartConsultation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    heure: '09:00',
    motif: 'Consultation générale',
    praticien: 'Dr. Mensah',
    statut: 'Confirmé' as RendezVous['statut'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient) return;

    onAddRDV({
      patientId: patient.id,
      patientNom: `${patient.nom} ${patient.prenom}`,
      telephone: patient.telephone,
      date: formData.date,
      heure: formData.heure,
      motif: formData.motif,
      praticien: formData.praticien,
      statut: formData.statut,
    });

    setIsModalOpen(false);
  };

  const filteredRDVs = filterDate ? rdvs.filter((r) => r.date === filterDate) : rdvs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rendez-vous & Agenda</h2>
          <p className="text-sm text-slate-500">Planification des consultations et accueil des patients</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      {/* Date filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="text-xs font-semibold text-slate-600">Filtrer par date :</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="text-xs text-sky-600 hover:underline"
          >
            Effacer le filtre
          </button>
        )}
      </div>

      {/* RDVs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRDVs.map((rdv) => (
          <div
            key={rdv.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-sky-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>{rdv.heure}</span>
                <span className="text-slate-400 font-normal text-xs">({rdv.date})</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  rdv.statut === 'Confirmé'
                    ? 'bg-emerald-100 text-emerald-700'
                    : rdv.statut === 'En attente'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {rdv.statut}
              </span>
            </div>

            <div>
              <div className="font-bold text-slate-800 text-base">{rdv.patientNom}</div>
              <div className="text-xs text-slate-500 mt-0.5">Tél : {rdv.telephone}</div>
              <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-700">
                <strong>Motif :</strong> {rdv.motif}
              </div>
              <div className="mt-1 text-xs text-slate-500">Praticien : {rdv.praticien}</div>
            </div>

            {/* Status change actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onStartConsultation(rdv.patientId)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-sm transition-all"
              >
                Démarrer consultation
              </button>

              <select
                value={rdv.statut}
                onChange={(e) => onUpdateStatus(rdv.id, e.target.value as any)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
              >
                <option value="Confirmé">Confirmé</option>
                <option value="En attente">En attente</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouveau RDV */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Planifier un rendez-vous</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient*</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heure*</label>
                  <input
                    type="time"
                    required
                    value={formData.heure}
                    onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Praticien</label>
                <input
                  type="text"
                  value={formData.praticien}
                  onChange={(e) => setFormData({ ...formData, praticien: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motif*</label>
                <textarea
                  rows={2}
                  required
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Enregistrer le RDV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
