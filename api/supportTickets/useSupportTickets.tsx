import client from "..";
import { SupportTicket, TicketMessage } from "../types/supportTickets";

const useSupportTickets = () => {
  // const fetchSupportTickets = async () => {
  //   const { data } = await client.get("/api/tickets/chats");
  //   return data;
  // };

  // const createSupportTicket = async ({
  //   receiver_id,
  //   message,
  //   file,
  // }: {
  //   receiver_id: string;
  //   message: string;
  //   file?: string;
  // }) => {
  //   const formData = new FormData();
  //   formData.append("receiver_id", receiver_id);
  //   formData.append("message", message);
  //   if (file) formData.append("file_url", file);
  //   const { data } = await client.post("/api/tickets/chats", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   return data;
  // };

  // const getMessages = async (ticket_id: string) => {
  //   const { data } = await client.get(`/api/tickets/chats/${ticket_id}`);
  //   return data;
  // };

  // const markMessageAsRead = async ({
  //   user_id,
  //   message_status,
  // }: {
  //   user_id: string;
  //   message_status: "sent" | "read" | "closed";
  // }) => {
  //   const { data } = await client.post(`/api/tickets/mark-as-read`, {
  //     message_status,
  //     user_id,
  //   });
  //   return data;
  // };

  const fetchSupportTickets = async (): Promise<SupportTicket[]> => {
    const { data } = await client.get("/api/tickets");
    return data;
  };

  const createNewSupportTicket = async (payload: {
    subject: string;
    message: string;
    reference?: string;
  }): Promise<SupportTicket> => {
    const { data } = await client.post("/api/tickets", payload);
    return data;
  };

  const displaySupportTicket = async (id: string): Promise<SupportTicket> => {
    const { data } = await client.get(`/api/tickets/${id}`);
    return data;
  };

  const sendReply = async (
    id: string,
    payload: { message: string },
  ): Promise<TicketMessage> => {
    const { data } = await client.post(`/api/tickets/${id}/reply`, payload);
    return data;
  };

  const updateTicketStatus = async (
    id: string,
    status: "closed",
  ): Promise<SupportTicket> => {
    const { data } = await client.patch(`/api/tickets/${id}/status`, {
      status,
    });
    return data;
  };

  return {
    fetchSupportTickets,
    createNewSupportTicket,
    displaySupportTicket,
    sendReply,
    updateTicketStatus,
  };
};

export default useSupportTickets;
