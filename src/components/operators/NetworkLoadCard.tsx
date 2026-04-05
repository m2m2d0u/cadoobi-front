import React from 'react';
import { Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function NetworkLoadCard() {
  const { t } = useLanguage();

  return (
    <div className="bg-primary text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full min-h-[200px]">
      <Zap className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">{t('operators.load.title')}</p>
        <h3 className="text-4xl font-bold font-headline mb-4">82%</h3>
        <p className="text-xs text-white/70 leading-relaxed">{t('operators.load.desc')}</p>
      </div>
      <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors backdrop-blur-sm border border-white/10">
        {t('operators.load.logs')}
      </button>
    </div>
  );
}
