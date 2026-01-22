import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { DataTable, Column } from "../../../components/UI/DataTable";
import { WarehouseRack } from "../../../api/types/warehouse";

interface LocationsTabProps {
  isLoadingRacks: boolean;
  racks: WarehouseRack[];
  rackColumns: Column<WarehouseRack>[];
  stats: {
    total: number;
    highOccupancy: number;
    pendingAudit: number;
    freeSpace: number;
  };
  setModalType: (type: string | null) => void;
}

const LocationsTab: React.FC<LocationsTabProps> = ({
  isLoadingRacks,
  racks,
  rackColumns,
  stats,
  setModalType,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800">
            Inventory Map & Racks
          </h3>
          <p className="text-sm text-slate-500">
            Define floor zones, rack IDs, and bin ranges across all hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Total Racks
          </p>
          <p className="text-2xl font-black text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
            High Occupancy
          </p>
          <p className="text-2xl font-black text-red-900">
            {stats.highOccupancy}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
            Pending Audit
          </p>
          <p className="text-2xl font-black text-orange-900">
            {stats.pendingAudit}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Free Space
          </p>
          <p className="text-2xl font-black text-slate-900">
            {stats.freeSpace}%
          </p>
        </div>
      </div>

      {isLoadingRacks ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <DataTable
          data={racks}
          columns={rackColumns}
          title="Storage Configuration"
          searchPlaceholder="Search Zone, ID or Warehouse..."
          primaryAction={
            <button
              onClick={() => setModalType("RACK")}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-800 flex items-center shadow-sm"
            >
              <Plus size={14} className="mr-1" /> New Rack
            </button>
          }
        />
      )}
    </div>
  );
};

export default LocationsTab;
