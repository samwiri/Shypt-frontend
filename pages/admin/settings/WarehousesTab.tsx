import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { DataTable, Column } from "../../../components/UI/DataTable";
import { WareHouseLocation } from "../../../api/types/warehouse";

interface WarehousesTabProps {
  isLoadingWarehouses: boolean;
  warehouses: WareHouseLocation[];
  warehouseColumns: Column<WareHouseLocation>[];
  setModalType: (type: string | null) => void;
}

const WarehousesTab: React.FC<WarehousesTabProps> = ({
  isLoadingWarehouses,
  warehouses,
  warehouseColumns,
  setModalType,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800">
            Warehouse Network
          </h3>
          <p className="text-sm text-slate-500">
            Manage global origin and destination hubs.
          </p>
        </div>
      </div>

      {isLoadingWarehouses ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <DataTable
          data={warehouses}
          columns={warehouseColumns}
          title="Global Hub Registry"
          primaryAction={
            <button
              onClick={() => setModalType("WAREHOUSE")}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-800 flex items-center shadow-sm"
            >
              <Plus size={14} className="mr-1" /> Add Hub
            </button>
          }
        />
      )}
    </div>
  );
};

export default WarehousesTab;
