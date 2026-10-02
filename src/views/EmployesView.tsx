import React, { useState } from 'react';
import { Employe } from '../types';
import { Search, Plus, Download, Edit2, Trash2, X, FileDown, UserCheck } from 'lucide-react';
import { pdfService } from '../services/pdfService';

interface EmployesViewProps {
  employes: Employe[];
  onAddEmploye: (employe: Omit<Employe, 'id'>) => void;
  onUpdateEmploye: (employe: Employe) => void;
  onDeleteEmploye: (id: string) => void;
}

export const EmployesView: React.FC<EmployesViewProps> = ({
  employes,
  onAddEmploye,
  onUpdateEmploye,
  onDeleteEmploye,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<Employe, 'id'>>({
    nom: '',
    prenom: '',
    dateNaissance: '1996-07-02',
    genre: 'Femme',
    telephone: '1234567865',
    email: 'info@edusmartschool.com',
    adresse: 'Beriny',
    poste: 'Infirmiere',
    specialite: 'Radio',
    dateEmbauche: '2024-06-05',
    numeroSecu: '12345',
    salaire: 40000,
    statut: 'Actif',
    diplomes: 'Diplome d\'Etat',
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingEmploye(null);
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '1995-01-01',
      genre: 'Femme',
      telephone: '',
      email: '',
      adresse: '',
      poste: '',
      specialite: '',
      dateEmbauche: new Date().toISOString().split('T')[0],
      numeroSecu: '',
      salaire: 40000,
      statut: 'Actif',
      diplomes: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employe) => {
    setEditingEmploye(emp);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmploye) {
      onUpdateEmploye({ ...formData, id: editingEmploye.id });
    } else {
      onAddEmploye(formData);
    }
    setIsModalOpen(false);
  };

  const filteredEmployes = employes.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      e.nom.toLowerCase().includes(q) ||
      e.prenom.toLowerCase().includes(q) ||
      e.poste.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'Tous les statuts' ? true : e.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header (Matches 10.jpeg) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employés</h2>
          <p className="text-sm text-slate-500">Gérez le personnel de la clinique</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exportation de la liste du personnel...')}
            className="px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
          >
            Exporter la liste
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel employé</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher un employé..."
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
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
          <option value="En congé">En congé</option>
        </select>
      </div>

      {/* Employes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Employé</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Poste</th>
                <th className="px-6 py-4">Date d'embauche</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredEmployes.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-teal-400 bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                        +
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {emp.nom} {emp.prenom}
                        </div>
                        <div className="text-xs text-slate-400">{emp.specialite || 'Général'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{emp.telephone}</div>
                    <div className="text-xs text-slate-400">{emp.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{emp.poste}</div>
                    <div className="text-xs text-slate-400">{emp.diplomes || 'Diplôme validé'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{emp.dateEmbauche}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {emp.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => pdfService.generateFicheEmploye(emp)}
                        title="Télécharger la fiche employé PDF"
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        title="Modifier"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer l'employé ${emp.nom} ${emp.prenom} ?`)) {
                            onDeleteEmploye(emp.id);
                          }
                        }}
                        title="Supprimer"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nouvel / Modifier Employé (Matches 11, 12, 13.jpeg) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingEmploye ? "Modifier l'employé" : "Ajouter un employé"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-sky-100 flex flex-col items-center justify-center text-sky-600 border border-sky-300">
                  <span className="text-xs font-semibold">Photo</span>
                  <Plus className="w-4 h-4 mt-1" />
                </div>
                <span className="text-xs text-slate-400 mt-1">Photo de profil (optionnelle)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nom*</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Prénom*</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date de naissance*</label>
                  <input
                    type="date"
                    required
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Genre*</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Téléphone*</label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Poste*</label>
                  <input
                    type="text"
                    required
                    value={formData.poste}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date d'embauche*</label>
                  <input
                    type="date"
                    required
                    value={formData.dateEmbauche}
                    onChange={(e) => setFormData({ ...formData, dateEmbauche: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Numéro de sécurité sociale</label>
                  <input
                    type="text"
                    value={formData.numeroSecu}
                    onChange={(e) => setFormData({ ...formData, numeroSecu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Salaire (F)</label>
                  <input
                    type="number"
                    value={formData.salaire}
                    onChange={(e) => setFormData({ ...formData, salaire: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Spécialité</label>
                  <input
                    type="text"
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Statut*</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                    <option value="En congé">En congé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Diplômes (un par ligne)</label>
                <textarea
                  rows={2}
                  value={formData.diplomes}
                  onChange={(e) => setFormData({ ...formData, diplomes: e.target.value })}
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

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  {editingEmploye ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
