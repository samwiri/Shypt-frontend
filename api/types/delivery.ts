import type { AuthUser } from "./auth";
import type { Order } from "./orders";
import type { Package } from "./package";

export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export interface Delivery {
  id: number;
  delivery_number: string;
  order_id: number;
  rider_id: number | null;
  delivery_address: string;
  delivery_date: string;
  status: DeliveryStatus | string;
  pod_signature: string | null;
  pod_photo_path: string | null;
  delivery_notes: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  order: Order;
  packages?: Package[];
  user?: AuthUser;
}

export interface PaginatedDeliveriesResponse {
  data: Delivery[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CreateDeliveryOrderPayload {
  order_id: number;
  delivery_address: string;
  delivery_date: string; // YYYY-MM-DD
  delivery_notes?: string;
}

export interface UpdateDeliveryOrderPayload {
  delivery_address?: string;
  delivery_date?: string; // YYYY-MM-DD
  delivery_notes?: string;
}

export interface UploadSignaturePayload {
  signature: string; // Base64
}

export interface UpdateDeliveryStatusPayload {
  status: DeliveryStatus;
  rider_id?: number;
  reason?: string;
}

export interface MessageResponse {
  message: string;
}

export interface UploadPodResponse {
  message: string;
  photo_url: string;
}

export interface UpdateDeliveryStatusResponse {
  message: string;
  data: Delivery;
}