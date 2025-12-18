import { OrderStatus, TaxStatus } from "../../types";

// Interfaces for Component State
export interface HWB {
  id: string;
  weight: number;
  desc: string;
  client: string;
  value: number; // Declared Value
  status: OrderStatus;
  origin: string;
  orderRef?: string; // Link to original Order
}

export interface MAWB {
  id: string;
  origin: string;
  destination: string;
  flightVessel: string;
  carrier: string; // Added carrier
  hwbs: string[]; // IDs
  status: "OPEN" | "CONSOLIDATED" | "IN_TRANSIT" | "ARRIVED" | "DECONSOLIDATED";
  taxStatus: TaxStatus;
  totalTax?: number;
  eta?: string;
  createdDate: string;
  totalWeight: number; // Added for manifest summary
}

// Mock Pending Orders for Receipt
export interface PendingOrder {
  id: string;
  client: string;
  desc: string;
  weight: number;
  origin: string;
}
