import React, { useState, useEffect } from "react";
import { DataTable, Column } from "../../components/UI/DataTable";
import StatusBadge from "../../components/UI/StatusBadge";
import useSupportTickets from "../../api/supportTickets/useSupportTickets";
import { SupportTicket } from "../../api/types/supportTickets";
import { timeAgo } from "../../utils/timeAgo";

const Ticketing: React.FC = () => {
  const triggerNav = (path: string) => {
    window.dispatchEvent(new CustomEvent("app-navigate", { detail: path }));
  };

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const { fetchSupportTickets } = useSupportTickets();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchSupportTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };
    loadTickets();
  }, []);

  const columns: Column<SupportTicket>[] = [
    {
      header: "ID",
      accessor: (t) => (
        <span className="font-mono text-primary-600 hover:underline">
          {t.id}
        </span>
      ),
      sortKey: "id",
    },
    { header: "Subject", accessor: "subject", sortable: true },
    {
      header: "Client",
      accessor: (t) => t.user?.full_name || "N/A",
    },
    {
      header: "Last Update",
      accessor: (t) => timeAgo(t.updated_at),
      sortKey: "updated_at",
    },
    {
      header: "Status",
      accessor: (t) => <StatusBadge status={t.status.toUpperCase()} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
          <p className="text-slate-500 text-sm">
            Manage client inquiries and issues.
          </p>
        </div>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        onRowClick={(t) => triggerNav(`/admin/tickets/${t.id}`)}
        title="Open Tickets"
        searchPlaceholder="Search tickets..."
      />
    </div>
  );
};

export default Ticketing;
