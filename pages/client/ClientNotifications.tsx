import React, { useState } from 'react';
import { Bell, Package, CreditCard, ShoppingBag, CheckCircle, Info, Filter, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Notification {
  id: number;
  type: 'ORDER' | 'FINANCE' | 'SYSTEM' | 'SHOPPING';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ClientNotifications: React.FC = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'ALL' | 'ORDER' | 'FINANCE' | 'SHOPPING'>('ALL');

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'ORDER', title: 'Package Arrived', message: 'Your shipment HWB-8832 has arrived at the Kampala Warehouse and is ready for pickup.', time: '2 hours ago', read: false },
    { id: 2, type: 'FINANCE', title: 'New Invoice', message: 'Invoice #INV-9921 for $45.00 has been generated for your recent shipment.', time: '5 hours ago', read: false },
    { id: 3, type: 'SHOPPING', title: 'Quote Ready', message: 'Admin has provided a quote for your "Gaming Monitor" request. Please review and pay.', time: '1 day ago', read: true },
    { id: 4, type: 'ORDER', title: 'Shipment Departed', message: 'HWB-8810 has departed Guangzhou (CAN) on flight CZ-330.', time: '2 days ago', read: true },
    { id: 5, type: 'SYSTEM', title: 'Account Verified', message: 'Your account ID CL-8821 is now fully verified for all warehouse addresses.', time: '1 week ago', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const filteredList = notifications.filter(n => filter === 'ALL' || n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={20} className="text-blue-600" />;
      case 'FINANCE': return <CreditCard size={20} className="text-green-600" />;
      case 'SHOPPING': return <ShoppingBag size={20} className="text-purple-600" />;
      default: return <Info size={20} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          <p className="text-slate-500 text-sm">Stay updated on your shipments and requests.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm text-primary-600 font-medium hover:underline flex items-center"
        >
          <Check size={16} className="mr-1" /> Mark all as read
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {['ALL', 'ORDER', 'FINANCE', 'SHOPPING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === f 
                ? 'bg-slate-100 text-slate-900 border-b-2 border-primary-500' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-100">
        {filteredList.length > 0 ? (
          filteredList.map((n) => (
            <div key={n.id} className={`p-4 flex items-start hover:bg-slate-50 transition ${n.read ? 'opacity-70' : 'bg-blue-50/30'}`}>
              <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${n.read ? 'bg-slate-100' : 'bg-white shadow-sm border border-slate-200'}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              </div>
              {!n.read && (
                <div className="ml-3 mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Bell size={48} className="mb-4 opacity-20" />
            <p>No notifications found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientNotifications;