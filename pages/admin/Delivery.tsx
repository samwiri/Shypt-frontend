import React, { useState } from 'react';
import { Map, Truck, User, Phone, CheckCircle, Navigation, Eye } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/UI/StatusBadge';

interface DeliveryTask {
  id: string;
  orderId: string;
  client: string;
  address: string;
  driver: string;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
}

const Delivery: React.FC = () => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DeliveryTask | null>(null);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [deliveries, setDeliveries] = useState<DeliveryTask[]>([
    { id: 'DEL-101', orderId: 'HWB-8821', client: 'Acme Corp', address: 'Plot 44, Kampala Rd', driver: 'Unassigned', status: 'PENDING' },
    { id: 'DEL-102', orderId: 'HWB-8823', client: 'Jane Doe', address: 'Ntinda Complex', driver: 'Mike (Boda)', status: 'DISPATCHED' },
  ]);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveries(prev => prev.map(d => d.id === selectedTask?.id ? { ...d, driver: 'Mike (Boda)', status: 'DISPATCHED' } : d));
    showToast('Driver Assigned & Dispatched', 'success');
    setModalOpen(false);
  };

  const handleComplete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: 'DELIVERED' } : d));
      showToast('Delivery Marked as Completed', 'success');
  };

  const handleDispatchClick = (e: React.MouseEvent, d: DeliveryTask) => {
      e.stopPropagation();
      setSelectedTask(d);
      setModalOpen(true);
  };

  const columns: Column<DeliveryTask>[] = [
    { header: 'Delivery ID', accessor: (d) => <span className="text-primary-600 hover:underline">{d.id}</span>, sortKey: 'id', sortable: true },
    { header: 'Order Ref', accessor: 'orderId', sortable: true },
    { header: 'Client Address', accessor: (d) => <div><div className="font-bold">{d.client}</div><div className="text-xs text-slate-500">{d.address}</div></div> },
    { header: 'Driver', accessor: 'driver' },
    { header: 'Status', accessor: (d) => <StatusBadge status={d.status} /> },
    { 
        header: 'Actions', 
        className: 'text-right',
        accessor: (d) => (
            <div className="flex justify-end gap-2">
                {d.status === 'PENDING' && (
                    <button onClick={(e) => handleDispatchClick(e, d)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Dispatch</button>
                )}
                {d.status === 'DISPATCHED' && (
                    <button onClick={(e) => handleComplete(e, d.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Complete</button>
                )}
            </div>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Last Mile Delivery</h2>
          <p className="text-slate-500 text-sm">Dispatch drivers and track local deliveries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
              <DataTable 
                 data={deliveries} 
                 columns={columns} 
                 onRowClick={(d) => triggerNav(`/admin/delivery/${d.id}`)}
                 title="Dispatch Board" 
                 searchPlaceholder="Search Deliveries..." 
              />
          </div>
          
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                      <Truck size={18} className="mr-2" /> Active Drivers
                  </h3>
                  <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                          <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3"><User size={16}/></div>
                              <div>
                                  <p className="text-sm font-medium">Mike (Boda)</p>
                                  <p className="text-xs text-green-600">Available</p>
                              </div>
                          </div>
                          <Phone size={16} className="text-slate-400" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                          <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3"><User size={16}/></div>
                              <div>
                                  <p className="text-sm font-medium">Sam (Van)</p>
                                  <p className="text-xs text-orange-600">On Delivery</p>
                              </div>
                          </div>
                          <Phone size={16} className="text-slate-400" />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Dispatch Order">
          <form onSubmit={handleAssign} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700">Assign Driver</label>
                  <select className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                      <option>Mike (Boda)</option>
                      <option>Sam (Van)</option>
                      <option>3rd Party Courier</option>
                  </select>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Confirm Dispatch</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default Delivery;