import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Send,
  Store,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  UserCheck,
  TowerControl as Tower,
  BookOpen,
  Wallet,
  Settings2
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { canAccessRoute } from '../../lib/permissions';

export function Sidebar() {
  const { t } = useLanguage();
  const location = useLocation();
  const { permissions } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: CreditCard, label: t('nav.transactions'), path: '/transactions' },
    { icon: Send, label: t('nav.payouts'), path: '/payouts' },
    { icon: Store, label: t('nav.merchants'), path: '/merchants' },
    { icon: Tower, label: t('nav.operators'), path: '/operators' },
    { icon: Users, label: t('nav.users'), path: '/users' },
    { icon: ShieldCheck, label: t('nav.roles'), path: '/roles' },
    { icon: UserCheck, label: t('nav.permissions'), path: '/permissions' },
    { icon: BookOpen, label: t('nav.ledgerEntries'), path: '/ledger-entries' },
    { icon: Wallet, label: t('nav.systemAccount'), path: '/system-account' },
    { icon: Settings2, label: t('nav.parameters'), path: '/parameters' },
    { icon: BarChart3, label: t('nav.reports'), path: '/reports' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter(item => canAccessRoute(item.path, permissions));

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 overflow-y-auto bg-surface-container-highest/30 flex flex-col py-6 pl-4 border-r border-outline-variant/10 z-50">
      <div className="mb-8 pr-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <h1 className="text-xl font-bold text-primary font-headline tracking-tight">Cadoobi Admin</h1>
        </div>
        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest pl-11">System Controller</p>
      </div>

      <nav className="flex-1 space-y-1 pr-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              const isSettingsProfile = item.path === '/settings' && location.pathname === '/profile';
              return cn(
                "flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-l-lg group",
                (isActive || isSettingsProfile)
                  ? "bg-surface-container-lowest text-primary border-r-4 border-secondary font-semibold shadow-sm" 
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              );
            }}
          >
            <item.icon className={cn("w-5 h-5", "group-hover:scale-110 transition-transform")} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pr-4 space-y-1 border-t border-outline-variant/10 pt-6">
        <div className="px-4 py-2 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-tighter">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            System Status: Active
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary w-full text-left transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Support</span>
        </button>
        
        <NavLink to="/login" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </NavLink>

        <div className="mt-6 px-4 py-4 bg-surface-container-low rounded-xl flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdhCFalAb3GsiHShHt1X8hrbao9jhdHN5f8Nxhv3E2gSaQzTV7fqb-lsowpt3MonNFfXWA3zvhhkZ8yJ8Mr0oE_nDtWuE5iA05QA7Xai3IKUPx9LJ-4hul1BpNQlFCsyKl14TzRiQpN51plbeJTasKNgCnRyvR1JB9KOtPxT1RxC_TsVwB3ulmu44lg7jY1fgpH23RLlKTnc3wgMJEEsaiI-Z_CKfZPsJiH_iag0RI05Q32MkOlRBrz9OpLKq4A1tYvgkqkis6W741" 
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover border border-outline-variant/20"
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <p className="text-primary text-xs font-bold truncate">Admin User</p>
            <p className="text-on-surface-variant text-[10px] truncate">admin@cadoobi.sn</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
