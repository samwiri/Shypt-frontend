import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface HSCode {
  id: string;
  code: string;
  desc: string;
  duty: number;
  vat: number;
}

interface HsCodesTabProps {
  hsCodes: HSCode[];
  setModalType: (type: string | null) => void;
}

const HsCodesTab: React.FC<HsCodesTabProps> = ({
  hsCodes,
  setModalType,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-800">
            HS Codes & Tax Rates
          </h3>
          <p className="text-sm text-slate-500">
            Used for URA tax estimation during deconsolidation.
          </p>
        </div>
        <button
          onClick={() => setModalType("HS_CODE")}
          className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition flex items-center"
        >
          <Plus size={16} className="mr-2" /> Add Code
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">HS Code</th>
              <th className="p-4">Category Description</th>
              <th className="p-4 text-right">Duty %</th>
              <th className="p-4 text-right">VAT %</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hsCodes.map((code) => (
              <tr key={code.code} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono font-bold text-slate-900">
                  {code.code}
                </td>
                <td className="p-4 text-slate-600">{code.desc}</td>
                <td className="p-4 text-right font-medium">{code.duty}%</td>
                <td className="p-4 text-right font-medium">{code.vat}%</td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HsCodesTab;
