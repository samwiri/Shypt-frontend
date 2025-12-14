import React, { useState } from 'react';
import { Search, Package, MapPin, Truck, Plane, CheckCircle, Clock, Anchor } from 'lucide-react';

const Tracking: React.FC = () => {
  const [query, setQuery] = useState('HWB-8821'); // Default sample for demo
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // Enhanced Mock Data showing a full logistics flow
      if (query.trim()) {
          setResult({
              id: query,
              desc: 'Laptop Batch A (Electronics)',
              status: 'ARRIVED',
              origin: 'Guangzhou (CN)',
              destination: 'Kampala (UG)',
              eta: '2025-03-05',
              mode: 'AIR',
              timeline: [
                  { 
                    step: 1, 
                    title: 'Pre-Alert Created', 
                    desc: 'Order details submitted by client.', 
                    date: 'Mar 01, 09:00', 
                    loc: 'Client Portal', 
                    completed: true,
                    icon: <FileTextIcon />
                  },
                  { 
                    step: 2, 
                    title: 'Received at Origin', 
                    desc: 'Package received, weighed (12.5kg), and inspected.', 
                    date: 'Mar 02, 14:00', 
                    loc: 'Guangzhou Warehouse', 
                    completed: true,
                    icon: <Package size={16} />
                  },
                  { 
                    step: 3, 
                    title: 'Consolidated', 
                    desc: 'Added to Master Manifest MAWB-CN-UG-991.', 
                    date: 'Mar 03, 10:00', 
                    loc: 'Guangzhou Warehouse', 
                    completed: true,
                    icon: <BoxIcon />
                  },
                  { 
                    step: 4, 
                    title: 'Departed Origin', 
                    desc: 'Flight CZ-330 en route to Entebbe.', 
                    date: 'Mar 04, 02:00', 
                    loc: 'Baiyun Airport (CAN)', 
                    completed: true,
                    icon: <Plane size={16} />
                  },
                  { 
                    step: 5, 
                    title: 'Arrived Destination', 
                    desc: 'Landed at Entebbe International Airport.', 
                    date: 'Mar 05, 06:30', 
                    loc: 'Entebbe (EBB)', 
                    completed: true,
                    icon: <MapPin size={16} />
                  },
                  { 
                    step: 6, 
                    title: 'Customs Clearance', 
                    desc: 'Undergoing URA verification and tax assessment.', 
                    date: 'Mar 05, 08:00', 
                    loc: 'URA Bond', 
                    completed: false, // Current Step
                    current: true,
                    icon: <ShieldIcon />
                  },
                  { 
                    step: 7, 
                    title: 'Ready for Pickup', 
                    desc: 'Available at Kampala office.', 
                    date: 'Est. Mar 06', 
                    loc: 'Kampala HQ', 
                    completed: false,
                    icon: <CheckCircle size={16} />
                  },
                  { 
                    step: 8, 
                    title: 'Delivered', 
                    desc: 'Handed over to client.', 
                    date: '-', 
                    loc: 'Client Address', 
                    completed: false,
                    icon: <Truck size={16} />
                  }
              ]
          });
      }
  };

  // Helper icons
  const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
  const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/><line x1="3.27 16.96" x2="12.01" y2="12.01"/><line x1="20.73 16.96" x2="12.01" y2="12.01"/></svg>;
  const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-800">Track Your Shipment</h2>
        <p className="text-slate-500 mt-2">Enter your HWB Number or Order ID to see real-time updates.</p>
      </div>

      <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. HWB-8832" 
                className="w-full pl-6 pr-14 py-4 text-lg border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white text-slate-900"
              />
              <button type="submit" className="absolute right-2 bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 transition">
                  <Search size={24} />
              </button>
          </form>
      </div>

      {result && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Header Card */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                          <h3 className="text-xl font-bold flex items-center">
                             {result.desc}
                             <span className="ml-3 px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 font-mono">{result.id}</span>
                          </h3>
                          <div className="flex items-center mt-2 text-sm text-slate-400">
                             <span className="flex items-center mr-4"><MapPin size={14} className="mr-1"/> {result.origin}</span>
                             <span className="mr-4">&rarr;</span>
                             <span className="flex items-center"><MapPin size={14} className="mr-1"/> {result.destination}</span>
                          </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                          <div className="bg-green-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                              {result.status}
                          </div>
                          <p className="text-xs text-slate-400">Est. Arrival: {result.eta}</p>
                      </div>
                  </div>

                  {/* Visual Map / Progress Bar */}
                  <div className="p-8 bg-slate-50 border-b border-slate-200">
                      <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                          {/* Background Line */}
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>
                          {/* Active Line (Calculated based on progress) */}
                          <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transition-all duration-1000" style={{ width: '65%' }}></div>

                          {/* Steps */}
                          <div className="relative z-10 flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                  <Package size={14} />
                              </div>
                              <span className="text-xs font-bold mt-2 text-slate-700">Origin</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                  {result.mode === 'AIR' ? <Plane size={14} /> : <Anchor size={14} />}
                              </div>
                              <span className="text-xs font-bold mt-2 text-slate-700">In Transit</span>
                          </div>

                          <div className="relative z-10 flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-600 flex items-center justify-center shadow-sm animate-pulse">
                                  <MapPin size={14} />
                              </div>
                              <span className="text-xs font-bold mt-2 text-slate-700">Arrival</span>
                          </div>

                          <div className="relative z-10 flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-300 flex items-center justify-center shadow-sm">
                                  <Truck size={14} />
                              </div>
                              <span className="text-xs font-bold mt-2 text-slate-400">Delivery</span>
                          </div>
                      </div>
                  </div>

                  {/* Detailed Timeline */}
                  <div className="p-8 bg-white">
                      <h4 className="font-bold text-slate-800 mb-6">Shipment Progress</h4>
                      <div className="space-y-0">
                          {result.timeline.map((event: any, i: number) => (
                              <div key={i} className="flex group">
                                  {/* Time Column */}
                                  <div className="w-24 flex-shrink-0 text-right pr-4 pt-1">
                                      <p className="text-xs font-bold text-slate-600">{event.date.split(',')[0]}</p>
                                      <p className="text-[10px] text-slate-400">{event.date.split(',')[1] || ''}</p>
                                  </div>

                                  {/* Line Column */}
                                  <div className="relative flex flex-col items-center px-2">
                                      <div className={`w-3 h-3 rounded-full z-10 border-2 ${event.completed ? 'bg-green-500 border-green-500' : event.current ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-100' : 'bg-white border-slate-300'}`}></div>
                                      {i !== result.timeline.length - 1 && (
                                          <div className={`w-0.5 flex-1 ${event.completed ? 'bg-green-200' : 'bg-slate-100'}`}></div>
                                      )}
                                  </div>

                                  {/* Content Column */}
                                  <div className="flex-1 pb-8 pl-2">
                                      <div className={`p-4 rounded-lg border ${event.current ? 'bg-blue-50 border-blue-100 shadow-sm' : 'bg-white border-transparent'}`}>
                                          <h5 className={`font-bold text-sm ${event.current ? 'text-blue-800' : event.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                                              {event.title}
                                          </h5>
                                          <p className={`text-xs mt-1 ${event.current ? 'text-blue-700' : 'text-slate-500'}`}>{event.desc}</p>
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