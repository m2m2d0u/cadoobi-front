import React, { useState, useEffect } from 'react';
import {
  Layout,
  ShieldCheck,
  Mail,
  Webhook,
  Key,
  RefreshCw,
  CheckCircle2,
  LockOpen,
  Plus,
  Copy,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, Modal, IconButton, StatusBadge } from '../components/ui';
import { PermissionGuard } from '../components/auth';
import { apiKeysService, webhooksService } from '../services';
import type {
  ApiKeyResponse,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  WebhookConfigurationResponse,
  CreateWebhookConfigurationRequest,
  UpdateWebhookConfigurationRequest
} from '../types/api';

export function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'branding' | 'security' | 'api-keys' | 'webhooks'>('branding');

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">{t('settings.title')}</h1>
        <p className="text-on-surface-variant max-w-2xl">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <nav className="w-full lg:w-64 shrink-0 space-y-6 sticky top-28">
          <SettingNavSection
            title={t('settings.nav.navigation')}
            label={t('settings.nav.branding')}
            active={activeTab === 'branding'}
            onClick={() => setActiveTab('branding')}
          />
          <SettingNavSection
            title={t('settings.nav.access')}
            label={t('settings.nav.security')}
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          />
          <SettingNavSection
            title={t('settings.nav.developer')}
            label={t('settings.nav.apiKeys')}
            active={activeTab === 'api-keys'}
            onClick={() => setActiveTab('api-keys')}
          />
          <SettingNavSection
            title={t('settings.nav.developer')}
            label={t('settings.nav.webhooks')}
            active={activeTab === 'webhooks'}
            onClick={() => setActiveTab('webhooks')}
          />
        </nav>

        <div className="grow space-y-16 w-full">
          {activeTab === 'branding' && <BrandingSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'api-keys' && <ApiKeysSection />}
          {activeTab === 'webhooks' && <WebhooksSection />}
        </div>
      </div>
    </div>
  );
}

function SettingNavSection({ title, label, active, onClick }: { title: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start w-full group text-left transition-opacity",
        !active && "opacity-50 hover:opacity-100"
      )}
    >
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

function BrandingSection() {
  const { t } = useLanguage();

  return (
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
  );
}

function SecuritySection() {
  const { t } = useLanguage();

  return (
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
  );
}

function ApiKeysSection() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyResponse | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    name: '',
    description: '',
    allowedReferrers: [],
    expiresAt: undefined
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiKeysService.getAll();
      setApiKeys(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const created = await apiKeysService.create(formData);
      setNewApiKey(created.apiKey || null);
      await fetchApiKeys();
      setFormData({ name: '', description: '', allowedReferrers: [], expiresAt: undefined });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;

    try {
      setIsLoading(true);
      await apiKeysService.update(editingKey.id, formData);
      await fetchApiKeys();
      setIsModalOpen(false);
      setEditingKey(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('settings.apiKeys.deleteConfirm'))) return;

    try {
      setIsLoading(true);
      await apiKeysService.delete(id);
      await fetchApiKeys();
    } catch (err: any) {
      setError(err.message || 'Failed to delete API key');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('settings.apiKeys.copied'));
  };

  return (
    <section className="bg-surface-container-lowest p-6 lg:p-10 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">{t('settings.apiKeys.title')}</h3>
          <p className="text-sm text-on-surface-variant">{t('settings.apiKeys.subtitle')}</p>
        </div>
        <Key className="text-primary-fixed-dim w-10 h-10" />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {newApiKey && (
        <div className="mb-6 p-6 bg-secondary/10 border-2 border-secondary rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-bold text-secondary mb-1">{t('settings.apiKeys.newKeyWarning')}</p>
              <p className="text-sm text-on-surface-variant">{t('settings.apiKeys.newKeyWarningDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 bg-surface-container-lowest rounded-lg">
            <code className="flex-1 font-mono text-sm break-all">{newApiKey}</code>
            <IconButton
              icon={Copy}
              onClick={() => copyToClipboard(newApiKey)}
              className="shrink-0"
            />
          </div>
          <button
            onClick={() => setNewApiKey(null)}
            className="mt-3 text-sm text-secondary hover:underline"
          >
            {t('common.close')}
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <PermissionGuard permission="api-key:create">
          <Button onClick={() => {
            setEditingKey(null);
            setFormData({ name: '', description: '', allowedReferrers: [], expiresAt: undefined });
            setIsModalOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            {t('settings.apiKeys.create')}
          </Button>
        </PermissionGuard>
      </div>

      <div className="space-y-3">
        {isLoading && apiKeys.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">{t('common.loading')}</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <Key className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">{t('settings.apiKeys.empty')}</p>
            <p className="text-sm mt-2">{t('settings.apiKeys.emptyDesc')}</p>
          </div>
        ) : (
          apiKeys.map((key) => (
            <div key={key.id} className="p-6 bg-surface-container-high rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-primary mb-1">{key.name}</h4>
                  {key.description && (
                    <p className="text-sm text-on-surface-variant mb-3">{key.description}</p>
                  )}
                  <div className="flex items-center gap-2 p-3 bg-surface-container-lowest rounded-lg">
                    <code className="flex-1 font-mono text-sm">{key.maskedApiKey}</code>
                    <IconButton
                      icon={Copy}
                      size="sm"
                      onClick={() => copyToClipboard(key.maskedApiKey)}
                    />
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <PermissionGuard permission="api-key:update">
                    <IconButton
                      icon={Edit2}
                      size="sm"
                      onClick={() => {
                        setEditingKey(key);
                        setFormData({
                          name: key.name,
                          description: key.description || '',
                          allowedReferrers: key.allowedReferrers,
                          expiresAt: key.expiresAt || undefined,
                          isActive: key.isActive
                        });
                        setIsModalOpen(true);
                      }}
                    />
                  </PermissionGuard>
                  <PermissionGuard permission="api-key:delete">
                    <IconButton
                      icon={Trash2}
                      size="sm"
                      onClick={() => handleDelete(key.id)}
                      className="text-error hover:bg-error/10"
                    />
                  </PermissionGuard>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <StatusBadge
                  status={key.isActive ? 'Active' : 'Blocked'}
                  label={key.isActive ? t('common.active') : t('common.inactive')}
                  variant="dot"
                />
                <span>{t('settings.apiKeys.created')}: {new Date(key.createdAt).toLocaleDateString()}</span>
                {key.lastUsedAt && (
                  <span>{t('settings.apiKeys.lastUsed')}: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                )}
                {key.expiresAt && (
                  <span className="text-error">{t('settings.apiKeys.expires')}: {new Date(key.expiresAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setError(null);
      }} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            {editingKey ? t('settings.apiKeys.edit') : t('settings.apiKeys.create')}
          </h3>

          {error && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={editingKey ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.apiKeys.form.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.apiKeys.form.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                rows={3}
                maxLength={255}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.apiKeys.form.expiresAt')}
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
              />
            </div>
            {editingKey && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-on-surface-variant">{t('common.active')}</span>
              </label>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editingKey ? t('common.saveChanges') : t('common.submit')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </section>
  );
}

function WebhooksSection() {
  const { t } = useLanguage();
  const [webhooks, setWebhooks] = useState<WebhookConfigurationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfigurationResponse | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateWebhookConfigurationRequest>({
    name: '',
    url: '',
    description: '',
    subscribedEvents: [],
    maxRetries: 3,
    timeoutSeconds: 30
  });

  const availableEvents = [
    'payment.created',
    'payment.completed',
    'payment.failed',
    'payout.created',
    'payout.completed',
    'payout.failed'
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await webhooksService.getAll();
      setWebhooks(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load webhooks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const created = await webhooksService.create(formData);
      setNewSecret(created.secret || null);
      await fetchWebhooks();
      setFormData({ name: '', url: '', description: '', subscribedEvents: [], maxRetries: 3, timeoutSeconds: 30 });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWebhook) return;

    try {
      setIsLoading(true);
      await webhooksService.update(editingWebhook.id, formData);
      await fetchWebhooks();
      setIsModalOpen(false);
      setEditingWebhook(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSecret = async (id: string) => {
    if (!confirm(t('settings.webhooks.regenerateConfirm'))) return;

    try {
      setIsLoading(true);
      const result = await webhooksService.regenerateSecret(id);
      setNewSecret(result.secret || null);
      await fetchWebhooks();
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate secret');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('settings.webhooks.deleteConfirm'))) return;

    try {
      setIsLoading(true);
      await webhooksService.delete(id);
      await fetchWebhooks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('settings.webhooks.copied'));
  };

  const toggleEvent = (event: string) => {
    const current = formData.subscribedEvents || [];
    if (current.includes(event)) {
      setFormData({ ...formData, subscribedEvents: current.filter(e => e !== event) });
    } else {
      setFormData({ ...formData, subscribedEvents: [...current, event] });
    }
  };

  return (
    <section className="bg-surface-container-lowest p-6 lg:p-10 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">{t('settings.webhooks.title')}</h3>
          <p className="text-sm text-on-surface-variant">{t('settings.webhooks.subtitle')}</p>
        </div>
        <Webhook className="text-primary-fixed-dim w-10 h-10" />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {newSecret && (
        <div className="mb-6 p-6 bg-secondary/10 border-2 border-secondary rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-bold text-secondary mb-1">{t('settings.webhooks.newSecretWarning')}</p>
              <p className="text-sm text-on-surface-variant">{t('settings.webhooks.newSecretWarningDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 bg-surface-container-lowest rounded-lg">
            <code className="flex-1 font-mono text-sm break-all">{newSecret}</code>
            <IconButton
              icon={Copy}
              onClick={() => copyToClipboard(newSecret)}
              className="shrink-0"
            />
          </div>
          <button
            onClick={() => setNewSecret(null)}
            className="mt-3 text-sm text-secondary hover:underline"
          >
            {t('common.close')}
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <PermissionGuard permission="webhook:create">
          <Button onClick={() => {
            setEditingWebhook(null);
            setFormData({ name: '', url: '', description: '', subscribedEvents: [], maxRetries: 3, timeoutSeconds: 30 });
            setIsModalOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            {t('settings.webhooks.create')}
          </Button>
        </PermissionGuard>
      </div>

      <div className="space-y-3">
        {isLoading && webhooks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">{t('common.loading')}</p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <Webhook className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">{t('settings.webhooks.empty')}</p>
            <p className="text-sm mt-2">{t('settings.webhooks.emptyDesc')}</p>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <div key={webhook.id} className="p-6 bg-surface-container-high rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-primary mb-1">{webhook.name}</h4>
                  {webhook.description && (
                    <p className="text-sm text-on-surface-variant mb-3">{webhook.description}</p>
                  )}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 p-3 bg-surface-container-lowest rounded-lg">
                      <span className="text-xs font-bold text-on-surface-variant">{t('settings.webhooks.url')}:</span>
                      <code className="flex-1 font-mono text-sm truncate">{webhook.url}</code>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-surface-container-lowest rounded-lg">
                      <span className="text-xs font-bold text-on-surface-variant">{t('settings.webhooks.secret')}:</span>
                      <code className="flex-1 font-mono text-sm">{webhook.maskedSecret}</code>
                      <PermissionGuard permission="webhook:update">
                        <button
                          onClick={() => handleRegenerateSecret(webhook.id)}
                          className="text-xs px-3 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 font-bold"
                        >
                          {t('settings.webhooks.regenerate')}
                        </button>
                      </PermissionGuard>
                    </div>
                  </div>
                  {webhook.subscribedEvents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {webhook.subscribedEvents.map((event) => (
                        <span key={event} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <PermissionGuard permission="webhook:update">
                    <IconButton
                      icon={Edit2}
                      size="sm"
                      onClick={() => {
                        setEditingWebhook(webhook);
                        setFormData({
                          name: webhook.name,
                          url: webhook.url,
                          description: webhook.description || '',
                          subscribedEvents: webhook.subscribedEvents,
                          maxRetries: webhook.maxRetries,
                          timeoutSeconds: webhook.timeoutSeconds,
                          isActive: webhook.isActive
                        });
                        setIsModalOpen(true);
                      }}
                    />
                  </PermissionGuard>
                  <PermissionGuard permission="webhook:delete">
                    <IconButton
                      icon={Trash2}
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                      className="text-error hover:bg-error/10"
                    />
                  </PermissionGuard>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <StatusBadge
                  status={webhook.isActive ? 'Active' : 'Blocked'}
                  label={webhook.isActive ? t('common.active') : t('common.inactive')}
                  variant="dot"
                />
                <span>{t('settings.webhooks.retries')}: {webhook.maxRetries}</span>
                <span>{t('settings.webhooks.timeout')}: {webhook.timeoutSeconds}s</span>
                {webhook.lastTriggeredAt && (
                  <span>{t('settings.webhooks.lastTriggered')}: {new Date(webhook.lastTriggeredAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setError(null);
      }} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            {editingWebhook ? t('settings.webhooks.edit') : t('settings.webhooks.create')}
          </h3>

          {error && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={editingWebhook ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.webhooks.form.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.webhooks.form.url')}
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
                maxLength={500}
                placeholder="https://your-domain.com/webhook"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.webhooks.form.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                rows={3}
                maxLength={255}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('settings.webhooks.form.events')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <label key={event} className="flex items-center gap-2 p-3 bg-surface-container-high rounded-lg cursor-pointer hover:bg-surface-container-highest">
                    <input
                      type="checkbox"
                      checked={(formData.subscribedEvents || []).includes(event)}
                      onChange={() => toggleEvent(event)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">
                  {t('settings.webhooks.form.maxRetries')}
                </label>
                <input
                  type="number"
                  value={formData.maxRetries}
                  onChange={(e) => setFormData({ ...formData, maxRetries: parseInt(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  min={0}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">
                  {t('settings.webhooks.form.timeout')}
                </label>
                <input
                  type="number"
                  value={formData.timeoutSeconds}
                  onChange={(e) => setFormData({ ...formData, timeoutSeconds: parseInt(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  min={5}
                  max={120}
                />
              </div>
            </div>
            {editingWebhook && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-on-surface-variant">{t('common.active')}</span>
              </label>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editingWebhook ? t('common.saveChanges') : t('common.submit')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </section>
  );
}
