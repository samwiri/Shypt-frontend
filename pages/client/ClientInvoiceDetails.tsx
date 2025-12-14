import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, CreditCard, CheckCircle, Download } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/UI/Modal';
import PaymentGateway from '../../components/UI/PaymentGateway';
import { Watermark, SecurityFooter } from '../../components/UI/SecurityFeatures';

interface InvoiceDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientInvoiceDetails: React.FC<InvoiceDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();
  
  // State for Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Initial State Setup
  const [invoice, setInvoice] = useState(() => {
      // Mock logic: If ID matches the pending demo ID, set status PENDING, else PAID.
      // We also default to PENDING for any new ID for testing purposes unless it's the known paid one.
      const isPaid = id === 'INV-9800' || id === 'INV-9755';
      return {
        id: id,
        date: '2025-03-01',
        dueDate: '2025-03-10',
        status: isPaid ? 'PAID' : 'PENDING', 
        items: [
            { desc: 'Air Freight (4.5kg @ $9/kg)', amount: 40.50 },
            { desc: 'Handling Fee & Documentation', amount: 4.50 },
        ],
        subtotal: 45.00,
        tax: 0.00,
        total: 45.00,
        client: {
            name: 'John Doe',
            id: 'CL-8821',
            address: 'Plot 44, Kampala Road',
            email: 'john@example.com'
        }
      };
  });

  // Ensure state updates if the ID prop changes (e.g. navigation from one invoice to another)
  useEffect(() => {
      const isPaid = id === 'INV-9800' || id === 'INV-9755';
      setInvoice(prev => ({
          ...prev,
          id: id,
          status: isPaid ? 'PAID' : 'PENDING'
      }));
  }, [id]);

  const handlePaymentSuccess = (txId: string) => {
      setInvoice(prev => ({ ...prev, status: 'PAID' }));
      setShowPaymentModal(false);
      showToast(`Payment Successful! Receipt: ${txId}`, 'success');
  };

  const handlePrint = () => {
      const originalTitle = document.title;
      document.title = `Shypt_Invoice_${invoice.id}`;
      window.print();
      document.title = originalTitle;
  }

  const InvoiceDocument = () => (
    <div className="bg-white p-8 md:p-12 relative overflow-hidden" id="printable-invoice">
        {/* Print Specific Headers */}
        <div className="hidden print:block">
            <Watermark text={invoice.status} />
        </div>

        {/* Company Header */}
        <div className="flex justify-between border-b-2 border-slate-900 pb-8 mb-8">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">INVOICE</h1>
                <p className="text-slate-500 mt-2 font-mono text-sm">#{invoice.id}</p>
                <div className="mt-4">
                    <StatusBadge status={invoice.status} />
                </div>
            </div>
            <div className="text-right">
                <h3 className="font-bold text-lg text-slate-900">Shypt Logistics</h3>
                <p className="text-sm text-slate-500">Plot 12, Industrial Area</p>
                <p className="text-sm text-slate-500">Kampala, Uganda</p>
                <p className="text-sm text-slate-500 mt-1">support@shypt.net</p>
            </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                <p className="font-bold text-slate-900 text-lg">{invoice.client.name}</p>
                <p className="text-sm text-slate-600">{invoice.client.address}</p>
                <p className="text-sm text-slate-600">{invoice.client.email}</p>
            </div>
            <div className="text-right space-y-3">
                <div className="flex justify-between md:justify-end gap-8">
                    <span className="text-sm text-slate-500 font-medium">Issue Date</span>
                    <span className="text-sm font-bold text-slate-900">{invoice.date}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-8">
                    <span className="text-sm text-slate-500 font-medium">Due Date</span>
                    <span className={`text-sm font-bold ${invoice.status === 'PENDING' ? 'text-red-600' : 'text-slate-900'}`}>{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-8 pt-2">
                    <span className="text-sm text-slate-500 font-medium">Amount Due</span>
                    <span className="text-xl font-black text-slate-900">${invoice.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-left mb-8">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-y border-slate-200">
                <tr>
                    <th className="px-4 py-4">Description</th>
                    <th className="px-4 py-4 text-right">Amount (USD)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, i) => (
                    <tr key={i}>
                        <td className="px-4 py-4 text-sm text-slate-700 font-medium">{item.desc}</td>
                        <td className="px-4 py-4 text-sm text-slate-900 text-right font-bold">${item.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
            <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between text-sm text-slate-600 px-4">
                    <span>Subtotal</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-slate-900 bg-slate-50 p-4 rounded-lg mt-2">
                    <span>Total</span>
                    <span>${invoice.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Footer / Payment Info */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between text-sm text-slate-500">
            <div className="mb-4 md:mb-0">
                <p className="font-bold text-slate-700 mb-1">Payment Instructions</p>
                <p>Bank: Stanbic Bank Uganda</p>
                <p>Account: 9030012345678</p>
                <p>Ref: {invoice.id}</p>
            </div>
            <div className="text-right">
                <p className="italic">Thank you for your business.</p>
                <p className="text-xs mt-1">Generated electronically.</p>
                <p className="text-xs mt-1">www.shypt.net</p>
            </div>
        </div>
        
        {/* Print Only Security Footer */}
        <div className="hidden print:block mt-8">
            <SecurityFooter type="ORIGINAL" reference={invoice.id} />
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
       {/* Actions Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800">Invoice {invoice.id}</h2>
                <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={invoice.status} />
                    <span className="text-sm text-slate-500">• Due {invoice.dueDate}</span>
                </div>
             </div>
          </div>
          <div className="flex space-x-3">
             <button 
                onClick={() => setShowPrintPreview(true)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center text-slate-700 transition"
             >
                <Printer size={16} className="mr-2" /> Print
             </button>
             {invoice.status === 'PENDING' ? (
                 <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-bold flex items-center shadow-md transition transform hover:-translate-y-0.5"
                 >
                    <CreditCard size={16} className="mr-2" /> Pay Now
                 </button>
             ) : (
                 <button disabled className="px-6 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-bold flex items-center cursor-default">
                    <CheckCircle size={16} className="mr-2" /> Paid
                 </button>
             )}
          </div>
       </div>

       {/* Screen View of Invoice */}
       <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto print:hidden">
          <InvoiceDocument />
       </div>

       {/* --- MODALS --- */}

       {/* Print Preview Modal */}
       <Modal isOpen={showPrintPreview} onClose={() => setShowPrintPreview(false)} title="Print Preview" size="xl">
           <div className="bg-slate-200 p-8 rounded overflow-y-auto max-h-[70vh] flex justify-center">
               <div className="bg-white shadow-2xl w-full max-w-3xl transform scale-95 origin-top">
                   <InvoiceDocument />
               </div>
           </div>
           <div className="flex justify-end pt-4 gap-3 border-t border-slate-100 mt-4">
               <button onClick={() => setShowPrintPreview(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
               <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                   <Printer size={16} className="mr-2" /> Print Document
               </button>
           </div>
       </Modal>

       {/* Payment Modal */}
       <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title={`Pay Invoice ${invoice.id}`}>
           <PaymentGateway 
              amount={invoice.total}
              invoiceId={invoice.id}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentModal(false)}
           />
       </Modal>
    </div>
  );
};

export default ClientInvoiceDetails;