import React, { useState } from 'react';
import { Plane, Ship, Anchor, ArrowRight, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { DataTable, Column } from '../../components/UI/DataTable';

interface Shipment {
  id: string;
  type: 'AIR' | 'SEA';
  carrier: string;
  flight?: string;
  vessel?: string;
  voyage?: string;
  container?: string;
  seal?: string;
  origin: string;
  dest: string;
  etd: string;
  eta: string;
  status: string;
  count: number;
  weight: string;
  packages: string[];
}

const Freight: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'AIR' | 'SEA'>('AIR');
  
  // Navigation Helper
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };
  
  // CRUD States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const [allShipments, setAllShipments] = useState<Shipment[]>([
    { 
      id: 'MAWB-001', type: 'AIR', carrier: 'Emirates', flight: 'EK202', origin: 'DXB', dest: 'LHR', 
      etd: '2025-03-01', eta: '2025-03-02', status: 'IN_TRANSIT', count: 45, weight: '850kg', packages: ['HWB-001', 'HWB-002', 'HWB-003'] 
    },
    { 
      id: 'MAWB-002', type: 'AIR', carrier: 'DHL Aviation', flight: 'D044', origin: 'MIA', dest: 'JFK', 
      etd: '2025-03-03', eta: '2025-03-03', status: 'CONSOLIDATED', count: 12, weight: '120kg', packages: ['HWB-010', 'HWB-012'] 
    },
    { 
      id: 'MBL-S01', type: 'SEA', carrier: 'Maersk', vessel: 'MAERSK SEALAND', voyage: 'V-2025-A', container: 'MSKU-998122', seal: 'SL-9912',
      origin: 'SHANGHAI', dest: 'LAX', etd: '2025-02-15', eta: '2025-03-20', status: 'IN_TRANSIT', count: 1200, weight: '12,000kg', packages: ['HWB-999', 'HWB-888'] 
    },
    { 
      id: 'MBL-S02', type: 'SEA', carrier: 'MSC', vessel: 'MSC GULSUN', voyage: 'V-441-B', container: 'MSCU-55102', seal: 'SL-5510',
      origin: 'ROTTERDAM', dest: 'NYC', etd: '2025-02-20', eta: '2025-03-25', status: 'CONSOLIDATED', count: 850, weight: '9,500kg', packages: ['HWB-771'] 
    },
  ]);

  const shipments = allShipments.filter(s => s.type === activeTab);

  // Handlers
  const handleAdd = () => {
    setEditingShipment(null);
    setFormMode('ADD');
    setIsFormOpen(true);
  };

  const handleEdit = (e: React.MouseEvent, shipment: Shipment) => {
    e.stopPropagation();
    setEditingShipment(shipment);
    setFormMode('EDIT');
    setIsFormOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this shipment?')) {
      setAllShipments(prev => prev.filter(s => s.id !== id));
      showToast('Shipment record deleted successfully', 'success');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const shipmentData: any = {
      type: activeTab,
      carrier: formData.get('carrier'),
      origin: formData.get('origin'),
      dest: formData.get('dest'),
      etd: formData.get('etd'),
      eta: formData.get('eta'),
      status: formData.get('status'),
      weight: formData.get('weight') + 'kg',
      count: 0, // Mock
      packages: []
    };

    if (activeTab === 'AIR') {
      shipmentData.flight = formData.get('flight_vessel');
      shipmentData.id = formMode === 'ADD' ? `MAWB-${Math.floor(Math.random()*1000)}` : editingShipment?.id;
    } else {
      shipmentData.vessel = formData.get('flight_vessel');
      shipmentData.voyage = formData.get('voyage');
      shipmentData.container = formData.get('container');
      shipmentData.id = formMode === 'ADD' ? `MBL-${Math.floor(Math.random()*1000)}` : editingShipment?.id;
    }

    if (formMode === 'ADD') {
      setAllShipments([...allShipments, shipmentData]);
      showToast('New Master Shipment Manifest Created', 'success');
    } else {
      setAllShipments(prev => prev.map(s => s.id === editingShipment?.id ? { ...s, ...shipmentData } : s));
      showToast('Shipment details updated successfully', 'success');
    }
    setIsFormOpen(false);
  };

  // --- COLUMN DEFINITIONS ---
  const columns: Column<Shipment>[] = [
    {
      header: activeTab === 'AIR' ? 'MAWB Number' : 'MBL Number',
      accessor: (s) => (
        <div>
           <div className="font-bold text-primary-700 hover:text-primary-900 hover:underline">{s.id}</div>
           <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.type}</div>
        </div>
      ),
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Route',
      accessor: (s) => (
        <div className="flex items-center text-sm font-semibold text-slate-800">
          <span>{s.origin}</span>
          <ArrowRight size={14} className="mx-2 text-slate-400" />
          <span>{s.dest}</span>
        </div>
      ),
      sortKey: 'origin',
      sortable: true
    },
    {
      header: 'Carrier Info',
      accessor: (s) => (
        <div className="text-sm">
          <div className="font-bold text-slate-900">{s.carrier}</div>
          <div className="text-xs text-slate-600 font-medium">
            {s.type === 'AIR' ? `Flight: ${s.flight}` : `Vessel: ${s.vessel}`}
          </div>
          {s.type === 'SEA' && (
            <div className="text-xs text-slate-500 mt-0.5">Voy: {s.voyage}</div>
          )}
        </div>
      ),
      sortKey: 'carrier',
      sortable: true
    },
    {
      header: 'Schedule',
      accessor: (s) => (
        <div className="text-sm text-slate-700 w-32">
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">ETD:</span>
            <span className="font-medium">{s.etd}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500">ETA:</span>
            <span className="font-bold text-slate-900">{s.eta}</span>
          </div>
        </div>
      ),
      sortKey: 'eta',
      sortable: true
    },
    {
      header: 'Load',
      accessor: (s) => (
        <div>
           <div className="text-slate-900 font-medium">{s.count} pkgs</div>
           <div className="text-xs text-slate-500">{s.weight}</div>
        </div>
      ),
      sortKey: 'count',
      sortable: true
    },
    {
      header: 'Status',
      accessor: (s) => <StatusBadge status={s.status} />,
      sortKey: 'status',
      sortable: true
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (s) => (
        <div className="flex justify-end space-x-2">
          <button onClick={(e) => handleEdit(e, s)} className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition" title="Edit Shipment">
            <Edit size={18} />
          </button>
          <button onClick={(e) => handleDelete(e, s.id)} className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition" title="Delete Shipment">
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
          <h2 className="text-2xl font-bold text-slate-900">Freight Management</h2>
          <p className="text-slate-600 text-sm">Track and manage Master Shipments (MAWB/MBL).</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-800 font-bold text-sm">Active {activeTab === 'AIR' ? 'Flights' : 'Voyages'}</p>
                <h3 className="text-3xl font-extrabold text-blue-950 mt-2">{shipments.length}</h3>
              </div>
              <div className="bg-white p-2 rounded-lg bg-opacity-80 border border-blue-100">
                 {activeTab === 'AIR' ? <Plane className="text-blue-600" /> : <Anchor className="text-blue-600" />}
              </div>
           </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-800 font-bold text-sm">Arriving Today</p>
                <h3 className="text-3xl font-extrabold text-emerald-950 mt-2">1</h3>
              </div>
              <div className="bg-white p-2 rounded-lg bg-opacity-80 border border-emerald-100">
                 <Calendar className="text-emerald-600" />
              </div>
           </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-700 font-bold text-sm">Total Weight</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">12.5t</h3>
              </div>
              <div className="bg-white p-2 rounded-lg bg-opacity-80 border border-slate-200">
                 <Anchor className="text-slate-600" />
              </div>
           </div>
        </div>
      </div>

      {/* Data Table with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 flex px-2">
            <button
              onClick={() => setActiveTab('AIR')}
              className={`flex items-center px-6 py-3 text-sm font-bold border-b-2 transition ${
                activeTab === 'AIR' ? 'border-primary-600 text-primary-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Plane size={16} className="mr-2" /> Air Freight
            </button>
            <button
              onClick={() => setActiveTab('SEA')}
              className={`flex items-center px-6 py-3 text-sm font-bold border-b-2 transition ${
                activeTab === 'SEA' ? 'border-primary-600 text-primary-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Ship size={16} className="mr-2" /> Sea Freight
            </button>
        </div>
        
        <DataTable 
          data={shipments}
          columns={columns}
          onRowClick={(s) => triggerNav(`/admin/freight/${s.id}`)}
          title={`Active ${activeTab === 'AIR' ? 'Air' : 'Sea'} Manifests`}
          searchPlaceholder={`Search ${activeTab} Shipments...`}
          primaryAction={
            <button 
              onClick={handleAdd}
              className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition shadow-sm font-medium text-sm"
            >
              <Plus size={16} className="mr-2" />
              New Manifest
            </button>
          }
        />
      </div>

      {/* ADD/EDIT FORM MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={`${formMode === 'ADD' ? 'Create' : 'Edit'} ${activeTab === 'AIR' ? 'Air' : 'Sea'} Shipment`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700">Carrier</label>
              <input name="carrier" required defaultValue={editingShipment?.carrier} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">{activeTab === 'AIR' ? 'Flight No.' : 'Vessel Name'}</label>
              <input name="flight_vessel" required defaultValue={activeTab === 'AIR' ? editingShipment?.flight : editingShipment?.vessel} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            {activeTab === 'SEA' && (
              <div>
                <label className="block text-sm font-bold text-slate-700">Voyage No.</label>
                <input name="voyage" defaultValue={editingShipment?.voyage} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700">Origin (Code)</label>
              <input name="origin" required defaultValue={editingShipment?.origin} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. DXB" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">Destination (Code)</label>
              <input name="dest" required defaultValue={editingShipment?.dest} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. LHR" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">ETD</label>
              <input type="date" name="etd" required defaultValue={editingShipment?.etd} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">ETA</label>
              <input type="date" name="eta" required defaultValue={editingShipment?.eta} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            {activeTab === 'SEA' && (
               <div className="col-span-2">
                 <label className="block text-sm font-bold text-slate-700">Container Number</label>
                 <input name="container" defaultValue={editingShipment?.container} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
               </div>
            )}
             <div>
              <label className="block text-sm font-bold text-slate-700">Total Weight (kg)</label>
              <input name="weight" type="number" defaultValue={editingShipment ? parseFloat(editingShipment.weight) : ''} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700">Status</label>
              <select name="status" defaultValue={editingShipment?.status || 'CONSOLIDATED'} className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="CONSOLIDATED">Consolidated</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="ARRIVED">Arrived</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
             <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-700 mr-2 hover:bg-slate-100 rounded border border-slate-300 bg-white font-medium">Cancel</button>
             <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-medium">
               {formMode === 'ADD' ? 'Create Shipment' : 'Save Changes'}
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Freight;