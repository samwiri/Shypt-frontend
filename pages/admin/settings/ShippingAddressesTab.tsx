import React from "react";
import { DataTable, Column } from "../../../components/UI/DataTable";
import { ShippingAddress } from "../../../api/types/shippingAddress";
import { Plus } from "lucide-react";

interface ShippingAddressesTabProps {
  isLoading: boolean;
  addresses: ShippingAddress[];
  columns: Column<ShippingAddress>[];
  setModalType: (type: string) => void;
}

const ShippingAddressesTab: React.FC<ShippingAddressesTabProps> = ({
  isLoading,
  addresses,
  columns,
  setModalType,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-700">
            Client Shipping Addresses
          </h3>
          <p className="text-sm text-slate-500">
            Manage predefined delivery addresses for clients.
          </p>
        </div>
        <button
          onClick={() => setModalType("SHIPPING_ADDRESS")}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center font-medium"
        >
          <Plus size={18} className="mr-2" />
          Add Address
        </button>
      </div>
      <DataTable
        columns={columns}
        data={addresses}
        loading={isLoading}
        // @ts-ignore
        emptyState="No shipping addresses configured."
      />
    </div>
  );
};

export default ShippingAddressesTab;
