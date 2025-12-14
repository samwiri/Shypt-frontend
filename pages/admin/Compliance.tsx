import React, { useState } from 'react';
import { AlertTriangle, FileText, Upload, Lock, ShieldCheck, FileWarning, Mail, XCircle } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';
import { DataTable, Column } from '../../components/UI/DataTable';

interface ComplianceHold {
  id: string;
  client: string;
  reason: string;
  status: 'ON_HOLD' | 'RELEASED' | 'REJECTED';
  date: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  history: string[];
}

const Compliance: React.FC = () => {
  const { showToast } = useToast();
  const [selectedHold, setSelectedHold] = useState<ComplianceHold | null>(null);
  const [modalType, setModalType] = useState<'DOC' | 'RELEASE' | 'NOTICE' | 'REJECT' | null>(null);

  const [holds, setHolds] = useState<ComplianceHold[]>([
    { 
        id: 'HWB-9932', 
        client: 'John Doe', 
        reason: 'Lithium Batteries Undeclared', 
        status: 'ON_HOLD', 
        date: '2025-03-01', 
        severity: 'HIGH',
        history: ['2025-03-01: Flagged by Warehouse Scanner'] 
    },
    { 
        id: 'HWB-9945', 
        client: 'Acme Corp', 
        reason: 'Missing Commercial Invoice', 
        status: 'ON_HOLD', 
        date: '2025-02-28', 
        severity: 'MEDIUM',
        history: ['2025-02-28: Arrived without documentation']
    },
    { 
        id: 'HWB-9988', 
        client: 'Jane Smith', 
        reason: 'Value Discrepancy (> $500)', 
        status: 'ON_HOLD', 
        date: '2025-03-02', 
        severity: 'LOW',
        history: ['2025-03-02: Declared $50, Market Value $800']
    },
  ]);

  const handleAction = (item: ComplianceHold, type: typeof modalType) => {
    setSelectedHold(item);
    setModalType(type);
  };

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHold) {
       setHolds(prev => prev.filter(h => h.id !== selectedHold.id));
       showToast(`Package ${selectedHold.id} released successfully`, 'success');
       setModalType(null);
    }
  };

  const handleReject = (e: React.FormEvent) => {
      e.preventDefault();
      if(selectedHold) {
          setHolds(prev => prev.map(h => h.id === selectedHold.id ? {...h, status: 'REJECTED'} : h));
          showToast(`Package ${selectedHold.id} rejected and flagged for return.`, 'warning');
          setModalType(null);
      }
  };

  const handleDocUpload = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Document uploaded and attached to case', 'success');
    setModalType(null);
  };

  const handleSendNotice = (e: React.FormEvent) => {
      e.preventDefault();
      showToast(`Official Compliance Notice sent to ${selectedHold?.client}`, 'info');
      setModalType(null);
  };

  // --- COLUMN DEFINITIONS ---
  const columns: Column<ComplianceHold>[] = [
    {
      header: 'HWB Number',
      accessor: (item) => <span className="font-mono font-medium text-slate-900">{item.id}</span>,
      sortKey: 'id',
      sortable: true
    },
    {
      header: 'Client',
      accessor: 'client',
      sortable: true
    },
    {
      header: 'Reason for Hold',
      accessor: (item) => (
        <div>
           <span className="font-medium text-slate-800">{item.reason}</span>
           {item.status === 'REJECTED' && <span className="text-xs text-red-600 block font-bold mt-1">REJECTED / RETURN TO SENDER</span>}
        </div>
      ),
      sortKey: 'reason',
      sortable: true
    },
    {
      header: 'Flagged Date',
      accessor: 'date',
      sortable: true
    },
    {
      header: 'Severity',
      accessor: (item) => (
        <span className={`text-xs font-bold px-2 py-1 rounded ${
            item.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
            item.severity === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {item.severity}
        </span>
      ),
      sortKey: 'severity',
      sortable: true
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (item) => (
        <div className="flex justify-end space-x-2">
            {item.status !== 'REJECTED' && (
                <>
                <button 
                    onClick={() => handleAction(item, 'NOTICE')}
                    className="p-1.5 text-slate-500 hover:text-blue-600 transition hover:bg-blue-50 rounded"
                    title="Issue Official Notice"
                >
                    <FileWarning size={18} />
                </button>
                <button 
                    onClick={() => handleAction(item, 'DOC')}
                    className="p-1.5 text-slate-500 hover:text-blue-600 transition hover:bg-blue-50 rounded"
                    title="Upload Supporting Document"
                >
                    <Upload size={18} />
                </button>
                <button 
                    onClick={() => handleAction(item, 'REJECT')}
                    className="p-1.5 text-slate-500 hover:text-red-600 transition hover:bg-red-50 rounded"
                    title="Reject Cargo"
                >
                    <XCircle size={18} />
                </button>
                <button 
                    onClick={() => handleAction(item, 'RELEASE')}
                    className="p-1.5 text-green-600 hover:text-green-800 transition font-bold text-xs border border-green-200 bg-green-50 px-2 rounded flex items-center"
                >
                    RELEASE
                </button>
                </>
            )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compliance & Customs</h2>
          <p className="text-slate-500 text-sm">Resolve holds, issue notices, and manage customs audits.</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" />
        <div className="ml-4">
          <h3 className="font-semibold text-red-900">{holds.filter(h => h.status === 'ON_HOLD').length} Packages Currently Held</h3>
          <p className="text-sm text-red-700 mt-1">
            These items are locked from consolidation or release until the issues are resolved.
          </p>
        </div>
      </div>

      <DataTable 
        data={holds}
        columns={columns}
        title="Active Compliance Cases"
        searchPlaceholder="Search Case ID, Client or Reason..."
      />

      {/* NOTICE GENERATION MODAL */}
      <Modal 
        isOpen={modalType === 'NOTICE'} 
        onClose={() => setModalType(null)} 
        title={`Issue Compliance Notice: ${selectedHold?.id}`}
      >
          <form onSubmit={handleSendNotice} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm">
                  <p><strong>To:</strong> {selectedHold?.client}</p>
                  <p><strong>Subject:</strong> URGENT: Compliance Hold on Shipment {selectedHold?.id}</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Notice Type</label>
                  <select className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                      <option>Request for Information (RFI)</option>
                      <option>Notice of Seizure Warning</option>
                      <option>Value Declaration Form</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Message to Client</label>
                  <textarea className="w-full border p-2 rounded mt-1 bg-white text-slate-900" rows={4} defaultValue={`Dear Customer,\n\nYour shipment ${selectedHold?.id} is currently on hold due to: ${selectedHold?.reason}.\n\nPlease provide the necessary documentation within 48 hours.`}></textarea>
              </div>
              <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
                      <Mail size={16} className="mr-2" /> Send Notice
                  </button>
              </div>
          </form>
      </Modal>

      {/* DOC UPLOAD MODAL */}
      <Modal 
        isOpen={modalType === 'DOC'} 
        onClose={() => setModalType(null)} 
        title={`Upload Documents: ${selectedHold?.id}`}
      >
        <form onSubmit={handleDocUpload} className="space-y-4">
           <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 bg-white">
              <Upload size={32} className="mb-2" />
              <p>Click to upload invoice, MSDS, or declaration</p>
           </div>
           <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Attach to Case</button>
           </div>
        </form>
      </Modal>

      {/* REJECT MODAL */}
      <Modal isOpen={modalType === 'REJECT'} onClose={() => setModalType(null)} title="Reject & Return Cargo">
          <form onSubmit={handleReject} className="space-y-4">
              <div className="bg-red-50 p-4 border border-red-200 rounded text-red-800 text-sm">
                  Warning: You are about to reject this cargo. This will initiate a Return to Sender (RTS) process or destruction order.
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Rejection Reason</label>
                  <select className="w-full border p-2 rounded mt-1 bg-white text-slate-900">
                      <option>Prohibited Item</option>
                      <option>Client Refused to Pay Duties</option>
                      <option>Hazardous Material (No Permit)</option>
                      <option>Damaged Beyond Repair</option>
                  </select>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirm Rejection</button>
              </div>
          </form>
      </Modal>

      {/* RELEASE MODAL (TWO-STEP VERIFICATION) */}
      <Modal 
        isOpen={modalType === 'RELEASE'} 
        onClose={() => setModalType(null)} 
        title={`Security Release: ${selectedHold?.id}`}
      >
        <form onSubmit={handleRelease} className="space-y-4">
           <div className="bg-green-50 p-4 rounded-lg flex items-start border border-green-100">
             <ShieldCheck className="text-green-600 w-10 h-10 mr-3 flex-shrink-0" />
             <div>
               <h4 className="font-bold text-green-900">Override Compliance Hold</h4>
               <p className="text-sm text-green-700 mt-1">
                 Current Issue: <strong>{selectedHold?.reason}</strong>. Ensure all documentation is verified before proceeding.
               </p>
             </div>
           </div>

           <div className="bg-slate-50 p-4 rounded border border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
               <Lock size={14} className="mr-1" /> Supervisor PIN
             </label>
             <input 
               type="password" 
               required 
               className="w-full border p-2 rounded text-center text-2xl tracking-widest bg-white text-slate-900 font-mono focus:ring-green-500 focus:border-green-500" 
               placeholder="••••" 
               maxLength={4}
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700">Reason for Release</label>
             <textarea 
               required 
               className="w-full border p-2 rounded mt-1 bg-white text-slate-900" 
               placeholder="e.g. Correct invoice provided and verified..."
               rows={3}
             ></textarea>
           </div>

           <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 border rounded text-slate-600 bg-white hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md">Authorize Release</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default Compliance;