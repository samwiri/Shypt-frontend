import React from 'react';
import { ArrowLeft, Package, Plane, MapPin, CheckCircle, Truck, Clock, FileText } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';

interface OrderDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientOrderDetails: React.FC<OrderDetailsProps> = ({ id, onBack }) => {
  const order = {
    id: id,
    desc: 'Amazon Shipment (Electronics)',
    status: 'IN_TRANSIT',
    subStatus: 'Departed Origin',
    flight: 'CZ-330',
    origin: 'New York (US)',
    destination: 'Kampala (UG)',
    weight: '2.5kg',
    tracking: 'TBA9921',
    eta: '2025-03-08',
    timeline: [
      { status: 'Pre-Alert Created', date: '2025-03-01 09:00', loc: 'Client Portal', done: true },
      { status: 'Received at Origin', date: '2025-03-03 14:00', loc: 'New York Warehouse', done: true },
      { status: 'Consolidated', date: '2025-03-03 18:00', loc: 'New York Warehouse', done: true },
      { status: 'Departed Origin', date: '2025-03-05 08:30', loc: 'JFK Airport', done: true },
      { status: 'In Transit', date: '2025-03-05 12:00', loc: 'Flight CZ-330', done: true, current: true },
      { status: 'Arrived at Destination', date: 'Est. 2025-03-06', loc: 'Entebbe Airport', done: false },
      { status: 'Ready for Pickup', date: '-', loc: 'Kampala Warehouse', done: false },
    ]
  };

  // Status progression map for logic
  const statusSteps = ['PENDING', 'RECEIVED', 'IN_TRANSIT', 'ARRIVED', 'RELEASED', 'DELIVERED'];
  const currentStepIndex = statusSteps.indexOf(order.status) === -1 ? 0 : statusSteps.indexOf(order.status);

  // Visualization Steps
  const visualSteps = [
      { label: 'Created', icon: FileText, matchStatus: 'PENDING' },
      { label: 'Received', icon: Package, matchStatus: 'RECEIVED' },
      { label: 'In Transit', icon: Plane, matchStatus: 'IN_TRANSIT' },
      { label: 'Arrived', icon: MapPin, matchStatus: 'ARRIVED' },
      { label: 'Ready', icon: CheckCircle, matchStatus: 'RELEASED' }
  ];

  // Calculate progress percentage
  // 5 steps = 4 intervals. 
  // Index 0 (Created) = 0%
  // Index 1 (Received) = 25%
  // Index 2 (In Transit) = 50%
  // Index 3 (Arrived) = 75%
  // Index 4 (Ready) = 100%
  const getProgressPercentage = () => {
      // If Delivered, also 100%
      if (order.status === 'DELIVERED') return 100;
      
      const idx = visualSteps.findIndex(s => s.matchStatus === order.status);
      if (idx === -1) {
          // If current status is intermediate (e.g. CONSOLIDATED which maps roughly to Received/InTransit transition)
          if (order.status === 'CONSOLIDATED') return 37.5; // Between Received (25) and In Transit (50)
          return 0;
      }
      return idx * 25;
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
             <ArrowLeft size={20} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-slate-800">{order.id}</h2>
             <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={order.status} />
                <span className="text-sm text-slate-500">{order.desc}</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             
             {/* Current Status Banner */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Current Status</p>
                        <h3 className="text-2xl font-bold text-slate-800">{order.subStatus}</h3>
                        <p className="text-slate-600 mt-1 flex items-center">
                            <Plane size={16} className="mr-2 text-blue-500" /> On Flight {order.flight}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 font-bold mb-1">Estimated Arrival</p>
                        <p className="text-xl font-bold text-green-600">{order.eta}</p>
                    </div>
                </div>

                {/* Horizontal Visual Tracker */}
                <div className="relative px-4 pb-4">
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full px-9">
                        <div className="h-1 bg-slate-100 w-full rounded-full relative">
                            {/* Active Progress */}
                            <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${getProgressPercentage()}%` }}></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between">
                        {visualSteps.map((step, index) => {
                            const isCompleted = index * 25 <= getProgressPercentage();
                            const isCurrent = visualSteps.findIndex(s => s.matchStatus === order.status) === index;
                            
                            return (
                                <div key={index} className="flex flex-col items-center group cursor-default">
                                    <div 
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${isCompleted || isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110' : 'bg-white border-slate-300 text-slate-300'}
                                        `}
                                    >
                                        <step.icon size={16} />
                                    </div>
                                    <span className={`text-xs font-bold mt-3 transition-colors ${isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
             </div>

             {/* Shipment Details Grid */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Shipment Details</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6 text-sm">
                   <div>
                      <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Tracking Number</span>
                      <span className="font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">{order.tracking}</span>
                   </div>
                   <div>
                      <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Weight</span>
                      <span className="font-medium text-slate-900">{order.weight}</span>
                   </div>
                   <div>
                      <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Origin</span>
                      <span className="font-medium text-slate-900">{order.origin}</span>
                   </div>
                   <div>
                      <span className="block text-slate-500 text-xs uppercase font-bold mb-1">Destination</span>
                      <span className="font-medium text-slate-900">{order.destination}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Vertical Timeline Sidebar */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                 <Clock size={18} className="mr-2 text-slate-500" /> Tracking Timeline
             </h3>
             <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {order.timeline.map((event, i) => (
                   <div key={i} className="relative pl-8 group">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${event.done ? 'bg-green-500 border-green-500' : event.current ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-100' : 'bg-white border-slate-300'}`}></div>
                      <div className={`${event.done || event.current ? 'opacity-100' : 'opacity-50'}`}>
                         <p className={`text-sm font-bold ${event.current ? 'text-blue-700' : 'text-slate-800'}`}>{event.status}</p>
                         <p className="text-xs text-slate-500 mt-0.5">{event.loc}</p>
                         <p className="text-xs text-slate-400 mt-0.5 font-mono">{event.date}</p>
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