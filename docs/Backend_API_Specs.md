# Backend API Specification (Draft)

This document defines the REST API contract expected by the current Frontend implementation. Backend developers should ensure their endpoints match these signatures.

## Base URL
`/api/v1`

## 📦 Orders (HWBs)

### Get All Orders
`GET /orders`
- **Query Params**: `?role=ADMIN|CLIENT&userId={id}`
- **Response**: `Order[]` (See `types.ts`)

### Create Pre-Alert (Client)
`POST /orders`
- **Payload**: `{ desc: string, origin: string, weight: number, trackingNo?: string }`
- **Response**: `Order`

### Receive Package (Warehouse Staff)
`POST /orders/receive`
- **Payload**: `{ orderId?: string, weight: number, dims: string, location: string }`
- **Note**: If `orderId` is missing, create a new Order. If present, update status to `RECEIVED`.

## ✈️ Freight (MAWBs)

### Create Manifest (Consolidation)
`POST /manifests`
- **Payload**: 
  ```json
  {
    "origin": "CN",
    "destination": "UG",
    "mode": "AIR",
    "carrier": "Emirates",
    "flightNumber": "EK202",
    "hwbIds": ["HWB-001", "HWB-002"]
  }
  ```
- **Response**: `MAWB` object.

### Update Manifest Status
`PUT /manifests/{id}/status`
- **Payload**: `{ status: "IN_TRANSIT" | "ARRIVED" | "DECONSOLIDATED" }`
- **Side Effect**: Must automatically update the status of all contained HWBs.

## 💰 Finance

### Generate Invoice
`POST /invoices`
- **Payload**: `{ clientId: string, items: [{desc, amount}], type: "FREIGHT" }`

### Record Payment
`POST /payments`
- **Payload**: `{ amount: number, method: "MOBILE_MONEY", reference: "TX-123", invoiceIds: [] }`
- **Logic**: If payment covers invoice total, update Invoice Status to `PAID`.

## 🛍️ Assisted Shopping

### Submit Request
`POST /shopping-requests`
- **Payload**: `{ url: string, itemName: string, qty: number }`

### Create Quote (Admin)
`PUT /shopping-requests/{id}/quote`
- **Payload**: `{ itemCost: number, shipping: number, serviceFee: number }`

## 🔔 Webhooks (External)

### Mobile Money Callback
`POST /webhooks/payment`
- **Source**: Payment Gateway (e.g., Flutterwave/MTN)
- **Payload**: `{ txRef: string, status: "SUCCESSFUL" }`
- **Action**: Find Payment by ref and mark `VERIFIED`.

---

**Authentication**
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Role-based access control (RBAC) required for `/admin/*` endpoints.
