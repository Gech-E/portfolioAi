'use client';

import { useState, useEffect } from 'react';
import { User, CreditCard, Bell, Shield, Palette, Loader2, Save, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'appearance', name: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    headline: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get<any>('/auth/me');
      if (response.success && response.data) {
        const u = response.data;
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          headline: u.headline || '',
          bio: u.bio || '',
          location: u.location || '',
          website: u.website || '',
          phone: u.phone || '',
        });
      }
    } catch {
      // Fall back to auth store data
      if (user) {
        setForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          headline: (user as any).headline || '',
          bio: (user as any).bio || '',
          location: (user as any).location || '',
          website: (user as any).website || '',
          phone: (user as any).phone || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.patch<any>('/users/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        website: form.website,
        phone: form.phone,
      });
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Settings nav */}
        <nav className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeTab === item.id
                  ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.name}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="rounded-xl border border-gray-200/60 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
          {activeTab === 'profile' && (
            <>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-6">Profile Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-lg font-medium text-white uppercase">
                    {form.firstName?.[0]}{form.lastName?.[0]}
                  </div>
                  <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                    Change avatar
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First name</label>
                    <input
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Last name</label>
                    <input
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800"
                    value={form.email}
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Headline</label>
                  <input
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="Full-Stack Developer & AI Enthusiast"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                    <input
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'billing' && (
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-6">Billing & Subscription</h3>
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-950/20 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Current Plan: <span className="uppercase">{user?.role || 'FREE'}</span></p>
                    <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">Your plan renews monthly</p>
                  </div>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Upgrade Plan
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">AI Credits</p>
                    <p className="text-xs text-gray-500">Monthly allocation</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">10 / month</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Max Portfolios</p>
                    <p className="text-xs text-gray-500">Free plan limit</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">1</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Portfolio view alerts', desc: 'Get notified when someone views your portfolio', checked: true },
                  { label: 'Resume downloads', desc: 'Notifications for resume exports', checked: true },
                  { label: 'AI generation complete', desc: 'When an AI task finishes processing', checked: false },
                  { label: 'Weekly digest', desc: 'Summary of your analytics and activity', checked: true },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4 rounded accent-blue-600" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-6">Security</h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                  <input type="password" className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="••••••••" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <input type="password" className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="••••••••" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <input type="password" className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="••••••••" />
                </div>
                <button className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-gray-900">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-6">Appearance</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Choose your preferred theme</p>
                <div className="flex gap-3">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button key={theme} className={`flex-1 rounded-xl border-2 p-4 text-center text-sm font-medium transition-colors ${
                      theme === 'Light'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                    }`}>
                      {theme === 'Light' && <Check className="mx-auto mb-2 h-5 w-5 text-blue-600" />}
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
