import React from 'react';
import { Search, Bell, History, HelpCircle, ChevronDown, Plus, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function TopBar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center px-8">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all" 
            placeholder={t('topbar.search')} 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant/10">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${language === 'fr' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              FR
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant transition-colors">
            <History className="w-5 h-5" />
          </button>
          <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-6 w-px bg-outline-variant/20 mx-2"></div>
        
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          New Transaction
        </button>
        
        <Link to="/profile" className="flex items-center gap-2 hover:bg-surface-container-high rounded-lg px-2 py-1 transition-colors ml-2">
          <span className="text-sm font-semibold text-primary">{t('topbar.profile')}</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </Link>
      </div>
    </header>
  );
}
