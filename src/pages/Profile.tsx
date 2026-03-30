import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Globe, 
  Clock, 
  Moon, 
  Sun, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export function Profile() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">{t('profile.title')}</h2>
        <p className="text-on-surface-variant text-sm mt-1">{t('profile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Card & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Profile Card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="h-32 bg-primary/5 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold border-4 border-surface-container-lowest shadow-xl">
                  AD
                </div>
              </div>
            </div>
            
            <div className="pt-16 p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-primary">Amadou Diop</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-secondary" />
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{t('profile.verified')}</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-medium">Super Admin</p>
                </div>
                <button className="px-6 py-2 bg-primary/5 text-primary text-sm font-bold rounded-xl hover:bg-primary/10 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email</p>
                    <p className="text-sm font-medium text-primary">amadou.diop@cadoobi.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-medium text-primary">+221 77 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
                    <p className="text-sm font-medium text-primary">Dakar, Senegal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-medium text-primary">October 12, 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">{t('profile.password.title')}</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{t('profile.password.desc')}</p>
              <button className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-colors">
                {t('profile.password.button')}
              </button>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">{t('profile.2fa.title')}</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{t('profile.2fa.desc')}</p>
              <button className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-colors">
                {t('profile.2fa.button')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Health */}
        <div className="space-y-8">
          {/* Preferences Card */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h4 className="text-xl font-bold text-primary mb-8">{t('profile.preferences.title')}</h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-on-surface-variant" />
                  <span className="text-sm font-medium text-primary">{t('profile.preferences.language')}</span>
                </div>
                <span className="text-sm font-bold text-secondary uppercase">{language === 'en' ? 'English' : 'Français'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-on-surface-variant" />
                  <span className="text-sm font-medium text-primary">{t('profile.preferences.timezone')}</span>
                </div>
                <span className="text-sm font-bold text-secondary">GMT +00:00</span>
              </div>

              <div className="pt-6 border-t border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">{t('profile.preferences.displayMode')}</p>
                <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-high rounded-xl">
                  <button className="flex items-center justify-center gap-2 py-2 bg-surface-container-lowest rounded-lg shadow-sm text-sm font-bold text-primary">
                    <Sun className="w-4 h-4" />
                    {t('profile.preferences.light')}
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                    <Moon className="w-4 h-4" />
                    {t('profile.preferences.dark')}
                  </button>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-between p-4 bg-error/5 text-error rounded-xl hover:bg-error/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-bold">{t('profile.preferences.signOut')}</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Account Health Card */}
          <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{t('profile.health.score')}</p>
                  <p className="text-3xl font-bold text-white">98%</p>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">{t('profile.health.title')}</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                {t('profile.health.desc')}
              </p>

              <div className="mt-8 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-secondary"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
