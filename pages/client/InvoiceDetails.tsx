import React from 'react';
import { ArrowLeft, Printer, CreditCard, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface InvoiceDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientInvoiceDetails: React.FC<InvoiceDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();

  const invoice = {
    id: id,
    date: '2025-03-01',
    dueDate: '2025-03-10',
    status: id === 'INV-9921' ? 'PENDING' : 'PAID',
    items: [
        { desc: 'Air Freight (4.5kg @ $9/kg)', amount: 40.50 },
        { desc: 'Handling Fee', amount: 4.50 },
    ],
    total: 45.00
  };

  const handlePrint = () => {
      window.print();
  };

  const handlePay = () => {
      if(confirm('Proceed to payment gateway?')) {
          showToast('Redirecting to Mobile Money / Card Payment...', 'info');
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
             <ArrowLeft size={20} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-slate-800">{invoice.id}</h2>
             <div className="mt-1"><StatusBadge status={invoice.status} /></div>
          </div>
          <div className="flex-1"></div>
          <div className="flex space-x-2">
             <button onClick={handlePrint} className="px-4 py-2 border rounded hover:bg-slate-50 text-sm flex items-center">
                <Printer size={16} className="mr-2" /> Print
             </button>
             {invoice.status === 'PENDING' && (
                 <button onClick={handlePay} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm flex items-center">
                    <CreditCard size={16} className="mr-2" /> Pay Now
                 </button>
             )}
          </div>
       </div>

       <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-3xl mx-auto print:shadow-none print:border-none">
          <div className="flex justify-between border-b border-slate-200 pb-6 mb-6">
             <div>
                <h1 className="text-2xl font-bold text-slate-800">INVOICE</h1>
                <p className="text-slate-500">{invoice.id}</p>
             </div>
             <div className="text-right">
                <h3 className="font-bold text-slate-800">WOFMS Logistics</h3>
                <p className="text-sm text-slate-500">Kampala, Uganda</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <p className="text-xs uppercase font-bold text-slate-400">Bill To</p>
                <p className="font-bold text-slate-800">John Doe</p>
                <p className="text-sm text-slate-600">Kampala, Uganda</p>
             </div>
             <div className="text-right">
                <p className="text-xs uppercase font-bold text-slate-400">Total Due</p>
                <p className="text-2xl font-bold text-slate-800">${invoice.total.toFixed(2)}</p>
                <p className="text-xs text-red-500">Due: {invoice.dueDate}</p>
             </div>
          </div>

          <table className="w-full text-left mb-8">
             <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                   <th className="px-4 py-3">Description</th>
                   <th className="px-4 py-3 text-right">Amount</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, i) => (
                    <tr key={i}>
                        <td className="px-4 py-3 text-sm text-slate-700">{item.desc}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">${item.amount.toFixed(2)}</td>
                    </tr>
                ))}
             </tbody>
          </table>

          <div className="flex justify-end border-t border-slate-200 pt-4">
             <div className="w-1/2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ClientInvoiceDetails;