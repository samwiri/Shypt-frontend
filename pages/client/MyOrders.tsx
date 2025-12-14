import React, { useState } from 'react';
import { Package, Plus, Search, Plane, Ship, AlertCircle } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface ClientOrder {
  id: string;
  desc: string;
  origin: string;
  weight: string;
  status: string;
  date: string;
  trackingNo?: string;
}

const MyOrders: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [orders, setOrders] = useState<ClientOrder[]>([
    { id: 'HWB-8832', desc: 'Amazon Shipment (Electronics)', origin: 'US', weight: '2.5kg', status: 'ARRIVED', date: '2025-03-05', trackingNo: 'TBA009212' },
    { id: 'ORD-9912', desc: 'Nike Sneakers', origin: 'UK', weight: '1.2kg', status: 'PENDING', date: '2025-03-04' },
    { id: 'HWB-8810', desc: 'Auto Parts', origin: 'CN', weight: '45kg', status: 'IN_TRANSIT', date: '2025-02-28' },
  ]);

  const handleCreatePreAlert = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newOrder: ClientOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      desc: fd.get('desc') as string,
      origin: fd.get('origin') as string,
      weight: (fd.get('weight') as string) + 'kg',
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      trackingNo: fd.get('tracking') as string
    };
    setOrders([newOrder, ...orders]);
    showToast('Pre-Alert Created. Warehouse notified.', 'success');
    setIsModalOpen(false);
  };

  const columns: Column<ClientOrder>[] = [
    { 
      header: 'Order ID', 
      accessor: (o) => <span className="font-mono font-bold text-primary-600 hover:underline">{o.id}</span>,
      sortKey: 'id',
      sortable: true 
    },
    { 
      header: 'Description', 
      accessor: (o) => (
        <div>
          <div className="font-medium text-slate-800">{o.desc}</div>
          {o.trackingNo && <div className="text-xs text-slate-500">Track: {o.trackingNo}</div>}
        </div>
      ),
      sortKey: 'desc',
      sortable: true
    },
    { header: 'Origin', accessor: 'origin', sortable: true },
    { header: 'Weight', accessor: 'weight' },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Status', accessor: (o) => <StatusBadge status={o.status} />, sortKey: 'status', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Orders</h2>
          <p className="text-slate-500 text-sm">Track your shipments and declare incoming packages.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 flex items-center text-sm font-medium shadow-sm"
        >
          <Plus size={16} className="mr-2" /> Create Pre-Alert
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
        <AlertCircle className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
        <div className="text-sm text-blue-800">
          <span className="font-bold">Did you know?</span> Creating a Pre-Alert helps us process your package 40% faster upon arrival at our warehouse.
        </div>
      </div>

      <DataTable 
        data={orders}
        columns={columns}
        onRowClick={(o) => triggerNav(`/client/orders/${o.id}`)}
        title="Active Shipments"
        searchPlaceholder="Search your orders..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Declare Incoming Package">
        <form onSubmit={handleCreatePreAlert} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Description of Goods <span className="text-red-500">*</span></label>
            <input name="desc" required placeholder="e.g. Shoes, Laptop, Clothes" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Origin Warehouse</label>
              <select name="origin" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900">
                <option value="US">USA (New York)</option>
                <option value="UK">UK (London)</option>
                <option value="CN">China (Guangzhou)</option>
                <option value="AE">UAE (Dubai)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Est. Weight (kg)</label>
              <input name="weight" type="number" step="0.1" placeholder="0.0" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Domestic Tracking Number (Optional)</label>
            <input name="tracking" placeholder="e.g. UPS/FedEx/DHL Number" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
            <p className="text-xs text-slate-500 mt-1">If the vendor has shipped it, paste the tracking number here.</p>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 font-medium">Submit Pre-Alert</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyOrders;