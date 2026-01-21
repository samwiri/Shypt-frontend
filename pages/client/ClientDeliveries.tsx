import React, { useState, useEffect } from "react";
import { Plus, Eye, Loader2 } from "lucide-react";
import { DataTable, Column } from "../../components/UI/DataTable";
import StatusBadge from "../../components/UI/StatusBadge";
import { useToast } from "../../context/ToastContext";
import useDelivery from "../../api/delivery/useDelivery";
import { Delivery } from "../../api/types/delivery";
import { useAuthContext } from "../../context/AuthContext"; // Import AuthContext

const ClientDeliveries: React.FC = () => {
  const { showToast } = useToast();
  const { listDeliveryOrders } = useDelivery();
  const { user } = useAuthContext(); // Get current user

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await listDeliveryOrders();
      const userDeliveries = response.data.filter(
        (d) => d.order?.user?.id === user.id,
      );
      setDeliveries(userDeliveries);
    } catch (error) {
      showToast("Failed to fetch delivery orders.", "error");
      console.error("Fetch deliveries error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      // Fetch only if user ID is available
      fetchData();
    }
  }, [user?.id]); // Re-fetch if user ID changes

  const triggerNav = (path: string) => {
    window.dispatchEvent(new CustomEvent("app-navigate", { detail: path }));
  };

  const columns: Column<Delivery>[] = [
    {
      header: "Delivery No.",
      accessor: (delivery) => (
        <span className="text-primary-600 font-medium hover:underline">
          {delivery.delivery_number}
        </span>
      ),
      sortKey: "delivery_number",
    },
    {
      header: "Order Ref",
      accessor: (delivery) => delivery.order?.tracking_number || "N/A",
      // @ts-ignore
      sortKey: "order.tracking_number",
    },
    {
      header: "Delivery Address",
      accessor: (delivery) => (
        <div className="text-xs text-slate-500">
          {delivery.delivery_address}
        </div>
      ),
      sortKey: "delivery_address",
    },
    {
      header: "Status",
      accessor: (delivery) => <StatusBadge status={delivery.status} />,
      sortKey: "status",
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (delivery) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerNav(`/client/deliveries/${delivery.id}`);
            }}
            className="text-slate-400 hover:text-primary-600 p-1"
            title="View Details"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Deliveries</h2>
          <p className="text-slate-500 text-sm">
            View the status of your outgoing deliveries.
          </p>
        </div>
      </div>

      <DataTable
        data={deliveries}
        columns={columns}
        loading={loading}
        onRowClick={(delivery) =>
          triggerNav(`/client/deliveries/${delivery.id}`)
        }
        title="My Deliveries"
        searchPlaceholder="Search deliveries..."
      />
    </div>
  );
};

export default ClientDeliveries;
