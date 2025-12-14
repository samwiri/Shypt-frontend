import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, Eye, Plus } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { DataTable, Column } from '../../components/UI/DataTable';

const Invoices: React.FC = () => {
  const { showToast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Helper to simulate navigation
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [invoices, setInvoices] = useState([
    { id: 'INV-2025-001', client: 'Acme Corp', type: 'FREIGHT', amount: 450.00, status: 'PAID', date: '2025-02-28' },
    { id: 'INV-2025-002', client: 'John Doe', type: 'SHOPPING', amount: 1200.00, status: 'PENDING', date: '2025-03-01', notes: 'Client uploaded bank transfer receipt #9912' },
    { id: 'INV-2025-003', client: 'Jane Smith', type: 'STORAGE_FEE', amount: 25.00, status: 'PENDING', date: '2025-03-02' },
  ]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInv = {
      id: `INV-2025-${100 + invoices.length}`,
      client: formData.get('client') as string,
      type: formData.get('type') as string,
      amount: Number(formData.get('amount')),
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices([newInv, ...invoices]);
    showToast('Invoice Generated and Sent to Client', 'success');
    setIsCreateOpen(false);
  };

  // --- COLUMN DEFINITIONS ---
  const columns: Column<typeof invoices[0]>[] = [
    {
      header: 'Invoice #',
      accessor: (inv) => <span className="font-medium text-primary-600 hover:underline">{inv.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Client',
      accessor: 'client',
      sortable: true
    },
    {
      header: 'Type',
      accessor: 'type',
      sortable: true,
      className: 'text-xs font-bold text-slate-500'
    },
    {
      header: 'Amount',
      accessor: (inv) => `$${inv.amount.toFixed(2)}`,
      sortKey: 'amount',
      sortable: true,
      className: 'font-medium text-slate-900'
    },
    {
      header: 'Status',
      accessor: (inv) => <StatusBadge status={inv.status} />,
      sortKey: 'status',
      sortable: true
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (inv) => (
        <button 
             onClick={(e) => { e.stopPropagation(); triggerNav(`/admin/invoices/${inv.id}`); }}
             className="text-slate-400 hover:text-primary-600 transition p-2"
           >
             <Eye size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financials</h2>
          <p className="text-slate-500 text-sm">Manage invoices and verify payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Total Outstanding</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">$1,225.00</p>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
             <p className="text-slate-500 text-sm font-medium">Pending Verification</p>
             <p className="text-2xl font-bold text-yellow-600 mt-1">{invoices.filter(i => i.status === 'PENDING').length} Invoices</p>
         </div>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        onRowClick={(inv) => triggerNav(`/admin/invoices/${inv.id}`)}
        title="Invoice History"
        searchPlaceholder="Search Invoices..."
        primaryAction={
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition flex items-center shadow-sm"
          >
            <Plus size={16} className="mr-2" />
            Generate Invoice
          </button>
        }
      />

      {/* CREATE INVOICE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Generate New Invoice"
      >
        <form onSubmit={handleCreate} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-slate-700">Client</label>
              <input name="client" required placeholder="Client Name or ID" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Invoice Type</label>
              <select name="type" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900">
                 <option value="FREIGHT">Freight Charges</option>
                 <option value="SHOPPING">Assisted Shopping</option>
                 <option value="STORAGE_FEE">Storage Fee</option>
                 <option value="CUSTOMS_DUTY">Customs Duty</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Amount (USD)</label>
              <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900" />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700">Description / Notes</label>
              <textarea name="notes" className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900" rows={3}></textarea>
           </div>
           <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border rounded text-slate-600 mr-2 bg-white">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700">Send Invoice</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;