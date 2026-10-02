import React from 'react';
import { Shield, Database, Download, RefreshCw, Key, LogOut } from 'lucide-react';
import { storageService } from '../services/storage';

interface ParametresViewProps {
  onResetDatabase: () => void;
  onLogout: () => void;
}

export const ParametresView: React.FC<ParametresViewProps> = ({
  onResetDatabase,
  onLogout,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Paramètres</h2>
        <p className="text-sm text-slate-500">Configuration générale et maintenance</p>
      </div>

      {/* Bloc Sécurité (Matches 15.jpeg) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-sky-600 px-6 py-3.5 text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold text-sm">Sécurité</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Gérez vos paramètres de sécurité et de connexion.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
            <button
              onClick={() => alert('Fonctionnalité : Modification du mot de passe administrateur.')}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Changer le mot de passe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bloc Base de données (Matches 15.jpeg) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-sky-600 px-6 py-3.5 text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          <h3 className="font-semibold text-sm">Base de données</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Gérez les données de l'application. La réinitialisation restaure le jeu de données de démonstration initial.
          </p>
          <div>
            <button
              onClick={() => {
                if (
                  confirm(
                    'Êtes-vous sûr de vouloir réinitialiser la base de données aux valeurs par défaut ?'
                  )
                ) {
                  onResetDatabase();
                  alert('La base de données a été réinitialisée avec succès !');
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réinitialiser la base de données</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bloc Exportation (Matches 15.jpeg) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-sky-600 px-6 py-3.5 text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          <h3 className="font-semibold text-sm">Exportation</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Exportez les données de l'application pour les sauvegarder ou les transférer. L'exportation inclut :
          </p>
          <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 pl-2">
            <li>Dossiers et historique des patients</li>
            <li>Consultations et relevés de constantes vitales</li>
            <li>Fiches des employés et contrats</li>
            <li>Inventaire et mouvements de la pharmacie</li>
            <li>Résultats de laboratoire et factures</li>
          </ul>
          <div>
            <button
              onClick={() => storageService.exportAllData()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter toutes les données</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
