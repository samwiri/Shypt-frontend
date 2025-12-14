import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  invoiceId: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, invoiceId, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<'CARD' | 'MOBILE'>('MOBILE');
  const [step, setStep] = useState<'INPUT' | 'AWAITING_PIN' | 'PROCESSING' | 'SUCCESS'>('INPUT');
  const [error, setError] = useState('');

  // Form States
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (method === 'MOBILE' && phone.length < 9) {
        setError('Please enter a valid phone number.');
        return;
    }
    if (method === 'CARD' && cardNumber.length < 12) {
        setError('Please enter a valid card number.');
        return;
    }

    setStep('PROCESSING');

    if (method === 'MOBILE') {
        // Simulate Network Request
        setTimeout(() => {
            setStep('AWAITING_PIN');
            
            // Simulate the user approving on their real phone after 5 seconds
            setTimeout(() => {
                setStep('SUCCESS');
            }, 5000);
        }, 1500);
    } else {
        // Card Payment Simulation
        setTimeout(() => {
            setStep('SUCCESS');
        }, 2500);
    }
  };

  const finalize = () => {
      const txId = `TX-${Math.floor(Math.random() * 1000000)}`;
      onSuccess(txId);
  };

  if (step === 'SUCCESS') {
      return (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
              <p className="text-slate-500 mt-2">Invoice {invoiceId} has been cleared.</p>
              <div className="bg-slate-50 border border-slate-200 rounded p-4 mt-6 mx-auto max-w-xs">
                  <div className="flex justify-between mb-2">
                    <p className="text-xs text-slate-500 uppercase">Amount Paid</p>
                    <p className="text-lg font-bold text-slate-900">${amount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-slate-500 uppercase">Transaction Ref</p>
                    <p className="font-mono text-sm text-slate-700">TX-{Math.floor(Math.random() * 1000000)}</p>
                  </div>
              </div>
              <button 
                onClick={finalize}
                className="mt-8 bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition w-full"
              >
                  Close & View Receipt
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="bg-slate-50 -mx-6 -mt-6 p-6 border-b border-slate-200 mb-6 flex justify-between items-center">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total to Pay</p>
                <p className="text-2xl font-bold text-slate-900">${amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400">Secure Checkout</p>
                <div className="flex items-center justify-end text-green-600 mt-1">
                    <Lock size={12} className="mr-1" />
                    <span className="text-[10px] font-bold uppercase">Encrypted</span>
                </div>
            </div>
        </div>

        {/* AWAITING PIN STATE */}
        {step === 'AWAITING_PIN' && (
            <div className="text-center py-8 animate-in fade-in">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-100 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200"></div>
                    
                    <div className="absolute inset-2 bg-yellow-50 rounded-full flex items-center justify-center">
                        <Smartphone className="text-yellow-600" size={32} />
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800">Check your phone</h3>
                <p className="text-slate-600 mt-3 px-4 leading-relaxed">
                    We have sent a payment request to <br/>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{phone}</span>
                </p>
                
                <div className="my-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start text-left">
                    <Loader2 size={20} className="animate-spin mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Waiting for approval...</p>
                        <p className="text-xs mt-1 opacity-80">Please enter your PIN on the mobile prompt to complete the transaction.</p>
                    </div>
                </div>

                <p className="text-xs text-slate-400">
                    Did not receive a prompt? Dial *165# to check pending approvals.
                </p>
            </div>
        )}

        {/* INPUT FORM (Initial State) */}
        {step === 'INPUT' && (
            <form onSubmit={handlePay}>
                {/* Method Toggle */}
                <div className="flex gap-4 mb-6">
                    <button 
                        type="button"
                        onClick={() => setMethod('MOBILE')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${method === 'MOBILE' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                        <Smartphone size={24} className="mb-2" />
                        <span className="text-sm font-bold">Mobile Money</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setMethod('CARD')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${method === 'CARD' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                        <CreditCard size={24} className="mb-2" />
                        <span className="text-sm font-bold">Card</span>
                    </button>
                </div>

                {method === 'MOBILE' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Network</label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setNetwork('MTN')} className={`flex-1 py-2 rounded border ${network === 'MTN' ? 'bg-yellow-100 border-yellow-400 text-yellow-900 font-bold' : 'border-slate-300 text-slate-600'}`}>MTN MoMo</button>
                                <button type="button" onClick={() => setNetwork('AIRTEL')} className={`flex-1 py-2 rounded border ${network === 'AIRTEL' ? 'bg-red-100 border-red-400 text-red-900 font-bold' : 'border-slate-300 text-slate-600'}`}>Airtel Money</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500 font-medium">+256</span>
                                <input 
                                    type="tel" 
                                    placeholder="772 123 456"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-14 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none bg-white text-slate-900"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">You will receive a prompt on your phone to approve.</p>
                        </div>
                    </div>
                )}

                {method === 'CARD' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                            <div className="relative">
                                <CreditCard size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none font-mono bg-white text-slate-900"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-center bg-white text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-center bg-white text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded flex items-center animate-in fade-in">
                        <AlertCircle size={16} className="mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                    Pay ${amount.toFixed(2)}
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="w-full mt-3 text-slate-500 text-sm font-medium hover:text-slate-800 disabled:opacity-50"
                >
                    Cancel Transaction
                </button>
            </form>
        )}

        {/* PROCESSING LOADER (Card or Pre-Auth Mobile) */}
        {step === 'PROCESSING' && (
            <div className="text-center py-12">
                <Loader2 size={48} className="animate-spin text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Processing Request</h3>
                <p className="text-slate-500 mt-2">Connecting to secure gateway...</p>
            </div>
        )}
    </div>
  );
};

export default PaymentGateway;