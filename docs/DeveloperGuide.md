# Developer Guide

## Architecture Overview

The **Shypt** application uses a **Single Page Application (SPA)** architecture built with React. It simulates a multi-tenant environment (Admin vs. Client) through role-based rendering in `App.tsx`.

### Routing Strategy
Instead of a heavy router library, we use a lightweight state-based router (`currentPath` state in `App.tsx`) for this prototype. 

*   **Dynamic Routes**: Routes like `/admin/orders/:id` are handled by checking string prefixes in the `renderContent` function.
*   **Navigation**: Components communicate navigation requests via a custom event `app-navigate`. This decouples deeply nested components from the main router logic.

### State Management
*   **Local State**: Most pages manage their own data (`useState`) to simulate a database.
*   **Mock Data**: Data is hardcoded in the component files but structured via TypeScript interfaces (`types.ts`) to ensure it mimics a real API response structure.
*   **Toast Context**: Global notifications are handled via `context/ToastContext.tsx`.

## Extending the System

### Adding a New Page
1.  Create the component in `pages/admin/` or `pages/client/`.
2.  Import it in `App.tsx`.
3.  Add it to the `ADMIN_ROUTES` or `CLIENT_ROUTES` object.
4.  Add a link in `components/Layout/Sidebar.tsx`.

### Modifying the Data Model
1.  Update the interface in `types.ts`.
2.  Update the mock data arrays in the relevant page components (e.g., `MOCK_USERS` in `Users.tsx`).

### Integration Points (Future)
To connect this frontend to a real backend:
1.  Replace `useState` initialization with `useEffect` calls to fetch data from an API.
2.  Replace `handleSubmit` functions with `POST/PUT` API calls.
3.  Update `utils/notificationService.ts` to call a real notification provider (e.g., SendGrid, Twilio).

## Component Library (`components/UI`)

*   **`Modal`**: A reusable dialog component. Handles "Escape" key closing and background locking.
*   **`StatusBadge`**: Standardized pill-shaped badges for order statuses. Colors are mapped automatically based on the status string.
*   **`DataTable`**: A powerful table component with search, sort, pagination, and bulk selection.
*   **`SecurityFeatures`**: Components for Watermarks and Secure Headers used in printing.

## Icons
We use `lucide-react` for all iconography. Ensure consistency by using the same icon for similar actions across different pages (e.g., `Eye` for viewing details, `Edit` for modification).

## Document Printing
The system uses the browser's native print engine.
*   **File Naming**: Before window.print() is called, `document.title` is temporarily updated to ensure the saved PDF has a relevant name (e.g., `Shypt_Invoice_INV-001`).
*   **Print Styles**: Utility classes (`print:hidden`, `print:block`) are used to format the view specifically for A4 paper.