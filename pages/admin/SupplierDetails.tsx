import React from 'react';
import { ArrowLeft, ExternalLink, Key, Lock, Eye, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SupplierDetailsProps {
  id: string;
  onBack: () => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();

  const handleCopy = () => {
      showToast('Password copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800">Amazon Business</h2>
                <a href="#" className="text-sm text-blue-600 flex items-center hover:underline">
                   https://business.amazon.com <ExternalLink size={12} className="ml-1" />
                </a>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Key size={18} className="mr-2 text-slate-500" /> Login Credentials
             </h3>
             <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                   <p className="text-xs uppercase text-slate-500 font-bold mb-1">Username / Email</p>
                   <div className="flex justify-between">
                      <span className="font-mono text-slate-800">purchasing@wofms.com</span>
                      <button className="text-slate-400 hover:text-blue-600"><Copy size={16}/></button>
                   </div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                   <p className="text-xs uppercase text-slate-500 font-bold mb-1">Password</p>
                   <div className="flex justify-between items-center">
                      <span className="font-mono text-slate-800 tracking-widest">••••••••••••</span>
                      <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600"><Copy size={16}/></button>
                   </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded border border-yellow-100 text-sm text-yellow-800">
                   <Lock size={14} className="inline mr-1"/> 2FA is enabled. Code sent to operations phone (+256...).
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">Internal Notes</h3>
             <div className="bg-slate-50 p-4 rounded text-sm text-slate-600 min-h-[150px]">
                Use the Prime account for free shipping on all orders over $25.
                Tax exemption certificate is applied automatically at checkout.
             </div>
          </div>
       </div>
    </div>
  );
};

export default SupplierDetails;