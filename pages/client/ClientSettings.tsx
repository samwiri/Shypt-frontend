import React, { useState } from 'react';
import { Save, User, Lock, Bell, Shield, Mail, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ClientSettings: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'NOTIFICATIONS'>('PROFILE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
          <p className="text-slate-500 text-sm">Manage your profile, shipping address, and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0">
          <nav className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'PROFILE' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User size={18} className="mr-3 text-slate-400" /> Profile & Address
            </button>
            <button
              onClick={() => setActiveTab('SECURITY')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'SECURITY' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Lock size={18} className="mr-3 text-slate-400" /> Security
            </button>
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'NOTIFICATIONS' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell size={18} className="mr-3 text-slate-400" /> Notifications
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSave}>
            {activeTab === 'PROFILE' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" defaultValue="John Doe" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" defaultValue="john@example.com" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input type="tel" defaultValue="+256 772 123456" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Company (Optional)</label>
                        <input type="text" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                    </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div>
                    <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4 flex items-center">
                        <MapPin size={20} className="mr-2 text-primary-600" /> Delivery Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Street Address</label>
                            <input type="text" defaultValue="Plot 44, Kampala Road" placeholder="Street, Plot, or House Number" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">City / Town</label>
                            <input type="text" defaultValue="Kampala" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Region</label>
                            <select className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900">
                                <option>Central</option>
                                <option>Western</option>
                                <option>Eastern</option>
                                <option>Northern</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Country</label>
                            <input type="text" defaultValue="Uganda" disabled className="mt-1 w-full border border-slate-200 rounded p-2 bg-slate-50 text-slate-500 cursor-not-allowed" />
                        </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'SECURITY' && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">Password & Security</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" className="mt-1 w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Mail className="text-slate-400 mr-3" size={20} />
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates about your shipments via email.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Bell className="text-slate-400 mr-3" size={20} />
                      <div>
                        <p className="font-medium text-slate-900">SMS Notifications</p>
                        <p className="text-sm text-slate-500">Receive critical alerts via SMS.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 flex items-center shadow-sm font-medium">
                <Save size={18} className="mr-2" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;