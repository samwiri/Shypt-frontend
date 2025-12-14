import React, { useState } from 'react';
import { Bell, Package, AlertTriangle, CreditCard, MessageSquare, Check, Filter, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Notification {
  id: number;
  type: 'ORDER' | 'COMPLIANCE' | 'FINANCE' | 'SUPPORT' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: 'HIGH' | 'NORMAL';
}

const AdminNotifications: React.FC = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'ALL' | 'ORDER' | 'COMPLIANCE' | 'FINANCE'>('ALL');

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'COMPLIANCE', title: 'High Risk Cargo', message: 'HWB-9932 contains undeclared Lithium Batteries. Shipment held.', time: '10 mins ago', read: false, priority: 'HIGH' },
    { id: 2, type: 'FINANCE', title: 'Payment Verification', message: 'Large payment of $1,200.00 received from Acme Corp via Bank Transfer.', time: '1 hour ago', read: false, priority: 'NORMAL' },
    { id: 3, type: 'ORDER', title: 'New Pre-Alert', message: 'John Doe created a pre-alert for 45kg shipment from Guangzhou.', time: '2 hours ago', read: false, priority: 'NORMAL' },
    { id: 4, type: 'SUPPORT', title: 'New Ticket', message: 'Ticket #TCK-102 created by Alice Smith: "Wrong item received".', time: '3 hours ago', read: true, priority: 'HIGH' },
    { id: 5, type: 'ORDER', title: 'Consolidation Ready', message: '15 items at NY Warehouse ready for consolidation to MAWB.', time: '5 hours ago', read: true, priority: 'NORMAL' },
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
      case 'COMPLIANCE': return <AlertTriangle size={20} className="text-red-600" />;
      case 'SUPPORT': return <MessageSquare size={20} className="text-purple-600" />;
      default: return <Info size={20} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Notifications</h2>
          <p className="text-slate-500 text-sm">Operational alerts and system updates.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm text-primary-600 font-medium hover:underline flex items-center"
        >
          <Check size={16} className="mr-1" /> Mark all as read
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {['ALL', 'ORDER', 'COMPLIANCE', 'FINANCE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === f 
                ? 'bg-slate-100 text-slate-900 border-b-2 border-primary-500' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'All Alerts' : f.charAt(0) + f.slice(1).toLowerCase()}
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
                  <div className="flex items-center">
                      <h4 className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                      {n.priority === 'HIGH' && <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">HIGH PRIORITY</span>}
                  </div>
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

export default AdminNotifications;