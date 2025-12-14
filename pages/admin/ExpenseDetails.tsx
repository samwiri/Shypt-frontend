import React from 'react';
import { ArrowLeft, CheckCircle, FileText, Ban } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ExpenseDetailsProps {
  id: string;
  onBack: () => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();

  const expense = {
      id: id,
      date: '2025-03-01',
      category: 'AIRLINE',
      desc: 'Freight Charges MAWB-001',
      amount: 3200.00,
      vendor: 'Emirates SkyCargo',
      paidBy: 'Sarah Jenkins',
      status: 'PAID',
      notes: 'Standard consolidation rate applied.'
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800">{expense.desc}</h2>
                <p className="text-sm text-slate-500">ID: {expense.id}</p>
             </div>
          </div>
          <div className="flex items-center space-x-2">
             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center">
                <CheckCircle size={14} className="mr-1" /> PAID
             </span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Transaction Details</h3>
             <div className="space-y-4">
                <div className="flex justify-between">
                   <span className="text-slate-500 text-sm">Amount</span>
                   <span className="font-bold text-lg text-slate-900">${expense.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 text-sm">Date</span>
                   <span className="text-slate-900 text-sm">{expense.date}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 text-sm">Category</span>
                   <span className="text-slate-900 text-sm font-medium">{expense.category}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 text-sm">Paid To</span>
                   <span className="text-slate-900 text-sm">{expense.vendor}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 text-sm">Authorized By</span>
                   <span className="text-slate-900 text-sm">{expense.paidBy}</span>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Receipt / Proof of Payment</h3>
             <div className="h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400">
                <FileText size={32} className="mb-2" />
                <p className="text-sm">No receipt attached.</p>
                <button className="mt-2 text-blue-600 text-xs font-medium hover:underline">Upload Receipt</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ExpenseDetails;