export interface ShippingAddress {
  id: number;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedShippingAddressesResponse {
  current_page: number;
  data: ShippingAddress[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CreateShippingAddressPayload {
  name: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone_number?: string;
}

export interface UpdateShippingAddressPayload {
  name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone_number?: string;
}

export interface MessageResponse {
    message: string;
}
