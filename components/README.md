# UI Component Library

The `components/` directory contains reusable UI elements designed to ensure consistency across the Admin and Client portals.

## 📁 Structure

- `Layout/`: High-level layout wrappers (Sidebar, MainLayout).
- `UI/`: Atomic components (Buttons, Modals, Tables).

## 🧩 Key Components

### 1. `DataTable.tsx`
A powerful, data-driven table component.
- **Props**:
  - `data`: Array of objects.
  - `columns`: Configuration array defining headers, accessors, and sorting logic.
  - `onRowClick`: Callback for row interaction.
  - `primaryAction`: React Node for the top-right action button (e.g., "Add New").
- **Features**: Built-in search filtering, pagination, and sorting.

### 2. `Modal.tsx`
Standardized dialog box.
- **Usage**:
  ```tsx
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
     <Content />
  </Modal>
  ```
- **Features**: Handles `Escape` key press and background scroll locking automatically.

### 3. `StatusBadge.tsx`
Displays status strings with semantic coloring.
- **Logic**: Automatically maps status strings (e.g., `PENDING`, `RELEASED`, `PAID`) to appropriate Tailwind color classes (Yellow, Green, Blue, Red).
- **Usage**: `<StatusBadge status={order.status} />`

### 4. `PaymentGateway.tsx`
A mock implementation of a payment processor.
- **Flow**: Mobile Money (Phone Input) -> Simulation of USSD Push -> Success.
- **Note**: For production, replace the `setTimeout` simulation with real API calls to Stripe / Flutterwave / DPO.

### 5. `SecurityFeatures.tsx`
Components used specifically for **Printable Documents**.
- `Watermark`: Adds a diagonal background text (e.g., "PAID", "COPY") visible only on print.
- `SecurityFooter`: Adds a QR code and tracking reference footer to documents.
- `SecureHeader`: Standardized document header.

## 🎨 Styling
We use **Tailwind CSS**. 
- Primary Color: `primary-600` (Blue).
- Text Color: `slate-800` (Dark Grey).
- Backgrounds: `slate-50` (Light Grey).

## 🖨️ Printing Support
The application relies on browser-native printing.
- Use `print:hidden` class to hide interactive elements (buttons, sidebars) when printing.
- Use `print:block` to show elements (like watermarks) only during print.
- **Important**: Before calling `window.print()`, we update `document.title` to ensure the saved PDF has a meaningful filename.
