import { User, CreditCard, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Settings nav */}
        <nav className="space-y-1">
          {[
            { name: 'Profile', icon: User, active: true },
            { name: 'Billing', icon: CreditCard },
            { name: 'Notifications', icon: Bell },
            { name: 'Security', icon: Shield },
            { name: 'Appearance', icon: Palette },
          ].map((item) => (
            <button key={item.name} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${item.active ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="h-4 w-4" /> {item.name}
            </button>
          ))}
        </nav>
        {/* Profile form */}
        <div className="rounded-xl border border-gray-200/60 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
          <h3 className="text-base font-medium text-gray-900 mb-6">Profile Information</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-lg font-medium text-white">AJ</div>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Change avatar</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">First name</label>
                <input className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" defaultValue="Alex" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Last name</label>
                <input className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" defaultValue="Johnson" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" defaultValue="alex@example.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Headline</label>
              <input className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" defaultValue="Full-Stack Developer & ML Engineer" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
              <textarea className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" defaultValue="Passionate developer with 5+ years of experience..." />
            </div>
            <div className="flex justify-end">
              <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
