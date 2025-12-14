# Shypt - Global Logistics OS

**Shypt Logistics** is a comprehensive dual-portal application designed to streamline the logistics of freight forwarding, warehousing, and assisted shopping. It bridges the gap between Origin Warehouses (China, USA, UK, UAE) and the Destination Hub (Uganda).

## 🚀 Key Features

### 🏢 Admin Portal (Staff)
*   **Warehouse Operations**: 
    *   **Receipt**: Log packages arriving at origin hubs.
    *   **Consolidation**: Group House Waybills (HWBs) into Master Waybills (MAWBs) for shipping.
    *   **Deconsolidation**: Receive MAWBs at destination and calculate URA taxes.
*   **Inventory Control**: Manage rack locations, bin assignments, and print ZPL labels.
*   **Compliance Module**: Manage customs holds, issue official notices, reject prohibited cargo, and upload supporting documentation.
*   **Freight Management**: Track Air and Sea freight movements (ETD/ETA).
*   **Assisted Shopping**: Manage "Shop For Me" requests, issue quotes, and track purchases.
*   **CRM**: Manage client profiles, TIN numbers, and addresses.
*   **Financials**: Generate professional invoices, record payments, and view client ledgers.

### 👤 Client Portal
*   **Dashboard**: View incoming packages and recent activity.
*   **Pre-Alerts**: Declare incoming packages before they arrive at the warehouse.
*   **Assisted Shopping**: Request items to be bought by the agency.
*   **Invoicing**: View outstanding bills and pay online.
*   **Tracking**: Real-time visual timeline of shipments.

## 🛠️ Technology Stack
*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **State Management**: React Hooks (Context API for Toast notifications)

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout/         # Sidebar, MainLayout
│   └── UI/             # Modals, StatusBadges, DataTable
├── context/            # Global contexts (Toast)
├── pages/              # Page views
│   ├── admin/          # Admin-specific pages (Orders, Warehouse, Compliance...)
│   └── client/         # Client-specific pages
├── types.ts            # Global TypeScript interfaces & Enums
└── utils/              # Helper functions (Notification Service)
```

## ⚡ Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📖 Workflows

### 1. The Warehouse Cycle
1.  **Receipt**: A package arrives at `Guangzhou`. Staff logs it in `Warehouse Operations > Receipt`.
2.  **Consolidation**: Staff selects multiple packages and creates a Master Manifest (`MAWB-CN-UG-2025`). Status changes to `CONSOLIDATED`.
3.  **Shipping**: In `Freight Management`, the MAWB is marked `IN_TRANSIT` (Departed) -> `ARRIVED` (Entebbe).
4.  **Deconsolidation**: In `Warehouse Ops > Deconsolidate`, staff selects the arrived MAWB.
5.  **Taxation**: System estimates URA taxes (Duty, VAT, Infra Levy).
6.  **Release**: Once taxes are paid, items are marked `RELEASED` for client pickup.

### 2. Compliance Holds
1.  If a package has issues (e.g., Lithium Batteries), staff flags it in `Compliance`.
2.  Status becomes `ON_HOLD`. It cannot be consolidated.
3.  Staff can:
    *   **Issue Notice**: Send a formal warning to the client.
    *   **Reject**: Mark as "Return to Sender".
    *   **Release**: Override the hold (requires Supervisor PIN).

### 3. Assisted Shopping
1.  Client requests "MacBook Pro" via the portal.
2.  Admin views request.
    *   If available: Admin sends a **Quote** (Cost + Shipping + Service Fee).
    *   If unavailable: Admin marks **Out of Stock** or suggests an alternative.
3.  Client pays via the portal.
4.  Admin marks as **Purchased** and uploads the receipt + tracking number.

## 🔐 Security
*   **Role-Based Access**: Strict separation between `ADMIN` and `CLIENT` views.
*   **Supervisor PIN**: Critical actions (like releasing compliance holds) simulate a secondary authentication step.
*   **Document Security**: All printed documents contain watermarks and tracking references.

---
*Powered by Shypt Logistics - www.shypt.net*