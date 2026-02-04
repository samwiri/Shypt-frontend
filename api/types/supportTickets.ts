export interface User {
  id: number;
  full_name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  status: "sent" | "read";
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  reference: string | null;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  user?: User;
  messages?: TicketMessage[];
}
