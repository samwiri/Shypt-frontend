import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ShoppingCart,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import { useToast } from "../../context/ToastContext";
import useAssistedShopping from "../../api/assistedShopping/useAssistedShopping";
import useInvoice from "@/api/invoices/useInvoice";
import {
  AssistedShoppingItem,
  UpdateAssistedShoppingPayload,
} from "../../api/types/assistedShopping";

interface ClientShoppingDetailsProps {
  requestId: string;
  onBack: () => void;
}

const ClientShoppingDetails: React.FC<ClientShoppingDetailsProps> = ({
  requestId,
  onBack,
}) => {
  const { showToast } = useToast();
  const [request, setRequest] = useState<AssistedShoppingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getAssistedShopping, updateAssistedShopping } = useAssistedShopping();
  const { recordInvoicePayment } = useInvoice();

  const fetchRequestDetails = async () => {
    try {
      setIsLoading(true);
      const id = parseInt(requestId.replace("REQ-", ""), 10);
      const response = await getAssistedShopping(id);
      setRequest(response.data);
    } catch (err) {
      setError("Failed to fetch request details.");
      showToast("Failed to fetch request details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const handlePay = async () => {
    if (!request) return;

    const total =
      request.quote_items?.reduce(
        (acc, q) => acc + q.unit_price * q.quantity,
        0
      ) || 0;

    if (confirm(`Accept quote and pay $${total.toFixed(2)}?`)) {
      setIsPaying(true);
      try {
        await recordInvoicePayment({
          amount: total,
          method: "CASH",
          paid_at: new Date().toISOString(),
          assisted_shopping_id: request.id,
        });
        const payload: UpdateAssistedShoppingPayload = {
          name: request.name,
          url: request.url,
          quantity: request.quantity,
          notes: request.notes,
          status: "paid",
        };
        await updateAssistedShopping(request.id, payload);
        showToast(
          "Payment successful! We will purchase your item shortly.",
          "success"
        );
        await fetchRequestDetails();
      } catch (error) {
        showToast("Payment failed. Please try again.", "error");
      } finally {
        setIsPaying(false);
      }
    }
  };

  const quoteTotal =
    request?.quote_items?.reduce(
      (acc, q) => acc + q.unit_price * q.quantity,
      0
    ) || 0;
  const serviceFee =
    request?.quote_items?.find((q) => q.item_name.includes("Service Fee"))
      ?.unit_price || 0;
  const quoteSubtotal = quoteTotal - serviceFee;
  const domesticShipping =
    request?.quote_items?.find((q) => q.item_name.includes("Domestic Shipping"))
      ?.unit_price || 0;
  const itemCost = quoteSubtotal - domesticShipping;

  const updates = useMemo(() => {
    if (!request) return [];
    const getStatusHistory = (status, createdAt, updatedAt) => {
      const history = [];
      const formattedCreationDate = new Date(createdAt).toLocaleString();
      const formattedUpdateDate = new Date(updatedAt).toLocaleString();

      history.push({ date: formattedCreationDate, text: "Request submitted" });

      if (status === "declined") {
        history.push({ date: formattedUpdateDate, text: "Request declined" });
        return history;
      }

      if (status === "quoted" || status === "paid" || status === "purchased") {
        history.push({
          date: formattedUpdateDate,
          text: "Admin reviewed request",
        });
        history.push({ date: formattedUpdateDate, text: "Quote generated" });
      }

      if (status === "paid" || status === "purchased") {
        history.push({
          date: formattedUpdateDate,
          text: "Quote paid by client",
        });
      }

      if (status === "purchased") {
        history.push({ date: formattedUpdateDate, text: "Item purchased" });
      }

      return history;
    };
    return getStatusHistory(
      request.status,
      request.created_at,
      request.updated_at
    );
  }, [request]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading Request Details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded">
        {error || "Request not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{request.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={request.status.toUpperCase()} />
            <a
              href={request.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              Original Link <ExternalLink size={10} className="ml-1" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Quotation</h3>
            </div>
            <div className="p-6">
              {request.status === "requested" ? (
                <div className="text-center text-slate-500 py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                  <p>
                    We are reviewing your request. A quote will appear here
                    shortly.
                  </p>
                </div>
              ) : !request.quote_items || request.quote_items.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Quotation is being generated.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Item Cost</span>
                    <span className="font-mono">${itemCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Domestic Shipping</span>
                    <span className="font-mono">
                      ${domesticShipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Service Fee</span>
                    <span className="font-mono">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between font-bold text-lg">
                    <span>Total Payable</span>
                    <span className="text-primary-600">
                      ${quoteTotal.toFixed(2)}
                    </span>
                  </div>

                  {request.status === "quoted" && (
                    <button
                      onClick={handlePay}
                      disabled={isPaying}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                      {isPaying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} className="mr-2" /> Pay Now
                        </>
                      )}
                    </button>
                  )}

                  {request.status === "paid" && (
                    <div className="w-full mt-4 bg-green-50 text-green-700 py-3 rounded-lg border border-green-200 flex items-center justify-center font-bold">
                      <CheckCircle size={18} className="mr-2" /> Quote Paid
                    </div>
                  )}

                  {request.status === "purchased" && (
                    <div className="w-full mt-4 bg-blue-50 text-blue-700 py-3 rounded-lg border border-blue-200 flex items-center justify-center font-bold">
                      <ShoppingCart size={18} className="mr-2" /> Item Purchased
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Your Notes</h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded">
              {request.notes || "No notes provided."}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-6">Status Updates</h3>
          <div className="border-l-2 border-slate-100 ml-2 space-y-6">
            {updates.map((u, i) => (
              <div key={i} className="relative pl-6">
                <div
                  className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${
                    i === updates.length - 1 ? "bg-primary-500" : "bg-slate-300"
                  }`}
                ></div>
                <p className="text-sm font-medium text-slate-800">{u.text}</p>
                <p className="text-xs text-slate-500">{u.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientShoppingDetails;
