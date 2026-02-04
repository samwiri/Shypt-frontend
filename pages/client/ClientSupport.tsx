import React, { useState, useEffect } from "react";
import { MessageSquare, Plus, ChevronRight } from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import Modal from "../../components/UI/Modal";
import { useToast } from "../../context/ToastContext";
import useSupportTickets from "../../api/supportTickets/useSupportTickets";
import { SupportTicket } from "../../api/types/supportTickets";
import { timeAgo } from "../../utils/timeAgo";

const ClientSupport: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchSupportTickets, createNewSupportTicket } = useSupportTickets();

  const triggerNav = (path: string) => {
    window.dispatchEvent(new CustomEvent("app-navigate", { detail: path }));
  };

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const loadTickets = async () => {
    try {
      const data = await fetchSupportTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      showToast("Failed to load support tickets.", "error");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
      reference: (fd.get("ref") as string) || undefined,
    };

    try {
      await createNewSupportTicket(payload);
      showToast("Ticket created. Support team notified.", "success");
      setIsModalOpen(false);
      loadTickets(); // Refresh tickets list
    } catch (error) {
      console.error("Failed to create ticket", error);
      showToast("Failed to create ticket. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support Center</h2>
          <p className="text-slate-500 text-sm">
            Need help? Create a ticket below.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 flex items-center text-sm font-medium shadow-sm"
        >
          <Plus size={16} className="mr-2" /> Open Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">My Tickets</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-50 transition cursor-pointer group"
                onClick={() => triggerNav(`/client/support/${t.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-primary-600">
                      {t.subject}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.reference || `Ticket ID: ${t.id}`}
                    </p>
                    <div className="mt-2 text-xs text-slate-400">
                      Last updated: {timeAgo(t.updated_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <StatusBadge status={t.status.toUpperCase()} />
                    <ChevronRight size={16} className="text-slate-300 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <MessageSquare size={18} className="mr-2 text-blue-600" /> FAQ
          </h3>
          <div className="space-y-4">
            <div className="border rounded p-3 bg-slate-50">
              <p className="font-semibold text-sm text-slate-800">
                How long does shipping take?
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Air freight typically takes 5-7 days from origin departure. Sea
                freight takes 45-60 days.
              </p>
            </div>
            <div className="border rounded p-3 bg-slate-50">
              <p className="font-semibold text-sm text-slate-800">
                Where is the warehouse address?
              </p>
              <p className="text-xs text-slate-600 mt-1">
                You can find your unique address ID on the Profile page.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Support Ticket"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Subject
            </label>
            <select
              name="subject"
              className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
            >
              <option>Where is my order?</option>
              <option>Billing / Invoice Issue</option>
              <option>Damaged Item</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Reference (Order ID)
            </label>
            <input
              name="ref"
              placeholder="Optional (e.g. HWB-8821)"
              className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900"
              placeholder="Describe your issue..."
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientSupport;