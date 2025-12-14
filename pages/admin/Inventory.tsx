import React, { useState } from 'react';
import { Package, Grid, AlertTriangle, Printer, Search, Box, Tag, Camera, Barcode, X, Copy, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/UI/StatusBadge';

interface InventoryItem {
  id: string;
  desc: string;
  client: string;
  weight: number;
  location: string; // Bin/Rack ID
  status: 'RECEIVED' | 'STORED' | 'DAMAGED' | 'CONSOLIDATED';
  warehouse: string;
}

const Inventory: React.FC = () => {
  const { showToast } = useToast();
  const [modalType, setModalType] = useState<'BIN' | 'DAMAGE' | 'LABEL' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [labelCopies, setLabelCopies] = useState(1);
  
  // Bulk Action State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  // Mock Data
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 'HWB-8821', desc: 'Laptop Batch A', client: 'Acme Corp', weight: 12.5, location: 'ROW-A-01', status: 'STORED', warehouse: 'CN' },
    { id: 'HWB-8822', desc: 'Fashion Samples', client: 'Jane Doe', weight: 4.2, location: 'UNASSIGNED', status: 'RECEIVED', warehouse: 'CN' },
    { id: 'HWB-9901', desc: 'Glass Vase', client: 'Art House', weight: 2.1, location: 'UNASSIGNED', status: 'DAMAGED', warehouse: 'US' },
    { id: 'HWB-9932', desc: 'Car Bumper', client: 'Mechanic Ltd', weight: 15.0, location: 'BULK-AREA-B', status: 'STORED', warehouse: 'UK' },
    { id: 'HWB-9944', desc: 'Textile Rolls', client: 'Fabrics Co', weight: 150.0, location: 'ROW-C-05', status: 'STORED', warehouse: 'CN' },
  ]);

  const handleOpenBin = (e: React.MouseEvent, item: InventoryItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    setModalType('BIN');
  };

  const handleOpenDamage = (e: React.MouseEvent, item: InventoryItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    setModalType('DAMAGE');
  };

  const handlePrintLabel = (e: React.MouseEvent, item: InventoryItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    setLabelCopies(1);
    setModalType('LABEL');
  };

  const handleSaveBin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newBin = fd.get('bin') as string;
    
    setItems(prev => prev.map(i => i.id === selectedItem?.id ? { ...i, location: newBin, status: 'STORED' } : i));
    showToast(`Item moved to ${newBin}`, 'success');
    setModalType(null);
  };

  const handleReportDamage = (e: React.FormEvent) => {
    e.preventDefault();
    setItems(prev => prev.map(i => i.id === selectedItem?.id ? { ...i, status: 'DAMAGED' } : i));
    showToast('Damage Report Filed & Client Notified', 'warning');
    setModalType(null);
  };

  // --- BULK ACTIONS ---
  const handleBulkPrint = () => {
      showToast(`Sent ${selectedIds.length} labels to thermal printer queue`, 'success');
      // Logic to actually generate print job
      setSelectedIds([]);
  };

  const handleBulkDelete = () => {
      if(confirm(`Are you sure you want to delete ${selectedIds.length} items from inventory?`)) {
          setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
          showToast(`${selectedIds.length} items removed`, 'warning');
          setSelectedIds([]);
      }
  };

  const handleBulkMove = () => {
      // For prototype simplicity, we just set them to a bulk location
      setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, location: 'BULK-STAGING' } : i));
      showToast(`${selectedIds.length} items moved to Bulk Staging`, 'success');
      setSelectedIds([]);
  };

  // --- Real Deterministic Barcode Generator ---
  const BarcodeGenerator = ({ value, height = 60 }: { value: string, height?: number }) => {
    if (!value) return null;
    const getBarPattern = (char: string) => {
        const code = char.charCodeAt(0);
        let binary = (code * 12345).toString(2).slice(0, 9);
        if(binary.length < 9) binary = binary.padStart(9, '1');
        return binary;
    };
    const sentinel = "1011001"; 
    let pattern = sentinel;
    for (let i = 0; i < value.length; i++) pattern += getBarPattern(value[i]) + "0";
    pattern += sentinel;

    return (
      <div className="flex flex-col items-center w-full">
        <svg height={height} width="100%" viewBox={`0 0 ${pattern.length * 2} ${height}`} preserveAspectRatio="none">
            {pattern.split('').map((bit, i) => (
                bit === '1' && <rect key={i} x={i * 2} y={0} width={2} height={height} fill="black" />
            ))}
        </svg>
        <div className="font-mono font-bold tracking-[0.3em] text-sm mt-1 uppercase">{value}</div>
      </div>
    );
  };

  const columns: Column<InventoryItem>[] = [
    {
      header: 'HWB ID',
      accessor: (item) => <span className="font-mono font-medium text-primary-700 hover:underline">{item.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Description',
      accessor: (item) => (
        <div>
           <div className="text-sm font-medium text-slate-900">{item.desc}</div>
           <div className="text-xs text-slate-500">{item.client}</div>
        </div>
      ),
      sortKey: 'desc',
      sortable: true
    },
    {
      header: 'Warehouse',
      accessor: 'warehouse',
      sortable: true,
      className: 'text-center'
    },
    {
      header: 'Bin / Rack',
      accessor: (item) => (
         <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${item.location === 'UNASSIGNED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {item.location}
         </span>
      ),
      sortKey: 'location',
      sortable: true
    },
    {
      header: 'Status',
      accessor: (item) => <StatusBadge status={item.status} />,
      sortKey: 'status',
      sortable: true
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (item) => (
        <div className="flex justify-end space-x-2">
           <button onClick={(e) => handleOpenBin(e, item)} className="p-1.5 text-slate-500 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50" title="Assign Location">
              <Grid size={16} />
           </button>
           <button onClick={(e) => handlePrintLabel(e, item)} className="p-1.5 text-slate-500 hover:text-slate-800 rounded bg-slate-50 hover:bg-slate-200" title="Print Barcode">
              <Printer size={16} />
           </button>
           <button onClick={(e) => handleOpenDamage(e, item)} className="p-1.5 text-slate-500 hover:text-red-600 rounded bg-slate-50 hover:bg-red-50" title="Report Damage">
              <AlertTriangle size={16} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Control</h2>
          <p className="text-slate-500 text-sm">Manage rack locations, barcodes, and cargo conditions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium flex items-center"><Box size={16} className="mr-2"/> Unassigned Items</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{items.filter(i => i.location === 'UNASSIGNED').length}</p>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium flex items-center"><AlertTriangle size={16} className="mr-2"/> Damaged Items</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{items.filter(i => i.status === 'DAMAGED').length}</p>
         </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 fade-in">
           <div className="flex items-center">
              <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-xs font-bold mr-3">{selectedIds.length} Selected</span>
              <span className="text-sm font-medium">Bulk Actions:</span>
           </div>
           <div className="flex space-x-2">
              <button onClick={handleBulkPrint} className="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition">
                 <Printer size={14} className="mr-2" /> Print Labels
              </button>
              <button onClick={handleBulkMove} className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition">
                 <Grid size={14} className="mr-2" /> Move to Bulk
              </button>
              <button onClick={handleBulkDelete} className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm transition">
                 <Trash2 size={14} className="mr-2" /> Delete
              </button>
              <button onClick={() => setSelectedIds([])} className="ml-2 text-slate-400 hover:text-white">
                 <X size={18} />
              </button>
           </div>
        </div>
      )}

      <DataTable 
        data={items}
        columns={columns}
        onRowClick={(item) => triggerNav(`/admin/inventory/${item.id}`)}
        title="Floor Inventory"
        searchPlaceholder="Search ID, Client or Location..."
        selectable={true}
        selectedRowIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* BIN ASSIGNMENT MODAL */}
      <Modal isOpen={modalType === 'BIN'} onClose={() => setModalType(null)} title={`Assign Location: ${selectedItem?.id}`}>
         <form onSubmit={handleSaveBin} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-4">
               <p className="text-sm font-bold">{selectedItem?.desc}</p>
               <p className="text-xs text-slate-500">Current: {selectedItem?.location}</p>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Select Rack / Bin</label>
               <select name="bin" className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                  <option value="ROW-A-01">Row A - Shelf 01</option>
                  <option value="ROW-A-02">Row A - Shelf 02</option>
                  <option value="ROW-B-01">Row B - Shelf 01 (Fragile)</option>
                  <option value="BULK-AREA">Bulk Storage Area</option>
               </select>
            </div>
            <div className="flex justify-end pt-4">
               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Location</button>
            </div>
         </form>
      </Modal>

      {/* DAMAGE REPORT MODAL */}
      <Modal isOpen={modalType === 'DAMAGE'} onClose={() => setModalType(null)} title={`Report Damage: ${selectedItem?.id}`}>
         <form onSubmit={handleReportDamage} className="space-y-4">
            <div className="bg-red-50 p-4 rounded border border-red-100 text-red-800 text-sm">
               Reporting damage will trigger an insurance workflow and notify the client immediately.
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Damage Description</label>
               <textarea required className="w-full border p-2 rounded mt-1 bg-white text-slate-900" rows={3} placeholder="e.g. Wet carton, crushed corner..."></textarea>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Evidence Photos</label>
               <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer mt-1">
                  <Camera size={24} className="mb-2" />
                  <span className="text-xs">Click to upload photos</span>
               </div>
            </div>
            <div className="flex justify-end pt-4">
               <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Submit Report</button>
            </div>
         </form>
      </Modal>

      {/* INVENTORY LABEL MODAL */}
      <Modal isOpen={modalType === 'LABEL'} onClose={() => setModalType(null)} title="Print Inventory Label" size="sm">
          {selectedItem && (
              <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                      <div className="flex items-center bg-slate-100 rounded p-1">
                          <button onClick={() => setLabelCopies(Math.max(1, labelCopies - 1))} className="px-3 py-1 hover:bg-white rounded font-bold text-slate-600">-</button>
                          <span className="px-4 font-mono text-sm font-bold">{labelCopies} Copy</span>
                          <button onClick={() => setLabelCopies(labelCopies + 1)} className="px-3 py-1 hover:bg-white rounded font-bold text-slate-600">+</button>
                      </div>
                  </div>

                  {/* Thermal Label Preview */}
                  <div className="border-4 border-slate-800 bg-white p-4 mx-auto w-[300px] h-[450px] flex flex-col justify-between shadow-xl relative print:shadow-none print:border-2 print:border-black">
                      {/* Label Header */}
                      <div className="text-center border-b-2 border-black pb-2">
                          <h2 className="font-black text-2xl uppercase tracking-tighter">SHYPT LOGISTICS</h2>
                          <p className="text-xs font-bold uppercase">Origin: {selectedItem.warehouse === 'CN' ? 'GUANGZHOU, CN' : selectedItem.warehouse === 'US' ? 'NEW YORK, USA' : 'LONDON, UK'}</p>
                      </div>

                      {/* Barcode Section */}
                      <div className="flex flex-col items-center justify-center py-2 flex-1">
                          <BarcodeGenerator value={selectedItem.id} height={80} />
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 border-y-2 border-black">
                          <div className="border-r-2 border-black p-2">
                              <p className="text-[10px] uppercase font-bold">Weight (KG)</p>
                              <p className="text-2xl font-black">{selectedItem.weight.toFixed(2)}</p>
                          </div>
                          <div className="p-2">
                              <p className="text-[10px] uppercase font-bold">Date</p>
                              <p className="text-lg font-bold leading-tight">{new Date().toLocaleDateString()}</p>
                          </div>
                      </div>

                      {/* Location Big */}
                      <div className="text-center bg-black text-white p-2">
                          <p className="text-[10px] uppercase font-bold text-slate-300">Bin Location</p>
                          <p className="text-4xl font-black">{selectedItem.location}</p>
                      </div>

                      {/* Client Info */}
                      <div className="p-2">
                          <p className="text-[10px] uppercase font-bold">Client / Consignee</p>
                          <p className="font-bold text-lg leading-none truncate">{selectedItem.client}</p>
                          <p className="text-xs mt-1 truncate">{selectedItem.desc}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-end text-[10px] font-bold">
                          <div>
                              <p>ORG: {selectedItem.warehouse}</p>
                              <p>DST: EBB</p>
                          </div>
                          <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                              QR
                          </div>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-3 pt-4 border-t">
                      <button onClick={() => setModalType(null)} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50">Close</button>
                      <button 
                        onClick={() => {
                            const originalTitle = document.title;
                            document.title = `Shypt_Label_${selectedItem.id}`;
                            showToast(`Sent ${labelCopies} label(s) to thermal printer`, 'success');
                            window.print();
                            document.title = originalTitle;
                        }} 
                        className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center shadow-lg"
                      >
                          <Printer size={16} className="mr-2" /> Print {labelCopies > 1 ? `(${labelCopies})` : ''}
                      </button>
                  </div>
              </div>
          )}
      </Modal>

    </div>
  );
};

export default Inventory;