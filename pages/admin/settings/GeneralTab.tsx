import { DollarSign } from "lucide-react";
import React from "react";

interface GeneralTabProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  exchangeRate: string;
  setExchangeRate: (value: string) => void;
  buffer: string;
  setBuffer: (value: string) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  companyName,
  setCompanyName,
  exchangeRate,
  setExchangeRate,
  buffer,
  setBuffer,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">
          Company Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Display Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Official Support Email
            </label>
            <input
              type="email"
              defaultValue="support@shypt.net"
              className="mt-1 w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4 flex items-center">
          <DollarSign size={20} className="mr-2 text-green-600" /> Currency &
          Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Global Exchange Rate (1 USD)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-slate-500 font-bold">
                UGX
              </span>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 pl-14 text-slate-900 bg-white font-black text-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Shopping Buffer (%)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                value={buffer}
                onChange={(e) => setBuffer(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white font-bold"
              />
              <span className="absolute right-3 top-2 text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
