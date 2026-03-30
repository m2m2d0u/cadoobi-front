import React from 'react';
import { 
  Layout, 
  ShieldCheck, 
  Mail, 
  Webhook, 
  Key, 
  RefreshCw,
  CheckCircle2,
  LockOpen
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function Settings() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">{t('settings.title')}</h1>
        <p className="text-on-surface-variant max-w-2xl">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <nav className="w-full lg:w-64 shrink-0 space-y-6 sticky top-28">
          <SettingNavSection title={t('settings.nav.navigation')} label={t('settings.nav.branding')} active />
          <SettingNavSection title={t('settings.nav.access')} label={t('settings.nav.security')} />
          <SettingNavSection title={t('settings.nav.communication')} label={t('settings.nav.email')} />
          <SettingNavSection title={t('settings.nav.developer')} label={t('settings.nav.api')} />
        </nav>

        <div className="flex-grow space-y-16 w-full">
          {/* General Branding */}
          <section className="bg-surface-container-lowest p-6 lg:p-10 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{t('settings.branding.title')}</h3>
                <p className="text-sm text-on-surface-variant">{t('settings.branding.desc')}</p>
              </div>
              <Layout className="text-primary-fixed-dim w-10 h-10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">{t('settings.branding.name')}</label>
                <input className="w-full bg-surface-container-highest border-none p-3 rounded-lg focus:ring-0 focus:border-b-2 border-surface-tint" type="text" defaultValue="Cadoobi Transactions"/>
                <p className="text-[11px] text-on-surface-variant">{t('settings.branding.nameDesc')}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">{t('settings.branding.currency')}</label>
                <select className="w-full bg-surface-container-highest border-none p-3 rounded-lg focus:ring-0" defaultValue="West African CFA franc (XOF)">
                  <option value="West African CFA franc (XOF)">{t('settings.branding.currency.xof')}</option>
                  <option value="Central African CFA franc (XAF)">{t('settings.branding.currency.xaf')}</option>
                  <option value="Euro (EUR)">{t('settings.branding.currency.eur')}</option>
                  <option value="US Dollar (USD)">{t('settings.branding.currency.usd')}</option>
                </select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface">{t('settings.branding.timezone')}</label>
                <select className="w-full bg-surface-container-highest border-none p-3 rounded-lg focus:ring-0" defaultValue="(GMT+00:00) Dakar, Senegal">
                  <option value="(GMT+00:00) Dakar, Senegal">{t('settings.branding.timezone.dakar')}</option>
                  <option value="(GMT+00:00) Abidjan, Côte d'Ivoire">{t('settings.branding.timezone.abidjan')}</option>
                  <option value="(GMT+01:00) Lagos, Nigeria">{t('settings.branding.timezone.lagos')}</option>
                </select>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button className="bg-primary text-white px-8 py-3 font-bold rounded hover:opacity-90 transition-all">{t('settings.branding.save')}</button>
            </div>
          </section>

          {/* Security Policy */}
          <section className="bg-surface-container-low p-6 lg:p-10 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{t('settings.security.title')}</h3>
                <p className="text-sm text-on-surface-variant">{t('settings.security.desc')}</p>
              </div>
              <LockOpen className="text-primary-fixed-dim w-10 h-10" />
            </div>
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-surface-container-lowest rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">{t('settings.security.2fa')}</p>
                    <p className="text-xs text-on-surface-variant">{t('settings.security.2faDesc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-secondary-container rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-on-secondary-container rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-lg flex items-center justify-between opacity-60">
                  <div>
                    <p className="font-bold text-primary">{t('settings.security.ip')}</p>
                    <p className="text-xs text-on-surface-variant">{t('settings.security.ipDesc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface">{t('settings.security.minPass')}</label>
                  <input className="w-full bg-surface-container-highest border-none p-3 rounded-lg tabular-nums" type="number" defaultValue="12"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface">{t('settings.security.timeout')}</label>
                  <input className="w-full bg-surface-container-highest border-none p-3 rounded-lg tabular-nums" type="number" defaultValue="30"/>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button className="bg-primary text-white px-8 py-3 font-bold rounded hover:opacity-90 transition-all">{t('settings.security.save')}</button>
            </div>
          </section>

          {/* API Integration */}
          <section className="bg-surface-container-lowest p-6 lg:p-10 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{t('settings.api.title')}</h3>
                <p className="text-sm text-on-surface-variant">{t('settings.api.desc')}</p>
              </div>
              <Webhook className="text-primary-fixed-dim w-10 h-10" />
            </div>
            <div className="space-y-8">
              <div className="p-6 bg-primary text-white rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Key className="text-secondary-container w-6 h-6" />
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60">{t('settings.api.prodKey')}</p>
                    <p className="font-mono text-lg tabular-nums">••••••••••••••••••••••••••••••4821</p>
                  </div>
                </div>
                <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-xs font-bold transition-all uppercase">{t('settings.api.reveal')}</button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">{t('settings.api.webhook')}</label>
                <div className="flex gap-2">
                  <input className="flex-grow bg-surface-container-highest border-none p-3 rounded-lg" type="url" defaultValue="https://api.merchant-core.com/webhooks/cadoobi"/>
                  <button className="bg-surface-container-highest p-3 rounded-lg hover:bg-surface-container-high transition-all">
                    <RefreshCw className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant">{t('settings.api.webhookDesc')}</p>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button className="bg-secondary-container text-on-secondary-container px-8 py-3 font-bold rounded hover:opacity-90 transition-all flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {t('settings.api.save')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SettingNavSection({ title, label, active }: any) {
  return (
    <button className={cn(
      "flex flex-col items-start w-full group text-left transition-opacity",
      !active && "opacity-50 hover:opacity-100"
    )}>
      <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">{title}</span>
      <div className={cn(
        "flex items-center gap-3 font-bold",
        active ? "text-primary" : "text-on-surface-variant font-semibold px-4"
      )}>
        {active && <span className="w-1 h-6 bg-secondary rounded-full"></span>}
        {label}
      </div>
    </button>
  );
}
