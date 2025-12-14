import React from 'react';
import { ArrowLeft, Package, Truck, Plane, MapPin, Calendar, FileText, CheckCircle, Printer, DollarSign, Upload, Edit, Box } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Watermark, SecureHeader, SecurityFooter } from '../../components/UI/SecurityFeatures';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onBack }) => {
  const { showToast } = useToast();

  const handleAction = (action: string) => {
      if (action === 'PRINT_LABEL') {
          const originalTitle = document.title;
          document.title = `Shypt_Waybill_${order.id}`;
          window.print();
          document.title = originalTitle;
      } else {
          showToast(`Action Triggered: ${action}`, 'info');
      }
  };

  // Mock Data
  const order = {
    id: orderId,
    client: { name: 'John Doe', id: 'CL-8821', address: 'Plot 44, Kampala Road, Uganda', phone: '+256 772 123456' },
    description: 'Electronics Batch (Laptops & Phones)',
    origin: 'Guangzhou, China (CAN)',
    destination: 'Kampala, Uganda (EBB)',
    weight: '450kg',
    volume: '2.5 CBM',
    pieces: 12,
    mode: 'AIR',
    status: 'IN_TRANSIT',
    created: '2025-02-28',
    etd: '2025-03-01',
    eta: '2025-03-05',
    timeline: [
      { status: 'Order Created', date: '2025-02-28 09:00', loc: 'Client Portal', done: true },
      { status: 'Received at Warehouse', date: '2025-02-28 14:30', loc: 'Guangzhou Warehouse', done: true },
      { status: 'Consolidated', date: '2025-03-01 10:00', loc: 'Guangzhou Warehouse', done: true },
      { status: 'Departed Origin', date: '2025-03-01 23:00', loc: 'CAN Airport', done: true },
      { status: 'Arrived Destination', date: '-', loc: 'Entebbe Airport (EBB)', done: false },
      { status: 'Customs Cleared', date: '-', loc: 'URA Bond', done: false },
      { status: 'Ready for Pickup', date: '-', loc: 'Kampala Warehouse', done: false },
    ]
  };

  return (
    <div className="space-y-6">
       {/* Screen Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-600">
            <ArrowLeft size={20} />
            </button>
            <div>
            <h2 className="text-2xl font-bold text-slate-800">Order {order.id}</h2>
            <p className="text-slate-500 text-sm">
                {order.mode === 'AIR' ? 'Air Freight' : 'Sea Freight'} • {order.origin} <span className="mx-1">&rarr;</span> {order.destination}
            </p>
            </div>
        </div>
        <div className="flex items-center space-x-3">
             <StatusBadge status={order.status} />
             <div className="h-6 w-px bg-slate-300 mx-2"></div>
             <button onClick={() => handleAction('PRINT_LABEL')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm transition" title="Print Waybill">
                <Printer size={16} className="mr-2" /> Waybill
             </button>
             <button onClick={() => handleAction('EDIT')} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit Order">
                <Edit size={20} />
             </button>
        </div>
      </div>
      
      {/* Actions Toolbar - Hidden on Print */}
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-sm flex flex-wrap gap-2 items-center print:hidden">
         <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 ml-2">Actions:</span>
         
         <button onClick={() => handleAction('GENERATE_INVOICE')} className="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition">
            <DollarSign size={14} className="mr-2" /> Generate Invoice
         </button>
         
         <button onClick={() => handleAction('UPLOAD_DOCS')} className="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition">
            <Upload size={14} className="mr-2" /> Upload Docs
         </button>

         {order.status === 'PENDING' && (
             <button onClick={() => handleAction('RECEIVE')} className="flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-500 rounded text-sm transition font-medium">
                <Package size={14} className="mr-2" /> Receive Package
             </button>
         )}

         {order.status === 'RECEIVED' && (
             <button onClick={() => handleAction('ADD_TO_MANIFEST')} className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition font-medium">
                <Plane size={14} className="mr-2" /> Add to Manifest
             </button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6 print:w-full">
           
           {/* Printable Waybill Document - Visible only on Print */}
           <div className="hidden print:block bg-white p-0">
              <Watermark text="WAYBILL" />
              <SecureHeader title="House Waybill" />
              
              <div className="relative z-10 grid grid-cols-2 gap-8 border-b-2 border-slate-800 pb-6 mb-6">
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-1">Shipper / Exporter</p>
                    <div className="border p-3 rounded text-sm">
                       <p className="font-bold">Shypt Consolidation Ctr</p>
                       <p>{order.origin}</p>
                       <p>Tel: +86-20-1234567</p>
                    </div>
                 </div>
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-1">Consignee</p>
                    <div className="border p-3 rounded text-sm">
                       <p className="font-bold">{order.client.name}</p>
                       <p>{order.client.address}</p>
                       <p>Tel: {order.client.phone}</p>
                       <p className="font-mono text-xs mt-1">ID: {order.client.id}</p>
                    </div>
                 </div>
              </div>

              <div className="relative z-10 mb-6">
                 <div className="flex justify-between items-center bg-slate-100 p-2 border-y border-slate-300 print:bg-transparent print:border-slate-800 mb-4">
                    <div className="text-center w-1/3">
                       <p className="text-xs uppercase font-bold">Origin</p>
                       <p className="text-lg font-bold">{order.origin.split(',')[0]}</p>
                    </div>
                    <div className="text-center w-1/3 border-x border-slate-300 print:border-slate-800">
                       <p className="text-xs uppercase font-bold">Mode</p>
                       <p className="text-lg font-bold">{order.mode}</p>
                    </div>
                    <div className="text-center w-1/3">
                       <p className="text-xs uppercase font-bold">Destination</p>
                       <p className="text-lg font-bold">{order.destination.split(',')[0]}</p>
                    </div>
                 </div>

                 <table className="w-full text-left border border-slate-300 print:border-slate-800">
                    <thead className="bg-slate-50 print:bg-transparent border-b border-slate-300 print:border-slate-800">
                       <tr>
                          <th className="p-2 border-r">No. of Pkgs</th>
                          <th className="p-2 border-r">Description of Goods</th>
                          <th className="p-2 border-r">Gross Weight</th>
                          <th className="p-2">Measurement</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td className="p-4 border-r align-top text-center">{order.pieces}</td>
                          <td className="p-4 border-r align-top">
                             <p className="font-bold">{order.description}</p>
                             <p className="text-xs mt-2 italic">Said to contain: General Merchandise</p>
                          </td>
                          <td className="p-4 border-r align-top text-center">{order.weight}</td>
                          <td className="p-4 align-top text-center">{order.volume}</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div className="relative z-10 flex justify-between mt-12 pt-4 border-t border-slate-300 print:border-slate-800 text-xs">
                 <div className="w-1/2 pr-4">
                    <p className="font-bold mb-2">Issuing Agent</p>
                    <div className="h-16 border-b border-slate-400 mb-1"></div>
                    <p>Signature & Stamp</p>
                 </div>
                 <div className="w-1/2 pl-4">
                    <p className="font-bold mb-2">Receiver</p>
                    <div className="h-16 border-b border-slate-400 mb-1"></div>
                    <p>Signature & Date</p>
                 </div>
              </div>

              <SecurityFooter type="ORIGINAL" reference={order.id} />
           </div>

           {/* Screen Only Components - Hidden on Print */}
           <div className="print:hidden">
             {/* Progress Map Visualization */}
             <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100"></div>
                <div className="flex justify-between items-center relative z-10">
                   <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-green-500">
                         <Package size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Guangzhou</p>
                      <p className="text-xs text-slate-500">Origin</p>
                   </div>
                   <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
                   <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-blue-500 animate-pulse">
                         <Plane size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-700">In Transit</p>
                      <p className="text-xs text-slate-500">Flight CZ330</p>
                   </div>
                   <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
                   <div className="text-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-slate-200">
                         <MapPin size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">Uganda</p>
                      <p className="text-xs text-slate-400">Destination</p>
                   </div>
                </div>
             </div>

             {/* Cargo Manifest */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
               <div className="px-6 py-4 border-b border-slate-200">
                 <h3 className="font-bold text-slate-800">Cargo Details</h3>
               </div>
               <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                     <p className="text-xs text-slate-500 uppercase">Description</p>
                     <p className="font-medium text-slate-900 mt-1">{order.description}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase">Weight / Vol</p>
                     <p className="font-medium text-slate-900 mt-1">{order.weight} / {order.volume}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase">Piece Count</p>
                     <p className="font-medium text-slate-900 mt-1">{order.pieces} Packages</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase">Declared Value</p>
                     <p className="font-medium text-slate-900 mt-1">$4,500.00</p>
                  </div>
               </div>
             </div>

             {/* Documents */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200">
                 <h3 className="font-bold text-slate-800">Documents</h3>
               </div>
               <div className="p-6 space-y-3">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                    <div className="flex items-center">
                       <FileText className="text-red-500 mr-3" size={20} />
                       <div>
                          <p className="text-sm font-medium text-slate-700">Commercial Invoice.pdf</p>
                          <p className="text-xs text-slate-500">Uploaded on Feb 28</p>
                       </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:underline">Download</button>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                    <div className="flex items-center">
                       <FileText className="text-red-500 mr-3" size={20} />
                       <div>
                          <p className="text-sm font-medium text-slate-700">Packing List.pdf</p>
                          <p className="text-xs text-slate-500">Uploaded on Mar 01</p>
                       </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:underline">Download</button>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Sidebar Timeline - Hidden on Print */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit print:hidden">
           <h3 className="font-bold text-slate-800 mb-6">Tracking Timeline</h3>
           <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
              {order.timeline.map((event, i) => (
                 <div key={i} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${event.done ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                    <div className={`${event.done ? 'opacity-100' : 'opacity-50'}`}>
                       <p className="text-sm font-bold text-slate-800">{event.status}</p>
                       <p className="text-xs text-slate-500 mt-0.5">{event.loc}</p>
                       <p className="text-xs text-slate-400 mt-0.5 font-mono">{event.date}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;