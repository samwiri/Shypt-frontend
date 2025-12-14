import React from 'react';

// --- ENUMS ---

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum FreightMode {
  AIR = 'AIR',
  SEA = 'SEA'
}

/**
 * Order Status Lifecycle:
 * 1. PENDING: Client created Pre-Alert, item not yet at warehouse.
 * 2. RECEIVED: Warehouse has physically scanned the item (HWB created).
 * 3. CONSOLIDATED: Item assigned to a Master Manifest (MAWB) for shipping.
 * 4. IN_TRANSIT: Departed Origin Airport/Port.
 * 5. ARRIVED: Landed at Destination (e.g., Entebbe).
 * 6. CUSTOMS_HOLD: Held by URA for verification (Optional).
 * 7. RELEASED: Cleared customs, taxes paid, ready for pickup.
 * 8. DELIVERED: Handed over to client or Last Mile driver.
 */
export enum OrderStatus {
  PENDING = 'PENDING',        
  RECEIVED = 'RECEIVED',      
  CONSOLIDATED = 'CONSOLIDATED', 
  IN_TRANSIT = 'IN_TRANSIT',  
  ARRIVED = 'ARRIVED',        
  CUSTOMS_HOLD = 'CUSTOMS_HOLD', 
  RELEASED = 'RELEASED',      
  DELIVERED = 'DELIVERED',    
  CANCELLED = 'CANCELLED'
}

export enum TaxStatus {
  UNASSESSED = 'UNASSESSED',
  ASSESSED = 'ASSESSED',
  PAID = 'PAID'
}

export enum TransactionType {
  INVOICE = 'INVOICE',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND'
}

// --- INTERFACES ---

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  country: string;
  zipCode?: string;
}

export interface User {
  id: string; // e.g., CL-8821
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  tinNumber?: string; // Tax Identification Number for URA (Uganda Revenue Authority)
  address: Address;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  preferredWarehouse?: 'CN' | 'US' | 'UK' | 'AE';
  joinedDate: string;
  balance: number; // Negative value indicates debt/outstanding amount
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  referenceId?: string; // Invoice ID or Payment Ref
  type: TransactionType;
  amount: number; // Positive for Debit (Invoice), Negative for Credit (Payment)
  runningBalance: number;
}

/**
 * House Waybill (HWB) / Order
 * Represents a single package or consignment belonging to one client.
 * This is the smallest unit of tracking in the system.
 */
export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  weight: number;
  volume?: number;
  declaredValue: number; // For Tax Calculation
  freightMode: FreightMode;
  origin: string; // Country Code
  status: OrderStatus;
  specialInstructions?: string;
  createdDate: string;
  manifestId?: string; // ID of the MAWB this order is packed into
}

/**
 * Master Air Waybill (MAWB) / Master Bill of Lading (MBL)
 * Represents a consolidated shipment containing multiple HWBs.
 * This object tracks the flight/vessel details.
 * 
 * Workflow:
 * 1. Warehouse staff selects multiple HWBs going to the same destination.
 * 2. They are "Consolidated" into one MAWB.
 * 3. The MAWB tracks the physical movement (Flight/Vessel).
 * 4. Upon arrival, the MAWB is "Deconsolidated" to release individual HWBs.
 */
export interface MAWB {
  id: string;
  origin: string;
  destination: string;
  mode: FreightMode;
  carrier: string;
  flightVessel: string;
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  status: 'OPEN' | 'CLOSED' | 'IN_TRANSIT' | 'ARRIVED' | 'DECONSOLIDATED';
  hwbIds: string[]; // List of Order IDs inside
  totalWeight: number;
  taxAssessment?: {
    importDuty: number;
    vat: number;
    withholdingTax: number;
    infrastructureLevy: number;
    totalPayable: number;
    status: TaxStatus;
  }
}