import React from 'react';
import { ArrowLeft, ExternalLink, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface ShoppingDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientShoppingDetails: React.FC<ShoppingDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();

  const request = {
    id: id,
    item: 'Gaming Monitor 144Hz',
    url: 'https://amazon.com/gaming-monitor...',
    status: id === 'REQ-001' ? 'QUOTED' : 'PURCHASED',
    date: '2025-03-01',
    notes: 'Please ensure it has HDMI 2.1 support.',
    quote: {
        itemCost: 300.00,
        shipping: 20.00,
        fee: 30.00,
        total: 350.00
    },
    updates: [
        { date: '2025-03-01 10:00', text: 'Request submitted' },
        { date: '2025-03-01 14:00', text: 'Admin reviewed request' },
        { date: '2025-03-01 14:30', text: 'Quote generated' }
    ]
  };

  const handlePay = () => {
      if (confirm(`Accept quote and pay $${request.quote.total}?`)) {
          showToast('Payment successful! We will purchase your item shortly.', 'success');
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
             <ArrowLeft size={20} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-slate-800">{request.item}</h2>
             <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={request.status} />
                <a href={request.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">
                    Original Link <ExternalLink size={10} className="ml-1" />
                </a>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             {/* Quote Card */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                   <h3 className="font-bold text-slate-800">Quotation</h3>
                </div>
                <div className="p-6">
                   {request.status === 'REQUESTED' ? (
                       <div className="text-center text-slate-500 py-8">
                           <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                           <p>We are reviewing your request. A quote will appear here shortly.</p>
                       </div>
                   ) : (
                       <div className="space-y-3">
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-600">Item Cost</span>
                               <span className="font-mono">${request.quote.itemCost.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-600">Domestic Shipping</span>
                               <span className="font-mono">${request.quote.shipping.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-600">Service Fee (10%)</span>
                               <span className="font-mono">${request.quote.fee.toFixed(2)}</span>
                           </div>
                           <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between font-bold text-lg">
                               <span>Total Payable</span>
                               <span className="text-primary-600">${request.quote.total.toFixed(2)}</span>
                           </div>

                           {request.status === 'QUOTED' && (
                               <button onClick={handlePay} className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold flex items-center justify-center">
                                   <CreditCard size={18} className="mr-2" /> Pay Now
                               </button>
                           )}
                           
                           {request.status === 'PURCHASED' && (
                               <div className="w-full mt-4 bg-green-50 text-green-700 py-3 rounded-lg border border-green-200 flex items-center justify-center font-bold">
                                   <CheckCircle size={18} className="mr-2" /> Paid & Purchased
                               </div>
                           )}
                       </div>
                   )}
                </div>
             </div>

             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-800 mb-4">Your Notes</h3>
                 <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded">{request.notes}</p>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
             <h3 className="font-bold text-slate-800 mb-6">Status Updates</h3>
             <div className="border-l-2 border-slate-100 ml-2 space-y-6">
                {request.updates.map((u, i) => (
                    <div key={i} className="relative pl-6">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <p className="text-sm font-medium text-slate-800">{u.text}</p>
                        <p className="text-xs text-slate-500">{u.date}</p>
                    </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ClientShoppingDetails;