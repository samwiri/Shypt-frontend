import React, { useState } from 'react';
import { Search, Eye, Plane, Ship, Trash2, Plus, Edit, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { DataTable, Column } from '../../components/UI/DataTable';

interface OrderData {
  id: string;
  client: string;
  desc: string;
  mode: 'AIR' | 'SEA';
  weight: string;
  status: string;
  date: string;
  value?: number;
  instructions?: string;
  origin: string;
}

const Orders: React.FC = () => {
  const { showToast } = useToast();
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  
  // Bulk Action State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  // Mock Data
  const [orders, setOrders] = useState<OrderData[]>([
    { id: 'ORD-001', client: 'Acme Corp', desc: 'Electronics Components', mode: 'AIR', weight: '45kg', status: 'PENDING', date: '2025-03-01', value: 1250, instructions: 'Handle with care', origin: 'CN' },
    { id: 'ORD-002', client: 'John Doe', desc: 'Personal Effects', mode: 'SEA', weight: '120kg', status: 'RECEIVED', date: '2025-02-28', value: 300, instructions: '', origin: 'UK' },
    { id: 'ORD-003', client: 'Global Tech', desc: 'Server Racks', mode: 'AIR', weight: '250kg', status: 'PENDING', date: '2025-02-25', value: 5000, instructions: 'Urgent delivery', origin: 'US' },
    { id: 'ORD-004', client: 'Jane Smith', desc: 'Cosmetics', mode: 'AIR', weight: '5kg', status: 'CANCELLED', date: '2025-02-24', value: 120, instructions: '', origin: 'AE' },
    { id: 'ORD-005', client: 'AutoParts Inc', desc: 'Brake Pads', mode: 'SEA', weight: '800kg', status: 'PENDING', date: '2025-02-20', value: 2200, instructions: 'Palletized', origin: 'CN' },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
      showToast('Order deleted successfully', 'success');
    }
  };

  const handleEdit = (order: OrderData) => {
    setEditingOrder(order);
    setFormMode('EDIT');
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setFormMode('ADD');
    setIsFormOpen(true);
  };

  // --- BULK ACTIONS ---
  const handleBulkReceive = () => {
      setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status: 'RECEIVED' } : o));
      showToast(`${selectedIds.length} orders marked as Received`, 'success');
      setSelectedIds([]);
  };

  const handleBulkCancel = () => {
      if (confirm(`Are you sure you want to cancel ${selectedIds.length} orders?`)) {
          setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status: 'CANCELLED' } : o));
          showToast(`${selectedIds.length} orders cancelled`, 'warning');
          setSelectedIds([]);
      }
  };

  const handleBulkDelete = () => {
      if (confirm(`Permanently delete ${selectedIds.length} orders? This cannot be undone.`)) {
          setOrders(prev => prev.filter(o => !selectedIds.includes(o.id)));
          showToast(`${selectedIds.length} orders deleted`, 'success');
          setSelectedIds([]);
      }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!formData.get('client') || !formData.get('desc')) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const orderData: OrderData = {
      id: formMode === 'ADD' ? `ORD-${Math.floor(Math.random() * 1000)}` : editingOrder!.id,
      client: formData.get('client') as string,
      desc: formData.get('desc') as string,
      mode: formData.get('mode') as 'AIR' | 'SEA',
      weight: (formData.get('weight') as string) + 'kg',
      status: formData.get('status') as string || 'PENDING',
      date: formMode === 'ADD' ? new Date().toISOString().split('T')[0] : editingOrder!.date,
      value: Number(formData.get('value')),
      instructions: formData.get('instructions') as string,
      origin: formData.get('origin') as string
    };

    if (formMode === 'ADD') {
      setOrders([orderData, ...orders]);
      showToast('New Pre-Alert created successfully', 'success');
    } else {
      setOrders(prev => prev.map(o => o.id === editingOrder?.id ? orderData : o));
      showToast('Order updated successfully', 'success');
    }
    setIsFormOpen(false);
  };

  // --- COLUMN DEFINITIONS ---
  const columns: Column<OrderData>[] = [
    {
      header: 'Order ID',
      accessor: (order) => <span className="text-primary-600 font-medium hover:underline">{order.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Client',
      accessor: (order) => (
        <div>
           <div className="font-medium text-slate-900">{order.client}</div>
           <div className="text-xs text-slate-500">{order.date}</div>
        </div>
      ),
      sortKey: 'client',
      sortable: true
    },
    {
      header: 'Origin',
      accessor: 'origin',
      sortable: true,
      className: 'text-sm text-slate-600'
    },
    {
      header: 'Description',
      accessor: 'desc',
      className: 'text-sm text-slate-600'
    },
    {
      header: 'Mode',
      sortKey: 'mode',
      sortable: true,
      accessor: (order) => (
         <div className="text-center">
            {order.mode === 'AIR' ? (
              <div className="inline-flex items-center px-2 py-1 rounded bg-sky-50 text-sky-700 text-xs font-bold">
                <Plane size={12} className="mr-1" /> Air
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                <Ship size={12} className="mr-1" /> Sea
              </div>
            )}
         </div>
      ),
      className: 'text-center'
    },
    {
      header: 'Status',
      accessor: (order) => <StatusBadge status={order.status} />,
      sortKey: 'status',
      sortable: true
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (order) => (
        <div className="flex justify-end space-x-2">
            <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(order); }}
            className="text-slate-400 hover:text-blue-600 p-1"
            title="Edit Order"
            >
            <Edit size={18} />
            </button>
            <button 
            onClick={(e) => { e.stopPropagation(); triggerNav(`/admin/orders/${order.id}`); }}
            className="text-slate-400 hover:text-primary-600 p-1"
            title="View Details"
            >
            <Eye size={18} />
            </button>
            <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
            className="text-slate-400 hover:text-red-600 p-1"
            title="Delete Order"
            >
            <Trash2 size={18} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Client Pre-Alerts</h2>
          <p className="text-slate-500 text-sm">Manage incoming shipments declared by clients.</p>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-800 text-white p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2 fade-in shadow-lg">
           <div className="flex items-center">
              <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-bold mr-3">{selectedIds.length} Selected</span>
              <span className="text-sm text-slate-300">Choose an action for selected items:</span>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={handleBulkReceive}
                className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition"
              >
                 <CheckCircle size={16} className="mr-2" /> Mark Received
              </button>
              <button 
                onClick={handleBulkCancel}
                className="flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded text-sm font-medium transition"
              >
                 <AlertCircle size={16} className="mr-2" /> Cancel
              </button>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition"
              >
                 <Trash2 size={16} className="mr-2" /> Delete
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="ml-2 text-slate-400 hover:text-white"
              >
                 <XCircle size={20} />
              </button>
           </div>
        </div>
      )}

      <DataTable 
        data={orders}
        columns={columns}
        onRowClick={(order) => triggerNav(`/admin/orders/${order.id}`)}
        title="Incoming Orders"
        searchPlaceholder="Search Orders..."
        selectable={true}
        selectedRowIds={selectedIds}
        onSelectionChange={setSelectedIds}
        primaryAction={
          <button 
            onClick={handleAdd}
            className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition flex items-center shadow-sm"
          >
            <Plus size={16} className="mr-2" />
            Create Manual Order
          </button>
        }
      />

      {/* CREATE/EDIT MODAL */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={formMode === 'ADD' ? "Create New Pre-Alert" : "Edit Order"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Client Name <span className="text-red-500">*</span></label>
            <input name="client" type="text" defaultValue={editingOrder?.client} className="mt-1 w-full border border-slate-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-900" placeholder="e.g. John Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700">Origin Warehouse</label>
               <select name="origin" defaultValue={editingOrder?.origin || 'CN'} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900">
                  <option value="CN">Guangzhou (CN)</option>
                  <option value="US">New York (US)</option>
                  <option value="UK">London (UK)</option>
                  <option value="AE">Dubai (AE)</option>
               </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Freight Mode</label>
              <select name="mode" defaultValue={editingOrder?.mode || 'AIR'} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900">
                <option value="AIR">Air Freight</option>
                <option value="SEA">Sea Freight</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description <span className="text-red-500">*</span></label>
            <input name="desc" type="text" defaultValue={editingOrder?.desc} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900" placeholder="e.g. Clothes and Shoes" required />
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Est. Weight (kg)</label>
                <input name="weight" type="number" defaultValue={editingOrder?.weight ? parseFloat(editingOrder.weight) : ''} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Declared Value (USD)</label>
                <input name="value" type="number" defaultValue={editingOrder?.value} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900" placeholder="0.00" />
              </div>
           </div>
          {formMode === 'EDIT' && (
             <div>
               <label className="block text-sm font-medium text-slate-700">Status</label>
               <select name="status" defaultValue={editingOrder?.status} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900">
                  <option value="PENDING">Pending</option>
                  <option value="RECEIVED">Received</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="ARRIVED">Arrived</option>
                  <option value="CANCELLED">Cancelled</option>
               </select>
             </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Special Instructions</label>
            <textarea name="instructions" defaultValue={editingOrder?.instructions} className="mt-1 w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900" rows={3}></textarea>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 bg-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {formMode === 'ADD' ? 'Create Order' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;