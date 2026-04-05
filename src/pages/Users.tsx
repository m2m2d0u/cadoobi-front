import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { usersService, rolesService } from '../services';
import type { UserResponse, RoleResponse, CreateUserRequest, UpdateUserRequest } from '../types/api';
import {
  UserInviteModal,
  UserEditModal,
  UserSuspendModal,
  UsersStatsSection,
  UsersTableFilters,
  UsersTable,
  UsersRBACFooter
} from '../components/users';

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

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
        usersService.list({ page: currentPage, size: pageSize, search: searchQuery }),
        rolesService.list({ activeOnly: true, size: 500 })
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
      fetchData();
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

  const handleSuspend = async () => {
    if (!userToSuspend) return;
    try {
      setIsActionLoading(true);
      await usersService.suspend(userToSuspend.id);
      setUserToSuspend(null);
      fetchData();
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

  // Client-side filtering by name, email, or role
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesName = user.fullName?.toLowerCase().includes(query);
    const matchesEmail = user.email?.toLowerCase().includes(query);
    const matchesRole = user.roles.some(role => role.name.toLowerCase().includes(query));
    return matchesName || matchesEmail || matchesRole;
  });

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
      <UserInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleInviteSubmit}
        roles={roles}
        isLoading={isLoading}
        error={isInviteModalOpen ? error : null}
      />

      {/* Edit Modal */}
      <UserEditModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleEditSubmit}
        roles={roles}
        isLoading={isActionLoading}
        error={userToEdit ? error : null}
      />

      {/* Suspend Confirmation Modal */}
      <UserSuspendModal
        isOpen={!!userToSuspend}
        onClose={() => setUserToSuspend(null)}
        user={userToSuspend}
        onConfirm={handleSuspend}
        isLoading={isActionLoading}
      />

      {/* Stats Section */}
      <UsersStatsSection totalElements={totalElements} users={users} rolesCount={roles.length} />

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        {/* Filters */}
        <UsersTableFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roles={roles}
        />

        {/* Error Display */}
        {error && !isInviteModalOpen && !userToSuspend && !userToEdit && (
          <div className="p-8 text-center bg-error/5 text-error border-b border-error/10">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-bold mb-1">Error Loading Data</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* Loading Progress Bar */}
        {isActionLoading && users.length > 0 && (
          <div className="w-full bg-surface-container-highest h-1 overflow-hidden">
            <div className="h-full bg-primary w-1/3 animate-[slide_1.5s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Table */}
        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          isActionLoading={isActionLoading}
          onResetAuth={handleResetAuth}
          onSuspend={setUserToSuspend}
          onActivate={handleActivate}
          onEdit={startEdit}
        />

        {/* Pagination */}
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

        {/* RBAC Footer */}
        <UsersRBACFooter />
      </div>
    </div>
  );
}
