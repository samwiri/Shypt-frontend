import React from "react";
import { Box, Camera, CheckCircle } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import { HWB, PendingOrder } from "./types";
import { OrderStatus } from "../../types";

interface ReceiptFlowProps {
  currentLocation: string;
  getLocName: (code: string) => string;
  setIsScannerOpen: (open: boolean) => void;
  handleReceipt: (e: React.FormEvent) => void;
  selectedOrderId: string;
  handleOrderSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currentPendingOrders: PendingOrder[];
  receiptClient: string;
  setReceiptClient: (value: string) => void;
  receiptDesc: string;
  setReceiptDesc: (value: string) => void;
  receiptWeight: string;
  setReceiptWeight: (value: string) => void;
  receiptValue: string;
  setReceiptValue: (value: string) => void;
  inventory: HWB[];
}

const ReceiptFlow: React.FC<ReceiptFlowProps> = ({
  currentLocation,
  getLocName,
  setIsScannerOpen,
  handleReceipt,
  selectedOrderId,
  handleOrderSelect,
  currentPendingOrders,
  receiptClient,
  setReceiptClient,
  receiptDesc,
  setReceiptDesc,
  receiptWeight,
  setReceiptWeight,
  receiptValue,
  setReceiptValue,
  inventory,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <Box className="mr-2" size={20} /> Receive New Package
          </h3>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center px-3 py-1.5 bg-slate-800 text-white rounded hover:bg-slate-700 text-xs font-bold shadow-sm transition"
          >
            <Camera size={14} className="mr-1.5" /> Scan Barcode
          </button>
        </div>

        <form onSubmit={handleReceipt} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-100 mb-4">
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Link to Pending Order (Pre-Alert)
            </label>
            <select
              value={selectedOrderId}
              onChange={handleOrderSelect}
              className="w-full border border-blue-200 rounded p-2 bg-white text-slate-900"
            >
              <option value="">-- Manual Entry / No Pre-Alert --</option>
              {currentPendingOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.client} ({order.desc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Client Name
            </label>
            <input
              required
              type="text"
              value={receiptClient}
              onChange={(e) => setReceiptClient(e.target.value)}
              className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2"
              placeholder="Client Name or ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <input
              required
              type="text"
              value={receiptDesc}
              onChange={(e) => setReceiptDesc(e.target.value)}
              className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2"
              placeholder="e.g. 5x Cartons of Shoes"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Weight (kg)
              </label>
              <input
                required
                type="number"
                step="0.1"
                value={receiptWeight}
                onChange={(e) => setReceiptWeight(e.target.value)}
                className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Declared Value ($)
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={receiptValue}
                onChange={(e) => setReceiptValue(e.target.value)}
                className="w-full border border-slate-300 rounded mt-1 bg-white text-slate-900 p-2"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 flex justify-center items-center font-medium"
            >
              <CheckCircle size={18} className="mr-2" />
              {selectedOrderId
                ? "Verify & Receive Order"
                : "Generate HWB & Receive"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">
          Recent Receipts at {getLocName(currentLocation)}
        </h3>
        <div className="space-y-2">
          {inventory
            .filter(
              (i) =>
                i.status === OrderStatus.RECEIVED && i.origin === currentLocation
            )
            .slice(-5)
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 border rounded bg-slate-50"
              >
                <div>
                  <p className="font-bold text-sm text-slate-800">{item.id}</p>
                  <p className="text-xs text-slate-500">
                    {item.desc} • {item.weight}kg
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          {inventory.filter(
            (i) =>
              i.status === OrderStatus.RECEIVED && i.origin === currentLocation
          ).length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">
              No recent receipts at this location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptFlow;
