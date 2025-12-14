import React, { useState } from 'react';
import { CreditCard, Plus, Search, CheckCircle, Calendar, DollarSign, ExternalLink, X, User, FileText, Eye } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';

interface Payment {
  id: string;
  client: string;
  clientId?: string;
  date: string;
  amount: number;
  method: 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CASH' | 'CHEQUE';
  reference: string;
  linkedInvoices?: string[];
  status: 'VERIFIED' | 'PENDING';
}

// Mock Data for Lookups
const MOCK_CLIENTS = [
    { id: 'CL-8821', name: 'Acme Corp' },
    { id: 'CL-8822', name: 'John Doe' },
    { id: 'CL-8823', name: 'Jane Smith' },
    { id: 'CL-8824', name: 'Global Tech' },
];

const MOCK_INVOICES = [
    { id: 'INV-2023-001', amount: 450.00, clientId: 'CL-8821' },
    { id: 'INV-2023-002', amount: 1200.00, clientId: 'CL-8823' },
    { id: 'INV-2023-003', amount: 25.00, clientId: 'CL-8822' },
];

const Payments: React.FC = () => {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  // Payment Form State
  const [selectedClient, setSelectedClient] = useState<{id: string, name: string} | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientList, setShowClientList] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [amount, setAmount] = useState('');

  // Mock Data
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'PAY-8801', client: 'Acme Corp', clientId: 'CL-8821', date: '2023-10-24', amount: 450.00, method: 'BANK_TRANSFER', reference: 'REF-992211', status: 'VERIFIED', linkedInvoices: ['INV-2023-001'] },
    { id: 'PAY-8802', client: 'John Doe', clientId: 'CL-8822', date: '2023-10-22', amount: 150.00, method: 'MOBILE_MONEY', reference: 'MM-77221', status: 'PENDING' },
    { id: 'PAY-8803', client: 'Jane Smith', clientId: 'CL-8823', date: '2023-10-21', amount: 1200.00, method: 'CASH', reference: 'RCT-0011', status: 'VERIFIED', linkedInvoices: ['INV-2023-002'] },
  ]);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPayment: Payment = {
      id: `PAY-${Math.floor(Math.random() * 10000)}`,
      client: selectedClient ? selectedClient.name : formData.get('client') as string,
      clientId: selectedClient?.id,
      date: formData.get('date') as string,
      amount: Number(amount),
      method: formData.get('method') as any,
      reference: formData.get('reference') as string,
      status: 'VERIFIED',
      linkedInvoices: selectedInvoice ? [selectedInvoice] : []
    };
    
    setPayments([newPayment, ...payments]);
    showToast('Payment Recorded Successfully', 'success');
    resetForm();
    setIsFormOpen(false);
  };

  const resetForm = () => {
    setSelectedClient(null);
    setClientSearch('');
    setSelectedInvoice('');
    setAmount('');
  };

  const handleClientSelect = (client: typeof MOCK_CLIENTS[0]) => {
      setSelectedClient(client);
      setClientSearch(client.name);
      setShowClientList(false);
  };

  const handleInvoiceSelect = (invId: string) => {
      setSelectedInvoice(invId);
      const inv = MOCK_INVOICES.find(i => i.id === invId);
      if (inv) {
          setAmount(inv.amount.toString());
          if (!selectedClient) {
             const client = MOCK_CLIENTS.find(c => c.id === inv.clientId);
             if (client) handleClientSelect(client);
          }
      }
  };

  const handleVerify = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'VERIFIED' } : p));
    showToast('Payment Verified', 'success');
  };

  const filteredClients = MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.id.toLowerCase().includes(clientSearch.toLowerCase()));
  // Filter invoices based on selected client if any
  const availableInvoices = selectedClient 
    ? MOCK_INVOICES.filter(i => i.clientId === selectedClient.id) 
    : MOCK_INVOICES;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payment Records</h2>
          <p className="text-slate-500 text-sm">Track incoming payments and reconcile with invoices.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition flex items-center shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Total Received (This Month)</p>
            <p className="text-2xl font-bold text-green-600 mt-1">$1,800.00</p>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
             <p className="text-slate-500 text-sm font-medium">Pending Verification</p>
             <p className="text-2xl font-bold text-yellow-600 mt-1">{payments.filter(p => p.status === 'PENDING').length} Payments</p>
         </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Transaction History</h3>
            <div className="relative w-64">
               <input 
                 type="text" 
                 placeholder="Search Reference or Client..." 
                 className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-900"
               />
               <Search className="absolute left-3 top-2 text-slate-400" size={14} />
            </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-3">Payment ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Method / Ref</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Linked Invoices</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => triggerNav(`/admin/payments/${pay.id}`)}>
                <td className="px-6 py-4 font-medium text-slate-900">
                    <span className="text-primary-600 hover:underline">{pay.id}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{pay.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {pay.client}
                    {pay.clientId && <div className="text-xs text-slate-400 font-normal">{pay.clientId}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-slate-600">{pay.method.replace('_', ' ')}</div>
                  <div className="text-xs text-slate-400 font-mono">{pay.reference}</div>
                </td>
                <td className="px-6 py-4 font-bold text-green-700">${pay.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-xs">
                   {pay.linkedInvoices && pay.linkedInvoices.length > 0 ? (
                      pay.linkedInvoices.map(inv => (
                         <span key={inv} className="block text-primary-600 hover:underline cursor-pointer">{inv}</span>
                      ))
                   ) : <span className="text-slate-400 italic">Unallocated</span>}
                </td>
                <td className="px-6 py-4">
                   <StatusBadge status={pay.status} />
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end space-x-2">
                       <button className="text-slate-400 hover:text-primary-600" title="View Details">
                           <Eye size={18} />
                       </button>
                       {pay.status === 'PENDING' && (
                          <button 
                             onClick={(e) => handleVerify(e, pay.id)}
                             className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                             title="Verify Payment"
                          >
                             <CheckCircle size={18} />
                          </button>
                       )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record New Payment"
      >
        <form onSubmit={handleCreate} className="space-y-4">
           {/* Client Search */}
           <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Search</label>
              <div className="flex items-center">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text"
                        value={clientSearch}
                        onChange={(e) => { setClientSearch(e.target.value); setShowClientList(true); }}
                        onFocus={() => setShowClientList(true)}
                        placeholder="Type to search client..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
                    />
                  </div>
                  {selectedClient && (
                      <button type="button" onClick={() => { setSelectedClient(null); setClientSearch(''); }} className="ml-2 text-slate-400 hover:text-red-500">
                          <X size={20} />
                      </button>
                  )}
              </div>
              
              {/* Client Suggestions Dropdown */}
              {showClientList && clientSearch && !selectedClient && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredClients.map(client => (
                          <div 
                            key={client.id}
                            onClick={() => handleClientSelect(client)}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                          >
                              <span className="text-slate-800 font-medium">{client.name}</span>
                              <span className="text-xs text-slate-400 font-mono">{client.id}</span>
                          </div>
                      ))}
                      {filteredClients.length === 0 && (
                          <div className="px-4 py-3 text-slate-500 text-sm italic">No clients found.</div>
                      )}
                  </div>
              )}
           </div>

           {/* Invoice Selection */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link to Invoice (Optional)</label>
              <select 
                  value={selectedInvoice}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
              >
                  <option value="">-- Select Pending Invoice --</option>
                  {availableInvoices.map(inv => (
                      <option key={inv.id} value={inv.id}>
                          {inv.id} - ${inv.amount.toFixed(2)} {selectedClient ? '' : `(${MOCK_CLIENTS.find(c=>c.id===inv.clientId)?.name})`}
                      </option>
                  ))}
              </select>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700">Amount (USD)</label>
                 <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                    <input 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        required 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded bg-white text-slate-900 font-bold" 
                        placeholder="0.00" 
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700">Payment Date</label>
                 <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700">Payment Method</label>
                 <select name="method" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900">
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700">Reference / Receipt #</label>
                 <input name="reference" required className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" placeholder="e.g. TX-12345" />
              </div>
           </div>

           <div className="flex justify-end pt-4 space-x-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 font-medium shadow-sm">Record Payment</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;