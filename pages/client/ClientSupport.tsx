import React, { useState } from 'react';
import { MessageSquare, Plus, ChevronRight } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';
import Modal from '../../components/UI/Modal';
import { useToast } from '../../context/ToastContext';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  lastUpdate: string;
  preview: string;
}

const ClientSupport: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const triggerNav = (path: string) => {
     window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
  };

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TCK-101', subject: 'Where is my order?', status: 'OPEN', lastUpdate: '2 hours ago', preview: 'Admin: Checking warehouse...' },
    { id: 'TCK-099', subject: 'Wrong Invoice Amount', status: 'CLOSED', lastUpdate: '1 week ago', preview: 'Issue resolved. Invoice updated.' },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const newTicket = {
          id: `TCK-${Math.floor(Math.random() * 1000)}`,
          subject: fd.get('subject') as string,
          status: 'OPEN',
          lastUpdate: 'Just now',
          preview: fd.get('message') as string
      };
      setTickets([newTicket, ...tickets]);
      showToast('Ticket created. Support team notified.', 'success');
      setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support Center</h2>
          <p className="text-slate-500 text-sm">Need help? Create a ticket below.</p>
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
                  {tickets.map(t => (
                      <div 
                        key={t.id} 
                        className="p-4 hover:bg-slate-50 transition cursor-pointer group"
                        onClick={() => triggerNav(`/client/support/${t.id}`)}
                      >
                          <div className="flex justify-between items-start">
                              <div>
                                  <h4 className="font-semibold text-slate-800 group-hover:text-primary-600">{t.subject}</h4>
                                  <p className="text-xs text-slate-500 mt-1">{t.preview}</p>
                                  <div className="mt-2 text-xs text-slate-400">Last updated: {t.lastUpdate}</div>
                              </div>
                              <div className="flex flex-col items-end">
                                  <StatusBadge status={t.status} />
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
                      <p className="font-semibold text-sm text-slate-800">How long does shipping take?</p>
                      <p className="text-xs text-slate-600 mt-1">Air freight typically takes 5-7 days from origin departure. Sea freight takes 45-60 days.</p>
                  </div>
                  <div className="border rounded p-3 bg-slate-50">
                      <p className="font-semibold text-sm text-slate-800">Where is the warehouse address?</p>
                      <p className="text-xs text-slate-600 mt-1">You can find your unique address ID on the Profile page.</p>
                  </div>
              </div>
          </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Support Ticket">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700">Subject</label>
                  <select name="subject" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900">
                      <option>Where is my order?</option>
                      <option>Billing / Invoice Issue</option>
                      <option>Damaged Item</option>
                      <option>General Inquiry</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Reference (Order ID)</label>
                  <input name="ref" placeholder="Optional (e.g. HWB-8821)" className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea name="message" required rows={4} className="w-full border border-slate-300 rounded p-2 mt-1 bg-white text-slate-900" placeholder="Describe your issue..."></textarea>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Submit Ticket</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default ClientSupport;