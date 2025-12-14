import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, FileText, Briefcase, CreditCard, DollarSign, Download, Printer } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import { LedgerEntry, TransactionType } from '../../types';
import { Watermark, SecureHeader, SecurityFooter } from '../../components/UI/SecurityFeatures';

interface UserDetailsProps {
  userId: string;
  onBack: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'LEDGER'>('PROFILE');

  const handlePrintStatement = () => {
      const originalTitle = document.title;
      document.title = `Shypt_Statement_${user.id}`;
      window.print();
      document.title = originalTitle;
  };

  // Mock User Data
  const user = {
    id: userId,
    name: 'John Doe',
    company: 'Doe Imports Ltd.',
    tin: '100-221-551',
    email: 'john@example.com',
    phone: '+256 772 123456',
    address: 'Plot 44, Kampala Road',
    city: 'Kampala',
    country: 'Uganda',
    balance: -450.00, // Negative means they owe money
    status: 'ACTIVE',
  };

  // Mock Ledger Data
  const ledger: LedgerEntry[] = [
    { id: 'TX-1004', date: '2025-03-05', description: 'Freight Invoice #INV-2025-001', referenceId: 'INV-2025-001', type: TransactionType.INVOICE, amount: 450.00, runningBalance: -450.00 },
    { id: 'TX-1003', date: '2025-03-01', description: 'Payment Received - Bank Transfer', referenceId: 'PAY-8812', type: TransactionType.PAYMENT, amount: -1200.00, runningBalance: 0.00 },
    { id: 'TX-1002', date: '2025-02-18', description: 'Assisted Shopping Invoice #INV-2025-002', referenceId: 'INV-2025-002', type: TransactionType.INVOICE, amount: 1200.00, runningBalance: 1200.00 },
    { id: 'TX-1001', date: '2025-01-01', description: 'Opening Balance', referenceId: '', type: TransactionType.ADJUSTMENT, amount: 0.00, runningBalance: 0.00 },
  ];

  return (
    <div className="space-y-6">
      {/* Screen Header - Hidden on Print */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
           <p className="text-slate-500 text-xs flex items-center">
             <span className="font-mono bg-slate-100 px-1 rounded mr-2">{user.id}</span> 
             {user.city}, {user.country}
           </p>
        </div>
        <div className="flex-1"></div>
        <div className="text-right mr-4">
           <p className="text-xs text-slate-500 uppercase">Wallet Balance</p>
           <p className={`text-xl font-bold ${user.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
             {user.balance < 0 ? `-$${Math.abs(user.balance).toFixed(2)}` : `$${user.balance.toFixed(2)}`}
           </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Tabs - Hidden on Print */}
      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'PROFILE' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Client Profile
          </button>
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'LEDGER' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Financial Ledger
          </button>
        </nav>
      </div>

      {/* PROFILE TAB */}
      <div className={`${activeTab === 'PROFILE' ? 'block' : 'hidden'} print:hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                    <label className="block text-slate-500 text-xs uppercase">Email</label>
                    <div className="flex items-center mt-1 text-slate-800"><Mail size={14} className="mr-2"/> {user.email}</div>
                 </div>
                 <div>
                    <label className="block text-slate-500 text-xs uppercase">Phone</label>
                    <div className="flex items-center mt-1 text-slate-800"><Phone size={14} className="mr-2"/> {user.phone}</div>
                 </div>
                 <div className="col-span-2">
                    <label className="block text-slate-500 text-xs uppercase">Address</label>
                    <div className="flex items-center mt-1 text-slate-800"><MapPin size={14} className="mr-2"/> {user.address}</div>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Business Info</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                    <label className="block text-slate-500 text-xs uppercase">Company</label>
                    <div className="flex items-center mt-1 text-slate-800"><Briefcase size={14} className="mr-2"/> {user.company}</div>
                 </div>
                 <div>
                    <label className="block text-slate-500 text-xs uppercase">TIN Number</label>
                    <div className="flex items-center mt-1 text-slate-800"><FileText size={14} className="mr-2"/> {user.tin}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* LEDGER TAB & PRINT VIEW */}
      <div className={`${activeTab === 'LEDGER' ? 'block' : 'hidden'} print:block print:w-full`}>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
           
           {/* Screen Actions */}
           <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
              <h3 className="font-bold text-slate-800 flex items-center">
                 <DollarSign size={18} className="mr-2 text-slate-500" /> Transaction History
              </h3>
              <button onClick={handlePrintStatement} className="text-xs flex items-center bg-white border border-slate-300 px-3 py-1.5 rounded text-slate-600 hover:bg-slate-50">
                 <Printer size={14} className="mr-1" /> Print Statement
              </button>
           </div>

           {/* Print Header */}
           <div className="hidden print:block p-8 pb-0">
              <Watermark text="STATEMENT" />
              <SecureHeader title="Statement of Account" />
              <div className="flex justify-between mb-8 text-sm">
                 <div>
                    <p className="font-bold uppercase text-slate-500">Client Details</p>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p>{user.company}</p>
                    <p>{user.address}</p>
                    <p className="mt-1">TIN: {user.tin}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-bold uppercase text-slate-500">Statement Period</p>
                    <p>Jan 01, 2025 - Mar 05, 2025</p>
                    <p className="mt-2 font-bold uppercase text-slate-500">Account ID</p>
                    <p className="font-mono">{user.id}</p>
                 </div>
              </div>
           </div>
           
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-500 font-medium border-b border-slate-200 print:bg-transparent print:border-slate-800">
                 <tr>
                    <th className="px-6 py-3 print:px-2">Date</th>
                    <th className="px-6 py-3 print:px-2">Ref</th>
                    <th className="px-6 py-3 print:px-2">Description</th>
                    <th className="px-6 py-3 text-right print:px-2">Debit (+)</th>
                    <th className="px-6 py-3 text-right print:px-2">Credit (-)</th>
                    <th className="px-6 py-3 text-right print:px-2">Balance</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                 {ledger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                       <td className="px-6 py-4 text-slate-600 print:px-2">{entry.date}</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-500 print:px-2">{entry.referenceId || '-'}</td>
                       <td className="px-6 py-4 print:px-2">
                          <p className="text-slate-900 font-medium">{entry.description}</p>
                       </td>
                       <td className="px-6 py-4 text-right text-slate-800 print:px-2">
                          {entry.amount > 0 ? `$${entry.amount.toFixed(2)}` : '-'}
                       </td>
                       <td className="px-6 py-4 text-right text-slate-800 print:px-2">
                          {entry.amount < 0 ? `$${Math.abs(entry.amount).toFixed(2)}` : '-'}
                       </td>
                       <td className={`px-6 py-4 text-right font-bold print:px-2 ${entry.runningBalance < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                          {entry.runningBalance < 0 ? `-$${Math.abs(entry.runningBalance).toFixed(2)}` : `$${entry.runningBalance.toFixed(2)}`}
                       </td>
                    </tr>
                 ))}
                 {ledger.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No transactions found for this client.</td>
                    </tr>
                 )}
              </tbody>
           </table>

           <div className="hidden print:block p-8 pt-4">
              <div className="flex justify-end mt-4 border-t border-slate-800 pt-4">
                 <div className="w-1/3">
                    <div className="flex justify-between font-bold text-lg">
                       <span>Closing Balance</span>
                       <span className={user.balance < 0 ? 'text-red-600' : 'text-black'}>
                          {user.balance < 0 ? `-$${Math.abs(user.balance).toFixed(2)}` : `$${user.balance.toFixed(2)}`}
                       </span>
                    </div>
                 </div>
              </div>
              <SecurityFooter type="CONFIDENTIAL" reference={`STMT-${user.id}-${new Date().getMonth()}`} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;