import React from 'react';
import { LogOut, Bell, Search, Calculator, ShieldCheck, User } from 'lucide-react';

export interface UserRole {
  name: string;
  role: 'Médecin' | 'Infirmière' | 'Administrateur';
  initials: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogout: () => void;
  lowStockCount?: number;
  onOpenSearch: () => void;
  onOpenCalculator: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const ROLES: UserRole[] = [
  { name: 'Dr. Mensah', role: 'Médecin', initials: 'DM' },
  { name: 'Bellize Zorru', role: 'Infirmière', initials: 'BZ' },
  { name: 'Sam Eric', role: 'Administrateur', initials: 'SE' },
];

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onLogout,
  lowStockCount = 0,
  onOpenSearch,
  onOpenCalculator,
  currentRole,
  onRoleChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          title="Recherche globale"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Recherche rapide...</span>
        </button>

        {/* Medical Tools Calculator */}
        <button
          onClick={onOpenCalculator}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
          title="Calculatrices médicales (IMC, Pédiatrie, Perfusion)"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Outils Cliniques</span>
        </button>

        {/* Low Stock Alerts */}
        {lowStockCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold animate-pulse">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} alerte stock</span>
          </div>
        )}

        {/* Role Switcher */}
        <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">{currentRole.name}</div>
            <div className="text-[10px] text-sky-600 font-semibold">{currentRole.role}</div>
          </div>
          <select
            value={currentRole.name}
            onChange={(e) => {
              const found = ROLES.find((r) => r.name === e.target.value);
              if (found) onRoleChange(found);
            }}
            className="text-xs border border-slate-200 rounded p-1 bg-slate-50 font-medium"
            title="Changer de profil actif"
          >
            {ROLES.map((r) => (
              <option key={r.name} value={r.name}>
                {r.role} ({r.name})
              </option>
            ))}
          </select>
        </div>

        {/* Déconnexion */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};
