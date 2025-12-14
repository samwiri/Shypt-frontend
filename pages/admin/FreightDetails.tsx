import React, { useState } from 'react';
import { ArrowLeft, Printer, Plane, Ship, Anchor, Container, Box, CheckCircle, Navigation, Package, FileText, Layers, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/UI/Modal';
import { Watermark, SecurityFooter, SecureHeader } from '../../components/UI/SecurityFeatures';

interface FreightDetailsProps {
  freightId: string;
  onBack: () => void;
}

const FreightDetails: React.FC<FreightDetailsProps> = ({ freightId, onBack }) => {
  const { showToast } = useToast();

  // Mock Data based on ID (simulating fetching)
  const isSea = freightId.startsWith('MBL');
  
  const [shipment, setShipment] = useState({
    id: freightId,
    type: isSea ? 'SEA' : 'AIR',
    carrier: isSea ? 'Maersk' : 'Emirates',
    flightVessel: isSea ? 'MAERSK SEALAND' : 'EK202',
    voyage: 'V-2025-A',
    origin: 'Dubai (DXB)',
    destination: 'London (LHR)',
    etd: '2025-03-01',
    eta: '2025-03-02',
    status: 'CONSOLIDATED', // Starting status
    weight: 850,
    volume: 12.5,
    container: 'MSKU-998122',
    seal: 'SL-9912',
    manifest: [
      { id: 'HWB-001', client: 'Acme Corp', desc: 'Electronics', weight: 150, pcs: 12 },
      { id: 'HWB-002', client: 'John Doe', desc: 'Garments', weight: 400, pcs: 45 },
      { id: 'HWB-003', client: 'Global Tech', desc: 'Spare Parts', weight: 300, pcs: 8 },
    ],
    documents: [
       { name: 'Master Air Waybill.pdf', date: 'Mar 01, 2025' },
       { name: 'Cargo Manifest.pdf', date: 'Mar 01, 2025' },
    ]
  });

  const handleAction = (action: string) => {
    switch (action) {
        case 'DEPART':
            if (confirm(`Confirm departure of ${shipment.id}? This will notify all ${shipment.manifest.length} clients.`)) {
                setShipment({...shipment, status: 'IN_TRANSIT'});
                showToast('Shipment status updated to In Transit', 'success');
            }
            break;
        case 'ARRIVE':
            if (confirm(`Confirm arrival at ${shipment.destination}?`)) {
                setShipment({...shipment, status: 'ARRIVED'});
                showToast('Shipment status updated to Arrived', 'success');
            }
            break;
        case 'PRINT':
            const originalTitle = document.title;
            document.title = `Shypt_Manifest_${shipment.id}`;
            window.print();
            document.title = originalTitle;
            break;
        case 'UPLOAD':
            showToast('Document uploaded successfully', 'success');
            break;
    }
  };

  return (
    <div className="space-y-6">
       {/* Top Bar - Hidden on Print */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                   {shipment.id}
                   <span className="ml-3"><StatusBadge status={shipment.status} /></span>
                </h2>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                   {shipment.type === 'AIR' ? <Plane size={14} className="mr-1"/> : <Ship size={14} className="mr-1"/>}
                   <span>{shipment.origin} &rarr; {shipment.destination}</span>
                </div>
             </div>
          </div>
          <div className="flex space-x-2">
             <button onClick={() => handleAction('PRINT')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm">
                <Printer size={16} className="mr-2" /> Manifest
             </button>
             
             {/* Dynamic Status Actions */}
             {shipment.status === 'CONSOLIDATED' && (
                <button onClick={() => handleAction('DEPART')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium shadow-sm">
                   <Navigation size={16} className="mr-2" /> Depart Origin
                </button>
             )}
             
             {shipment.status === 'IN_TRANSIT' && (
                <button onClick={() => handleAction('ARRIVE')} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium shadow-sm">
                   <CheckCircle size={16} className="mr-2" /> Mark Arrived
                </button>
             )}
             
             {shipment.status === 'ARRIVED' && (
                <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                   <CheckCircle size={16} className="mr-2" /> Arrived at Dest.
                </div>
             )}
              
             {shipment.status === 'DECONSOLIDATED' && (
                <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded border border-purple-200">
                    <Layers size={16} className="mr-2" /> Processed
                </div>
             )}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
          {/* Main Content: Manifest List */}
          <div className="lg:col-span-2 space-y-6 print:w-full">
             
             <div className="print:block hidden">
                <SecureHeader title="Master Manifest" />
                <Watermark text="MANIFEST" />
             </div>

             {/* Key Info Cards */}
             <div className="grid grid-cols-3 gap-4 print:mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:shadow-none print:border-slate-800">
                   <p className="text-xs text-slate-500 uppercase font-bold">Carrier info</p>
                   <p className="text-lg font-bold text-slate-800 mt-1">{shipment.carrier}</p>
                   <p className="text-sm text-slate-600">{shipment.flightVessel}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:shadow-none print:border-slate-800">
                   <p className="text-xs text-slate-500 uppercase font-bold">Total Load</p>
                   <p className="text-lg font-bold text-slate-800 mt-1">{shipment.weight} kg</p>
                   <p className="text-sm text-slate-600">{shipment.volume} cbm</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:shadow-none print:border-slate-800">
                   <p className="text-xs text-slate-500 uppercase font-bold">Timeline</p>
                   <div className="mt-1">
                      <div className="flex justify-between text-xs">
                         <span className="text-slate-500">ETD:</span>
                         <span className="font-medium">{shipment.etd}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                         <span className="text-slate-500">ETA:</span>
                         <span className="font-medium">{shipment.eta}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:bg-transparent print:border-slate-800">
                   <h3 className="font-bold text-slate-800">Manifested Items ({shipment.manifest.length})</h3>
                </div>
                <table className="w-full text-left">
                   <thead className="bg-white text-slate-500 text-xs uppercase font-medium border-b border-slate-100 print:bg-transparent print:border-slate-800">
                      <tr>
                         <th className="px-6 py-3 print:px-0">HWB ID</th>
                         <th className="px-6 py-3 print:px-0">Client</th>
                         <th className="px-6 py-3 print:px-0">Description</th>
                         <th className="px-6 py-3 text-right print:px-0">Weight</th>
                         <th className="px-6 py-3 text-right print:hidden">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                      {shipment.manifest.map((item) => (
                         <tr key={item.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                            <td className="px-6 py-4 font-mono font-medium text-slate-900 print:px-0">{item.id}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 print:px-0">{item.client}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 print:px-0">
                               {item.desc}
                               <span className="text-xs text-slate-400 block">{item.pcs} pieces</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-medium print:px-0">{item.weight} kg</td>
                            <td className="px-6 py-4 text-right print:hidden">
                               <button className="text-slate-400 hover:text-red-600">
                                  <Box size={16} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="print:block hidden">
                <SecurityFooter type="CONFIDENTIAL" reference={shipment.id} />
             </div>
          </div>

          {/* Sidebar - Hidden on Print */}
          <div className="space-y-6 print:hidden">
             {shipment.type === 'SEA' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                      <Container size={18} className="mr-2 text-slate-500" /> Container Info
                   </h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                         <span className="text-slate-500">Container No.</span>
                         <span className="font-mono font-medium">{shipment.container}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                         <span className="text-slate-500">Seal No.</span>
                         <span className="font-mono font-medium">{shipment.seal}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-slate-500">Voyage</span>
                         <span className="font-medium">{shipment.voyage}</span>
                      </div>
                   </div>
                </div>
             )}

             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                   <FileText size={18} className="mr-2 text-slate-500" /> Documents
                </h3>
                <div className="space-y-3">
                   {shipment.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                         <div className="flex items-center overflow-hidden">
                            <FileText size={16} className="text-red-500 mr-2 flex-shrink-0" />
                            <div className="truncate">
                               <p className="text-xs font-medium text-slate-700 truncate">{doc.name}</p>
                               <p className="text-[10px] text-slate-400">{doc.date}</p>
                            </div>
                         </div>
                         <button className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-2">View</button>
                      </div>
                   ))}
                   <button onClick={() => handleAction('UPLOAD')} className="w-full py-2 border border-dashed border-slate-300 rounded text-slate-500 text-xs hover:bg-slate-50 transition">
                      + Upload Document
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default FreightDetails;