import React from 'react';
import { ArrowLeft, Map, Phone, User, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';

interface DeliveryDetailsProps {
  id: string;
  onBack: () => void;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ id, onBack }) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800">Delivery {id}</h2>
                <div className="mt-1"><StatusBadge status="DISPATCHED" /></div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="md:col-span-2 bg-slate-200 rounded-lg min-h-[400px] flex items-center justify-center border border-slate-300">
             <div className="text-center text-slate-500">
                <Map size={48} className="mx-auto mb-2 opacity-50" />
                <p>Map Integration Placeholder</p>
                <p className="text-xs">Live tracking would appear here.</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Driver Details</h3>
                <div className="flex items-center mb-4">
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                      <User size={24} className="text-slate-500" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">Mike (Boda)</p>
                      <p className="text-sm text-slate-500">Motorcycle • UBA 123X</p>
                   </div>
                </div>
                <button className="w-full bg-slate-800 text-white py-2 rounded flex items-center justify-center hover:bg-slate-700">
                   <Phone size={16} className="mr-2" /> Call Driver
                </button>
             </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Delivery Info</h3>
                <div className="space-y-2 text-sm">
                   <p><span className="text-slate-500 block text-xs uppercase">Client</span> Acme Corp</p>
                   <p><span className="text-slate-500 block text-xs uppercase">Address</span> Plot 44, Kampala Road</p>
                   <p><span className="text-slate-500 block text-xs uppercase">Instructions</span> Call upon arrival at gate.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default DeliveryDetails;