import React, { useState } from 'react';
import { Calculator, X, HeartPulse, Scale, Droplet } from 'lucide-react';

interface MedicalCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalCalculatorModal: React.FC<MedicalCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'imc' | 'pediatrie' | 'perfusion'>('imc');

  // IMC State
  const [poids, setPoids] = useState<number>(70);
  const [taille, setTaille] = useState<number>(175); // cm

  // Pédiatrie State
  const [poidsEnfant, setPoidsEnfant] = useState<number>(12);
  const [doseParKg, setDoseParKg] = useState<number>(15); // mg/kg

  // Perfusion State
  const [volumeMl, setVolumeMl] = useState<number>(500);
  const [dureeHeures, setDureeHeures] = useState<number>(4);

  if (!isOpen) return null;

  // IMC Calculation
  const tailleMetres = taille / 100;
  const imc = tailleMetres > 0 ? (poids / (tailleMetres * tailleMetres)).toFixed(1) : '0';
  const imcVal = parseFloat(imc);
  let imcCat = { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (imcVal < 18.5) {
    imcCat = { label: 'Insuffisance pondérale', color: 'text-amber-600', bg: 'bg-amber-50' };
  } else if (imcVal >= 30) {
    imcCat = { label: 'Obésité', color: 'text-rose-600', bg: 'bg-rose-50' };
  } else if (imcVal >= 25) {
    imcCat = { label: 'Surpoids', color: 'text-amber-600', bg: 'bg-amber-50' };
  }

  // Dose Pédiatrique
  const doseParPrise = poidsEnfant * doseParKg;
  const doseJournaliereMax = poidsEnfant * 60; // règle 60mg/kg/jour

  // Débit de perfusion (gouttes / min) : (Volume en ml * 20 gouttes/ml) / (Durée en minutes)
  const debitGouttes = dureeHeures > 0 ? Math.round((volumeMl * 20) / (dureeHeures * 60)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <Calculator className="w-5 h-5 text-sky-200" />
            <span>Outils & Calculatrices Cliniques</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('imc')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'imc'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            IMC (Masse Corporelle)
          </button>
          <button
            onClick={() => setActiveTab('pediatrie')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'pediatrie'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Dose Pédiatrique
          </button>
          <button
            onClick={() => setActiveTab('perfusion')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'perfusion'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Débit Perfusion IV
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'imc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    value={poids}
                    onChange={(e) => setPoids(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    value={taille}
                    onChange={(e) => setTaille(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border border-slate-200 ${imcCat.bg} text-center`}>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Indice de Masse Corporelle (IMC)
                </span>
                <div className={`text-3xl font-extrabold my-1 ${imcCat.color}`}>{imc} kg/m²</div>
                <div className={`text-xs font-bold ${imcCat.color}`}>{imcCat.label}</div>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Classification OMS : 18.5 - 24.9 (Normale), 25.0 - 29.9 (Surpoids), ≥30.0 (Obésité)
              </div>
            </div>
          )}

          {activeTab === 'pediatrie' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poids Enfant (kg)
                  </label>
                  <input
                    type="number"
                    value={poidsEnfant}
                    onChange={(e) => setPoidsEnfant(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Posologie unitaire (mg/kg)
                  </label>
                  <input
                    type="number"
                    value={doseParKg}
                    onChange={(e) => setDoseParKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-xs font-medium text-sky-600 uppercase tracking-wide">
                  Dose par prise recommandée
                </span>
                <div className="text-3xl font-extrabold text-sky-800 my-1">{doseParPrise} mg</div>
                <div className="text-xs text-sky-700">
                  Dose maximale journalière conseillée : <strong>{doseJournaliereMax} mg/jour</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perfusion' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Volume à perfuser (ml)
                  </label>
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durée (heures)
                  </label>
                  <input
                    type="number"
                    value={dureeHeures}
                    onChange={(e) => setDureeHeures(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                  Vitesse de perfusion (Standard 20 gttes/ml)
                </span>
                <div className="text-3xl font-extrabold text-emerald-800 my-1">
                  {debitGouttes} gouttes / min
                </div>
                <div className="text-xs text-emerald-700">
                  Soit environ {((volumeMl / (dureeHeures || 1))).toFixed(0)} ml / heure
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
