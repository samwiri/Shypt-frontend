import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, DollarSign, Printer, MessageSquare, Truck, Check, XCircle, ShoppingCart } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Watermark, SecureHeader, SecurityFooter } from '../../components/UI/SecurityFeatures';
import Modal from '../../components/UI/Modal';

interface ShoppingDetailsProps {
  requestId: string;
  onBack: () => void;
}

const ShoppingDetails: React.FC<ShoppingDetailsProps> = ({ requestId, onBack }) => {
  const { showToast } = useToast();
  const [modalMode, setModalMode] = useState<'QUOTE' | 'PURCHASE' | null>(null);

  // Mock Request Data
  const [request, setRequest] = useState({
    id: requestId,
    status: requestId === 'REQ-2025-002' ? 'PAID' : 'REQUESTED',
    date: '2025-03-01',
    client: { name: 'John Doe', id: 'CL-8821', email: 'john@example.com', phone: '+256 772 123456' },
    item: {
      name: 'MacBook Pro 14-inch (M4 Pro)',
      url: 'https://apple.com/shop/buy-mac/macbook-pro/14-inch-m4-pro',
      description: 'Space Black, 12-core CPU, 18-core GPU, 18GB Unified Memory, 1TB SSD Storage.',
      qty: 1,
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
    },
    quote: {
      cost: 2399.00,
      domesticShipping: 0.00,
      serviceFee: 239.90, // 10%
      total: 2638.90,
      currency: 'USD'
    },
    timeline: [
        { date: '2025-03-01 10:30', event: 'Request Submitted' },
        // { date: '2025-03-01 14:00', event: 'Quotation Sent ($2638.90)' },
    ]
  });

  const handleAction = (action: string) => {
      switch(action) {
          case 'PRINT':
              const originalTitle = document.title;
              document.title = `Shypt_Quote_${request.id}`;
              window.print();
              document.title = originalTitle;
              break;
          case 'QUOTE':
              setModalMode('QUOTE');
              break;
          case 'PURCHASE':
              setModalMode('PURCHASE');
              break;
          case 'REJECT':
              if (confirm('Mark item as Out of Stock?')) {
                  setRequest(prev => ({ ...prev, status: 'OUT_OF_STOCK' }));
                  showToast('Request status updated to Out of Stock', 'warning');
              }
              break;
      }
  };

  const submitQuote = (e: React.FormEvent) => {
      e.preventDefault();
      setRequest(prev => ({ 
          ...prev, 
          status: 'QUOTED', 
          timeline: [...prev.timeline, { date: new Date().toLocaleString(), event: 'Quotation Generated' }] 
      }));
      showToast('Quotation generated and sent to client', 'success');
      setModalMode(null);
  };

  const submitPurchase = (e: React.FormEvent) => {
      e.preventDefault();
      setRequest(prev => ({ 
          ...prev, 
          status: 'PURCHASED',
          timeline: [...prev.timeline, { date: new Date().toLocaleString(), event: 'Item Purchased' }] 
      }));
      showToast('Purchase confirmed and tracking logged', 'success');
      setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header - Screen Only */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Shopping Request {request.id}</h2>
            <div className="flex items-center space-x-2 text-sm mt-1">
               <StatusBadge status={request.status} />
               <span className="text-slate-500">• {new Date(request.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
           <button onClick={() => handleAction('PRINT')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm">
              <Printer size={16} className="mr-2" /> Print
           </button>
           
           {request.status === 'REQUESTED' && (
               <>
                <button onClick={() => handleAction('REJECT')} className="flex items-center px-3 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm">
                    <XCircle size={16} className="mr-2" /> Reject
                </button>
                <button onClick={() => handleAction('QUOTE')} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium">
                    <DollarSign size={16} className="mr-2" /> Create Quote
                </button>
               </>
           )}

           {request.status === 'PAID' && (
               <button onClick={() => handleAction('PURCHASE')} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
                   <ShoppingCart size={16} className="mr-2" /> Mark Purchased
               </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
         
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-6 print:w-full">
            
            {/* Printable Document Container */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 relative overflow-hidden print:shadow-none print:border-none">
                
                {/* Security Features for Print */}
                <div className="hidden print:block">
                    <Watermark text={request.status} />
                    <SecureHeader title="Proforma Invoice" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8 print:hidden">
                        <h3 className="font-bold text-slate-800 text-lg">Request Details</h3>
                    </div>

                    {/* Client & Item Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100 print:border-slate-800">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Client</p>
                            <p className="font-bold text-slate-900">{request.client.name}</p>
                            <p className="text-sm text-slate-600">{request.client.email}</p>
                            <p className="text-sm text-slate-600">{request.client.phone}</p>
                            <p className="text-xs font-mono text-slate-400 mt-1">ID: {request.client.id}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Request Info</p>
                            <p className="text-sm"><span className="text-slate-500">Date:</span> {request.date}</p>
                            <p className="text-sm"><span className="text-slate-500">ID:</span> {request.id}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 mb-8">
                        <div className="w-24 h-24 bg-slate-100 rounded border border-slate-200 flex items-center justify-center flex-shrink-0">
                            {request.item.image ? (
                                <img src={request.item.image} alt="Item" className="max-w-full max-h-full p-2 object-contain" />
                            ) : (
                                <ShoppingCart className="text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-slate-900 mb-1">{request.item.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{request.item.description}</p>
                            <a href={request.item.url} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline flex items-center print:hidden">
                                Open Store Link <ExternalLink size={10} className="ml-1" />
                            </a>
                            <p className="text-xs text-slate-500 print:block hidden">URL: {request.item.url}</p>
                        </div>
                    </div>

                    {/* Financial Breakdown (Only show if quoted) */}
                    {(request.status !== 'REQUESTED' && request.status !== 'OUT_OF_STOCK') && (
                        <div className="bg-slate-50 rounded border border-slate-200 p-6 print:bg-transparent print:border-slate-800">
                            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 print:border-slate-800">Cost Breakdown</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Item Cost</span>
                                    <span className="font-mono">{request.quote.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Domestic Shipping</span>
                                    <span className="font-mono">{request.quote.domesticShipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Service Fee (10%)</span>
                                    <span className="font-mono">{request.quote.serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-2 mt-2 print:border-slate-800">
                                    <span>Total Payable ({request.quote.currency})</span>
                                    <span>{request.quote.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="hidden print:block mt-8">
                        <SecurityFooter type="ORIGINAL" reference={request.id} />
                    </div>
                </div>
            </div>
         </div>

         {/* Sidebar - Screen Only */}
         <div className="space-y-6 print:hidden">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Request History</h3>
                <div className="border-l-2 border-slate-100 ml-2 space-y-6">
                    {request.timeline.map((t, i) => (
                        <div key={i} className="relative pl-6">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <p className="text-sm font-medium text-slate-800">{t.event}</p>
                            <p className="text-xs text-slate-500">{t.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes / Chat Mock */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                    <MessageSquare size={18} className="mr-2" /> Internal Notes
                </h3>
                <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 mb-3 border border-slate-100">
                    Client requested space black specifically. Checked Apple store availability.
                </div>
                <textarea className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-slate-900" rows={3} placeholder="Add a note..."></textarea>
                <button className="mt-2 w-full bg-slate-800 text-white text-xs py-2 rounded hover:bg-slate-700">Add Note</button>
            </div>
         </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Quote Modal */}
      <Modal isOpen={modalMode === 'QUOTE'} onClose={() => setModalMode(null)} title="Generate Quotation">
          <form onSubmit={submitQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Item Cost (USD)</label>
                      <input type="number" step="0.01" defaultValue={request.quote.cost} className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded mt-1" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Shipping (USD)</label>
                      <input type="number" step="0.01" defaultValue={0} className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded mt-1" />
                  </div>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Send Quote</button>
              </div>
          </form>
      </Modal>

      {/* Purchase Modal */}
      <Modal isOpen={modalMode === 'PURCHASE'} onClose={() => setModalMode(null)} title="Confirm Purchase">
          <form onSubmit={submitPurchase} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700">Order Number</label>
                  <input type="text" required className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded mt-1" placeholder="Vendor Order #" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Tracking Number</label>
                  <input type="text" required className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded mt-1" placeholder="Domestic Tracking" />
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirm & Save</button>
              </div>
          </form>
      </Modal>

    </div>
  );
};

export default ShoppingDetails;