import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, User } from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import useSupportTickets from "../../api/supportTickets/useSupportTickets";
import { SupportTicket } from "../../api/types/supportTickets";
import { timeAgo } from "../../utils/timeAgo";
import { useToast } from "../../context/ToastContext";
import { useAuthContext } from "@/context/AuthContext";

interface TicketDetailsProps {
  id: string;
  onBack: () => void;
}

const ClientTicketDetails: React.FC<TicketDetailsProps> = ({ id, onBack }) => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { displaySupportTicket, sendReply } = useSupportTickets();
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicket = async () => {
    try {
      const data = await displaySupportTicket(id);
      setTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket details", error);
      showToast("Failed to load ticket details.", "error");
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      const newMessage = await sendReply(id, { message: replyMessage });
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...(prev.messages || []), newMessage],
            }
          : null,
      );
      setReplyMessage("");
    } catch (error) {
      console.error("Failed to send reply", error);
      showToast("Failed to send reply. Please try again.", "error");
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  const currentUserId = user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {ticket.subject}{" "}
              <span className="text-sm font-normal text-slate-500 ml-2">
                #{ticket.id}
              </span>
            </h2>
            <div className="mt-1">
              <StatusBadge status={ticket.status.toUpperCase()} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {ticket.messages?.map((msg) => {
            const isClientMessage = msg.user_id === currentUserId; // Current logged-in user is the client
            const senderName = isClientMessage ? "Me" : "Support";
            const alignmentClass = isClientMessage ? "flex-row-reverse" : "";
            const messageBgClass = isClientMessage
              ? "bg-blue-600 text-white rounded-l-lg rounded-br-lg text-left"
              : "bg-slate-100 text-slate-800 rounded-r-lg rounded-bl-lg";
            const nameAlignmentClass = isClientMessage ? "justify-end" : "";
            const avatarBgClass = isClientMessage
              ? "bg-blue-600 text-white"
              : "bg-slate-200";

            return (
              <div key={msg.id} className={`flex gap-4 ${alignmentClass}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${avatarBgClass}`}
                >
                  {msg.user ? (
                    msg.user.full_name.charAt(0).toUpperCase()
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className={isClientMessage ? "text-right" : "text-left"}>
                  <div
                    className={`flex items-baseline mb-1 ${nameAlignmentClass}`}
                  >
                    <span className="font-bold text-slate-800 mr-2">
                      {senderName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {timeAgo(msg.created_at)}
                    </span>
                  </div>
                  <div className={`p-4 text-sm max-w-lg ${messageBgClass}`}>
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status === "open" && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReply()}
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 bg-white"
              />
              <button
                onClick={handleReply}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientTicketDetails;
