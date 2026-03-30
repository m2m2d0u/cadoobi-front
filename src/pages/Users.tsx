import React, { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  Shield,
  MoreVertical,
  Mail,
  Lock,
  X,
  ChevronDown,
  Send,
  RefreshCw,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge, Pagination } from '../components/ui';
import type { StatusType } from '../components/ui';
import { usersService, rolesService } from '../services';
import type { UserResponse, RoleResponse, CreateUserRequest, UpdateUserRequest } from '../types/api';

export function Users() {
  const { t } = useLanguage();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Action state
  const [userToSuspend, setUserToSuspend] = useState<UserResponse | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Invite Form
  const initialFormState: CreateUserRequest = {
    email: '',
    password: '',
    fullName: '',
    phone: '',
    roleIds: [],
    sendWelcomeEmail: true
  };
  const [formData, setFormData] = useState<CreateUserRequest>(initialFormState);

  // Edit Form
  const [editFormData, setEditFormData] = useState<UpdateUserRequest>({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [usersData, rolesData] = await Promise.all([
        usersService.list({ page: currentPage, size: pageSize }),
        rolesService.list({ activeOnly: true, size: 500 }) // Load all active roles for the dropdown, not paginated ideally, but assuming size 500 works.
      ]);

      setUsers(usersData?.data || []);
      setTotalElements(usersData?.pagination?.totalElements || 0);
      setTotalPages(usersData?.pagination?.totalPages || 0);

      setRoles(rolesData?.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to pull user directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleIds || formData.roleIds.length === 0) {
      setError('You must assign at least one role to this user.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await usersService.create(formData);
      setIsInviteModalOpen(false);
      setFormData(initialFormState);
      fetchData(); // reload dashboard
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to dispatch user invite');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (user: UserResponse) => {
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      roleIds: user.roles.map(r => r.id),
      phone: user.phone || undefined
    });
    setUserToEdit(user);
    setError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    try {
      setIsActionLoading(true);
      setError(null);
      await usersService.update(userToEdit.id, editFormData);
      setUserToEdit(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to update user details');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Backend Actions Handlers
  const handleSuspend = async () => {
    if (!userToSuspend) return;
    try {
      setIsActionLoading(true);
      await usersService.suspend(userToSuspend.id);
      setUserToSuspend(null);
      fetchData(); // Reload safely
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to suspend user');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setIsActionLoading(true);
      await usersService.activate(id);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to activate user');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResetAuth = async (id: string) => {
    try {
      setIsActionLoading(true);
      await usersService.resetFailedLogins(id);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to reset logins');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Safe status mapping helper
  const mapStatus = (status: string): StatusType => {
    if (status === 'ACTIVE') return 'Active';
    if (status === 'PENDING') return 'Pending';
    if (status === 'SUSPENDED' || status === 'LOCKED' || status === 'BLOCKED') return 'Blocked';
    return 'Pending';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading || isActionLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="w-4 h-4" />
              {t('users.invite')}
            </Button>
          </>
        }
      />

      {/* Invite Modal */}
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

          <form className="space-y-6" onSubmit={handleInviteSubmit}>
            {error && isInviteModalOpen && <div className="p-3 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.fullName')}</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={t('users.modal.fullNamePlaceholder')}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('users.modal.emailPlaceholder')}
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.password')}</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('users.modal.passwordPlaceholder')}
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.assignRole')}</label>
              <div className="relative">
                <select
                  required
                  value={formData.roleIds[0] || ''}
                  onChange={e => setFormData({ ...formData, roleIds: [e.target.value] })}
                  className="w-full bg-surface-container-high border-2 border-primary/10 rounded-lg p-4 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all pr-12 font-bold cursor-pointer"
                >
                  <option value="" disabled>Select a designated role...</option>
                  {roles.filter(r => r.isActive).map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                  ))}
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
              <div
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.sendWelcomeEmail ? 'bg-secondary' : 'bg-outline-variant/30'}`}
                onClick={() => setFormData({ ...formData, sendWelcomeEmail: !formData.sendWelcomeEmail })}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.sendWelcomeEmail ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="flex-1 py-4 text-sm font-bold bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-primary transition-colors"
                disabled={isLoading}
              >
                {t('users.modal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-[2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary'}`}
              >
                {isLoading ? t('common.saving') : t('users.modal.sendInvitation')}
                {!isLoading && <Send className="w-4 h-4 -rotate-45" />}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!userToEdit} onClose={() => setUserToEdit(null)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{t('users.modal.editTitle')}</h3>
              <p className="text-sm text-on-surface-variant">{t('users.modal.editSubtitle')}</p>
            </div>
            <button
              onClick={() => setUserToEdit(null)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleEditSubmit}>
            {error && !!userToEdit && <div className="p-3 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.fullName')}</label>
              <input
                type="text"
                required
                value={editFormData.fullName || ''}
                onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.email')}</label>
              <input
                type="email"
                required
                value={editFormData.email || ''}
                onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.assignRole')}</label>
              <div className="relative">
                <select
                  required
                  value={editFormData.roleIds?.[0] || ''}
                  onChange={e => setEditFormData({ ...editFormData, roleIds: [e.target.value] })}
                  className="w-full bg-surface-container-high border-2 border-primary/10 rounded-lg p-4 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all pr-12 font-bold cursor-pointer"
                >
                  <option value="" disabled>Select a designated role...</option>
                  {roles.filter(r => r.isActive).map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={() => setUserToEdit(null)}
                className="flex-1 py-4 text-sm font-bold bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-primary transition-colors"
                disabled={isActionLoading}
              >
                {t('users.modal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className={`flex-[2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 ${isActionLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary'}`}
              >
                {isActionLoading ? t('common.saving') : t('users.modal.saveChanges')}
                {!isActionLoading && <Send className="w-4 h-4 -rotate-45" />}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Suspend Confirmation Modal */}
      <Modal isOpen={!!userToSuspend} onClose={() => setUserToSuspend(null)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-error mb-1">{t('users.modal.suspendTitle')}</h3>
              </div>
            </div>
            <button
              onClick={() => setUserToSuspend(null)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-on-surface-variant text-sm bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 leading-relaxed">
              {t('users.modal.suspendDesc')}
              <br /><br />
              <span className="font-bold text-primary">{userToSuspend?.fullName}</span> <span className="opacity-70">({userToSuspend?.email})</span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setUserToSuspend(null)}
              className="flex-1 py-4 text-sm font-bold bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-primary transition-colors"
              disabled={isActionLoading}
            >
              {t('users.modal.cancel')}
            </button>
            <button
              onClick={handleSuspend}
              className={`flex-[2] py-4 text-sm font-bold text-white rounded-xl transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 ${isActionLoading ? 'bg-error/50 cursor-not-allowed' : 'bg-error hover:bg-error/90'}`}
              disabled={isActionLoading}
            >
              {isActionLoading ? t('common.saving') : t('users.modal.suspendConfirm')}
            </button>
          </div>
        </div>
      </Modal>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label={t('users.stats.totalTeam')}
          value={totalElements.toString()}
          icon={UsersIcon}
          iconColor="primary"
          badge={<span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t('users.stats.newThisWeek')}</span>}
        />
        <StatsCard
          label={t('users.stats.security')}
          value="98%"
          icon={Shield}
          iconColor="secondary"
          badge={<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{roles.length} Roles</span>}
        />
        <StatsCard
          label={t('users.stats.activeSessions')}
          value={users.filter(u => u.status === 'ACTIVE').length.toString()}
          icon={Lock}
          iconColor="amber"
          badge={<span className="text-[10px] font-bold text-error uppercase tracking-widest">{t('users.stats.failedLogins')}</span>}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
          <SearchInput
            value=""
            onChange={() => { }}
            placeholder={t('users.search.placeholder')}
            className="grow"
          />
          <select className="bg-surface-container-high border-none rounded-lg text-sm px-4 py-2 font-bold text-primary cursor-pointer">
            <option>{t('users.filter.allRoles')}</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {error && !isInviteModalOpen && !userToSuspend && !userToEdit && (
          <div className="p-8 text-center bg-error/5 text-error border-b border-error/10">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-bold mb-1">Error Loading Data</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {isActionLoading && users.length > 0 && (
          <div className="w-full bg-surface-container-highest h-1 overflow-hidden">
            <div className="h-full bg-primary w-1/3 animate-[slide_1.5s_ease-in-out_infinite]" />
          </div>
        )}

        {isLoading && users.length === 0 ? (
          <div className="p-12 flex justify-center"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant flex flex-col items-center">
            <UsersIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">No users provisioned yet in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse relative">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.user')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.role')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.status')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.lastActive')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('users.table.actions')}</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-outline-variant/5 transition-opacity ${isActionLoading || isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary text-sm">{user.fullName}</span>
                          <span className="text-xs text-on-surface-variant flex items-center gap-1"><Mail className="w-3 h-3 opacity-50" /> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? user.roles.map(role => (
                          <div key={role.id} className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded">
                            <Shield className="w-3.5 h-3.5 text-secondary" />
                            <span className="text-xs font-bold text-primary">{role.name}</span>
                          </div>
                        )) : (
                          <span className="text-xs text-on-surface-variant italic">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={mapStatus(user.status)}
                        label={user.status}
                        variant="icon"
                      />
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant font-medium">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton
                          icon={RefreshCw}
                          size="md"
                          className="rounded-full bg-surface-container-low hover:bg-surface-container-high"
                          title="Reset Failed Logins"
                          onClick={() => handleResetAuth(user.id)}
                        />
                        <IconButton
                          icon={Lock}
                          size="md"
                          className={`rounded-full ${user.status === 'ACTIVE' ? 'bg-error/5 text-error hover:bg-error/20 hover:text-error' : 'bg-primary/5 text-primary hover:bg-primary/20 hover:text-primary'} transition-colors`}
                          title={user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                          onClick={() => user.status === 'ACTIVE' ? setUserToSuspend(user) : handleActivate(user.id)}
                        />
                        <IconButton
                          icon={Edit2}
                          size="md"
                          className="rounded-full hover:bg-outline-variant/10 text-on-surface-variant"
                          title="Edit User"
                          onClick={() => startEdit(user)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(0);
          }}
        />

        <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-secondary" />
            <div>
              <h4 className="font-bold text-primary text-sm">{t('users.rbac.title')}</h4>
              <p className="text-xs text-on-surface-variant font-medium max-w-2xl">{t('users.rbac.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
