import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Brain,
  KeyRound,
  Palette,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useSettingsStore } from '../stores/settingsStore';
import type { AiProvider, Settings } from '../types';

type SettingsTab = 'provider' | 'theme' | 'notifications' | 'security';

const tabs: Array<{
  id: SettingsTab;
  label: string;
  icon: typeof Brain;
}> = [
  { id: 'provider', label: 'AI provider', icon: KeyRound },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const notificationDescriptions: Record<keyof Settings['notifications'], string> = {
  emailAlerts: 'Receive email notifications for scan results.',
  pushNotifications: 'Receive browser push notifications when supported.',
  weeklyReport: 'Receive a weekly summary of analyses.',
  criticalThreatsOnly: 'Limit notifications to critical threats.',
};

const securityDescriptions: Record<
  'autoBlockHighRisk' | 'requireConfirmation' | 'logAllAnalyses',
  string
> = {
  autoBlockHighRisk: 'Enable automatic blocking for high-risk content where a blocking integration exists.',
  requireConfirmation: 'Require confirmation before running an analysis.',
  logAllAnalyses: 'Keep a record of completed analyses in your account history.',
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('provider');
  const {
    settings,
    updateAiProvider,
    updateNotification,
    updateSecurity,
    resetSettings,
  } = useSettingsStore();

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage provider selection and local platform preferences.</p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={selected ? 'page' : undefined}
                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  selected
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 flex-1"
        >
          {activeTab === 'provider' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-text-primary">AI provider</h2>
                <p className="mt-1 text-xs text-text-muted">Choose the provider used by the server-side analysis function.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(['openai', 'gemini'] as AiProvider[]).map((provider) => {
                    const selected = settings.aiProvider === provider;
                    return (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => updateAiProvider(provider)}
                        aria-pressed={selected}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          selected
                            ? 'border-accent-blue/40 bg-accent-blue/10'
                            : 'border-border-subtle bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-text-primary">
                          {provider === 'openai' ? 'OpenAI' : 'Google Gemini'}
                        </span>
                        <span className="mt-1 block text-xs text-text-muted">
                          {selected ? 'Selected provider' : 'Select provider'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent-blue" />
                    <h3 className="text-sm font-semibold text-text-primary">Credential handling</h3>
                  </div>
                  <p className="text-sm leading-6 text-text-secondary">
                    Provider API keys are configured as Supabase Edge Function secrets by the
                    project operator. They are not entered, stored, or exposed in this browser
                    settings page. Selecting a provider does not confirm that its server secret
                    is configured or that the provider is currently available.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'theme' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-text-primary">Theme preferences</h2>
                <p className="mt-1 text-xs text-text-muted">Appearance settings for this release.</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-4">
                  <Palette className="h-5 w-5 text-accent-blue" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Dark mode</p>
                    <p className="text-xs text-text-muted">The current interface uses the dark theme.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-text-primary">Notification preferences</h2>
                <p className="mt-1 text-xs text-text-muted">These switches save your preferences; delivery integrations may require separate setup.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {(Object.keys(settings.notifications) as Array<keyof Settings['notifications']>).map((key) => {
                  const enabled = settings.notifications[key];
                  return (
                    <div key={key} className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-white/[0.03]">
                      <div>
                        <p className="text-sm font-medium capitalize text-text-primary">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">{notificationDescriptions[key]}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`Toggle ${key}`}
                        onClick={() => updateNotification(key, !enabled)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-accent-blue' : 'bg-white/10'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-text-primary">Security preferences</h2>
                <p className="mt-1 text-xs text-text-muted">Application preferences; these are not substitutes for server-side authorization.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {(['autoBlockHighRisk', 'requireConfirmation', 'logAllAnalyses'] as const).map((key) => {
                  const enabled = settings.security[key];
                  return (
                    <div key={key} className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-white/[0.03]">
                      <div>
                        <p className="text-sm font-medium capitalize text-text-primary">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">{securityDescriptions[key]}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`Toggle ${key}`}
                        onClick={() => updateSecurity(key, !enabled)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-accent-blue' : 'bg-white/10'}`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
                <div className="border-t border-border-subtle pt-4">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={resetSettings}
                    icon={<RotateCcw className="h-4 w-4" />}
                  >
                    Reset preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
