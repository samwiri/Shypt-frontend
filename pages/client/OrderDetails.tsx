import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package as PackageIcon,
  Plane,
  MapPin,
  CheckCircle,
  FileText,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import { useToast } from "../../context/ToastContext";
import useOrders from "../../api/orders/useOrders";
import { Order } from "../../api/types/orders";

interface OrderDetailsProps {
  id: string;
  onBack: () => void;
}

const ORDER_STATUS_FLOW = [
  "PENDING",
  "RECEIVED",
  "CONSOLIDATED",
  "DISPATCHED",
  "IN_TRANSIT",
  "ARRIVED",
  "READY_FOR_RELEASE",
  "RELEASED",
  "DELIVERED",
];

const CLIENT_TIMELINE_MAP: { [key: string]: string } = {
  PENDING: "Pre-Alert Created",
  RECEIVED: "Received at Origin Warehouse",
  CONSOLIDATED: "Consolidated for Shipment",
  DISPATCHED: "Departed from Origin",
  IN_TRANSIT: "In Transit to Destination",
  ARRIVED: "Arrived at Destination",
  READY_FOR_RELEASE: "Customs Cleared & Ready",
  RELEASED: "Released from Warehouse",
  DELIVERED: "Delivered",
};

const VISUAL_STEPS = [
  { label: "Created", icon: FileText, matchStatus: ["PENDING"] },
  {
    label: "Received",
    icon: PackageIcon,
    matchStatus: ["RECEIVED", "CONSOLIDATED"],
  },
  {
    label: "In Transit",
    icon: Plane,
    matchStatus: ["DISPATCHED", "IN_TRANSIT"],
  },
  { label: "Arrived", icon: MapPin, matchStatus: ["ARRIVED"] },
  {
    label: "Ready",
    icon: CheckCircle,
    matchStatus: ["READY_FOR_RELEASE", "RELEASED", "DELIVERED"],
  },
];

const ClientOrderDetails: React.FC<OrderDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();
  const { getOrder } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await getOrder(parseInt(id, 10));
        setOrder(response.data);
      } catch (err) {
        showToast("Failed to fetch order details.", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold">Order Not Found</h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const formattedTimeline = ORDER_STATUS_FLOW.map((status, index) => {
    const historyEvent = order.status_history.find((h) => h.status === status);
    return {
      status: CLIENT_TIMELINE_MAP[status] || status,
      date: historyEvent
        ? new Date(historyEvent.created_at).toLocaleString()
        : index === currentStatusIndex
        ? new Date(order.created_at).toLocaleString()
        : "-",
      loc: historyEvent ? historyEvent.location : "N/A",
      done: index <= currentStatusIndex,
      current: index === currentStatusIndex,
    };
  });

  const getProgressPercentage = () => {
    const currentVisualStepIndex = VISUAL_STEPS.findIndex((step) =>
      step.matchStatus.includes(order.status)
    );
    if (currentVisualStepIndex === -1) return 0;
    // 4 intervals for 5 steps.
    return (currentVisualStepIndex / (VISUAL_STEPS.length - 1)) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Order {order.tracking_number}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={order.status} />
            <span className="text-sm text-slate-500">
              {order.packages.map((p) => p.contents).join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Horizontal Visual Tracker */}
            <div className="relative pt-4 pb-4">
              <div className="absolute top-5 left-0 w-full px-9">
                <div className="h-1 bg-slate-100 w-full rounded-full relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              <div className="relative z-10 flex justify-between">
                {VISUAL_STEPS.map((step, index) => {
                  const stepIndex = VISUAL_STEPS.findIndex((s) =>
                    s.matchStatus.includes(order.status)
                  );
                  const isCompleted = index <= stepIndex;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-300 text-slate-300"
                        }`}
                      >
                        <step.icon size={16} />
                      </div>
                      <span
                        className={`text-xs font-bold mt-3 ${
                          isCompleted ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-slate-800">Package Details</h3>
            </div>
            <div className="p-6">
              {order.packages && order.packages.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Contents</th>
                      <th className="text-right p-2">Weight (kg)</th>
                      <th className="text-right p-2">Dimensions (cm)</th>
                      <th className="text-right p-2">Declared Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.packages.map((pkg) => (
                      <tr key={pkg.id} className="border-b">
                        <td className="p-2">{pkg.contents}</td>
                        <td className="text-right p-2">
                          {Number(pkg.weight).toFixed(2)}
                        </td>
                        <td className="text-right p-2">{`${pkg.length}x${pkg.width}x${pkg.height}`}</td>
                        <td className="text-right p-2">
                          Ugx
                          {Number(
                            Number(pkg.declared_value).toFixed(2)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No packages found in this order.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-6">Tracking Timeline</h3>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
            {formattedTimeline.map((event, i) => (
              <div key={i} className="relative pl-8">
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                    event.done
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-slate-300"
                  }`}
                ></div>
                <div style={{ opacity: event.done ? 1 : 0.5 }}>
                  <p className="text-sm font-bold text-slate-800">
                    {event.status}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{event.loc}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOrderDetails;
