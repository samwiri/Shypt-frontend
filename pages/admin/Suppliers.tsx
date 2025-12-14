import React, { useState } from 'react';
import { ShoppingBag, Lock, Plus, ExternalLink, Trash2, Key, Edit, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/UI/Modal';
import { DataTable, Column } from '../../components/UI/DataTable';

interface Supplier {
  id: number;
  name: string;
  url: string;
  category: string;
  taxExempt: boolean;
  notes: string;
}

const Suppliers: React.FC = () => {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Amazon Business', url: 'https://business.amazon.com', category: 'General', taxExempt: true, notes: 'Use Prime account for free shipping.' },
    { id: 2, name: 'Apple Store US', url: 'https://apple.com', category: 'Electronics', taxExempt: false, notes: 'Limit 2 iPhones per order.' },
    { id: 3, name: 'Shein', url: 'https://shein.com', category: 'Fashion', taxExempt: false, notes: 'Standard shipping takes 7 days.' },
  ]);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSuppliers([...suppliers, {
        id: Date.now(),
        name: fd.get('name') as string,
        url: fd.get('url') as string,
        category: fd.get('category') as string,
        taxExempt: fd.get('tax') === 'on',
        notes: fd.get('notes') as string
    }]);
    showToast('Supplier added successfully', 'success');
    setIsFormOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if(confirm('Remove this supplier?')) {
          setSuppliers(prev => prev.filter(s => s.id !== id));
          showToast('Supplier removed', 'info');
      }
  };

  const columns: Column<Supplier>[] = [
    {
      header: 'ID',
      accessor: (s) => <span className="font-mono text-primary-600 hover:underline">{s.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Vendor Name',
      accessor: (s) => (
        <div className="font-bold text-slate-800 flex items-center">
           {s.name}
           {s.taxExempt && <span className="ml-2 bg-green-100 text-green-800 text-[10px] px-2 rounded-full">Tax Exempt</span>}
        </div>
      ),
      sortKey: 'name',
      sortable: true
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true
    },
    {
      header: 'URL',
      accessor: (s) => <a href={s.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 hover:underline flex items-center">{s.url} <ExternalLink size={10} className="ml-1"/></a>
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (s) => (
        <div className="flex justify-end space-x-2">
           <button onClick={() => triggerNav(`/admin/suppliers/${s.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600"><Eye size={16}/></button>
           <button onClick={(e) => handleDelete(e, s.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Supplier Management</h2>
          <p className="text-slate-500 text-sm">Manage shopping accounts and vendor details.</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 flex items-center shadow-sm text-sm font-medium">
           <Plus size={16} className="mr-2" /> Add Supplier
        </button>
      </div>

      <DataTable 
         data={suppliers}
         columns={columns}
         onRowClick={(s) => triggerNav(`/admin/suppliers/${s.id}`)}
         title="Vendor List"
         searchPlaceholder="Search suppliers..."
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Supplier">
         <form onSubmit={handleAdd} className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700">Vendor Name</label>
               <input name="name" required className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Website URL</label>
               <input name="url" required className="w-full border p-2 rounded mt-1 bg-white text-slate-900" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Category</label>
               <select name="category" className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                  <option>General</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Automotive</option>
               </select>
            </div>
            <div className="flex items-center">
               <input type="checkbox" name="tax" className="h-4 w-4 text-primary-600 rounded" />
               <label className="ml-2 text-sm text-slate-700">Tax Exempt Account Available</label>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Internal Notes</label>
               <textarea name="notes" className="w-full border p-2 rounded mt-1 bg-white text-slate-900" rows={3}></textarea>
            </div>
            <div className="flex justify-end pt-4">
               <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Save Supplier</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Suppliers;