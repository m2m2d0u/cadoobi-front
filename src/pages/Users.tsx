import React, { useState } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  Shield,
  MoreVertical,
  Mail,
  Lock,
  Key,
  X,
  ChevronDown,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';

const users = [
  { id: 1, name: 'Abass Diallo', email: 'm.abassdiallo@gmail.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago' },
  { id: 2, name: 'Fatou Sow', email: 'fatou.sow@cadoobi.com', role: 'Compliance Officer', status: 'Active', lastActive: '1 hour ago' },
  { id: 3, name: 'Moussa Ndiaye', email: 'moussa.n@cadoobi.com', role: 'Support Agent', status: 'Pending', lastActive: 'Never' },
  { id: 4, name: 'Awa Diop', email: 'awa.diop@cadoobi.com', role: 'Finance Manager', status: 'Blocked', lastActive: '3 days ago' },
];

export function Users() {
  const { t } = useLanguage();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        actions={
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className="w-4 h-4" />
            {t('users.invite')}
          </Button>
        }
      />

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{t('users.modal.inviteTitle')}</h3>
              <p className="text-sm text-on-surface-variant">{t('users.modal.inviteSubtitle')}</p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.fullName')}</label>
              <input
                type="text"
                placeholder={t('users.modal.fullNamePlaceholder')}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.email')}</label>
              <input
                type="email"
                placeholder={t('users.modal.emailPlaceholder')}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.assignRole')}</label>
              <div className="relative">
                <select className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all pr-12">
                  <option>{t('users.modal.roleAdmin')}</option>
                  <option>{t('users.modal.roleCompliance')}</option>
                  <option>{t('users.modal.roleFinance')}</option>
                  <option>{t('users.modal.roleSupport')}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{t('users.modal.sendEmail')}</p>
                  <p className="text-[11px] text-on-surface-variant">{t('users.modal.sendEmailDesc')}</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              {t('users.modal.sendInvitation')}
              <Send className="w-4 h-4 rotate-[-45deg]" />
            </button>
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="w-full py-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              {t('users.modal.cancel')}
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label={t('users.stats.totalTeam')}
          value="24"
          icon={UsersIcon}
          iconColor="primary"
          badge={<span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t('users.stats.newThisWeek')}</span>}
        />
        <StatsCard
          label={t('users.stats.security')}
          value="98%"
          icon={Shield}
          iconColor="secondary"
          badge={<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.stats.rolesDefined')}</span>}
        />
        <StatsCard
          label={t('users.stats.activeSessions')}
          value="8"
          icon={Lock}
          iconColor="amber"
          badge={<span className="text-[10px] font-bold text-error uppercase tracking-widest">{t('users.stats.failedLogins')}</span>}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder={t('users.search.placeholder')}
            className="flex-grow"
          />
          <select className="bg-surface-container-high border-none rounded-lg text-sm px-4 py-2 font-bold text-primary">
            <option>{t('users.filter.allRoles')}</option>
            <option>Super Admin</option>
            <option>Compliance</option>
            <option>Finance</option>
            <option>Support</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.user')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.role')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.status')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.lastActive')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('users.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary text-sm">{user.name}</span>
                        <span className="text-xs text-on-surface-variant">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-sm font-medium text-primary">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={user.status as StatusType}
                      label={user.status === 'Active' ? t('common.active') : user.status === 'Pending' ? t('common.pending') : t('common.blocked')}
                      variant="icon"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton icon={Mail} size="md" className="rounded-full" />
                      <IconButton icon={Key} size="md" className="rounded-full" />
                      <IconButton icon={MoreVertical} size="md" className="rounded-full" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-secondary" />
            <div>
              <h4 className="font-bold text-primary text-sm">{t('users.rbac.title')}</h4>
              <p className="text-xs text-on-surface-variant">{t('users.rbac.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
