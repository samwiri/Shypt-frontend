import React, { useState } from 'react';
import { FileText, CreditCard, Download, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface Invoice {
  id: string;
  date: string;
  desc: string;
  amount: number;
  status: string;
  dueDate: string;
}

const ClientInvoices: React.FC = () => {
  const { showToast } = useToast();
  
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-9921', date: '2025-03-01', desc: 'Freight Charges - HWB-8832', amount: 45.00, status: 'PENDING', dueDate: '2025-03-10' },
    { id: 'INV-9800', date: '2025-02-15', desc: 'Shopping Request - REQ-002', amount: 85.00, status: 'PAID', dueDate: '2025-02-25' },
    { id: 'INV-9755', date: '2025-01-20', desc: 'Sea Freight - Bulk Clothes', amount: 320.00, status: 'PAID', dueDate: '2025-01-30' },
  ]);

  const totalDue = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const paidThisMonth = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0); 

  const columns: Column<Invoice>[] = [
    { 
      header: 'Invoice #', 
      accessor: (i) => <span className="font-mono font-medium text-slate-700">{i.id}</span>, 
      sortKey: 'id', 
      sortable: true 
    },
    { header: 'Date', accessor: 'date', sortable: true, className: 'text-slate-500 text-sm' },
    { header: 'Description', accessor: 'desc', className: 'font-medium text-slate-800' },
    { 
      header: 'Due Date', 
      accessor: (i) => (
        <span className={i.status === 'PENDING' ? 'text-orange-600 font-medium' : 'text-slate-500'}>
          {i.dueDate}
        </span>
      ), 
      sortable: true 
    },
    { header: 'Status', accessor: (i) => <StatusBadge status={i.status} />, sortKey: 'status', sortable: true },
    { header: 'Amount', accessor: (i) => `$${i.amount.toFixed(2)}`, className: 'font-bold text-right text-slate-900' },
    {
        header: '',
        className: 'text-right',
        accessor: (i) => (
            i.status === 'PENDING' ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); triggerNav(`/client/invoices/${i.id}`); }}
                  className="bg-primary-600 text-white px-3 py-1.5 rounded text-xs hover:bg-primary-700 shadow-sm flex items-center ml-auto font-medium transition"
                >
                  <CreditCard size={12} className="mr-1.5" /> Pay Now
                </button>
            ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="text-slate-400 hover:text-slate-600 ml-auto block p-1 border border-transparent hover:border-slate-200 rounded"
                  title="Download Receipt"
                >
                    <Download size={16} />
                </button>
            )
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Invoices</h2>
          <p className="text-slate-500 text-sm">View statement and pay outstanding bills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg shadow-sm border border-red-100 flex items-center justify-between">
            <div>
               <p className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                 <Clock size={12} className="mr-1" /> Outstanding Balance
               </p>
               <p className="text-3xl font-extrabold text-slate-900">${totalDue.toFixed(2)}</p>
               <p className="text-slate-500 text-xs mt-1">{invoices.filter(i => i.status === 'PENDING').length} Unpaid Invoices</p>
            </div>
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500">
               <FileText size={24} />
            </div>
         </div>

         <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-lg shadow-sm border border-green-100 flex items-center justify-between">
            <div>
               <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                 <TrendingUp size={12} className="mr-1" /> Paid (Lifetime)
               </p>
               <p className="text-3xl font-extrabold text-slate-900">${paidThisMonth.toFixed(2)}</p>
               <p className="text-slate-500 text-xs mt-1">All time payments</p>
            </div>
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">
               <CheckCircle size={24} />
            </div>
         </div>
      </div>

      <DataTable 
        data={invoices} 
        columns={columns} 
        onRowClick={(i) => triggerNav(`/client/invoices/${i.id}`)}
        title="Transaction History" 
      />
    </div>
  );
};

export default ClientInvoices;