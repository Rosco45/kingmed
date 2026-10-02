import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCheck,
  Settings,
  Calendar,
  BookOpen,
  FlaskConical,
  Package,
  Receipt,
  LogOut,
  Activity,
  ShoppingCart
} from 'lucide-react';
import { UserRole } from './Header';

export type ActiveTab =
  | 'dashboard'
  | 'patients'
  | 'consultations'
  | 'employes'
  | 'parametres'
  | 'rendezvous'
  | 'carnet-sante'
  | 'resultat-labo'
  | 'stock-pharmacie'
  | 'vente-pharmacie'
  | 'facturation';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  currentRole,
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { id: 'consultations', label: 'Consultations', icon: <FileText className="w-5 h-5" /> },
    { id: 'employes', label: 'Employés', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'rendezvous', label: 'Rendez-vous', icon: <Calendar className="w-5 h-5" /> },
    { id: 'carnet-sante', label: 'Carnet de santé', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'resultat-labo', label: 'Résultat labo', icon: <FlaskConical className="w-5 h-5" /> },
    { id: 'stock-pharmacie', label: 'Stock pharmacie', icon: <Package className="w-5 h-5" /> },
    { id: 'vente-pharmacie', label: 'Ventes Pharmacie', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'facturation', label: 'Facturation', icon: <Receipt className="w-5 h-5" /> },
    { id: 'parametres', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#0b72e7] text-white flex flex-col shrink-0 min-h-screen shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-blue-400/30">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-emerald-400">
          <Activity className="w-6 h-6 text-emerald-400 font-bold" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white flex items-center">
          <span className="text-emerald-300">K</span>ingmed
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/20 text-white font-semibold shadow-inner border-l-4 border-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-blue-400/30 bg-blue-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-200 text-sky-800 font-bold flex items-center justify-center text-xs">
              {currentRole.initials}
            </div>
            <div className="truncate text-left">
              <div className="text-sm font-medium text-white truncate">{currentRole.name}</div>
              <div className="text-xs text-blue-200">{currentRole.role}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Déconnexion"
            className="p-1.5 rounded-lg hover:bg-white/15 text-blue-200 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
