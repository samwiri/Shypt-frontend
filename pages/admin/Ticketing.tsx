import React, { useState } from 'react';
import { MessageSquare, User, CheckCircle, Clock } from 'lucide-react';
import { DataTable, Column } from '../../components/UI/DataTable';
import StatusBadge from '../../components/UI/StatusBadge';

interface Ticket {
  id: string;
  subject: string;
  client: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  lastUpdate: string;
  priority: 'HIGH' | 'NORMAL';
}

const Ticketing: React.FC = () => {
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TCK-101', subject: 'Where is my order?', client: 'John Doe', status: 'OPEN', lastUpdate: '2 hrs ago', priority: 'NORMAL' },
    { id: 'TCK-102', subject: 'Wrong item received', client: 'Alice Smith', status: 'CLOSED', lastUpdate: '1 day ago', priority: 'HIGH' },
  ]);

  const columns: Column<Ticket>[] = [
    { header: 'ID', accessor: (t) => <span className="font-mono text-primary-600 hover:underline">{t.id}</span>, sortKey: 'id', sortable: true },
    { header: 'Subject', accessor: 'subject', sortable: true },
    { header: 'Client', accessor: 'client', sortable: true },
    { header: 'Last Update', accessor: 'lastUpdate', sortable: true },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
          <p className="text-slate-500 text-sm">Manage client inquiries and issues.</p>
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