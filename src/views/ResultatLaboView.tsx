import React, { useState } from 'react';
import { Patient, ResultatLabo } from '../types';
import { FlaskConical, FileText, Upload, Eye, CheckCircle2 } from 'lucide-react';

interface ResultatLaboViewProps {
  patients: Patient[];
  labResults: ResultatLabo[];
  onAddLabResult: (result: Omit<ResultatLabo, 'id'>) => void;
}

export const ResultatLaboView: React.FC<ResultatLaboViewProps> = ({
  patients,
  labResults,
  onAddLabResult,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-2'); // Sam Eric selected as in 22.jpeg
  const [titre, setTitre] = useState('');
  const [fichierNom, setFichierNom] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientResults = selectedPatient
    ? labResults.filter((r) => r.patientId === selectedPatient.id)
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFichierNom(file.name);
      setFileType(file.type.includes('image') ? 'image' : 'pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !titre) {
      alert('Veuillez sélectionner un patient et donner un nom au résultat.');
      return;
    }

    onAddLabResult({
      patientId: selectedPatient.id,
      patientNom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      titre,
      date: new Date().toLocaleDateString('fr-FR'),
      fichierNom: fichierNom || 'analyse_examen.pdf',
      fichierType: fileType,
      fichierUrl:
        fileType === 'image'
          ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'
          : '#',
      notes: 'Analyse enregistrée au laboratoire',
    });

    setTitre('');
    setFichierNom('');
    alert('Résultat de laboratoire enregistré avec succès !');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Résultat labo</h2>
        <p className="text-sm text-slate-500">
          Enregistrement et archivage des examens biologiques et imageries
        </p>
      </div>

      {/* Upload Box (Matches 21.jpeg) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nom du résultat
            </label>
            <input
              type="text"
              placeholder="Ex: Hémogramme"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fichier (photo ou PDF)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>

      {/* Résultats enregistrés (Matches 21.jpeg & 22.jpeg) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Résultats enregistrés</h3>

        {patientResults.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Aucun résultat pour ce patient.
          </div>
        ) : (
          <div className="space-y-4">
            {patientResults.map((res) => (
              <div
                key={res.id}
                className="p-4 border border-slate-200 rounded-xl hover:border-sky-300 transition-all bg-slate-50/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sky-800 text-base">{res.titre}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Ajouté le {res.date}</p>
                  </div>
                  {res.fichierType === 'pdf' ? (
                    <button
                      onClick={() => alert(`Visualisation du fichier PDF : ${res.fichierNom}`)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" /> Voir le PDF
                    </button>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                      Image
                    </span>
                  )}
                </div>

                {res.fichierType === 'image' && (
                  <div className="mt-3">
                    <div className="w-28 h-28 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center p-2">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                          ⚕
                        </div>
                        <span className="text-[10px] text-emerald-800 font-medium block mt-1">
                          Cliché médical
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
