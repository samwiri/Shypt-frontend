import React from 'react';
import { User, Mail, Shield, Activity, Clock, MapPin, Key } from 'lucide-react';

const AdminProfile: React.FC = () => {
  return (
    <div className="space-y-6">
       {/* Header Card */}
       <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-slate-400">
             <User size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
             <h1 className="text-2xl font-bold text-slate-800">Sarah Jenkins</h1>
             <p className="text-primary-600 font-medium">Senior Operations Supervisor</p>
             <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center"><Mail size={14} className="mr-1" /> s.jenkins@wofms.com</span>
                <span className="flex items-center"><MapPin size={14} className="mr-1" /> Kampala HQ</span>
                <span className="flex items-center"><Shield size={14} className="mr-1" /> Level 3 Access</span>
             </div>
          </div>
          <div className="flex flex-col space-y-2">
             <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700 flex items-center">
                <Key size={14} className="mr-2" /> Change Password
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Activity size={18} className="mr-2 text-blue-600" /> Performance (Mar 2025)
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-slate-600 text-sm">Approvals Processed</span>
                   <span className="font-bold text-slate-900">142</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                   <span className="text-slate-600 text-sm">Compliance Reviews</span>
                   <span className="font-bold text-slate-900">28</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                   <span className="text-slate-600 text-sm">Avg Response Time</span>
                   <span className="font-bold text-slate-900">12m</span>
                </div>
             </div>
          </div>

          {/* Activity Log */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-slate-500" /> Recent Activity Log
             </h3>
             <div className="space-y-6 relative border-l border-slate-200 ml-2 pl-6">
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                   <p className="text-sm font-bold text-slate-800">Approved Invoice #INV-2025-001</p>
                   <p className="text-xs text-slate-500">Today, 10:42 AM</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                   <p className="text-sm font-bold text-slate-800">Released Cargo HWB-9932 from Compliance Hold</p>
                   <p className="text-xs text-slate-500">Yesterday, 4:15 PM</p>
                   <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">"Documents verified manually. Battery declaration attached."</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white shadow-sm"></div>
                   <p className="text-sm font-bold text-slate-800">Logged in from New Device (IP 192.168.1.1)</p>
                   <p className="text-xs text-slate-500">Mar 01, 2025, 08:00 AM</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                   <p className="text-sm font-bold text-slate-800">Created Manifest MAWB-UK-UG-2025</p>
                   <p className="text-xs text-slate-500">Feb 28, 2025, 2:30 PM</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminProfile;