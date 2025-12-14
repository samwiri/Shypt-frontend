import React from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';

interface TicketDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientTicketDetails: React.FC<TicketDetailsProps> = ({ id, onBack }) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-bold text-slate-800">Ticket {id}</h2>
                <div className="mt-1"><StatusBadge status="OPEN" /></div>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[600px]">
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div className="flex gap-4 flex-row-reverse">
                   <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                       <User size={20} className="text-slate-600" />
                   </div>
                   <div className="text-right">
                       <div className="flex items-baseline justify-end mb-1">
                           <span className="font-bold text-slate-800 mr-2">Me</span>
                           <span className="text-xs text-slate-400">Today, 10:00 AM</span>
                       </div>
                       <div className="bg-slate-100 p-4 rounded-l-lg rounded-br-lg text-slate-800 text-sm max-w-lg text-left">
                           <p>Hi, I checked my tracking for HWB-8821 and it still says Pending. Can you check if it arrived?</p>
                       </div>
                   </div>
               </div>

               <div className="flex gap-4">
                   <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                       A
                   </div>
                   <div>
                       <div className="flex items-baseline mb-1">
                           <span className="font-bold text-slate-800 mr-2">Admin Support</span>
                           <span className="text-xs text-slate-400">Today, 10:15 AM</span>
                       </div>
                       <div className="bg-blue-600 p-4 rounded-r-lg rounded-bl-lg text-white text-sm max-w-lg">
                           <p>Hello John, let me check the warehouse system for you. Please give me a moment.</p>
                       </div>
                   </div>
               </div>
           </div>

           <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
               <div className="flex items-center gap-2">
                   <input type="text" placeholder="Type your reply..." className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                   <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                       <Send size={20} />
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};

export default ClientTicketDetails;