import React from 'react';
import { Download, TrendingUp, DollarSign, Package, AlertCircle, Clock, Plane, Ship } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
          <p className="text-slate-500 text-sm">Financial summaries and operational performance metrics.</p>
        </div>
        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm hover:bg-slate-50 transition flex items-center shadow-sm">
          <Download size={16} className="mr-2" />
          Export All Data (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Monthly Revenue</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">$48,250</h4>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-green-600"><DollarSign size={20}/></div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-3 flex items-center">
                <TrendingUp size={12} className="mr-1" /> +15% vs last month
              </p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Transit Time</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">4.2 Days</h4>
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-blue-600"><Clock size={20}/></div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-3 flex items-center">
                -0.5 days vs target
              </p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Shipments</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">1,240</h4>
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-purple-600"><Package size={20}/></div>
              </div>
              <div className="flex gap-2 mt-3 text-xs text-slate-500">
                 <span className="flex items-center"><Plane size={10} className="mr-1"/> 850</span>
                 <span className="flex items-center"><Ship size={10} className="mr-1"/> 390</span>
              </div>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Compliance Rate</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">98.5%</h4>
                  </div>
                  <div className="p-2 bg-red-50 rounded text-red-600"><AlertCircle size={20}/></div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                 12 holds generated
              </p>
           </div>
      </div>

      {/* Operational Metrics */}
      <section className="space-y-4 pt-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" /> Operational Metrics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Chart Visualization */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="font-semibold text-slate-700">Shipment Volume Trend</h4>
                 <select className="text-sm border-slate-300 rounded p-1 bg-white text-slate-700 border">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              {/* Mock Chart Area */}
              <div className="h-64 w-full flex items-end justify-between space-x-2 px-2 border-b border-l border-slate-200 pb-0">
                 {[35, 52, 41, 68, 45, 80, 50, 65, 55, 75, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                       {/* Tooltip */}
                       <div className="opacity-0 group-hover:opacity-100 mb-1 text-center text-xs bg-slate-800 text-white rounded py-1 px-2 transition-opacity">
                          {Math.floor(h * 1.5)}
                       </div>
                       {/* Bar */}
                       <div className="w-full bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-all" style={{ height: `${h}%` }}></div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400 px-2">
                 <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
              </div>
           </div>

           {/* Table Metrics */}
           <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                 <h4 className="font-semibold text-slate-700">Warehouse Performance</h4>
                 <span className="text-xs text-slate-500 bg-white border px-2 py-1 rounded">Last 30 Days</span>
              </div>
              <table className="w-full text-left text-sm">
                 <thead className="bg-white text-slate-500 border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-3 font-medium">Location</th>
                       <th className="px-6 py-3 font-medium">Throughput</th>
                       <th className="px-6 py-3 font-medium text-right">Avg Process Time</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr>
                       <td className="px-6 py-3 text-slate-800 font-medium">Guangzhou (CN)</td>
                       <td className="px-6 py-3 text-slate-600">4,520 kg</td>
                       <td className="px-6 py-3 text-green-600 text-right">1.2 Hrs</td>
                    </tr>
                    <tr>
                       <td className="px-6 py-3 text-slate-800 font-medium">New York (US)</td>
                       <td className="px-6 py-3 text-slate-600">2,150 kg</td>
                       <td className="px-6 py-3 text-yellow-600 text-right">3.5 Hrs</td>
                    </tr>
                    <tr>
                       <td className="px-6 py-3 text-slate-800 font-medium">London (UK)</td>
                       <td className="px-6 py-3 text-slate-600">1,890 kg</td>
                       <td className="px-6 py-3 text-green-600 text-right">2.1 Hrs</td>
                    </tr>
                    <tr>
                       <td className="px-6 py-3 text-slate-800 font-medium">Dubai (AE)</td>
                       <td className="px-6 py-3 text-slate-600">3,400 kg</td>
                       <td className="px-6 py-3 text-green-600 text-right">1.8 Hrs</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;