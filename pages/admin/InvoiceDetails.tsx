import React, { useState } from 'react';
import { ArrowLeft, Download, Send, CreditCard, Ban, RotateCcw, Check, Printer } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Watermark, SecurityFooter, SecureHeader } from '../../components/UI/SecurityFeatures';

interface InvoiceDetailsProps {
  invoiceId: string;
  onBack: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoiceId, onBack }) => {
  const { showToast } = useToast();
  
  // Mock Data based on ID
  const [invoice, setInvoice] = useState({
    id: invoiceId,
    client: { name: 'Acme Corp', id: 'CL-8821', email: 'billing@acme.com', address: 'Kampala, Uganda' },
    issueDate: '2025-03-01',
    dueDate: '2025-03-15',
    status: invoiceId === 'INV-2025-001' ? 'PAID' : 'PENDING',
    items: [
      { desc: 'Air Freight Charges (45kg @ $8/kg)', amount: 360.00 },
      { desc: 'Customs Clearance Fee', amount: 50.00 },
      { desc: 'Local Delivery', amount: 40.00 },
    ],
    subtotal: 450.00,
    tax: 0.00,
    total: 450.00,
    notes: 'Please include Invoice ID in bank transfer description.'
  });

  const handleAction = (action: string) => {
    switch (action) {
      case 'PAY':
        setInvoice({ ...invoice, status: 'PAID' });
        showToast('Invoice marked as PAID', 'success');
        break;
      case 'VOID':
        setInvoice({ ...invoice, status: 'CANCELLED' });
        showToast('Invoice has been Voided', 'warning');
        break;
      case 'REMIND':
        showToast(`Reminder sent to ${invoice.client.email}`, 'info');
        break;
      case 'REFUND':
        setInvoice({ ...invoice, status: 'PENDING' }); // Simulating refund logic
        showToast('Refund processed. Status reverted.', 'info');
        break;
      case 'DOWNLOAD':
      case 'PRINT':
        const originalTitle = document.title;
        document.title = `Shypt_Invoice_${invoice.id}`;
        window.print();
        document.title = originalTitle;
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions - Hidden on Print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Invoice {invoice.id}</h2>
            <div className="flex items-center space-x-2 text-sm mt-1">
               <StatusBadge status={invoice.status} />
               <span className="text-slate-500">• Issued: {invoice.issueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
           <button onClick={() => handleAction('PRINT')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm">
              <Printer size={16} className="mr-2" /> Print
           </button>
           
           {invoice.status === 'PENDING' && (
             <>
               <button onClick={() => handleAction('REMIND')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm">
                  <Send size={16} className="mr-2" /> Remind
               </button>
               <button onClick={() => handleAction('VOID')} className="flex items-center px-3 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm">
                  <Ban size={16} className="mr-2" /> Void
               </button>
               <button onClick={() => handleAction('PAY')} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
                  <Check size={16} className="mr-2" /> Mark Paid
               </button>
             </>
           )}

           {invoice.status === 'PAID' && (
             <button onClick={() => handleAction('REFUND')} className="flex items-center px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm">
                <RotateCcw size={16} className="mr-2" /> Issue Refund
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
         {/* Invoice Document */}
         <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-8 relative overflow-hidden print:shadow-none print:border-none print:w-full">
            
            {/* Security Components */}
            <Watermark text={invoice.status} />
            <SecureHeader title="Commercial Invoice" />

            <div className="relative z-10">
                <div className="flex justify-between border-b border-slate-100 pb-8 mb-8 print:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 print:hidden">INVOICE</h1>
                    <p className="text-slate-500 mt-1 font-mono">#{invoice.id}</p>
                </div>
                <div className="text-right">
                    <h3 className="font-bold text-slate-800">Shypt Logistics</h3>
                    <p className="text-sm text-slate-500">Plot 12, Industrial Area</p>
                    <p className="text-sm text-slate-500">Kampala, Uganda</p>
                    <p className="text-sm text-slate-500">www.shypt.net</p>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Bill To</p>
                    <p className="font-bold text-slate-800">{invoice.client.name}</p>
                    <p className="text-sm text-slate-500">{invoice.client.address}</p>
                    <p className="text-sm text-slate-500">{invoice.client.email}</p>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Due Date</p>
                        <p className="font-bold text-slate-800">{invoice.dueDate}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Amount Due</p>
                        <p className="text-xl font-bold text-slate-800">${invoice.total.toFixed(2)}</p>
                    </div>
                </div>
                </div>

                <table className="w-full text-left mb-8">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase print:bg-transparent print:border-b print:border-slate-300">
                    <tr>
                        <th className="px-4 py-3 rounded-l-md print:px-0">Description</th>
                        <th className="px-4 py-3 text-right rounded-r-md print:px-0">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                    {invoice.items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-4 py-3 text-slate-700 print:px-0">{item.desc}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900 print:px-0">${item.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                </table>

                <div className="flex justify-end">
                <div className="w-1/2 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax (0%)</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-800 border-t border-slate-200 pt-2 mt-2 print:border-slate-800">
                        <span>Total</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
                </div>

                {invoice.notes && (
                <div className="mt-8 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Notes</p>
                    <p className="text-sm text-slate-600">{invoice.notes}</p>
                </div>
                )}

                <SecurityFooter type="ORIGINAL" reference={invoice.id} />
            </div>
         </div>

         {/* Sidebar Payment Info - Hidden on Print */}
         <div className="space-y-6 print:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4">Payment Information</h3>
               <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">Bank Transfer</p>
                     <p className="text-sm font-medium text-slate-800">Bank: Stanbic Bank Uganda</p>
                     <p className="text-sm text-slate-600">Acc: 9030012345678</p>
                     <p className="text-sm text-slate-600">Name: Shypt Logistics</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">Mobile Money</p>
                     <p className="text-sm font-medium text-slate-800">MTN: *165*...</p>
                     <p className="text-sm text-slate-600">Merchant Code: 88212</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
               <h3 className="font-bold text-slate-800 mb-4">Client History</h3>
               <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                     <span className="text-slate-600">Total Invoiced</span>
                     <span className="font-medium">$4,500.00</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-600">Outstanding</span>
                     <span className="font-medium text-red-600">$450.00</span>
                  </div>
               </div>
               <button className="w-full mt-4 text-primary-600 text-sm font-medium hover:underline">View Client Ledger</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;