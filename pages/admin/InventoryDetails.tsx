import React from 'react';
import { ArrowLeft, Box, Printer, Grid, History, Camera } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface InventoryDetailsProps {
  id: string;
  onBack: () => void;
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();

  const handlePrint = () => {
      showToast('ZPL Label sent to printer', 'success');
  };

  const item = {
      id: id,
      desc: 'Laptop Batch A (10 Units)',
      client: 'Acme Corp (CL-8821)',
      weight: 12.5,
      dims: '40x30x20 cm',
      location: 'ROW-A-01',
      status: 'STORED',
      warehouse: 'Guangzhou (CN)',
      receivedDate: '2025-03-01 10:00 AM',
      history: [
          { date: '2025-03-01 10:00 AM', action: 'Received at Dock 4', user: 'Staff A' },
          { date: '2025-03-01 10:15 AM', action: 'Measured & Weighed', user: 'Staff A' },
          { date: '2025-03-01 11:00 AM', action: 'Moved to Bin ROW-A-01', user: 'Forklift B' },
      ]
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                   {item.id} <span className="ml-3"><StatusBadge status={item.status} /></span>
                </h2>
                <p className="text-sm text-slate-500">{item.warehouse}</p>
             </div>
          </div>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm">
             <Printer size={16} className="mr-2" /> Print Label
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                   <Box size={18} className="mr-2 text-slate-500" /> Item Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <p className="text-slate-500 text-xs uppercase">Description</p>
                      <p className="font-medium text-slate-900">{item.desc}</p>
                   </div>
                   <div>
                      <p className="text-slate-500 text-xs uppercase">Client</p>
                      <p className="font-medium text-slate-900">{item.client}</p>
                   </div>
                   <div>
                      <p className="text-slate-500 text-xs uppercase">Weight</p>
                      <p className="font-medium text-slate-900">{item.weight} kg</p>
                   </div>
                   <div>
                      <p className="text-slate-500 text-xs uppercase">Dimensions</p>
                      <p className="font-medium text-slate-900">{item.dims}</p>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                   <History size={18} className="mr-2 text-slate-500" /> Movement History
                </h3>
                <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-4">
                   {item.history.map((h, i) => (
                      <div key={i} className="relative">
                         <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                         <p className="text-sm font-medium text-slate-800">{h.action}</p>
                         <p className="text-xs text-slate-500">{h.date} • by {h.user}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
                <h3 className="font-bold text-slate-800 mb-2">Current Location</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 inline-block mb-2">
                   <Grid size={32} className="text-blue-600 mb-1 mx-auto" />
                   <p className="text-2xl font-mono font-bold text-blue-900">{item.location}</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline block w-full">Change Location</button>
             </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                   <div className="aspect-square bg-slate-100 rounded flex items-center justify-center text-slate-400">
                      <Camera size={24} />
                   </div>
                   <div className="aspect-square bg-slate-100 rounded flex items-center justify-center text-slate-400">
                      <span className="text-xs">No Image</span>
                   </div>
                </div>
                <button className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded text-slate-500 text-xs hover:bg-slate-50">
                   + Upload Photo
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default InventoryDetails;