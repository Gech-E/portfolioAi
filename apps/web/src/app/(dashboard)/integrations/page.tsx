'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Globe, RefreshCcw, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Integration {
  id: string;
  provider: string;
  status: string;
  externalUsername: string | null;
  lastSyncAt: string | null;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await api.get<Integration[]>('/integrations');
      setIntegrations(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (provider: string) => {
    setSyncing(provider);
    try {
      await api.post(`/integrations/${provider}/sync`);
      toast.success(`${provider} synced successfully!`);
      fetchIntegrations();
    } catch (error: any) {
      toast.error(error.message || `Failed to sync ${provider}`);
    } finally {
      setSyncing(null);
    }
  };

  const providers = [
    {
      id: 'GITHUB',
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-900',
      description: 'Import your repositories, languages, and contribution graph.',
    },
    {
      id: 'LINKEDIN',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Sync your work history, education, and skills.',
    },
    {
      id: 'BEHANCE',
      name: 'Behance',
      icon: Globe,
      color: 'bg-blue-600',
      description: 'Import your design projects and case studies.',
    },
  ];

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Connect your professional profiles to auto-populate your portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const integration = integrations.find(i => i.provider === p.id);
          const isConnected = integration?.status === 'CONNECTED';

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${p.color} text-white rounded-xl`}>
                  <p.icon className="h-6 w-6" />
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    CONNECTED
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-500 px-2.5 py-1 rounded-full">
                    <XCircle className="h-3 w-3" />
                    NOT CONNECTED
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{p.name}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                {p.description}
              </p>

              {isConnected && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1">
                  <p className="text-xs text-gray-500">Connected as:</p>
                  <p className="text-sm font-semibold dark:text-white">@{integration.externalUsername}</p>
                  <p className="text-[10px] text-gray-400">
                    Last synced: {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : 'Never'}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleSync(p.id)}
                      disabled={syncing === p.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {syncing === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                      Sync Now
                    </button>
                    <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Connect {p.name}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h3 className="text-xl font-bold">More coming soon!</h3>
          <p className="mt-2 opacity-90 max-w-md">We're working on integrations for Behance, Dribbble, Medium, and Google Scholar to help you build the ultimate portfolio.</p>
        </div>
        <Globe className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10" />
      </div>
    </div>
  );
}
