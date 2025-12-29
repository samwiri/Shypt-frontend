import React, { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Truck,
  Plane,
  CheckCircle,
  Anchor,
  FileText,
  Archive,
  Shield,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import useOrders from "@/api/orders/useOrders";

const Tracking: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getOrderByTrackingNumber } = useOrders();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await getOrderByTrackingNumber(query.trim());
      const order = response.data;

      const ORDER_STATUS_FLOW = [
        "PENDING",
        "RECEIVED",
        "CONSOLIDATED",
        "DISPATCHED",
        "IN_TRANSIT",
        "ARRIVED",
        "CUSTOMS_CLEARANCE",
        "READY_FOR_RELEASE",
        "DELIVERED",
      ];

      const STATUS_DETAILS: Record<
        string,
        { title: string; desc: string; icon: React.ReactNode }
      > = {
        PENDING: {
          title: "Pre-Alert Created",
          desc: "Order details submitted by client.",
          icon: <FileText size={16} />,
        },
        RECEIVED: {
          title: "Received at Origin",
          desc: "Package received and inspected.",
          icon: <Package size={16} />,
        },
        CONSOLIDATED: {
          title: "Consolidated",
          desc: "Added to a master shipment.",
          icon: <Archive size={16} />,
        },
        DISPATCHED: {
          title: "Departed Origin",
          desc: "Shipment is on the way to destination country.",
          icon:
            //   @ts-ignore
            order.shipping_method === "AIR" ? (
              <Plane size={16} />
            ) : (
              <Anchor size={16} />
            ),
        },
        IN_TRANSIT: {
          title: "In Transit",
          desc: "Moving within destination country.",
          icon: <Truck size={16} />,
        },
        ARRIVED: {
          title: "Arrived Destination",
          desc: "Landed at destination port/airport.",
          icon: <MapPin size={16} />,
        },
        CUSTOMS_CLEARANCE: {
          title: "Customs Clearance",
          desc: "Undergoing verification and tax assessment.",
          icon: <Shield size={16} />,
        },
        READY_FOR_RELEASE: {
          title: "Ready for Pickup/Delivery",
          desc: "Cleared and available at our office.",
          icon: <CheckCircle size={16} />,
        },
        DELIVERED: {
          title: "Delivered",
          desc: "Successfully handed over to the client.",
          icon: <UserCheck size={16} />,
        },
      };

      const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status);

      const sortedHistory = [...order.status_history].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const timeline = ORDER_STATUS_FLOW.map((status, index) => {
        const historyEvent = sortedHistory.find((h) => h.status === status);
        const details = STATUS_DETAILS[status];
        const isCompleted =
          currentStatusIndex >= 0 && index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;

        if (!details) return null;

        return {
          step: index + 1,
          title: details.title,
          desc: historyEvent?.notes || details.desc,
          date: historyEvent
            ? new Date(historyEvent.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : isCurrent
            ? "In Progress"
            : "Pending",
          loc: historyEvent?.location || "N/A",
          completed: isCompleted,
          current: isCurrent,
          icon: details.icon,
        };
      }).filter(Boolean);

      const progress =
        currentStatusIndex >= 0
          ? (currentStatusIndex / (ORDER_STATUS_FLOW.length - 1)) * 100
          : 0;

      const trackingData = {
        id: order.tracking_number,
        desc:
          //   @ts-ignore
          order.description ||
          //   @ts-ignore
          `Shipment of ${order.items?.length || 1} item(s)`,
        status: order.status.replace(/_/g, " "),
        origin: order.origin_country,
        destination: order.receiver_address,
        eta: order.arrived_at
          ? new Date(order.arrived_at).toLocaleDateString()
          : "Pending",
        //   @ts-ignore
        mode: order.shipping_method,
        timeline: timeline,
        progress: progress,
      };

      setResult(trackingData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tracking number not found.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Track Your Shipment
        </h2>
        <p className="text-slate-500 mt-2">
          Enter your HWB Number or Order ID to see real-time updates.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. HWB-8832"
            className="w-full pl-6 pr-14 py-4 text-lg border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white text-slate-900"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Search size={24} />
            )}
          </button>
        </form>
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center p-8 text-slate-500">Searching...</div>
      )}

      {result && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  {result.desc}
                  <span className="ml-3 px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 font-mono">
                    {result.id}
                  </span>
                </h3>
                <div className="flex items-center mt-2 text-sm text-slate-400">
                  <span className="flex items-center mr-4">
                    <MapPin size={14} className="mr-1" /> {result.origin}
                  </span>
                  <span className="mr-4">&rarr;</span>
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" /> {result.destination}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="bg-green-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                  {result.status}
                </div>
                <p className="text-xs text-slate-400">
                  Est. Arrival: {result.eta}
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-b border-slate-200">
              <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transition-all duration-1000"
                  style={{ width: `${result.progress}%` }}
                ></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                    <Package size={14} />
                  </div>
                  <span className="text-xs font-bold mt-2 text-slate-700">
                    Origin
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                    {result.mode === "AIR" ? (
                      <Plane size={14} />
                    ) : (
                      <Anchor size={14} />
                    )}
                  </div>
                  <span className="text-xs font-bold mt-2 text-slate-700">
                    In Transit
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      result.progress >= 50
                        ? "bg-green-500 text-white"
                        : "bg-white border-2 border-slate-300 text-slate-300"
                    }`}
                  >
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs font-bold mt-2 text-slate-700">
                    Arrival
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      result.progress === 100
                        ? "bg-green-500 text-white"
                        : "bg-white border-2 border-slate-300 text-slate-300"
                    }`}
                  >
                    <Truck size={14} />
                  </div>
                  <span className="text-xs font-bold mt-2 text-slate-400">
                    Delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white">
              <h4 className="font-bold text-slate-800 mb-6">
                Shipment Progress
              </h4>
              <div className="space-y-0">
                {result.timeline.map((event: any, i: number) => (
                  <div key={i} className="flex group">
                    <div className="w-24 flex-shrink-0 text-right pr-4 pt-1">
                      <p className="text-xs font-bold text-slate-600">
                        {event.date.split(",")[0]}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {event.date.split(",")[1] || ""}
                      </p>
                    </div>

                    <div className="relative flex flex-col items-center px-2">
                      <div
                        className={`w-3 h-3 rounded-full z-10 border-2 ${
                          event.completed
                            ? "bg-green-500 border-green-500"
                            : event.current
                            ? "bg-blue-500 border-blue-500 ring-4 ring-blue-100"
                            : "bg-white border-slate-300"
                        }`}
                      ></div>
                      {i !== result.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 ${
                            event.completed ? "bg-green-200" : "bg-slate-100"
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="flex-1 pb-8 pl-2">
                      <div
                        className={`p-4 rounded-lg border ${
                          event.current
                            ? "bg-blue-50 border-blue-100 shadow-sm"
                            : "bg-white border-transparent"
                        }`}
                      >
                        <h5
                          className={`font-bold text-sm ${
                            event.current
                              ? "text-blue-800"
                              : event.completed
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {event.title}
                        </h5>
                        <p
                          className={`text-xs mt-1 ${
                            event.current ? "text-blue-700" : "text-slate-500"
                          }`}
                        >
                          {event.desc}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                          <MapPin size={10} className="mr-1" /> {event.loc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
