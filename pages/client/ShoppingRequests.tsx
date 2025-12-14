import React, { useState } from 'react';
import { ShoppingBag, Plus, ExternalLink, DollarSign } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface ShopRequest {
  id: string;
  item: string;
  url: string;
  status: string;
  quoteAmount?: number;
  date: string;
}

const ShoppingRequests: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [requests, setRequests] = useState<ShopRequest[]>([
    { id: 'REQ-001', item: 'Gaming Monitor', url: 'https://amazon.com/...', status: 'QUOTED', quoteAmount: 350.00, date: '2025-03-01' },
    { id: 'REQ-002', item: 'Zara Dress', url: 'https://zara.com/...', status: 'PURCHASED', quoteAmount: 85.00, date: '2025-02-20' },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newReq: ShopRequest = {
      id: `REQ-${Math.floor(Math.random() * 1000)}`,
      item: fd.get('item') as string,
      url: fd.get('url') as string,
      status: 'REQUESTED',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([newReq, ...requests]);
    showToast('Request submitted! We will send a quote shortly.', 'success');
    setIsModalOpen(false);
  };

  const handleAcceptQuote = (e: React.MouseEvent, req: ShopRequest) => {
      e.stopPropagation(); // Prevent row click
      // Simulate payment flow
      showToast(`Quote for ${req.item} accepted. Redirecting to payment...`, 'info');
      triggerNav(`/client/shopping/${req.id}`);
  };

  const columns: Column<ShopRequest>[] = [
    { header: 'ID', accessor: 'id', sortable: true, className: 'font-mono text-xs' },
    { 
      header: 'Item', 
      accessor: (r) => (
        <div>
          <div className="font-bold text-slate-800">{r.item}</div>
          <a href={r.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-blue-600 hover:underline flex items-center">
             Link <ExternalLink size={10} className="ml-1" />
          </a>
        </div>
      ), 
      sortKey: 'item',
      sortable: true 
    },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Status', accessor: (r) => <StatusBadge status={r.status} />, sortKey: 'status', sortable: true },
    { 
      header: 'Quote', 
      accessor: (r) => r.quoteAmount ? `$${r.quoteAmount.toFixed(2)}` : '-', 
      className: 'text-right font-medium' 
    },
    {
        header: 'Action',
        className: 'text-right',
        accessor: (r) => (
            r.status === 'QUOTED' ? (
                <button 
                  onClick={(e) => handleAcceptQuote(e, r)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 shadow-sm"
                >
                  Accept & Pay
                </button>
            ) : null
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Shop For Me</h2>
          <p className="text-slate-500 text-sm">We buy from international stores for you.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 flex items-center text-sm font-medium shadow-sm"
        >
          <Plus size={16} className="mr-2" /> New Request
        </button>
      </div>

      <DataTable 
        data={requests} 
        columns={columns} 
        onRowClick={(r) => triggerNav(`/client/shopping/${r.id}`)}
        title="My Requests" 
        searchPlaceholder="Search items..." 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Shopping Request">
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-slate-700">Item Name</label>
              <input name="item" required className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" placeholder="e.g. MacBook Pro M3" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Store URL (Link)</label>
              <input name="url" type="url" required className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" placeholder="https://amazon.com/..." />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Quantity</label>
              <input name="qty" type="number" defaultValue={1} min={1} className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Options / Notes</label>
              <textarea name="notes" rows={3} className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" placeholder="Size: M, Color: Black..."></textarea>
           </div>
           <div className="flex justify-end pt-4">
              <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Submit Request</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShoppingRequests;