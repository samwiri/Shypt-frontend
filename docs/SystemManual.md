# Shypt System Documentation

## Overview
**Shypt** (formerly OMS/WOFMS) is a comprehensive logistics operating system designed to manage the end-to-end logistics of freight forwarding from international hubs (New York, London, Dubai, Guangzhou) to Uganda.

## Folder Structure
- `components/`: Reusable UI components (Layouts, Badges, Modals, DataTable, PaymentGateway).
- `pages/`: Page views for Admin and Client portals.
  - `pages/admin/`: Staff-facing modules.
  - `pages/client/`: Client-facing modules.
- `types.ts`: Global TypeScript definitions.
- `utils/`: Helper functions (Notification service).

## Admin Workflows (Staff)

### 1. Client Onboarding (CRM)
**Location:** `Admin > CRM / Clients`
- Admins can register clients with detailed information including:
  - Personal Details
  - Business Info (TIN Number for URA)
  - Physical Address in Uganda
  - Preferred Origin Warehouse
- **Ledger:** A financial ledger tracks all invoices and payments for each client.

### 2. Receiving & Inventory (Origin Warehouse)
**Location:** `Admin > Warehouse Ops > Receipt` & `Admin > Inventory Control`
- Warehouse staff receive packages at specific locations (CN, US, UK, AE).
- Items are logged with weight, description, and client.
- **Bin Management:** Staff can assign specific Shelf/Rack locations to items via the Inventory module.
- **Labels:** Staff can print ZPL thermal labels with "Shypt Logistics" branding.
- **Damage Reporting:** If an item is damaged, staff flag it, upload photos, and it triggers an alert.

### 3. Consolidation (Origin Warehouse)
**Location:** `Admin > Warehouse Ops > Consolidate`
- Staff select multiple received House Waybills (HWBs).
- These are grouped into a Master Waybill (MAWB) for a specific flight/vessel.
- **Status Change:** `RECEIVED` -> `CONSOLIDATED` -> `IN_TRANSIT`.

### 4. Deconsolidation & URA Taxes (Destination Warehouse)
**Location:** `Admin > Warehouse Ops > Deconsolidate`
- When a MAWB arrives in Uganda, staff select it from the list.
- **Tax Assessment:** The system calculates estimated URA taxes (Import Duty, VAT, Withholding, Infrastructure Levy) based on declared value and HS Codes configured in Settings.
- **Release:** Once taxes are marked as paid/processed, the individual packages are released.

### 5. Assisted Shopping & Suppliers
**Location:** `Admin > Shop For Me` & `Admin > Suppliers`
- Clients request items to be bought on their behalf.
- Admins provide quotes (including a configured buffer %) -> Clients Pay -> Admins Purchase -> Items enter Warehouse flow.
- Staff manage vendor accounts (Amazon, Shein, Apple) via the Suppliers module.

### 6. Expenses & Financials
**Location:** `Admin > Expenses`
- Staff record Cost of Sales (COS) such as Airline charges, Customs fees, and local transport.
- This allows for Net Profit calculation per month or per Manifest.

### 7. Last Mile Delivery
**Location:** `Admin > Last Mile Delivery`
- Once items are `RELEASED`, dispatchers assign drivers (Boda/Van) to deliver the package.
- Status moves from `DISPATCHED` -> `DELIVERED`.

---

## Client Workflows (Customer Portal)

### 1. Pre-Alerts (Declaring Cargo)
**Location:** `Client > My Orders`
- Clients expecting packages (e.g., from Amazon) can create a **Pre-Alert**.
- They select the origin warehouse and provide a description and tracking number.
- This helps the warehouse identify the package upon arrival.

### 2. Tracking
**Location:** `Client > Tracking`
- Clients can enter an HWB or Order ID to see a visual timeline of their shipment's journey.
- Milestones: Pre-Alert -> Received -> In Transit -> Arrived -> Released.

### 3. Assisted Shopping Requests
**Location:** `Client > Assisted Shopping`
- Clients submit a link to an item they want.
- Admin sends back a **Quote** (Cost + Shipping + Fee).
- Client clicks "Accept & Pay" to initiate the purchase via the integrated payment gateway simulator.

### 4. Invoices & Payments
**Location:** `Client > Invoices`
- Clients view outstanding invoices for Freight or Shopping.
- They can click "Pay Now" to settle bills via Mobile Money or Card.
- **Receipts:** Upon payment, a branded Shypt receipt is generated.

### 5. Support Tickets
**Location:** `Client > Support`
- Clients can raise tickets for missing items, billing issues, or general inquiries.
- They can view the status of their tickets (Open/Closed).

## Developer Notes
- **State Management:** Currently uses React local state. For production, integrate Redux or React Query with a real backend.
- **Notifications:** `utils/notificationService.ts` logs to console. Integrate with SendGrid/Twilio API in production.
- **Documents:** PDF generation is handled via browser print styles (`@media print`) with dynamic document titles for file naming (e.g., `Shypt_Invoice_101.pdf`).