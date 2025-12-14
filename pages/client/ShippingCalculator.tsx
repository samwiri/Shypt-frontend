import React, { useState, useEffect } from 'react';
import { Calculator, Plane, Ship, Info, AlertTriangle, ArrowRight, Box } from 'lucide-react';

const ShippingCalculator: React.FC = () => {
  const [mode, setMode] = useState<'AIR' | 'SEA'>('AIR');
  const [origin, setOrigin] = useState('US');
  const [weight, setWeight] = useState<number>(0);
  const [dims, setDims] = useState({ l: 0, w: 0, h: 0 });
  const [category, setCategory] = useState('GENERAL');
  
  const [estimate, setEstimate] = useState<{
    chargeableWeight: number;
    baseRate: number;
    shippingCost: number;
    clearingCost: number;
    total: number;
    isVolumetric: boolean;
  } | null>(null);

  // Constants (Mock Rates)
  const RATES = {
    US: { AIR: 8.5, SEA: 3.5, CURRENCY: 'USD' },
    UK: { AIR: 7.5, SEA: 3.0, CURRENCY: 'GBP' },
    CN: { AIR: 12.0, SEA: 250, CURRENCY: 'USD' }, // CN Sea is usually CBM based, but keeping simple per kg for demo
    AE: { AIR: 6.0, SEA: 2.5, CURRENCY: 'USD' }
  };

  useEffect(() => {
    calculate();
  }, [mode, origin, weight, dims, category]);

  const calculate = () => {
    if (weight <= 0) {
      setEstimate(null);
      return;
    }

    // 1. Calculate Volumetric Weight (cm / 6000 standard)
    const volumeWeight = (dims.l * dims.w * dims.h) / 6000;
    
    // 2. Determine Chargeable Weight
    let chargeable = weight;
    let isVolumetric = false;

    if (mode === 'AIR' && volumeWeight > weight) {
      chargeable = volumeWeight;
      isVolumetric = true;
    }

    // 3. Get Base Rate
    const rateConfig = RATES[origin as keyof typeof RATES];
    const baseRate = rateConfig[mode];

    // 4. Calculate Costs
    let shippingCost = chargeable * baseRate;
    
    // Simple Clearing logic (e.g. $2 per kg)
    let clearingCost = chargeable * 2.0; 
    
    // Category Multiplier (Electronics are expensive to clear)
    if (category === 'ELECTRONICS') clearingCost *= 1.5;

    setEstimate({
      chargeableWeight: parseFloat(chargeable.toFixed(2)),
      baseRate,
      shippingCost,
      clearingCost,
      total: shippingCost + clearingCost,
      isVolumetric
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Shipping Rate Calculator</h2>
          <p className="text-slate-500 text-sm">Estimate your shipping costs before you buy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUTS */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center">
             <Calculator size={20} className="mr-2 text-primary-600" /> Shipment Details
           </h3>

           <div className="space-y-6">
              {/* Toggle Mode */}
              <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                 <button 
                   onClick={() => setMode('AIR')}
                   className={`flex items-center px-6 py-2 rounded-md text-sm font-medium transition ${mode === 'AIR' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <Plane size={16} className="mr-2" /> Air Freight
                 </button>
                 <button 
                   onClick={() => setMode('SEA')}
                   className={`flex items-center px-6 py-2 rounded-md text-sm font-medium transition ${mode === 'SEA' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <Ship size={16} className="mr-2" /> Sea Freight
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Origin Warehouse</label>
                    <select 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                    >
                       <option value="US">USA (New York)</option>
                       <option value="UK">UK (London)</option>
                       <option value="CN">China (Guangzhou)</option>
                       <option value="AE">UAE (Dubai)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                    <div className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-500 flex items-center justify-between cursor-not-allowed">
                       <span>Kampala, Uganda</span>
                       <ArrowRight size={14} />
                    </div>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Item Category</label>
                 <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                 >
                    <option value="GENERAL">General Goods (Clothes, Shoes, Home)</option>
                    <option value="ELECTRONICS">Electronics (Phones, Laptops)</option>
                    <option value="LIQUIDS">Liquids / Cosmetics</option>
                 </select>
                 {category === 'ELECTRONICS' && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center">
                       <Info size={12} className="mr-1" /> Electronics attract a higher clearance fee.
                    </p>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Actual Weight (kg)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="0.0"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Dimensions (cm) - Optional</label>
                    <div className="flex gap-2">
                       <input placeholder="L" type="number" onChange={e => setDims({...dims, l: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 text-center" />
                       <span className="self-center text-slate-400">x</span>
                       <input placeholder="W" type="number" onChange={e => setDims({...dims, w: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 text-center" />
                       <span className="self-center text-slate-400">x</span>
                       <input placeholder="H" type="number" onChange={e => setDims({...dims, h: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 text-center" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RESULTS */}
        <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-white flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">Estimated Quote</h3>
              
              {estimate ? (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between text-slate-300 text-sm">
                       <span>Chargeable Weight</span>
                       <span className="font-mono text-white font-bold">{estimate.chargeableWeight} kg</span>
                    </div>
                    
                    {estimate.isVolumetric && (
                        <div className="bg-yellow-500/20 border border-yellow-500/50 p-2 rounded text-xs text-yellow-200 flex items-start">
                           <AlertTriangle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                           <p>Volumetric weight exceeded actual weight. You are charged based on volume.</p>
                        </div>
                    )}

                    <div className="flex justify-between text-slate-300 text-sm">
                       <span>Rate per kg</span>
                       <span className="font-mono text-white">${estimate.baseRate.toFixed(2)}</span>
                    </div>

                    <div className="pt-4 border-t border-slate-700 space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Freight Charge</span>
                          <span>${estimate.shippingCost.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Clearing & Taxes</span>
                          <span>${estimate.clearingCost.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-700 mt-4">
                       <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Estimated Cost</p>
                       <div className="text-4xl font-bold text-green-400">
                          ${estimate.total.toFixed(2)}
                       </div>
                       <p className="text-[10px] text-slate-500 mt-2">*This is an estimate. Final invoice may vary based on warehouse verification.</p>
                    </div>
                 </div>
              ) : (
                 <div className="text-center py-10 text-slate-500">
                    <Box size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Enter shipment details to view rates.</p>
                 </div>
              )}
           </div>

           <div className="mt-6 bg-slate-800 p-4 rounded text-xs text-slate-400 leading-relaxed">
              <strong>Note:</strong> Air freight takes 5-7 days. Sea freight takes 45-60 days. 
              Insurance is optional and calculated at 5% of declared value.
           </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingCalculator;