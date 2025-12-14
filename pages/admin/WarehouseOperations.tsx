import React, { useState } from 'react';
import { Box, Layers, Globe, Plane, Calculator, Camera, CheckCircle, X, Search, ScanLine, Smartphone, Printer, FileText, ArrowRight, Navigation, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { sendStatusNotification } from '../../utils/notificationService';
import { OrderStatus, TaxStatus } from '../../types';

// Interfaces for Component State
interface HWB {
  id: string;
  weight: number;
  desc: string;
  client: string;
  value: number; // Declared Value
  status: OrderStatus;
  origin: string;
  orderRef?: string; // Link to original Order
}

interface MAWB {
  id: string;
  origin: string;
  destination: string;
  flightVessel: string;
  carrier: string; // Added carrier
  hwbs: string[]; // IDs
  status: 'OPEN' | 'CONSOLIDATED' | 'IN_TRANSIT' | 'ARRIVED' | 'DECONSOLIDATED';
  taxStatus: TaxStatus;
  totalTax?: number;
  eta?: string;
  createdDate: string;
  totalWeight: number; // Added for manifest summary
}

// Mock Pending Orders for Receipt
interface PendingOrder {
  id: string;
  client: string;
  desc: string;
  weight: number;
  origin: string;
}

const WarehouseOperations: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'RECEIPT' | 'CONSOLIDATE' | 'DECONSOLIDATE'>('RECEIPT');
  const [currentLocation, setCurrentLocation] = useState('CN'); 
  
  // Modal State
  const [isConsolidateOpen, setIsConsolidateOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Navigation Helper
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  // --- STATE WITH SAMPLE DATA ---
  
  // 0. Pending Orders (Pre-alerts from Clients)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([
    { id: 'ORD-001', client: 'Acme Corp', desc: 'Electronics Components', weight: 45, origin: 'CN' },
    { id: 'ORD-003', client: 'Global Tech', desc: 'Server Racks', weight: 250, origin: 'US' },
    { id: 'ORD-005', client: 'AutoParts Inc', desc: 'Brake Pads', weight: 800, origin: 'CN' },
  ]);

  // 1. Inventory (Pending Consolidation)
  const [inventory, setInventory] = useState<HWB[]>([
    { id: 'HWB-8821', weight: 12.5, desc: 'Laptop Batch A', client: 'Acme Corp', value: 2500, status: OrderStatus.RECEIVED, origin: 'CN' },
    { id: 'HWB-8822', weight: 4.2, desc: 'Fashion Samples', client: 'Jane Doe', value: 150, status: OrderStatus.RECEIVED, origin: 'CN' },
    { id: 'HWB-8823', weight: 55.0, desc: 'Auto Parts', client: 'Mechanic Shop Ltd', value: 1200, status: OrderStatus.RECEIVED, origin: 'CN' },
    { id: 'HWB-771', weight: 10.5, desc: 'Shoes', client: 'Alice', value: 200, status: OrderStatus.IN_TRANSIT, origin: 'CN' },
    { id: 'HWB-772', weight: 5.0, desc: 'Toys', client: 'Bob', value: 50, status: OrderStatus.IN_TRANSIT, origin: 'CN' },
    { id: 'HWB-661', weight: 8.0, desc: 'Books', client: 'Charlie', value: 80, status: OrderStatus.IN_TRANSIT, origin: 'UK' },
  ]);

  // 2. Active Manifests (MAWBs)
  const [mawbs, setMawbs] = useState<MAWB[]>([
    { 
      id: 'MAWB-CN-UG-991', 
      origin: 'CN', 
      destination: 'UG', 
      flightVessel: 'CZ-330',
      carrier: 'China Southern',
      hwbs: ['HWB-771', 'HWB-772'], 
      status: 'ARRIVED', 
      taxStatus: TaxStatus.UNASSESSED,
      eta: '2025-03-05',
      createdDate: '2025-02-28',
      totalWeight: 15.5
    },
    { 
      id: 'MAWB-UK-UG-202', 
      origin: 'UK', 
      destination: 'UG', 
      flightVessel: 'BA-063',
      carrier: 'British Airways',
      hwbs: ['HWB-661'], 
      status: 'IN_TRANSIT', 
      taxStatus: TaxStatus.UNASSESSED,
      eta: '2025-03-08',
      createdDate: '2025-03-01',
      totalWeight: 8.0
    }
  ]);

  // UI State
  const [selectedHwbs, setSelectedHwbs] = useState<string[]>([]);
  
  // Receipt Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [receiptWeight, setReceiptWeight] = useState('');
  const [receiptDesc, setReceiptDesc] = useState('');
  const [receiptValue, setReceiptValue] = useState('');
  const [receiptClient, setReceiptClient] = useState('');

  // Deconsolidation State
  const [activeDeconMawb, setActiveDeconMawb] = useState<MAWB | null>(null);
  const [calculatedTax, setCalculatedTax] = useState<{duty: number, vat: number, wht: number, infra: number, total: number} | null>(null);

  // --- HANDLERS ---

  const getLocName = (code: string) => {
      switch(code) {
          case 'US': return 'New York (JFK)';
          case 'UK': return 'London (LHR)';
          case 'AE': return 'Dubai (DXB)';
          case 'CN': return 'Guangzhou (CAN)';
          case 'UG': return 'Kampala (EBB)';
          default: return code;
      }
  };

  // 0. Order Selection Handler
  const handleOrderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);
    fillFormFromOrder(orderId);
  };

  const fillFormFromOrder = (orderId: string) => {
    if (orderId) {
      const order = pendingOrders.find(o => o.id === orderId);
      if (order) {
        setReceiptDesc(order.desc);
        setReceiptWeight(order.weight.toString());
        setReceiptClient(order.client);
      }
    } else {
      setReceiptDesc('');
      setReceiptWeight('');
      setReceiptClient('');
    }
  };

  // 0.5 Barcode Scanning Logic
  const handleScanCode = (code: string) => {
      setIsScannerOpen(false);
      const existingOrder = pendingOrders.find(o => o.id === code);
      
      if (existingOrder) {
          if (existingOrder.origin !== currentLocation) {
              showToast(`Warning: Order ${code} is expected in ${existingOrder.origin}, not ${currentLocation}`, 'warning');
          }
          setSelectedOrderId(code);
          fillFormFromOrder(code);
          showToast(`Order ${code} scanned successfully`, 'success');
      } else {
          setSelectedOrderId('');
          setReceiptDesc(`Scanned Item: ${code}`);
          setReceiptClient('Unknown - Walk In');
          setReceiptWeight('');
          showToast(`Unknown barcode ${code}. Please fill details.`, 'info');
      }
  };

  // 1. Receipt Handler
  const handleReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const newHwb: HWB = {
      id: `HWB-${Math.floor(Math.random() * 10000)}`,
      weight: Number(receiptWeight),
      desc: receiptDesc || 'General Cargo',
      client: receiptClient || 'Walk-in / Unknown', 
      value: Number(receiptValue) || 50,
      status: OrderStatus.RECEIVED,
      origin: currentLocation,
      orderRef: selectedOrderId || undefined
    };

    setInventory([...inventory, newHwb]);
    if (selectedOrderId) {
      setPendingOrders(prev => prev.filter(o => o.id !== selectedOrderId));
    }
    
    sendStatusNotification({
      recipientEmail: 'client@example.com',
      recipientPhone: '555-0101',
      orderId: newHwb.id,
      newStatus: OrderStatus.RECEIVED
    });
    
    showToast(`Package ${newHwb.id} Received & Logged`, 'success');
    setReceiptWeight('');
    setReceiptDesc('');
    setReceiptValue('');
    setReceiptClient('');
    setSelectedOrderId('');
  };

  // 2. Consolidation Logic
  const toggleHwbSelection = (id: string) => {
    setSelectedHwbs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleOpenConsolidate = () => {
     if (selectedHwbs.length === 0) {
        showToast('Please select at least one package', 'warning');
        return;
     }
     setIsConsolidateOpen(true);
  };

  const handleBulkConsolidateAction = (action: string) => {
      if (action === 'REMOVE') {
          setSelectedHwbs([]);
          showToast('Selection cleared.', 'info');
      }
  };

  const handleConsolidateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const flight = formData.get('flight') as string;
    const dest = formData.get('destination') as string;
    const carrier = formData.get('carrier') as string;

    const newMawbId = `MAWB-${currentLocation}-${dest}-${Math.floor(Date.now() / 1000).toString().slice(-4)}`;
    
    // Calculate total weight
    const selectedItems = inventory.filter(i => selectedHwbs.includes(i.id));
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

    const newMawb: MAWB = {
      id: newMawbId,
      origin: currentLocation,
      destination: dest,
      flightVessel: flight,
      carrier: carrier,
      hwbs: selectedHwbs,
      status: 'CONSOLIDATED',
      taxStatus: TaxStatus.UNASSESSED,
      eta: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      totalWeight: totalWeight
    };

    setMawbs([newMawb, ...mawbs]); 
    
    setInventory(prev => prev.map(item => 
      selectedHwbs.includes(item.id) ? { ...item, status: OrderStatus.CONSOLIDATED } : item
    ));

    showToast(`Manifest ${newMawbId} Created Successfully`, 'success');
    setSelectedHwbs([]);
    setIsConsolidateOpen(false);
    
    // Navigate to the full manifest page instead of a modal
    triggerNav(`/admin/freight/${newMawb.id}`);
  };

  // Quick Action Handler for Outbound Manifest Table
  const handleManifestAction = (action: string, manifest: MAWB) => {
      switch(action) {
          case 'VIEW':
              triggerNav(`/admin/freight/${manifest.id}`);
              break;
          case 'PRINT':
              const originalTitle = document.title;
              document.title = `Shypt_Manifest_Label_${manifest.id}`;
              showToast(`Generating Master Label for ${manifest.id}...`, 'success');
              window.print();
              document.title = originalTitle;
              break;
          case 'DEPART':
              setMawbs(prev => prev.map(m => m.id === manifest.id ? {...m, status: 'IN_TRANSIT'} : m));
              showToast(`${manifest.id} marked as In Transit`, 'success');
              break;
      }
  };

  // 3. Deconsolidation & Tax Logic
  const handleSelectMawbForDecon = (mawb: MAWB) => {
    setActiveDeconMawb(mawb);
    setCalculatedTax(null);
  };

  const calculateUraTaxes = () => {
    if (!activeDeconMawb) return;
    
    // Simulate summing up value of HWBs in this MAWB
    const totalDeclaredValue = 2500 + (Math.random() * 1000); 

    const duty = totalDeclaredValue * 0.25; 
    const vat = (totalDeclaredValue + duty) * 0.18; 
    const infra = totalDeclaredValue * 0.015; 
    const wht = totalDeclaredValue * 0.06; 
    
    const total = duty + vat + infra + wht;

    setCalculatedTax({ duty, vat, wht, infra, total });
    
    const updated = { ...activeDeconMawb, taxStatus: TaxStatus.ASSESSED, totalTax: total };
    setMawbs(prev => prev.map(m => m.id === updated.id ? updated : m));
    setActiveDeconMawb(updated);
    
    showToast('URA Tax Assessment Generated', 'info');
  };

  const handleReleaseMawb = () => {
    if (!activeDeconMawb) return;

    const releasedMawb = { ...activeDeconMawb, status: 'DECONSOLIDATED' as const, taxStatus: TaxStatus.PAID };
    setMawbs(prev => prev.map(m => m.id === releasedMawb.id ? releasedMawb : m));

    releasedMawb.hwbs.forEach(hwbId => {
      sendStatusNotification({
        recipientEmail: 'client@example.com',
        recipientPhone: '555-0101',
        orderId: hwbId,
        newStatus: OrderStatus.RELEASED
      });
    });

    showToast(`Manifest ${releasedMawb.id} Released. Taxes Paid.`, 'success');
    setActiveDeconMawb(null);
  };

  // Helpers
  const currentInventory = inventory.filter(i => i.status === OrderStatus.RECEIVED && i.origin === currentLocation);
  const currentPendingOrders = pendingOrders.filter(o => o.origin === currentLocation);
  const outboundManifests = mawbs.filter(m => m.origin === currentLocation);

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg text-white print:hidden">
        <div>
          <h2 className="text-xl font-bold">Warehouse Operations</h2>
          <p className="text-slate-400 text-xs">Managing inventory at <span className="text-primary-300 font-mono">{getLocName(currentLocation)}</span></p>
        </div>
        <div className="flex items-center space-x-3">
            <Globe size={18} className="text-slate-400" />
            <select 
                value={currentLocation} 
                onChange={(e) => {
                   setCurrentLocation(e.target.value);
                   setSelectedHwbs([]);
                   setSelectedOrderId('');
                }}
                className="bg-slate-700 border-slate-600 text-white text-sm rounded p-2 focus:ring-primary-500"
            >
                <optgroup label="Origin Warehouses">
                    <option value="CN">Guangzhou (CN)</option>
                    <option value="US">New York (US)</option>
                    <option value="UK">London (UK)</option>
                    <option value="AE">Dubai (UAE)</option>
                </optgroup>
                <optgroup label="Destination">
                    <option value="UG">Kampala (UG)</option>
                </optgroup>
            </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('RECEIPT')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'RECEIPT' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500'}`}>
             Inbound Receipt
          </button>
          <button onClick={() => setActiveTab('CONSOLIDATE')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'CONSOLIDATE' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500'}`}>
             Consolidation (Outbound)
          </button>
          <button 
             onClick={() => setActiveTab('DECONSOLIDATE')} 
             disabled={currentLocation !== 'UG'}
             className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'DECONSOLIDATE' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500'} ${currentLocation !== 'UG' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             Deconsolidation & Tax (Uganda)
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {/* --- RECEIPT FLOW --- */}
        {activeTab === 'RECEIPT' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Box className="mr-2" size={20} /> Receive New Package
                  </h3>
                  <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center px-3 py-1.5 bg-slate-800 text-white rounded hover:bg-slate-700 text-xs font-bold shadow-sm transition"
                  >
                    <Camera size={14} className="mr-1.5" /> Scan Barcode
                  </button>
              </div>
              
              <form onSubmit={handleReceipt} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded border border-blue-100 mb-4">
                  <label className="block text-sm font-bold text-blue-900 mb-2">Link to Pending Order (Pre-Alert)</label>
                  <select 
                    value={selectedOrderId} 
                    onChange={handleOrderSelect}
                    className="w-full border border-blue-200 rounded p-2 bg-white text-slate-900"
                  >
                    <option value="">-- Manual Entry / No Pre-Alert --</option>
                    {currentPendingOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.id} - {order.client} ({order.desc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Client Name</label>
                    <input required type="text" value={receiptClient} onChange={e => setReceiptClient(e.target.value)} className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2" placeholder="Client Name or ID" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <input required type="text" value={receiptDesc} onChange={e => setReceiptDesc(e.target.value)} className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2" placeholder="e.g. 5x Cartons of Shoes" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
                      <input required type="number" step="0.1" value={receiptWeight} onChange={e => setReceiptWeight(e.target.value)} className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2" placeholder="0.00" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Declared Value ($)</label>
                      <input required type="number" step="0.01" value={receiptValue} onChange={e => setReceiptValue(e.target.value)} className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2" placeholder="0.00" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 flex justify-center items-center font-medium">
                     <CheckCircle size={18} className="mr-2" /> 
                     {selectedOrderId ? 'Verify & Receive Order' : 'Generate HWB & Receive'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
               <h3 className="font-semibold text-slate-800 mb-4">Recent Receipts at {getLocName(currentLocation)}</h3>
               <div className="space-y-2">
                  {inventory.filter(i => i.status === OrderStatus.RECEIVED && i.origin === currentLocation).slice(-5).reverse().map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded bg-slate-50">
                       <div>
                          <p className="font-bold text-sm text-slate-800">{item.id}</p>
                          <p className="text-xs text-slate-500">{item.desc} • {item.weight}kg</p>
                       </div>
                       <StatusBadge status={item.status} />
                    </div>
                  ))}
                  {inventory.filter(i => i.status === OrderStatus.RECEIVED && i.origin === currentLocation).length === 0 && (
                     <p className="text-slate-400 text-sm text-center py-4">No recent receipts at this location.</p>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* --- CONSOLIDATE FLOW --- */}
        {activeTab === 'CONSOLIDATE' && (
          <div className="space-y-6">
            
            {/* Consolidation Selection Area */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Available for Consolidation</h3>
                    <p className="text-sm text-slate-500">Select HWBs to group into a Master Air Waybill.</p>
                </div>
                
                <div className="flex gap-2">
                    {/* Bulk Actions for Selection */}
                    {selectedHwbs.length > 0 && (
                        <div className="flex items-center gap-2 mr-4 bg-slate-100 px-3 py-1 rounded-lg">
                            <span className="text-xs font-bold text-slate-700">{selectedHwbs.length} Selected</span>
                            <button onClick={() => handleBulkConsolidateAction('REMOVE')} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                        </div>
                    )}
                    <button 
                        onClick={handleOpenConsolidate}
                        disabled={selectedHwbs.length === 0}
                        className="bg-primary-600 disabled:bg-slate-300 text-white py-2 px-6 rounded hover:bg-primary-700 flex items-center transition font-medium shadow-sm"
                    >
                        <Layers size={18} className="mr-2" /> Consolidate ({selectedHwbs.length})
                    </button>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="p-3 w-10">
                      <input type="checkbox" onChange={(e) => {
                          if(e.target.checked) setSelectedHwbs(currentInventory.map(i => i.id));
                          else setSelectedHwbs([]);
                      }} />
                    </th>
                    <th className="p-3">HWB ID</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Value ($)</th>
                    <th className="p-3 text-right">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInventory.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400">No pending items for consolidation at {currentLocation}</td></tr>
                  ) : currentInventory.map(item => (
                    <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 ${selectedHwbs.includes(item.id) ? 'bg-blue-50' : ''}`}>
                      <td className="p-3">
                        <input 
                          type="checkbox" 
                          checked={selectedHwbs.includes(item.id)}
                          onChange={() => toggleHwbSelection(item.id)}
                          className="text-primary-600 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="p-3 font-mono text-sm font-medium">{item.id}</td>
                      <td className="p-3 text-sm text-slate-600">{item.client}</td>
                      <td className="p-3 text-sm text-slate-600">{item.desc}</td>
                      <td className="p-3 text-sm text-right">{item.value}</td>
                      <td className="p-3 text-sm text-right">{item.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Outbound Manifests Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
               <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                  <Plane size={20} className="mr-2 text-slate-500" /> Recent Outbound Manifests (From {currentLocation})
               </h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                       <tr>
                          <th className="px-4 py-3">MAWB ID</th>
                          <th className="px-4 py-3">Dest</th>
                          <th className="px-4 py-3">Details</th>
                          <th className="px-4 py-3 text-right">Load</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {outboundManifests.length === 0 ? (
                          <tr><td colSpan={6} className="p-4 text-center text-slate-400 italic">No manifests created yet.</td></tr>
                       ) : outboundManifests.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50">
                             <td className="px-4 py-3 font-medium text-primary-600">
                                 <button onClick={() => handleManifestAction('VIEW', m)} className="hover:underline text-left">{m.id}</button>
                             </td>
                             <td className="px-4 py-3 text-sm font-bold text-slate-700">{m.destination}</td>
                             <td className="px-4 py-3 text-sm">
                                 <div className="font-medium text-slate-800">{m.carrier}</div>
                                 <div className="text-xs text-slate-500">{m.flightVessel}</div>
                             </td>
                             <td className="px-4 py-3 text-sm text-right">
                                 <div className="font-medium">{m.totalWeight.toFixed(2)} kg</div>
                                 <div className="text-xs text-slate-500">{m.hwbs.length} pcs</div>
                             </td>
                             <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                             <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                    <button 
                                        onClick={() => handleManifestAction('VIEW', m)} 
                                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded" 
                                        title="View Full Manifest"
                                    >
                                        <FileText size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleManifestAction('PRINT', m)} 
                                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded" 
                                        title="Print Master Label"
                                    >
                                        <Printer size={16} />
                                    </button>
                                    {m.status === 'CONSOLIDATED' && (
                                        <button 
                                            onClick={() => handleManifestAction('DEPART', m)} 
                                            className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded" 
                                            title="Mark Departed"
                                        >
                                            <Navigation size={16} />
                                        </button>
                                    )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* --- DECONSOLIDATION FLOW --- */}
        {activeTab === 'DECONSOLIDATE' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Manifest List */}
              <div className="lg:col-span-1 space-y-4">
                 <h3 className="font-bold text-slate-800">Incoming / Arrived Manifests</h3>
                 {mawbs.filter(m => m.destination === 'UG' && m.status !== 'DECONSOLIDATED').map(mawb => (
                    <div 
                      key={mawb.id} 
                      onClick={() => handleSelectMawbForDecon(mawb)}
                      className={`p-4 rounded border cursor-pointer transition relative ${activeDeconMawb?.id === mawb.id ? 'bg-primary-50 border-primary-500' : 'bg-white border-slate-200 hover:border-primary-300'}`}
                    >
                       <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 text-sm">{mawb.id}</p>
                          <StatusBadge status={mawb.status} />
                       </div>
                       <p className="text-xs text-slate-500 mt-2 flex items-center">
                          <Plane size={12} className="mr-1"/> {mawb.flightVessel}
                       </p>
                       <p className="text-xs text-slate-500 mt-1">{mawb.hwbs.length} Packages • ETA: {mawb.eta}</p>
                       
                       {/* Tax Indicator */}
                       <div className={`mt-2 text-xs font-bold px-2 py-1 inline-block rounded ${mawb.taxStatus === TaxStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          Tax: {mawb.taxStatus}
                       </div>
                    </div>
                 ))}
                 {mawbs.filter(m => m.destination === 'UG' && m.status !== 'DECONSOLIDATED').length === 0 && (
                    <p className="text-slate-400 text-sm">No manifests pending deconsolidation.</p>
                 )}
              </div>

              {/* Right: Tax Assessment & Release */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                 {activeDeconMawb ? (
                    <>
                       <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
                          <div>
                             <h3 className="text-xl font-bold text-slate-800">Processing: {activeDeconMawb.id}</h3>
                             <p className="text-sm text-slate-500">Manifest contains {activeDeconMawb.hwbs.length} items.</p>
                          </div>
                          {activeDeconMawb.status !== 'ARRIVED' && (
                             <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
                                Status: {activeDeconMawb.status} (Wait for Arrival)
                             </div>
                          )}
                       </div>

                       {/* Step 1: Tax Calc */}
                       <div className="mb-6">
                          <h4 className="font-bold text-slate-700 flex items-center mb-3">
                             <Calculator size={18} className="mr-2 text-slate-500" /> URA Tax Assessment
                          </h4>
                          
                          {activeDeconMawb.taxStatus === TaxStatus.UNASSESSED && (
                             <div className="bg-slate-50 p-6 rounded border border-slate-200 text-center">
                                <p className="text-slate-600 mb-4">Tax assessment has not been generated for this manifest.</p>
                                <button onClick={calculateUraTaxes} className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700 text-sm font-medium">
                                   Calculate Taxes (Simulate)
                                </button>
                             </div>
                          )}

                          {(calculatedTax || activeDeconMawb.taxStatus !== TaxStatus.UNASSESSED) && (
                             <div className="bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-2 gap-4">
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">Import Duty (25%)</p>
                                   <p className="font-medium text-slate-800">${calculatedTax?.duty.toFixed(2) || (activeDeconMawb.totalTax ? (activeDeconMawb.totalTax * 0.25).toFixed(2) : '0.00')}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">VAT (18%)</p>
                                   <p className="font-medium text-slate-800">${calculatedTax?.vat.toFixed(2) || (activeDeconMawb.totalTax ? (activeDeconMawb.totalTax * 0.18).toFixed(2) : '0.00')}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">Withholding Tax (6%)</p>
                                   <p className="font-medium text-slate-800">${calculatedTax?.wht.toFixed(2) || '0.00'}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-slate-500 uppercase">Infra. Levy (1.5%)</p>
                                   <p className="font-medium text-slate-800">${calculatedTax?.infra.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="col-span-2 border-t border-slate-200 pt-2 mt-2">
                                   <div className="flex justify-between items-center">
                                      <span className="font-bold text-slate-800">Total Payable to URA</span>
                                      <span className="text-xl font-bold text-red-600">${calculatedTax?.total.toFixed(2) || activeDeconMawb.totalTax?.toFixed(2)}</span>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>

                       {/* Step 2: Release */}
                       <div className="flex justify-end pt-4 border-t border-slate-200">
                          <button 
                             onClick={handleReleaseMawb}
                             disabled={activeDeconMawb.taxStatus === TaxStatus.PAID}
                             className={`px-6 py-2 rounded text-white font-medium flex items-center transition ${
                                activeDeconMawb.taxStatus !== TaxStatus.UNASSESSED && activeDeconMawb.taxStatus !== TaxStatus.PAID
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-slate-300 cursor-not-allowed'
                             }`}
                          >
                             <CheckCircle size={18} className="mr-2" />
                             {activeDeconMawb.taxStatus === TaxStatus.PAID ? 'Already Released' : 'Pay Taxes & Release'}
                          </button>
                       </div>
                    </>
                 ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                       <Plane size={48} className="mb-4 opacity-20" />
                       <p>Select a Manifest to process arrival and taxes.</p>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* CONSOLIDATE FORM */}
      <Modal isOpen={isConsolidateOpen} onClose={() => setIsConsolidateOpen(false)} title="Create Master Manifest">
         <form onSubmit={handleConsolidateSubmit} className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700">Origin</label>
               <input disabled value={getLocName(currentLocation)} className="w-full border border-slate-300 p-2 rounded bg-slate-100 text-slate-500" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Destination</label>
               <select name="destination" className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900">
                  <option value="UG">Kampala, Uganda (EBB)</option>
               </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Carrier (Airline/Line)</label>
                    <input name="carrier" required placeholder="e.g. Emirates" className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Flight / Vessel</label>
                    <input name="flight" required placeholder="e.g. EK-202" className="w-full border border-slate-300 p-2 rounded bg-white text-slate-900" />
                </div>
            </div>
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
               Consolidating <strong>{selectedHwbs.length}</strong> items. Total Weight: <strong>{inventory.filter(i => selectedHwbs.includes(i.id)).reduce((acc, c) => acc + c.weight, 0).toFixed(2)} kg</strong>.
            </div>
            <div className="flex justify-end pt-2">
               <button type="button" onClick={() => setIsConsolidateOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50 mr-2">Cancel</button>
               <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Generate MAWB</button>
            </div>
         </form>
      </Modal>

      {/* BARCODE SCANNER SIMULATOR MODAL */}
      <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Scan Barcode" size="md">
          <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center mb-6 border-4 border-slate-800">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                      <div className="w-48 h-32 border-2 border-white/50 rounded-lg relative">
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                      </div>
                      <p className="text-white/70 text-xs mt-4">Align code within frame</p>
                  </div>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595079676614-8b609c919d3f?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-20 filter grayscale"></div>
              </div>

              <div className="w-full space-y-4">
                  <p className="text-sm font-bold text-slate-700 text-center">Tap a code to simulate scan:</p>
                  <div className="grid grid-cols-2 gap-3">
                      {currentPendingOrders.slice(0, 4).map(order => (
                          <button 
                            key={order.id}
                            onClick={() => handleScanCode(order.id)}
                            className="p-3 border border-slate-300 rounded hover:bg-blue-50 hover:border-blue-400 transition flex flex-col items-center"
                          >
                              <ScanLine size={20} className="mb-1 text-slate-500" />
                              <span className="font-mono text-xs font-bold">{order.id}</span>
                              <span className="text-[10px] text-slate-500 truncate w-full text-center">{order.client}</span>
                          </button>
                      ))}
                      <button 
                        onClick={() => handleScanCode(`UNK-${Math.floor(Math.random()*1000)}`)}
                        className="p-3 border border-dashed border-slate-300 rounded hover:bg-slate-50 transition flex flex-col items-center text-slate-500"
                      >
                          <Smartphone size={20} className="mb-1" />
                          <span className="text-xs">Simulate Unknown</span>
                      </button>
                  </div>
                  
                  <div className="relative pt-4 border-t border-slate-100">
                      <p className="text-xs text-center text-slate-400 mb-2">Or enter manually</p>
                      <input 
                        type="text" 
                        placeholder="Type Barcode & Enter" 
                        className="w-full border border-slate-300 rounded p-2 text-center font-mono uppercase focus:ring-primary-500 bg-white text-slate-900"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                handleScanCode((e.target as HTMLInputElement).value);
                            }
                        }}
                      />
                  </div>
              </div>
          </div>
          <style>{`
            @keyframes scan {
                0% { top: 10%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 90%; opacity: 0; }
            }
          `}</style>
      </Modal>

    </div>
  );
};

export default WarehouseOperations;