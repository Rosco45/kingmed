import React, { useState } from 'react';
import { Patient, Consultation } from '../types';
import {
  Search,
  Plus,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  Printer,
  ArrowLeft,
  X,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

interface PatientsViewProps {
  patients: Patient[];
  consultations: Consultation[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  selectedPatientId?: string | null;
  onSelectPatient: (id: string | null) => void;
  onOpenConsultationModal: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  consultations,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  selectedPatientId,
  onSelectPatient,
  onOpenConsultationModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'date'>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'infos' | 'consultations' | 'documents'>('infos');

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: 'Homme' as 'Homme' | 'Femme' | 'Autre',
    telephone: '',
    email: '',
    adresse: '',
    antecedents: '',
    notes: '',
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientConsultations = consultations.filter((c) => c.patientId === selectedPatientId);

  // Filter & Sort
  const filteredPatients = patients
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      return (
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.telephone.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'nom') {
        const cmp = a.nom.localeCompare(b.nom);
        return sortOrder === 'asc' ? cmp : -cmp;
      } else {
        const cmp = (a.createdAt || '').localeCompare(b.createdAt || '');
        return sortOrder === 'asc' ? cmp : -cmp;
      }
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.dateNaissance) {
      alert('Veuillez renseigner les champs obligatoires (*)');
      return;
    }
    onAddPatient(formData);
    setIsAddModalOpen(false);
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '',
      genre: 'Homme',
      telephone: '',
      email: '',
      adresse: '',
      antecedents: '',
      notes: '',
    });
  };

  const calculateAge = (dateStr: string) => {
    if (!dateStr) return '';
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} ans`;
  };

  // If a patient is selected, display their detailed profile (Matches 4.jpeg)
  if (selectedPatient) {
    return (
      <div className="space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => onSelectPatient(null)}
          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste des patients</span>
        </button>

        {/* Patient Header Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-400 bg-sky-50 flex items-center justify-center text-emerald-600">
              <span className="text-2xl font-bold">+</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedPatient.nom} {selectedPatient.prenom}
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-sky-500 text-white text-xs font-semibold">
                  {calculateAge(selectedPatient.dateNaissance)}
                </span>
                <span className="text-xs text-slate-500 font-medium">• {selectedPatient.genre}</span>
                <span className="text-xs text-slate-500 font-medium">• {selectedPatient.telephone}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => alert('Exportation des données patient...')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" /> Exporter
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer
            </button>
            <button
              onClick={() => alert('Modification disponible dans la prochaine version')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="w-3.5 h-3.5" /> Modifier
            </button>
            <button
              onClick={() => {
                if (confirm('Confirmer la suppression de ce patient ?')) {
                  onDeletePatient(selectedPatient.id);
                  onSelectPatient(null);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
          </div>
        </div>

        {/* Content Tabs & Panes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Informations du patient */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-sky-600 text-white font-semibold text-sm px-6 py-3">
              Informations du patient
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="text-xs text-slate-400 font-medium">Date de naissance</label>
                <div className="text-slate-800 font-medium">
                  {selectedPatient.dateNaissance} ({calculateAge(selectedPatient.dateNaissance)})
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Téléphone</label>
                <div className="text-slate-800 font-medium">{selectedPatient.telephone}</div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Email</label>
                <div className="text-slate-800 font-medium">{selectedPatient.email || 'N/A'}</div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Adresse</label>
                <div className="text-slate-800 font-medium">{selectedPatient.adresse || 'N/A'}</div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Antécédents médicaux</label>
                <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-medium text-xs">
                  {selectedPatient.antecedents || 'Aucun antécédent signalé'}
                </div>
              </div>

              {selectedPatient.notes && (
                <div>
                  <label className="text-xs text-slate-400 font-medium">Notes complémentaires</label>
                  <div className="text-slate-700 text-xs mt-1 bg-slate-50 p-2.5 rounded border border-slate-100">
                    {selectedPatient.notes}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 font-medium">Créé le</label>
                <div className="text-slate-500 text-xs">{selectedPatient.createdAt}</div>
              </div>
            </div>
          </div>

          {/* Right: Onglets Consultations / Documents */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <div className="flex items-center gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveTab('consultations')}
                  className={`pb-3 -mb-3 border-b-2 font-semibold transition-colors ${
                    activeTab === 'consultations'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Consultations ({patientConsultations.length})
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`pb-3 -mb-3 border-b-2 font-semibold transition-colors ${
                    activeTab === 'documents'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Documents (0)
                </button>
              </div>

              <button
                onClick={() => onOpenConsultationModal(selectedPatient.id)}
                className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle consultation</span>
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'consultations' && (
              <div className="flex-1 flex flex-col justify-center">
                {patientConsultations.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm">Aucune consultation enregistrée</p>
                    <button
                      onClick={() => onOpenConsultationModal(selectedPatient.id)}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ajouter une consultation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patientConsultations.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-lg border border-slate-200 hover:border-sky-300 bg-slate-50/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 text-sm">{c.diagnostic}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                              {c.statut}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Date : {c.date} • Prescription : {c.prescription}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-800">
                            {c.coutTotal.toLocaleString()} F
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12 text-slate-400 text-sm">
                Aucun document joint pour ce patient.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Patients Table View (Matches 1.jpeg)
  return (
    <div className="space-y-6">
      {/* Header with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients</h2>
          <p className="text-sm text-slate-500">Gérez les patients</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportation de la liste des patients au format CSV...')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
          >
            Exporter la liste des patients
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un patient</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setSortBy('nom')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border ${
              sortBy === 'nom' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'border-slate-200 text-slate-600'
            }`}
          >
            Nom
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border ${
              sortBy === 'date' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'border-slate-200 text-slate-600'
            }`}
          >
            Date
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600"
          >
            {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Âge</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-teal-400 bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                        +
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {patient.prenom} {patient.nom}
                        </div>
                        <div className="text-xs text-slate-400">Créé le {patient.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{patient.telephone}</div>
                    <div className="text-xs text-slate-400">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{patient.genre}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">
                      {calculateAge(patient.dateNaissance)}
                    </div>
                    <div className="text-xs text-slate-400">{patient.dateNaissance}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ajouter un nouveau patient (Matches 2.jpeg & 3.jpeg) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Ajouter un nouveau patient</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nom*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prénom*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date de naissance*
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Genre*
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value as 'Homme' | 'Femme' | 'Autre' })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Téléphone*
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Antécédents médicaux
                </label>
                <textarea
                  rows={2}
                  placeholder="Historique médical, allergies, maladies chroniques..."
                  value={formData.antecedents}
                  onChange={(e) => setFormData({ ...formData, antecedents: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
