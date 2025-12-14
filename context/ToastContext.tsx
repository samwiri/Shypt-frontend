import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center p-4 rounded-lg shadow-lg min-w-[300px] border-l-4 animate-slide-in
              ${toast.type === 'success' ? 'bg-white border-green-500' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-500' : ''}
              ${toast.type === 'warning' ? 'bg-white border-yellow-500' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-500' : ''}
            `}
          >
            <div className="mr-3">
              {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
              {toast.type === 'error' && <XCircle className="text-red-500" size={20} />}
              {toast.type === 'warning' && <AlertCircle className="text-yellow-500" size={20} />}
              {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
            </div>
            <p className="text-sm font-medium text-slate-800 flex-1">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};