import React from "react";
import { Plane, Calculator, CheckCircle } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import { MAWB } from "./types";
import { TaxStatus } from "../../types";

interface DeconsolidateFlowProps {
  mawbs: MAWB[];
  handleSelectMawbForDecon: (mawb: MAWB) => void;
  activeDeconMawb: MAWB | null;
  calculateUraTaxes: () => void;
  calculatedTax: {
    duty: number;
    vat: number;
    wht: number;
    infra: number;
    total: number;
  } | null;
  handleReleaseMawb: () => void;
}

const DeconsolidateFlow: React.FC<DeconsolidateFlowProps> = ({
  mawbs,
  handleSelectMawbForDecon,
  activeDeconMawb,
  calculateUraTaxes,
  calculatedTax,
  handleReleaseMawb,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Manifest List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="font-bold text-slate-800">
          Incoming / Arrived Manifests
        </h3>
        {mawbs
          .filter(
            (m) => m.destination === "UG" && m.status !== "DECONSOLIDATED"
          )
          .map((mawb) => (
            <div
              key={mawb.id}
              onClick={() => handleSelectMawbForDecon(mawb)}
              className={`p-4 rounded border cursor-pointer transition relative ${
                activeDeconMawb?.id === mawb.id
                  ? "bg-primary-50 border-primary-500"
                  : "bg-white border-slate-200 hover:border-primary-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-bold text-slate-800 text-sm">{mawb.id}</p>
                <StatusBadge status={mawb.status} />
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center">
                <Plane size={12} className="mr-1" /> {mawb.flightVessel}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {mawb.hwbs.length} Packages • ETA: {mawb.eta}
              </p>

              {/* Tax Indicator */}
              <div
                className={`mt-2 text-xs font-bold px-2 py-1 inline-block rounded ${
                  mawb.taxStatus === TaxStatus.PAID
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Tax: {mawb.taxStatus}
              </div>
            </div>
          ))}
        {mawbs.filter(
          (m) => m.destination === "UG" && m.status !== "DECONSOLIDATED"
        ).length === 0 && (
          <p className="text-slate-400 text-sm">
            No manifests pending deconsolidation.
          </p>
        )}
      </div>

      {/* Right: Tax Assessment & Release */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        {activeDeconMawb ? (
          <>
            <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Processing: {activeDeconMawb.id}
                </h3>
                <p className="text-sm text-slate-500">
                  Manifest contains {activeDeconMawb.hwbs.length} items.
                </p>
              </div>
              {activeDeconMawb.status !== "ARRIVED" && (
                <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
                  Status: {activeDeconMawb.status} (Wait for Arrival)
                </div>
              )}
            </div>

            {/* Step 1: Tax Calc */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 flex items-center mb-3">
                <Calculator size={18} className="mr-2 text-slate-500" /> URA
                Tax Assessment
              </h4>

              {activeDeconMawb.taxStatus === TaxStatus.UNASSESSED && (
                <div className="bg-slate-50 p-6 rounded border border-slate-200 text-center">
                  <p className="text-slate-600 mb-4">
                    Tax assessment has not been generated for this manifest.
                  </p>
                  <button
                    onClick={calculateUraTaxes}
                    className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700 text-sm font-medium"
                  >
                    Calculate Taxes (Simulate)
                  </button>
                </div>
              )}

              {(calculatedTax ||
                activeDeconMawb.taxStatus !== TaxStatus.UNASSESSED) && (
                <div className="bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      Import Duty (25%)
                    </p>
                    <p className="font-medium text-slate-800">
                      $
                      {calculatedTax?.duty.toFixed(2) ||
                        (activeDeconMawb.totalTax
                          ? (activeDeconMawb.totalTax * 0.25).toFixed(2)
                          : "0.00")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      VAT (18%)
                    </p>
                    <p className="font-medium text-slate-800">
                      $
                      {calculatedTax?.vat.toFixed(2) ||
                        (activeDeconMawb.totalTax
                          ? (activeDeconMawb.totalTax * 0.18).toFixed(2)
                          : "0.00")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      Withholding Tax (6%)
                    </p>
                    <p className="font-medium text-slate-800">
                      ${calculatedTax?.wht.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      Infra. Levy (1.5%)
                    </p>
                    <p className="font-medium text-slate-800">
                      ${calculatedTax?.infra.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">
                        Total Payable to URA
                      </span>
                      <span className="text-xl font-bold text-red-600">
                        $
                        {calculatedTax?.total.toFixed(2) ||
                          activeDeconMawb.totalTax?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Release */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={handleReleaseMawb}
                disabled={activeDeconMawb.taxStatus === TaxStatus.PAID}
                className={`px-6 py-2 rounded text-white font-medium flex items-center transition ${
                  activeDeconMawb.taxStatus !== TaxStatus.UNASSESSED &&
                  activeDeconMawb.taxStatus !== TaxStatus.PAID
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                <CheckCircle size={18} className="mr-2" />
                {activeDeconMawb.taxStatus === TaxStatus.PAID
                  ? "Already Released"
                  : "Pay Taxes & Release"}
              </button>
            </div>
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <Plane size={48} className="mb-4 opacity-20" />
            <p>Select a Manifest to process arrival and taxes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeconsolidateFlow;
