import type { Metadata } from 'next';
import { UserProfile } from '@clerk/nextjs';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Settings | PoolCalc',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and preferences</p>
        </div>

        <Card className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Account Information</h2>
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              },
            }}
          />
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Calculator Preferences</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="electricity-rate" className="block text-sm font-medium text-gray-700">
                Default Electricity Rate ($/kWh)
              </label>
              <input
                id="electricity-rate"
                type="number"
                step="0.001"
                defaultValue="0.14"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="measurement-units" className="block text-sm font-medium text-gray-700">
                Default Measurement Units
              </label>
              <select id="measurement-units" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="gallons">Gallons</option>
                <option value="liters">Liters</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="size-4 rounded text-blue-600" />
              <span className="ml-3 text-sm text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="size-4 rounded text-blue-600" />
              <span className="ml-3 text-sm text-gray-700">Maintenance reminders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="size-4 rounded text-blue-600" />
              <span className="ml-3 text-sm text-gray-700">Seasonal optimization alerts</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
