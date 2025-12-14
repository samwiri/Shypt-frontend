import React, { useState } from 'react';
import { DollarSign, TrendingDown, Plus, FileText, Calendar } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';

interface Expense {
  id: string;
  category: 'AIRLINE' | 'CUSTOMS' | 'LOCAL_TRANSPORT' | 'PACKAGING' | 'OTHER';
  description: string;
  amount: number;
  date: string;
  linkedManifest?: string;
  paidTo: string;
  status: 'PAID' | 'PENDING';
}

const Expenses: React.FC = () => {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'EXP-001', category: 'AIRLINE', description: 'Freight Charges MAWB-001', amount: 3200.00, date: '2025-03-01', linkedManifest: 'MAWB-001', paidTo: 'Emirates SkyCargo', status: 'PAID' },
    { id: 'EXP-002', category: 'LOCAL_TRANSPORT', description: 'Truck Rental to Warehouse', amount: 150.00, date: '2025-03-02', linkedManifest: 'MAWB-001', paidTo: 'Quick Transporters', status: 'PAID' },
    { id: 'EXP-003', category: 'CUSTOMS', description: 'Bond Fees', amount: 450.00, date: '2025-03-03', linkedManifest: 'MAWB-002', paidTo: 'URA', status: 'PENDING' },
  ]);

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newExp: Expense = {
      id: `EXP-${Math.floor(Math.random() * 1000)}`,
      category: fd.get('category') as any,
      description: fd.get('description') as string,
      amount: Number(fd.get('amount')),
      date: fd.get('date') as string,
      linkedManifest: fd.get('manifest') as string,
      paidTo: fd.get('paidTo') as string,
      status: 'PAID' // Assuming immediate recording
    };
    setExpenses([newExp, ...expenses]);
    showToast('Expense Recorded', 'success');
    setIsFormOpen(false);
  };

  const columns: Column<Expense>[] = [
    { header: 'ID', accessor: (exp) => <span className="font-mono text-xs text-primary-600 hover:underline">{exp.id}</span>, sortKey: 'id', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Category', accessor: 'category', sortable: true, className: 'text-xs font-bold' },
    { header: 'Description', accessor: 'description' },
    { header: 'Paid To', accessor: 'paidTo' },
    { 
      header: 'Amount', 
      accessor: (exp) => <span className="font-bold text-red-600">-${exp.amount.toFixed(2)}</span>, 
      sortKey: 'amount', 
      sortable: true, 
      className: 'text-right' 
    },
    { 
        header: 'Status', 
        accessor: (exp) => <span className={`px-2 py-1 rounded text-xs ${exp.status === 'PAID' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'}`}>{exp.status}</span> 
    }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Expenses</h2>
          <p className="text-slate-500 text-sm">Track Cost of Sales (COS) and payouts.</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center shadow-sm text-sm font-medium">
           <Plus size={16} className="mr-2" /> Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Total Expenses (Mar)</p>
            <p className="text-2xl font-bold text-red-600 mt-1">${totalExpenses.toFixed(2)}</p>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Net Profit (Est.)</p>
            <p className="text-2xl font-bold text-green-600 mt-1">$4,250.00</p>
            <p className="text-xs text-slate-400">Revenue - Expenses</p>
         </div>
      </div>

      <DataTable 
         data={expenses} 
         columns={columns} 
         onRowClick={(exp) => triggerNav(`/admin/expenses/${exp.id}`)}
         title="Expense Ledger"
         searchPlaceholder="Search Expenses..."
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Record New Expense">
         <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select name="category" className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                     <option value="AIRLINE">Airline / Freight Charge</option>
                     <option value="CUSTOMS">Customs & Taxes</option>
                     <option value="LOCAL_TRANSPORT">Local Transport</option>
                     <option value="PACKAGING">Packaging Materials</option>
                     <option value="OTHER">Other / Admin</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700">Date</label>
                  <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Description</label>
               <input name="description" required placeholder="e.g. Flight EK202 Charges" className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700">Amount (USD)</label>
                  <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700">Paid To</label>
                  <input name="paidTo" required placeholder="Vendor Name" className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Linked Manifest (Optional)</label>
               <input name="manifest" placeholder="e.g. MAWB-001" className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
            </div>
            <div className="flex justify-end pt-4">
               <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Save Expense</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Expenses;