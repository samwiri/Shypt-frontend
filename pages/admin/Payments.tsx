import React, { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Calendar,
  DollarSign,
  ExternalLink,
  X,
  User,
  FileText,
  Eye,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import Modal from "../../components/UI/Modal";
import { useToast } from "../../context/ToastContext";
import useInvoice from "@/api/invoices/useInvoice";
import {
  Invoice,
  Payment as ApiPayment,
  RecordPaymentPayload,
} from "@/api/types/invoice";
import useAuth from "@/api/auth/useAuth";
import { AuthUser } from "@/api/types/auth";

import { DataTable, Column } from "../../components/UI/DataTable";

// Helper function for currency formatting
const formatCurrency = (amount: number, currency: string | undefined) => {
  const symbol = currency === "UGX" ? "UGX " : "$";
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface LocalPayment extends ApiPayment {
  client: string;
  clientId?: string;
  linkedInvoices?: string[];
  invoiceCurrency?: string; // Add currency of the linked invoice
}
const Payments: React.FC = () => {
  const { showToast } = useToast();
  const { listInvoices, recordInvoicePayment, getAllPayments } = useInvoice();
  const { fetchAllUsers } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClient, setSelectedClient] = useState<AuthUser | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientList, setShowClientList] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [amount, setAmount] = useState("");

  // Removed mock data from payments state
  const [payments, setPayments] = useState<LocalPayment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [invoiceResponse, allPaymentsResponse, usersResponse] =
          await Promise.all([
            listInvoices(),
            getAllPayments(),
            fetchAllUsers(),
          ]);

        const invoices = invoiceResponse.data || [];
        const users = usersResponse.data || [];
        const apiPayments = allPaymentsResponse.data.data || [];

        setAllInvoices(invoices);
        setAllUsers(users);

        const transformedPayments: LocalPayment[] = apiPayments.map(
          (p: ApiPayment) => {
            return {
              ...p,
              client: p.user?.full_name || "N/A",
              clientId: p.user?.id.toString(),
              linkedInvoices: p.invoice ? [p.invoice.invoice_number] : [],
              invoiceCurrency: p.invoice?.currency || "USD",
            };
          }
        );

        setPayments(transformedPayments);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        showToast("Failed to load initial data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const totalReceivedThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return payments.reduce(
      (acc, pay) => {
        if (pay.status === "COMPLETED") {
          const paidDate = new Date(pay.paid_at);
          if (
            paidDate.getMonth() === currentMonth &&
            paidDate.getFullYear() === currentYear
          ) {
            const currency = pay.invoiceCurrency || "USD"; // Assume USD if null
            if (currency === "UGX") {
              acc.ugx += Number(pay.amount);
            } else {
              acc.usd += Number(pay.amount);
            }
          }
        }
        return acc;
      },
      { usd: 0, ugx: 0 }
    );
  }, [payments]);

  const pendingPaymentsCount = useMemo(() => {
    return payments.filter((p) => p.status === "PENDING").length;
  }, [payments]);

  const triggerNav = (path: string) => {
    window.dispatchEvent(new CustomEvent("app-navigate", { detail: path }));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const method = formData.get("method") as
      | "BANK_TRANSFER"
      | "MOBILE_MONEY"
      | "CASH"
      | "CHEQUE";
    const apiMethod = method === "CHEQUE" ? "BANK_TRANSFER" : method;

    const payload: RecordPaymentPayload = {
      invoice_id: selectedInvoice ? parseInt(selectedInvoice, 10) : undefined,
      amount: Number(amount),
      method: apiMethod,
      paid_at: formData.get("date") as string,
      transaction_reference: formData.get("reference") as string,
      status: "COMPLETED",
    };

    try {
      const newPayment = await recordInvoicePayment(payload);
      // const linkedInvoice = allInvoices.find(
      //   (inv) => inv.id === newPayment.invoice_id
      // );
      // const paymentClient = allUsers.find(
      //   (user) => user.id === linkedInvoice?.user_id || selectedClient?.id
      // );

      // const newPaymentForState: LocalPayment = {
      //   ...newPayment,
      //   client: paymentClient?.full_name || "N/A",
      //   clientId: paymentClient?.id.toString(),
      //   linkedInvoices: linkedInvoice ? [linkedInvoice.invoice_number] : [],
      //   invoiceCurrency: linkedInvoice?.currency || "USD",
      // };

      // setPayments((prevPayments) => [newPaymentForState, ...prevPayments]);
      // await ();
      showToast("Payment Recorded Successfully", "success");
      resetForm();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error("Failed to record payment:", error);
      showToast(
        `Failed to record payment: ${error.message || "Unknown error"}`,
        "error"
      );
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
    setClientSearch("");
    setSelectedInvoice("");
    setAmount("");
  };

  const handleClientSelect = (client: AuthUser) => {
    setSelectedClient(client);
    setClientSearch(client.full_name);
    setShowClientList(false);
  };

  const handleInvoiceSelect = (invId: string) => {
    setSelectedInvoice(invId);
    const inv = allInvoices.find((i) => i.id === parseInt(invId, 10));
    if (inv) {
      const totalAmount = inv.line_items.reduce(
        (acc, item) => acc + Number(item.unit_price) * item.quantity,
        0
      );
      setAmount(totalAmount.toString());
      const client = allUsers.find((user) => user.id === inv.user_id);
      if (client) handleClientSelect(client);
    }
  };

  const handleVerify = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "COMPLETED" } : p))
    );
    showToast("Payment Verified", "success");
  };

  const filteredClients = allUsers.filter(
    (user) =>
      user.full_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const availableInvoices = allInvoices.filter(
    (i) => i.status.toUpperCase() !== "COMPLETED"
  );

  const columns: Column<LocalPayment>[] = [
    {
      header: "Payment ID",
      accessor: (pay) => (
        <span className="font-mono text-xs text-primary-600 font-bold hover:underline">
          {pay.id}
        </span>
      ),
      sortKey: "id",
    },
    {
      header: "Date",
      accessor: (pay) =>
        new Date(pay.paid_at).toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      sortKey: "paid_at",
    },
    {
      header: "Client",
      accessor: (pay) => (
        <div>
          <div className="font-medium text-slate-800">{pay.client}</div>
          {pay.user?.email && (
            <div className="text-xs text-slate-400 font-normal">
              {pay.user.email}
            </div>
          )}
        </div>
      ),
      sortKey: "client",
    },
    {
      header: "Method / Ref",
      accessor: (pay) => (
        <div>
          <div className="text-xs font-bold text-slate-600">
            {pay?.method.replace("_", " ")}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {pay.transaction_reference}
          </div>
        </div>
      ),
      sortKey: "method",
    },
    {
      header: "Amount",
      accessor: (pay) => (
        <span className="font-bold text-green-700">
          {formatCurrency(Number(pay.amount), pay.invoiceCurrency)}
        </span>
      ),
      sortKey: "amount",
      className: "text-right",
    },
    {
      header: "Linked Invoices",
      accessor: (pay) =>
        pay.linkedInvoices && pay.linkedInvoices.length > 0 ? (
          pay.linkedInvoices.map((inv) => (
            <span
              key={inv}
              className="block text-primary-600 hover:underline cursor-pointer"
            >
              {inv}
            </span>
          ))
        ) : (
          <span className="text-slate-400 italic">Unallocated</span>
        ),
    },
    {
      header: "Status",
      accessor: (pay) => <StatusBadge status={pay.status || ""} />,
      sortKey: "status",
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (pay) => (
        <div className="flex justify-end space-x-2">
          <button
            className="text-slate-400 hover:text-primary-600"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              triggerNav(`/admin/payments/${pay.id}`);
            }}
          >
            <Eye size={18} />
          </button>
          {pay.status === "PENDING" && (
            <button
              onClick={(e) => handleVerify(e, pay.id)}
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
              title="Verify Payment"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payment Records</h2>
          <p className="text-slate-500 text-sm">
            Track incoming payments and reconcile with invoices.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition flex items-center shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            Total Received (This Month)
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {totalReceivedThisMonth.usd > 0 &&
              formatCurrency(totalReceivedThisMonth.usd, "USD")}
            {totalReceivedThisMonth.usd > 0 &&
              totalReceivedThisMonth.ugx > 0 &&
              " / "}
            {totalReceivedThisMonth.ugx > 0 &&
              formatCurrency(totalReceivedThisMonth.ugx, "UGX")}
            {totalReceivedThisMonth.usd === 0 &&
              totalReceivedThisMonth.ugx === 0 &&
              formatCurrency(0, "USD")}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            Pending Verification
          </p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {pendingPaymentsCount}{" "}
            {pendingPaymentsCount === 1 ? "Payment" : "Payments"}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        onRowClick={(pay) => triggerNav(`/admin/payments/${pay.id}`)}
        title="Transaction History"
        searchPlaceholder="Search by any field..."
      />

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record New Payment"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Client Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client Search
            </label>
            <div className="flex items-center">
              <div className="relative flex-1">
                <User
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientList(true);
                  }}
                  onFocus={() => setShowClientList(true)}
                  placeholder="Type to search client..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
              {selectedClient && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(null);
                    setClientSearch("");
                  }}
                  className="ml-2 text-slate-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Client Suggestions Dropdown */}
            {showClientList && clientSearch && !selectedClient && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                  >
                    <span className="text-slate-800 font-medium">
                      {client.full_name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {client.email}
                    </span>
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="px-4 py-3 text-slate-500 text-sm italic">
                    No clients found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invoice Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link to Invoice (Optional)
            </label>
            <select
              value={selectedInvoice}
              onChange={(e) => handleInvoiceSelect(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
            >
              <option disabled value="">
                -- Select Pending Invoice --
              </option>
              {availableInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} -{" "}
                  {formatCurrency(
                    inv.line_items.reduce(
                      (acc, item) =>
                        acc + Number(item.unit_price) * item.quantity,
                      0
                    ),
                    inv.currency
                  )}{" "}
                  {inv.user?.full_name ? `(${inv.user.full_name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Amount (
                {selectedInvoice
                  ? allInvoices.find(
                      (inv) => inv.id === parseInt(selectedInvoice, 10)
                    )?.currency === "UGX"
                    ? "UGX"
                    : "USD"
                  : "USD"}
                )
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-slate-500">
                  {selectedInvoice
                    ? allInvoices.find(
                        (inv) => inv.id === parseInt(selectedInvoice, 10)
                      )?.currency === "UGX"
                      ? "UGX "
                      : "$"
                    : "$"}
                </span>{" "}
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded bg-white text-slate-900 font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Payment Date
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Payment Method
              </label>
              <select
                name="method"
                className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Reference / Receipt #
              </label>
              <input
                name="reference"
                required
                className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
                placeholder="e.g. TX-12345"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 font-medium shadow-sm"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
