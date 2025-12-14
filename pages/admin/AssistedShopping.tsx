import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, DollarSign, Check, X, Truck, MessageSquare, AlertCircle, Eye } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { DataTable, Column } from '../../components/UI/DataTable';

const AssistedShopping: React.FC = () => {
  const { showToast } = useToast();
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<'QUOTE' | 'PURCHASE' | 'REJECT' | null>(null);

  // Quote State
  const [quoteCost, setQuoteCost] = useState<number>(0);
  const [quoteShip, setQuoteShip] = useState<number>(0);

  const [requests, setRequests] = useState([
    { id: 'REQ-2025-001', client: 'John Doe', item: 'MacBook Pro M4', url: 'https://apple.com/store...', price: 0, status: 'REQUESTED', date: '2025-03-01' },
    { id: 'REQ-2025-002', client: 'Alice Smith', item: 'Nike Air Jordans (Limited)', url: 'https://nike.com/jordan...', price: 250, status: 'PAID', date: '2025-02-28' },
    { id: 'REQ-2025-003', client: 'Bob Jones', item: 'Auto Part #554', url: 'https://ebay.com/item...', price: 1500, status: 'QUOTED', date: '2025-02-25' },
    { id: 'REQ-2025-004', client: 'Sarah Lee', item: 'Sephora Bundle', url: 'https://sephora.com...', price: 0, status: 'OUT_OF_STOCK', date: '2025-02-20' },
    { id: 'REQ-2025-005', client: 'Mike Ross', item: 'Gaming Chair', url: 'https://amazon.com...', price: 450, status: 'PURCHASED', date: '2025-02-18' },
    { id: 'REQ-2025-006', client: 'Harvey Specter', item: 'Suits Supply', url: 'https://suitsupply.com...', price: 1200, status: 'PAID', date: '2025-02-15' },
  ]);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const handleOpenModal = (req: any, mode: typeof modalMode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedReq(req);
    setModalMode(mode);
    setQuoteCost(0);
    setQuoteShip(0);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: 'QUOTED', price: quoteCost + quoteShip + (quoteCost * 0.1) } : r));
    showToast('Quotation sent to client', 'success');
    setModalMode(null);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: 'PURCHASED' } : r));
    showToast('Item marked as Purchased. Tracking saved.', 'success');
    setModalMode(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, status: 'OUT_OF_STOCK' } : r));
      showToast('Client notified of item unavailability.', 'info');
      setModalMode(null);
  };

  // --- COLUMN DEFINITIONS ---
  const columns: Column<typeof requests[0]>[] = [
    {
      header: 'Request ID',
      accessor: (req) => <span className="font-medium text-primary-600 hover:underline">{req.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Client',
      accessor: 'client',
      sortable: true
    },
    {
      header: 'Item Details',
      accessor: (req) => (
        <div>
           <div className="text-sm font-medium text-slate-800">{req.item}</div>
           <a href="#" onClick={(e) => e.stopPropagation()} className="text-xs text-blue-600 flex items-center hover:underline mt-0.5">
             View Link <ExternalLink size={10} className="ml-1" />
           </a>
        </div>
      ),
      sortKey: 'item',
      sortable: true
    },
    {
      header: 'Status',
      accessor: (req) => <StatusBadge status={req.status} />,
      sortKey: 'status',
      sortable: true
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true
    },
    {
      header: 'Value',
      accessor: (req) => req.price > 0 ? `$${req.price.toFixed(2)}` : '-',
      sortKey: 'price',
      sortable: true,
      className: 'text-right'
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (req) => (
        <div className="flex justify-end space-x-2">
            {req.status === 'REQUESTED' && (
              <>
                  <button 
                  onClick={(e) => handleOpenModal(req, 'REJECT', e)}
                  className="text-slate-500 hover:text-red-600 p-1"
                  title="Mark Out of Stock / Reject"
                  >
                  <X size={16} />
                  </button>
                  <button 
                  onClick={(e) => handleOpenModal(req, 'QUOTE', e)}
                  className="text-primary-600 hover:text-primary-800 font-medium text-xs bg-primary-50 px-2 py-1 rounded border border-primary-200"
                  >
                  Quote
                  </button>
              </>
            )}
            {req.status === 'PAID' && (
              <button 
                onClick={(e) => handleOpenModal(req, 'PURCHASE', e)}
                className="text-green-600 hover:text-green-800 font-medium text-xs bg-green-50 px-2 py-1 rounded border border-green-200"
              >
                Buy Now
              </button>
            )}
            {req.status === 'QUOTED' && <span className="text-xs text-slate-400 italic">Waiting</span>}
            {req.status === 'PURCHASED' && <span className="text-xs text-green-600 font-bold flex items-center"><Check size={14} className="mr-1"/> Bought</span>}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Assisted Shopping</h2>
          <p className="text-slate-500 text-sm">Manage 'Buy For Me' requests, quotations, and procurement.</p>
        </div>
      </div>

      <DataTable 
        data={requests}
        columns={columns}
        onRowClick={(req) => triggerNav(`/admin/shopping/${req.id}`)}
        title="Request Queue"
        searchPlaceholder="Search Requests, Items or Clients..."
      />

      {/* QUOTE MODAL */}
      <Modal isOpen={modalMode === 'QUOTE'} onClose={() => setModalMode(null)} title="Create Quotation">
        <form onSubmit={handleQuoteSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-start">
             <ExternalLink size={16} className="mr-2 mt-0.5" />
             <div>
                <p><strong>Verification Step:</strong> Click the link below to verify price and availability.</p>
                <a href="#" className="underline text-blue-600 break-all">{selectedReq?.url}</a>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Item Cost (USD)</label>
                <input 
                    required type="number" step="0.01"
                    className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1" 
                    placeholder="0.00" 
                    onChange={e => setQuoteCost(parseFloat(e.target.value) || 0)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Domestic Shipping (USD)</label>
                <input 
                    required type="number" step="0.01"
                    className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1" 
                    placeholder="0.00" 
                    onChange={e => setQuoteShip(parseFloat(e.target.value) || 0)}
                />
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-4">
             <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span>${(quoteCost + quoteShip).toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm mb-1">
                <span>Service Fee (10%):</span>
                <span>${((quoteCost + quoteShip) * 0.1).toFixed(2)}</span>
             </div>
             <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total to Client:</span>
                <span className="text-primary-600">${((quoteCost + quoteShip) * 1.1).toFixed(2)}</span>
             </div>
          </div>

          <div className="flex justify-end pt-4">
             <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Send Quote</button>
          </div>
        </form>
      </Modal>

      {/* PURCHASE MODAL */}
      <Modal isOpen={modalMode === 'PURCHASE'} onClose={() => setModalMode(null)} title="Confirm Purchase">
         <form onSubmit={handlePurchaseSubmit} className="space-y-4">
           <div className="bg-blue-50 p-4 rounded text-blue-800 text-sm mb-4">
              Please visit the retailer URL, purchase the item, and upload the receipt here.
              Ensure you record the domestic tracking so the warehouse can identify it.
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700">Retailer Order # <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1" placeholder="e.g. 112-9928-111" />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700">Domestic Carrier <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1">
                  <option>UPS</option>
                  <option>FedEx</option>
                  <option>USPS</option>
                  <option>DHL</option>
                  <option>Amazon Logistics</option>
                  <option>Other</option>
                </select>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700">Tracking Number <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1" placeholder="e.g. 1Z999..." />
             </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700">Upload Receipt</label>
              <input type="file" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 mt-1" />
           </div>

           <div className="flex justify-end pt-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center">
                <Truck size={16} className="mr-2" />
                Confirm Purchased
              </button>
           </div>
         </form>
      </Modal>

      {/* REJECT/ISSUE MODAL */}
      <Modal isOpen={modalMode === 'REJECT'} onClose={() => setModalMode(null)} title="Issue Unavailability Notice">
          <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700">Reason</label>
                  <select className="w-full border border-slate-300 p-2 rounded mt-1 bg-white text-slate-900">
                      <option>Item Out of Stock</option>
                      <option>Price Mismatch (Too Expensive)</option>
                      <option>Seller does not ship to Warehouse</option>
                      <option>Prohibited Item</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Suggest Alternative URL (Optional)</label>
                  <input type="url" placeholder="https://..." className="w-full border border-slate-300 p-2 rounded mt-1 bg-white text-slate-900" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Message to Client</label>
                  <textarea className="w-full border border-slate-300 p-2 rounded mt-1 bg-white text-slate-900" rows={3} defaultValue="We are sorry, but we could not fulfill your request because..."></textarea>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Notify Client</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default AssistedShopping;