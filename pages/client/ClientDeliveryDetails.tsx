import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, FileText, Loader2 } from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import { useToast } from "../../context/ToastContext";
import useDelivery from "../../api/delivery/useDelivery";
import { useAuthContext } from "../../context/AuthContext";
import { Delivery } from "../../api/types/delivery";

interface ClientDeliveryDetailsProps {
  deliveryId: string;
  onBack: () => void;
}

const ClientDeliveryDetails: React.FC<ClientDeliveryDetailsProps> = ({
  deliveryId,
  onBack,
}) => {
  const { showToast } = useToast();
  const { showDeliveryOrder } = useDelivery();
  const { user } = useAuthContext();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await showDeliveryOrder(Number(deliveryId));

      if (response.order?.user?.id !== user.id) {
        showToast("You are not authorized to view this delivery.", "error");
        setDelivery(null);
        // Assuming onBack() navigates away
        onBack();
      } else {
        setDelivery(response);
      }
    } catch (err) {
      showToast("Failed to fetch delivery details.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryId) {
      fetchDetails();
    }
  }, [deliveryId]);

  if (loading) return <div>Loading...</div>;
  if (!delivery) return <div>Delivery not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {delivery.delivery_number}
            </h2>
            <p className="text-slate-500 text-sm">
              Order: {delivery.order.tracking_number}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={delivery.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Address</p>
                <p>{delivery.delivery_address}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p>{new Date(delivery.delivery_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Notes</p>
                <p>{delivery.delivery_notes || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Delivered At</p>
                <p>
                  {delivery.delivered_at
                    ? new Date(delivery.delivered_at).toLocaleString()
                    : "Not yet delivered"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Client & Order</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Client</p>
                <p>{delivery.order.user.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Contact</p>
                <p>
                  {delivery.order.user.email} / {delivery.order.user.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Order Tracking #</p>
                <p>{delivery.order.tracking_number}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Order Type</p>
                {/* @ts-ignore */}
                <p>{delivery.order.type}</p>
              </div>
            </div>
          </div>
          {(delivery.pod_photo_path || delivery.pod_signature) && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">
                Proof of Delivery
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {delivery.pod_photo_path && (
                  <div>
                    <p className="text-sm text-slate-500">POD Photo</p>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${delivery.pod_photo_path}`}
                      alt="Proof of Delivery"
                      className="mt-2 max-w-full h-auto rounded-md shadow"
                    />
                  </div>
                )}
                {delivery.pod_signature && (
                  <div>
                    <p className="text-sm text-slate-500">Customer Signature</p>
                    <img
                      src={delivery.pod_signature}
                      alt="Customer Signature"
                      className="mt-2 max-w-full h-auto rounded-md shadow"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
          <h3 className="font-bold text-slate-800 mb-6">Delivery Timeline</h3>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-green-500 border-green-500"></div>
              <p className="text-sm font-bold text-slate-800">
                Delivery Created
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {new Date(delivery.created_at).toLocaleString()}
              </p>
            </div>
            {delivery.status === "ASSIGNED" && delivery.updated_at && (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-blue-500 border-blue-500"></div>
                <p className="text-sm font-bold text-slate-800">
                  Assigned to Rider
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {new Date(delivery.updated_at).toLocaleString()}
                </p>
              </div>
            )}
            {delivery.status === "OUT_FOR_DELIVERY" && delivery.updated_at && (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-yellow-500 border-yellow-500"></div>
                <p className="text-sm font-bold text-slate-800">
                  Out for Delivery
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {new Date(delivery.updated_at).toLocaleString()}
                </p>
              </div>
            )}
            {delivery.status === "DELIVERED" && delivery.delivered_at && (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-green-500 border-green-500"></div>
                <p className="text-sm font-bold text-slate-800">Delivered</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {new Date(delivery.delivered_at).toLocaleString()}
                </p>
              </div>
            )}
            {delivery.status === "CANCELLED" && delivery.updated_at && (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-red-500 border-red-500"></div>
                <p className="text-sm font-bold text-slate-800">Cancelled</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {new Date(delivery.updated_at).toLocaleString()}
                </p>
              </div>
            )}
            {delivery.status === "FAILED" && delivery.updated_at && (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-red-500 border-red-500"></div>
                <p className="text-sm font-bold text-slate-800">Failed</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {new Date(delivery.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDeliveryDetails;
