import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function UsersRBACFooter() {
  const { t } = useLanguage();

  return (
    <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30">
      <div className="flex items-center gap-4">
        <Shield className="w-8 h-8 text-secondary" />
        <div>
          <h4 className="font-bold text-primary text-sm">{t('users.rbac.title')}</h4>
          <p className="text-xs text-on-surface-variant font-medium max-w-2xl">{t('users.rbac.desc')}</p>
        </div>
      </div>
    </div>
  );
}
