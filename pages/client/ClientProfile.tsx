import React from 'react';
import { User, MapPin, Mail, Phone, Wallet, Package, Shield, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ClientProfile: React.FC = () => {
  const { showToast } = useToast();

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6">
       <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-slate-400">
             <User size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
             <h1 className="text-2xl font-bold text-slate-800">John Doe</h1>
             <p className="text-primary-600 font-mono font-medium text-lg">ID: CL-8821</p>
             <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center"><Mail size={14} className="mr-1" /> john@example.com</span>
                <span className="flex items-center"><Phone size={14} className="mr-1" /> +256 772 123456</span>
                <span className="flex items-center"><MapPin size={14} className="mr-1" /> Kampala, Uganda</span>
             </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 text-right">
                <p className="text-xs text-green-600 uppercase font-bold">Wallet Balance</p>
                <p className="text-xl font-bold text-green-800">$0.00</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Package size={18} className="mr-2 text-blue-600" /> Your Shipping Address
             </h3>
             <div className="bg-slate-800 text-white p-4 rounded-lg space-y-2 relative group cursor-pointer" onClick={() => handleCopy("John Doe (CL-8821)\n144-25 183rd St, Unit CL-8821\nSpringfield Gardens, NY 11413\nUnited States")}>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <Copy size={16} className="text-slate-400" />
                </div>
                <p className="font-bold">John Doe (CL-8821)</p>
                <p>144-25 183rd St, Unit CL-8821</p>
                <p>Springfield Gardens, NY 11413</p>
                <p>United States</p>
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700">Use this address when shopping on Amazon, eBay, etc.</p>
             </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Shield size={18} className="mr-2 text-slate-500" /> Account Security
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                   <div>
                      <p className="text-sm font-medium text-slate-800">Password</p>
                      <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                   </div>
                   <button className="text-sm text-blue-600 hover:underline">Update</button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                   <div>
                      <p className="text-sm font-medium text-slate-800">Notifications</p>
                      <p className="text-xs text-slate-500">Email & SMS Enabled</p>
                   </div>
                   <button className="text-sm text-blue-600 hover:underline">Manage</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ClientProfile;