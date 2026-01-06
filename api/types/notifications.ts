import { AuthUser } from "./auth";

export interface notificationDetails {
  id: number;
  type: "ORDER" | "FINANCE" | "SYSTEM" | "SHOPPING";
  title: string;
  body: string;
  status: "read" | "not_read";
  sender_id: number;
  receiver_id: number;
  receiver: AuthUser;
  sender: AuthUser;
  updated_at: string;
  created_at: string;
  category?: string;
}

export interface notificationsFetchRes {
  status: string;
  data: {
    unread_messages_count: number;
    messages: notificationDetails[];
  };
}
